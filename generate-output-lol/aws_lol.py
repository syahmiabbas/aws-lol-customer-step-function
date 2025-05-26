import argparse
import boto3
import json
import os
import time
import uuid
from typing import Dict, List
import boto3

ENDPOINT_NAME = None
REGION_NAME = 'us-west-2'
TEST_INSTRUCTION = "{prompt}"
USER_ID = ''
MODEL_ID = ''
DATASET = None
EVAL_SET = None
GENERATOR = None
sm_runtime = None

def time_elapsed(func):
    def wrapper(*args, **kwargs):        
        return result
    return wrapper


def format_instructions(instructions: List[Dict[str, str]]) -> List[str]:
    """Format instructions where conversation roles must alternate user/assistant/user/assistant/..."""
    prompt: List[str] = []
    for user, answer in zip(instructions[::2], instructions[1::2]):
        prompt.extend(["<s>", "[INST] ", (user["content"]).strip(), " Provide an answwer with less than 300 words. [/INST] ", (answer["content"]).strip(), "</s>"])
    # prompt.extend(["<s>", "[INST] ", (instructions[-1]["content"]).strip(), " Provide an answwer with less than 300 words.  [/INST] "])#LLAMA2
    prompt.extend(["<|begin_of_text|>", "<|start_header_id|>user<|end_header_id|> ", (instructions[-1]["content"]).strip(), " Provide an answwer with less than 300 words.  <|eot_id|><|start_header_id|>assistant<|end_header_id|>"])#LLAMA3
    # prompt.extend(["", (instructions[-1]["content"]).strip(), " Provide an answer with less than 300 words."])#LLAMA2
    return "".join(prompt)


def invoke_mistral(prompt, endpoint_name, **kwargs):
    instructions = [{"role": "user", "content": prompt}]
    formatted_prompt = format_instructions(instructions)
    parameters = {"max_new_tokens": 512, "do_sample": False}
    for k in kwargs:
        if k in ['max_new_tokens', 'do_sample']:
            parameters[k] = kwargs[k]

    payload = {
        "inputs": formatted_prompt,
        "parameters": parameters
    }
    print("INVOKING ENDPOINT")
    print(payload)
    try:
        response = sm_runtime.invoke_endpoint(
            EndpointName=endpoint_name,
            ContentType='application/json',
            Body=json.dumps(payload).encode('utf-8'),
            #  InferenceComponentName='meta-textgeneration-llama-3-8b-instruct-20240613-080621', #Comment if LLAMA2
            CustomAttributes= "accept_eula=true")
    except Exception as e:
        response = f'Error: {e}'
        return response

    print("ENDPOINT RESPONSE")
    response = json.loads(response['Body'].read())
    print(response)
    completion = response['generated_text'] #llama3

    
    # completion = response[0]['generated_text'] # for llama3
    # completion = response[0]['generated_text'] # for llama2(correct)
    # completion = response[0]['generation'] # for llama2(wrong)
    
    completionSplit = completion.split("<|eot_id|><|start_header_id|>assistant<|end_header_id|>")
    
    if len(completionSplit) > 0:
        print("testing...")
        completion = completionSplit[0] #ENABLE on for LLAMA3 
        print("testing2...")
    
    print(completion)

    return completion


def alpaca_eval_from_template(generate_fn, prompt_template, output_json, endpoint_name, eval_set: List[Dict]):
    global DATASET, GENERATOR

    n = len(eval_set)
    model_outputs = []
    for i, example in enumerate(eval_set):
        instruction = example["instruction"]
        
        start_time = time.time()
        
        output = generate_fn(instruction, endpoint_name)
        
        end_time = time.time()
        
        # Calculate and print elapsed time
        elapsed_time = end_time - start_time

        print(f"Time elapsed: {elapsed_time} seconds")
        
        example["output"] = output
        print(f"""\n----- Example {i+1:03d} / {n} -----\n**Input**: {instruction}\n**Output**: {output}\n""")

        model_outputs.append({
            'dataset': DATASET,
            'instruction': instruction,
            'output': output,
            'generator': GENERATOR
        })

    with open(output_json, 'w') as f:
        json.dump(model_outputs, f, indent=2)

# class AWS_LOL_Class():
    
#     def __init__(self, ENDPOINT_NAME, REGION_NAME, TEST_INSTRUCTION):
#         self.__endpoint_name__ = ENDPOINT_NAME
#         self.__region_name__ = REGION_NAME
#         self.__test_instruction__ = TEST_INSTRUCTION
        
#     def generate_model_outputs(self):
#         alpaca_eval_from_template(
#             generate_fn = invoke_mistral,
#             prompt_template = TEST_INSTRUCTION,
#             output_json = f"{user_id}-{model_id}-outputs.json"
#         )

def client(endpoint_name, region_name, test_instruction, user_id, model_id, eval_set, generator_name):
    global ENDPOINT_NAME, REGION_NAME, TEST_INSTRUCTION, USER_ID, MODEL_ID, EVAL_SET, GENERATOR, sm_runtime

    ENDPOINT_NAME = endpoint_name
    REGION_NAME = region_name
    TEST_INSTRUCTION = test_instruction
    USER_ID = user_id
    MODEL_ID = model_id
    EVAL_SET = eval_set
    GENERATOR = generator_name
    sm_runtime = boto3.client('sagemaker-runtime', region_name=REGION_NAME)


def generate_model_outputs():
    global TEST_INSTRUCTION, USER_ID, MODEL_ID, ENDPOINT_NAME
    
    random_string = str(uuid.uuid4())[:4]
    print(random_string)

    alpaca_eval_from_template(
        generate_fn = invoke_mistral,
        prompt_template = TEST_INSTRUCTION,
        output_json = f"/tmp/{USER_ID}-{MODEL_ID}-outputs-{random_string}.json",
        endpoint_name = ENDPOINT_NAME,
        eval_set = EVAL_SET
    )

    return f"/tmp/{USER_ID}-{MODEL_ID}-outputs-{random_string}.json"