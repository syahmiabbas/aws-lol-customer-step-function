import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as fs from 'fs';
import * as path from 'path';
import { CfnOutput } from 'aws-cdk-lib';

export class TestTemplateStack extends cdk.Stack {

  public constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const accountId = this.account;
    // let eventName = this.node.tryGetContext('eventName') ?? `event`;
    // const bucketName = eventName + "-lol-output-json-bucket"

    const eventNameParam = new cdk.CfnParameter(this, 'eventName', {
      type: 'String',
      default: 'event',
      description: 'The event name'
    });

    const bucketName = eventNameParam.valueAsString + "-lol-output-json-bucket"

    // S3 Bucket
    const bucket = new s3.Bucket(this, `lol-output-json-bucket`, {
      bucketName: bucketName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // IAM Roles and Policies
    const devAccountId = "755215164008"

    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        resources: [
          `${bucket.bucketArn}/*`
        ],
        actions: [
          "s3:GetObject"
        ],
        principals: [
          new iam.ArnPrincipal(`arn:aws:iam::${devAccountId}:root`)
        ],
        effect: iam.Effect.ALLOW,
      })
    )

    const crossAccountTrustPolicy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            AWS: `arn:aws:iam::${devAccountId}:root`
          },
          Action: "sts:AssumeRole"
        }
      ]
    };

    const crossAccountIamRole = new iam.CfnRole(this, 'CrossAccountIamRole', {
      assumeRolePolicyDocument: crossAccountTrustPolicy,
      policies: [
        {
          policyName: 'StartStateMachineExecutionPolicy',
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'VisualEditor0',
                Effect: 'Allow',
                Action: 'states:StartExecution',
                Resource: '*',
              },
            ],
          },
        },
      ],
      roleName: 'CrossAccountIamRole',
    });

    new CfnOutput(this, 'CrossAccountIamRoleArn', {
      value: crossAccountIamRole.attrArn
    })
    
    const iamManagedPolicy00policyserviceroleAwsLambdaBasicExecutionRole3c20a019eb064314971c118d6208f90400yhG8c = new iam.CfnManagedPolicy(this, 'IAMManagedPolicy00policyserviceroleAWSLambdaBasicExecutionRole3c20a019eb064314971c118d6208f90400yhG8C', {
      managedPolicyName: 'AWSLambdaBasicExecutionRole-3c20a019-eb06-4314-971c-118d6208f904-2',
      path: '/service-role/',
      description: '',
      groups: [
      ],
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Resource: '*',
            Action: 'logs:CreateLogGroup',
            Effect: 'Allow',
          },
          {
            Resource: [
              '*',
            ],
            Action: [
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Effect: 'Allow',
          },
        ],
      },
      roles: [
      ],
      users: [
      ],
    });
    // iamManagedPolicy00policyserviceroleAwsLambdaBasicExecutionRole3c20a019eb064314971c118d6208f90400yhG8c.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

    const iamManagedPolicy00policyserviceroleAwsLambdaBasicExecutionRoleb148c8e705b84b8782d18ff8c9295d2a00T4IaS = new iam.CfnManagedPolicy(this, 'IAMManagedPolicy00policyserviceroleAWSLambdaBasicExecutionRoleb148c8e705b84b8782d18ff8c9295d2a00T4IaS', {
      managedPolicyName: 'AWSLambdaBasicExecutionRole-b148c8e7-05b8-4b87-82d1-8ff8c9295d2a-2',
      path: '/service-role/',
      description: '',
      groups: [
      ],
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Resource: '*',
            Action: 'logs:CreateLogGroup',
            Effect: 'Allow',
          },
          {
            Resource: [
              '*',
            ],
            Action: [
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Effect: 'Allow',
          },
        ],
      },
      roles: [
      ],
      users: [
      ],
    });
    // iamManagedPolicy00policyserviceroleAwsLambdaBasicExecutionRoleb148c8e705b84b8782d18ff8c9295d2a00T4IaS.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

    const iamManagedPolicy00policyserviceroleAwsLambdaBasicExecutionRolebc3dbd2944bb4977ade5b9d9fcc354ff006Gnpi = new iam.CfnManagedPolicy(this, 'IAMManagedPolicy00policyserviceroleAWSLambdaBasicExecutionRolebc3dbd2944bb4977ade5b9d9fcc354ff006GNPI', {
      managedPolicyName: 'AWSLambdaBasicExecutionRole-bc3dbd29-44bb-4977-ade5-b9d9fcc354ff-2',
      path: '/service-role/',
      description: '',
      groups: [
      ],
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Resource: '*',
            Action: 'logs:CreateLogGroup',
            Effect: 'Allow',
          },
          {
            Resource: [
              '*',
            ],
            Action: [
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Effect: 'Allow',
          },
        ],
      },
      roles: [
      ],
      users: [
      ],
    });
    // iamManagedPolicy00policyserviceroleAwsLambdaBasicExecutionRolebc3dbd2944bb4977ade5b9d9fcc354ff006Gnpi.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

    const iamManagedPolicy00policyserviceroleAwsLambdaBasicExecutionRoled0e0792fb9f045c38965f949f4baa98000Xc2iL = new iam.CfnManagedPolicy(this, 'IAMManagedPolicy00policyserviceroleAWSLambdaBasicExecutionRoled0e0792fb9f045c38965f949f4baa98000Xc2iL', {
      managedPolicyName: 'AWSLambdaBasicExecutionRole-d0e0792f-b9f0-45c3-8965-f949f4baa980-2',
      path: '/service-role/',
      description: '',
      groups: [
      ],
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Resource: '*',
            Action: 'logs:CreateLogGroup',
            Effect: 'Allow',
          },
          {
            Resource: [
              '*',
            ],
            Action: [
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Effect: 'Allow',
          },
        ],
      },
      roles: [
      ],
      users: [
      ],
    });
    // iamManagedPolicy00policyserviceroleAwsLambdaBasicExecutionRoled0e0792fb9f045c38965f949f4baa98000Xc2iL.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

    const iamManagedPolicy00policyserviceroleAwsLambdaBasicExecutionRoled6dfd6de2f7746b6aa269d3ca1068a9a00f4InM = new iam.CfnManagedPolicy(this, 'IAMManagedPolicy00policyserviceroleAWSLambdaBasicExecutionRoled6dfd6de2f7746b6aa269d3ca1068a9a00f4InM', {
      managedPolicyName: 'AWSLambdaBasicExecutionRole-d6dfd6de-2f77-46b6-aa26-9d3ca1068a9a-2',
      path: '/service-role/',
      description: '',
      groups: [
      ],
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Resource: '*',
            Action: 'logs:CreateLogGroup',
            Effect: 'Allow',
          },
          {
            Resource: [
              '*',
            ],
            Action: [
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Effect: 'Allow',
          },
        ],
      },
      roles: [
      ],
      users: [
      ],
    });
    // iamManagedPolicy00policyserviceroleAwsLambdaBasicExecutionRoled6dfd6de2f7746b6aa269d3ca1068a9a00f4InM.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

    const iamManagedPolicy00policyserviceroleAwsLambdaBasicExecutionRolee2b614c2b9a246c5ba098c8f369208e8005BtZq = new iam.CfnManagedPolicy(this, 'IAMManagedPolicy00policyserviceroleAWSLambdaBasicExecutionRolee2b614c2b9a246c5ba098c8f369208e8005BtZq', {
      managedPolicyName: 'AWSLambdaBasicExecutionRole-e2b614c2-b9a2-46c5-ba09-8c8f369208e8-2',
      path: '/service-role/',
      description: '',
      groups: [
      ],
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Resource: '*',
            Action: 'logs:CreateLogGroup',
            Effect: 'Allow',
          },
          {
            Resource: [
              '*',
            ],
            Action: [
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Effect: 'Allow',
          },
        ],
      },
      roles: [
      ],
      users: [
      ],
    });
    // iamManagedPolicy00policyserviceroleAwsLambdaBasicExecutionRolee2b614c2b9a246c5ba098c8f369208e8005BtZq.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

    const iamManagedPolicy00policyserviceroleLambdaInvokeScopedAccessPolicy323492b2607c4249931f5560bb9a5997003syRh = new iam.CfnManagedPolicy(this, 'IAMManagedPolicy00policyserviceroleLambdaInvokeScopedAccessPolicy323492b2607c4249931f5560bb9a5997003syRh', {
      managedPolicyName: 'LambdaInvokeScopedAccessPolicy-323492b2-607c-4249-931f-5560bb9a5997-2',
      path: '/service-role/',
      description: 'Allow AWS Step Functions to invoke Lambda functions on your behalf',
      groups: [
      ],
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Resource: [
              '*',
            ],
            Action: [
              'lambda:InvokeFunction',
            ],
            Effect: 'Allow',
          },
          {
            Resource: [
              '*',
            ],
            Action: [
              'lambda:InvokeFunction',
            ],
            Effect: 'Allow',
          },
        ],
      },
      roles: [
      ],
      users: [
      ],
    });
    // iamManagedPolicy00policyserviceroleLambdaInvokeScopedAccessPolicy323492b2607c4249931f5560bb9a5997003syRh.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

    const iamManagedPolicy00policyserviceroleLambdaInvokeScopedAccessPolicy9038aaba8e9340148a672c675c2fe15800KGmzR = new iam.CfnManagedPolicy(this, 'IAMManagedPolicy00policyserviceroleLambdaInvokeScopedAccessPolicy9038aaba8e9340148a672c675c2fe15800KGmzR', {
      managedPolicyName: 'LambdaInvokeScopedAccessPolicy-9038aaba-8e93-4014-8a67-2c675c2fe158-2',
      path: '/service-role/',
      description: 'Allow AWS Step Functions to invoke Lambda functions on your behalf',
      groups: [
      ],
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Resource: [
              '*',
            ],
            Action: [
              'lambda:InvokeFunction',
            ],
            Effect: 'Allow',
          },
          {
            Resource: [
              '*',
            ],
            Action: [
              'lambda:InvokeFunction',
            ],
            Effect: 'Allow',
          },
        ],
      },
      roles: [
      ],
      users: [
      ],
    });
    // iamManagedPolicy00policyserviceroleLambdaInvokeScopedAccessPolicy9038aaba8e9340148a672c675c2fe15800KGmzR.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

    const iamManagedPolicy00policyserviceroleXRayAccessPolicycc0bb9bdd3a24187ae380ded079faec9006FjLa = new iam.CfnManagedPolicy(this, 'IAMManagedPolicy00policyserviceroleXRayAccessPolicycc0bb9bdd3a24187ae380ded079faec9006FjLA', {
      managedPolicyName: 'XRayAccessPolicy-cc0bb9bd-d3a2-4187-ae38-0ded079faec9-2',
      path: '/service-role/',
      description: 'Allow AWS Step Functions to call X-Ray daemon on your behalf',
      groups: [
      ],
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Resource: [
              '*',
            ],
            Action: [
              'xray:PutTraceSegments',
              'xray:PutTelemetryRecords',
              'xray:GetSamplingRules',
              'xray:GetSamplingTargets',
            ],
            Effect: 'Allow',
          },
        ],
      },
      roles: [
      ],
      users: [
      ],
    });
    // iamManagedPolicy00policyserviceroleXRayAccessPolicycc0bb9bdd3a24187ae380ded079faec9006FjLa.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

    const iamManagedPolicy00policyserviceroleXRayAccessPolicyf3d44725d9094eaf99b931789d62b0c200KfLi9 = new iam.CfnManagedPolicy(this, 'IAMManagedPolicy00policyserviceroleXRayAccessPolicyf3d44725d9094eaf99b931789d62b0c200KfLi9', {
      managedPolicyName: 'XRayAccessPolicy-f3d44725-d909-4eaf-99b9-31789d62b0c2-2',
      path: '/service-role/',
      description: 'Allow AWS Step Functions to call X-Ray daemon on your behalf',
      groups: [
      ],
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Resource: [
              '*',
            ],
            Action: [
              'xray:PutTraceSegments',
              'xray:PutTelemetryRecords',
              'xray:GetSamplingRules',
              'xray:GetSamplingTargets',
            ],
            Effect: 'Allow',
          },
        ],
      },
      roles: [
      ],
      users: [
      ],
    });
    // iamManagedPolicy00policyserviceroleXRayAccessPolicyf3d44725d9094eaf99b931789d62b0c200KfLi9.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

    const iamRole00StepFunctionsprojectlolstatemachine3rolefiakxscni00h21Nt = new iam.CfnRole(this, 'IAMRole00StepFunctionsprojectlolstatemachine3rolefiakxscni00h21NT', {
      path: '/service-role/',
      managedPolicyArns: [
        iamManagedPolicy00policyserviceroleXRayAccessPolicyf3d44725d9094eaf99b931789d62b0c200KfLi9.ref,
        'arn:aws:iam::aws:policy/AWSLambda_FullAccess',
        'arn:aws:iam::aws:policy/AmazonSageMakerFullAccess',
        'arn:aws:iam::aws:policy/AWSStepFunctionsFullAccess',
        iamManagedPolicy00policyserviceroleLambdaInvokeScopedAccessPolicy9038aaba8e9340148a672c675c2fe15800KGmzR.ref,
      ],
      maxSessionDuration: 3600,
      roleName: 'StepFunctions-project-lol-state-machine-3-role-fiakxscni',
      policies: [
        {
          policyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Resource: '*',
                Action: 'lambda:InvokeFunction',
                Effect: 'Allow',
              },
            ],
          },
          policyName: 'invokeLambda',
        },

      ],
      assumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'states.amazonaws.com',
            },
          },
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              AWS: 'arn:aws:iam::755215164008:root',
            },
          }
        ],
      },
    });

    const iamRole00generateendpointlolrolegkshk7dh008sG46 = new iam.CfnRole(this, 'IAMRole00generateendpointlolrolegkshk7dh008sG46', {
      path: '/service-role/',
      managedPolicyArns: [
        iamManagedPolicy00policyserviceroleAwsLambdaBasicExecutionRoled0e0792fb9f045c38965f949f4baa98000Xc2iL.ref,
        'arn:aws:iam::aws:policy/AmazonSageMakerFullAccess',
        'arn:aws:iam::aws:policy/AdministratorAccess',
        
      ],
      maxSessionDuration: 3600,
      roleName: 'generate-endpoint-lol-role-gkshk7dh',
      assumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'sagemaker.amazonaws.com',
            },
          },
        ],
      },
    });

    const iamRole00generateoutputlolrole15901mev00zktT8 = new iam.Role(this, 'iamRole00generateoutputlolrole15901mev00zktT8', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      path: '/service-role/',
      managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
          iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
      ],
      maxSessionDuration: cdk.Duration.hours(1),
      roleName: 'generate-output-lol-role-qv3i7d6d'
    });

    const iamRole00generateflowoutputlolrole = new iam.Role(this, 'iamRole00generateflowoutputlolrole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      path: '/service-role/',
      managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ],
      maxSessionDuration: cdk.Duration.hours(1),
      roleName: 'generate-flow-output-lol-role'
    });

    // Lambda Layer: sagemaker-lol-layer
    const sagemaker_lol_layer = new lambda.LayerVersion(this, 'sagemaker-lol-layer', {
      code: lambda.Code.fromAsset('sagemakerlollayer9DA53C9F-770ab930-c3dd-48bc-b7de-acc42e144c96.zip'),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_9],
    });

    // Lambda Function: generate-endpoint-lol
    const generate_endpoint_lol_code = fs.readFileSync('generate-endpoint-lol.py', 'utf8');
    const lambdaFunction00generateendpointlol002J8eY = new lambda.CfnFunction(this, 'LambdaFunction00generateendpointlol002J8eY', {
      memorySize: 256,
      description: '',
      tracingConfig: {
        mode: 'PassThrough',
      },
      timeout: 900,
      runtimeManagementConfig: {
        updateRuntimeOn: 'Auto',
      },
      handler: 'index.lambda_handler',
      code: {
        zipFile: generate_endpoint_lol_code
      },
      role: iamRole00generateendpointlolrolegkshk7dh008sG46.attrArn,
      fileSystemConfigs: [
      ],
      functionName: 'generate-endpoint-lol',
      runtime: 'python3.9',
      packageType: 'Zip',
      loggingConfig: {
        logFormat: 'Text',
        logGroup: '/aws/lambda/generate-endpoint-lol',
      },
      ephemeralStorage: {
        size: 512,
      },
      layers: [
        sagemaker_lol_layer.layerVersionArn
      ],
      architectures: [
        'x86_64',
      ],
    });
    
    // Lambda Function: generate-output-lol
    const outputZipPath = path.join(__dirname, '../generate-output-lol.zip');

    const lambdaFunction00generateoutputlol00Iio5p = new lambda.Function(this, 'lambdaFunction00generateoutputlol00Iio5p', {
      memorySize: 256,
      description: '',
      tracing: lambda.Tracing.ACTIVE,
      timeout: cdk.Duration.seconds(900),
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset(outputZipPath),
      handler: 'index.lambda_handler',
      functionName: 'generate-output-lol',
      environment: {
        "BUCKET_NAME": bucketName
      },
      role: iamRole00generateoutputlolrole15901mev00zktT8
    });

    // const generate_flow_output_lol_code = fs.readFileSync('generate-endpoint-lol.py', 'utf8');
    const generateFlowOutputFunction = new lambda.Function(this, 'generate_flow_output_lol', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'index.handler',
      memorySize: 256,
      timeout: cdk.Duration.seconds(900),
      code: lambda.Code.fromInline("./generate-endpoint-lol.py"),
      layers: [
        lambda.LayerVersion.fromLayerVersionArn(this, 'MyImportedLayer', sagemaker_lol_layer.layerVersionArn)
      ],
      functionName: 'generate-flow-output-lol',
      environment: {
        "BUCKET_NAME": bucketName
      },
      role: iamRole00generateflowoutputlolrole
    })

    // State Machine: project-lol-state-machine-3
    const stepFunctionsStateMachine00stateMachineprojectlolstatemachine300zd3Gf = new stepfunctions.CfnStateMachine(this, 'StepFunctionsStateMachine00stateMachineprojectlolstatemachine300zd3Gf', {
      definitionString: `{
        "Comment": "A description of my state machine",
        "StartAt": "check type",
        "States": {
          "check type": {
            "Type": "Choice",
            "Choices": [
              {
                "Next": "Generate Prompt Flow Outputs",
                "Not": {
                  "Variable": "$.eventType",
                  "StringEquals": "TUNE_WHIZ"
                }
              }
            ],
            "Default": "Deploy Endpoint"
          },
          "Generate Prompt Flow Outputs": {
            "Type": "Task",
            "Resource": "arn:aws:states:::lambda:invoke",
            "OutputPath": "$.Payload",
            "Parameters": {
              "Payload.$": "$",
              "FunctionName": "${generateFlowOutputFunction.functionArn}"
            },
            "Retry": [
              {
                "ErrorEquals": [
                  "Lambda.ServiceException",
                  "Lambda.AWSLambdaException",
                  "Lambda.SdkClientException",
                  "Lambda.TooManyRequestsException"
                ],
                "IntervalSeconds": 1,
                "MaxAttempts": 3,
                "BackoffRate": 2,
                "JitterStrategy": "FULL"
              }
            ],
            "End": true
          },
          "Deploy Endpoint": {
            "Type": "Task",
            "Resource": "arn:aws:states:::lambda:invoke",
            "OutputPath": "$.Payload",
            "Parameters": {
              "Payload.$": "$",
              "FunctionName": "${lambdaFunction00generateendpointlol002J8eY.attrArn}"
            },
            "Retry": [
              {
                "ErrorEquals": [
                  "Lambda.ServiceException",
                  "Lambda.AWSLambdaException",
                  "Lambda.SdkClientException",
                  "Lambda.TooManyRequestsException"
                ],
                "IntervalSeconds": 1,
                "MaxAttempts": 3,
                "BackoffRate": 2
              }
            ],
            "Next": "Generate Output",
            "Catch": [
              {
                "ErrorEquals": [
                  "States.ALL"
                ],
                "Next": "Generate Output",
                "ResultPath": null
              }
            ]
          },
          "Generate Output": {
            "Type": "Task",
            "Resource": "arn:aws:states:::lambda:invoke",
            "OutputPath": "$.Payload",
            "Parameters": {
              "Payload.$": "$",
              "FunctionName": "${lambdaFunction00generateoutputlol00Iio5p.functionArn}"
            },
            "Retry": [
              {
                "ErrorEquals": [
                  "Lambda.ServiceException",
                  "Lambda.AWSLambdaException",
                  "Lambda.SdkClientException",
                  "Lambda.TooManyRequestsException"
                ],
                "IntervalSeconds": 1,
                "MaxAttempts": 3,
                "BackoffRate": 2
              }
            ],
            "Next": "DeleteEndpoint",
            "Catch": [
              {
                "ErrorEquals": [
                  "States.ALL"
                ],
                "Next": "DeleteEndpoint"
              }
            ]
          },
          "DeleteEndpoint": {
            "Type": "Task",
            "End": true,
            "Parameters": {
              "EndpointName.$": "$.endpointName"
            },
            "Resource": "arn:aws:states:::aws-sdk:sagemaker:deleteEndpoint",
            "ResultPath": null,
            "Retry": [
              {
                "ErrorEquals": [
                  "States.ALL"
                ],
                "BackoffRate": 2,
                "IntervalSeconds": 1,
                "MaxAttempts": 3
              }
            ]
          }
        }
      }`,
      loggingConfiguration: {
        includeExecutionData: false,
        level: 'OFF',
      },
      stateMachineName: 'project-lol-state-machine-3',
      roleArn: iamRole00StepFunctionsprojectlolstatemachine3rolefiakxscni00h21Nt.attrArn,
      tags: [
      ],
      stateMachineType: 'STANDARD',
      tracingConfiguration: {
        enabled: false,
      },
    });
    // stepFunctionsStateMachine00stateMachineprojectlolstatemachine300zd3Gf.cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;

    new CfnOutput(this, 'StateMachine3Arn', {
      value: stepFunctionsStateMachine00stateMachineprojectlolstatemachine300zd3Gf.attrArn
  });

  }
}