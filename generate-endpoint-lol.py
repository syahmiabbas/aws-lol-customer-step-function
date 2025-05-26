import json
import boto3
import sagemaker
from sagemaker import get_execution_role
from sagemaker.jumpstart.estimator import JumpStartEstimator
from sagemaker.jumpstart.model import JumpStartModel
import uuid
import time

# Initialize the SageMaker client
sagemaker_client = boto3.client('sagemaker')

# Function to check the status of the endpoint
def check_endpoint_status(endpoint_name):
    response = sagemaker_client.describe_endpoint(EndpointName=endpoint_name)
    status = response['EndpointStatus']
    return status

def lambda_handler(event, context):
    
    print(event)
    model_id = "meta-textgeneration-llama-3-2-1b-instruct"
    #"meta-textgeneration-llama-3-8b-instruct" # "meta-textgeneration-llama-2-7b-f" 
    training_job_name = event['trainingName']
    eventType = event['eventType']
    executionName = event['AWS_STEP_FUNCTIONS_STARTED_BY_EXECUTION_ID']
    executionName = executionName.split('project-lol-statemachine-2:')[1]
    print(executionName)
    
    model_version = "1.0.2"#"2.3.0" #2.1.0 "2.2.1" "2.3.0"
    
    try:
        # jsEstimator = JumpStartEstimator(model_id=model_id,instance_type="ml.g5.2xlarge")
        attached_estimator = JumpStartEstimator.attach(training_job_name, model_id,model_version)
        # attached_estimator.logs()
        # predictor = attached_estimator.deploy(initial_instance_count=1,instance_type="ml.g5.2xlarge")
        
        print(f"training job name : {training_job_name}")
        
        # # # Define unique endpoint name 
        model_name = f"llama-3-8b-endpoint-{uuid.uuid4()}"
        
        container_image = "763104351884.dkr.ecr.us-east-1.amazonaws.com/djl-inference:0.29.0-lmi11.0.0-cu124"
        # 763104351884.dkr.ecr.us-east-1.amazonaws.com/huggingface-pytorch-tgi-inference:2.1.1-tgi2.0.0-gpu-py310-cu121-ubuntu22.04
        
        # Create the model in SageMaker
        if isinstance(attached_estimator.model_data, dict):
            print("COMRESSED TYPE: None")
            # Create the model in SageMaker (UNCOMPRESSED)
            
            create_model_response = sagemaker_client.create_model(
                ModelName=model_name,
                ExecutionRoleArn=get_execution_role(),
                PrimaryContainer={
                    'Image': container_image,
                    'ModelDataSource': attached_estimator.model_data,
                    'Environment': {  # Set environment variables here
                        'ENDPOINT_SERVER_TIMEOUT': '3600',
                        'HF_MODEL_ID': '/opt/ml/model',
                        'MAX_INPUT_LENGTH': '4095',
                        'MAX_TOTAL_TOKENS': '4096',
                        'MODEL_CACHE_ROOT': '/opt/ml/model',
                        'SAGEMAKER_ENV': '1',
                        'SAGEMAKER_MODEL_SERVER_WORKERS': '1',
                        'SAGEMAKER_PROGRAM': 'inference.py',
                        'SM_NUM_GPUS': '1',
                    }
                }
            )
        else:
            print("COMRESSED TYPE: ZIP")
            # Create the model in SageMaker (COMPRESS)
            
            create_model_response = sagemaker_client.create_model(
                ModelName=model_name,
                ExecutionRoleArn=get_execution_role(),
                PrimaryContainer={
                    'Image': container_image,
                    'ModelDataUrl': attached_estimator.model_data,
                    'Environment': {  # Set environment variables here
                        'ENDPOINT_SERVER_TIMEOUT': '3600',
                        'HF_MODEL_ID': '/opt/ml/model',
                        'MAX_INPUT_LENGTH': '4095',
                        'MAX_TOTAL_TOKENS': '4096',
                        'MODEL_CACHE_ROOT': '/opt/ml/model',
                        'SAGEMAKER_ENV': '1',
                        'SAGEMAKER_MODEL_SERVER_WORKERS': '1',
                        'SAGEMAKER_PROGRAM': 'inference.py',
                        'SM_NUM_GPUS': '1',
                    }
                }
            )
        
        # # Define the endpoint configuration name
        endpoint_config_name = f"config-{uuid.uuid4()}"
    
        # # Create the endpoint configuration
        create_endpoint_config_response = sagemaker_client.create_endpoint_config(
            EndpointConfigName=endpoint_config_name,
            ProductionVariants=[
                {
                    'InstanceType': 'ml.g5.2xlarge',
                    'InitialVariantWeight': 1,
                    'InitialInstanceCount': 1,
                    'ModelName': model_name,
                    'VariantName': 'AllTraffic'
                }
            ]
        )
        
        # # Define the endpoint name
        endpoint_name = f"endpoint-{uuid.uuid4()}"
        
        # # Create the endpoint
        create_endpoint_response = sagemaker_client.create_endpoint(
            EndpointName=endpoint_name,
            EndpointConfigName=endpoint_config_name
        )
        
        # Poll the endpoint status until it's 'InService' or an error occurs
        while True:
            status = check_endpoint_status(endpoint_name)
            print(f"Endpoint status: {status}")
            
            if status == 'InService':
                print("Endpoint is in service. Proceeding to the next step.")
                break
            elif status in ['Failed', 'RollbackFailed']:
                raise RuntimeError(f"Endpoint creation failed with status: {status}")
            else:
                print("Waiting....")
            
            time.sleep(10)  # Wait for 30 seconds before checking the status again


    
        return {
            'body': endpoint_name, #predictor.endpoint_name, 
            'TaskToken': event["TaskToken"],
            'modelId': event["modelId"],
            'leaderboardId': event["leaderboardId"],
            'trainingName': event["trainingName"],
            'reference_outputs': event['reference_outputs'],
            'userId': event['userId'],
            'eventType': eventType,
            'executionName': executionName
        }
        
    except Exception as e:
        print("-------ERROR MESSAGE--------")
        print(f"An error occurred: {e}")
        
        return {
            'status': 500,
            'errorMessage': str(e),
            'TaskToken': event["TaskToken"],
            'leaderboardId': event["leaderboardId"],
            'trainingName': event["trainingName"],
            'modelId': event["modelId"],
            'reference_outputs': event['reference_outputs'],
            'userId': event['userId'],
            'eventType': eventType,
            'executionName': executionName
        }
