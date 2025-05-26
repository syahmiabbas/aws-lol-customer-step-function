import json
import os
import aws_lol
import uuid
import boto3
import zipfile
from io import BytesIO
import requests

s3 = boto3.client('s3', region_name="us-east-1")
stepfunctions = boto3.client('stepfunctions')
bucket_name = os.environ.get('BUCKET_NAME')

def lambda_handler(event, context):
    
    error_message = event.get("errorMessage")
    
    if(error_message):
        print("USER ID HERE")
        user_id = event['userId']
        print(user_id)
        
        print(type(error_message))
        if error_message.startswith("'") and error_message.endswith("'"):
            error_message = error_message[1:-1]
        if error_message == 'body':
            print("Error message is 'body'")
            error = "Task timed out"
            print(error)
        else:
            error = event["errorMessage"]
            print(error)
        
        task_token = event['TaskToken']
        model_outputs = ""
        endpoint_name = ""
        modelId = ""
        leaderboardId = ""
        trainingName = ""
        userId = user_id
        reference_outputs = ""
        eventType = ""
        api_gateway_url = f'https://4xkf7lc0wg.execute-api.us-east-1.amazonaws.com/dev/invokeSF?TaskToken={task_token}&model_outputs={model_outputs}&endpointName={endpoint_name}&modelId={modelId}&leaderboardId={leaderboardId}&trainingName={trainingName}&userId={userId}&reference_outputs={reference_outputs}&eventType={eventType}&errorMessage={error}'
    
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
            
        payload_except = {
            "body": event['TaskToken'],
            "errorMessage": error
        }
        print(payload_except)
        
        payload_dump_except = json.dumps(payload_except)
        print(payload_dump_except)
        
        print("INVOKING STEP FUNCTIONS API DESPITE ERROR")
        # Invoke API Gateway
        response = requests.post(api_gateway_url, data=payload_dump_except, headers=headers)
        print(response)
        return {
            'status': 500,
            'errorMessage': error
        }
        
    else:
    
        try:
            print(event)
            userId = event['userId']
        
            # Get the path to the instructions.json file
            file_path = os.path.join(os.path.dirname(__file__), 'instructions.json')
        
            # Load the contents of the file
            with open(file_path, 'r') as file:
                lol_dataset = json.load(file)
            
            # Print the first element of lol_dataset
            print(json.dumps(lol_dataset[0], indent=2))
            
            aws_lol.client(
                endpoint_name = event['body'],
                region_name = 'us-east-1',
                test_instruction = "B",  # B = 100 questions. A = 800 questions. C = healthcare questions. D = finance questions.
                user_id = 'test',
                model_id = 'lol-model',
                eval_set = lol_dataset,
                generator_name = 'lol-generator'
            )
            
            output_file = aws_lol.generate_model_outputs()
            output_bucket = bucket_name # load bucket name from environment variable
            print(output_file) # attachment needs be to be up to 10MB
            s3.upload_file(output_file, output_bucket, output_file) 
            s3_uri = f"s3://{output_bucket}/{output_file}"
            print(f"S3 URI of the uploaded object: {s3_uri}")
            
            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        
            jsonOutput = {
                'model_outputs': s3_uri,
                'TaskToken': event['TaskToken'],
                'endpointName': event['body'],
                'modelId': event["modelId"],
                'leaderboardId': event["leaderboardId"],
                'trainingName': event["trainingName"],
                'eventType' : event["eventType"],
                'reference_outputs': event["reference_outputs"],
                'userId': event['userId']
            }
            
            print(event['TaskToken'])
        
            print(jsonOutput)
            print(json.dumps(jsonOutput))
            
            payload = {
                "body": event['TaskToken']
            }
            
            payload_dump = json.dumps(payload)
            
            task_token = event['TaskToken']
            model_outputs = s3_uri
            endpoint_name = event['body']
            modelId = event["modelId"]
            leaderboardId = event['leaderboardId']
            trainingName = event['trainingName']
            eventType = event['eventType']
            executionName = event['executionName']
            userId = event['userId']
            reference_outputs = event['reference_outputs']
            api_gateway_url = f'https://4xkf7lc0wg.execute-api.us-east-1.amazonaws.com/dev/invokeSF?TaskToken={task_token}&model_outputs={model_outputs}&endpointName={endpoint_name}&modelId={modelId}&leaderboardId={leaderboardId}&trainingName={trainingName}&userId={userId}&eventType={eventType}&executionName={executionName}&reference_outputs={reference_outputs}'
        
            print("INVOKING STEP FUNCTIONS API")
            # Invoke API Gateway 
            response = requests.post(api_gateway_url, data=payload_dump, headers=headers)
        
            return {
                'output': json.dumps(jsonOutput),
                'taskToken': event['TaskToken'],
                'model_outputs': s3_uri,
                'endpointName': event['body'],
                'modelId': event["modelId"],
                'leaderboardId': event["leaderboardId"],
                'trainingName': event["trainingName"],
                'eventType' : event["eventType"],
                'executionName' : executionName,
                'reference_outputs': event['reference_outputs'],
                'userId': event['userId']
            }
        
        except Exception as e:
            print("-------ERROR MESSAGE--------")
            print(f"An error occurred: {e}")
            
            error_message = str(e)
            if error_message.startswith("'") and error_message.endswith("'"):
                error_message = error_message[1:-1]
            if error_message == 'body':
                print("Error message is 'body'")
                e = "Task timed out"
            
            print("USER ID HERE")
            user_id = event['userId']
            print(user_id)
            
            task_token = event['TaskToken']
            executionName = event['executionName']
            model_outputs = ""
            endpoint_name = ""
            trainingName = ""
            userId = user_id
            reference_outputs = ""
            modelId = ""
            leaderboardId = ""
            eventType = ""
            api_gateway_url = f'https://4xkf7lc0wg.execute-api.us-east-1.amazonaws.com/dev/invokeSF?TaskToken={task_token}&model_outputs={model_outputs}&endpointName={endpoint_name}&modelId={modelId}&leaderboardId={leaderboardId}&trainingName={trainingName}&userId={userId}&eventType={eventType}&reference_outputs={reference_outputs}&executionName={executionName}&errorMessage={e}'
        
            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
            
            payload_except = {
                "body": event['TaskToken'],
                "errorMessage": error_message
            }
            print(payload_except)
            
            payload_dump_except = json.dumps(payload_except)
            print(payload_dump_except)
            
            print("INVOKING STEP FUNCTIONS API DESPITE ERROR")
            # Invoke API Gateway
            response = requests.post(api_gateway_url, data=payload_dump_except, headers=headers)
            print(response)
            return {
                'status': 500,
                'errorMessage': error_message
            }