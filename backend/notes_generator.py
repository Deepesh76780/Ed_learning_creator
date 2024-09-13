# This script is used to generate lecture notes for a given transcript. The notes are generated for 3 different difficulty levels: undergrad, teenagers and experts.

#Imports
from groq import Groq
import os
import json
from dotenv import load_dotenv
# Load the environment variables
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
# generating for 3 different difficulty levels
dic = {0: "undergrad", 1: "teenagers", 2: "experts"}
# function to generate the messages for the completion
def message(i, transcript):
    if i==0:
        return [
            {
                "role": "system",
                "content": "You are an expert notes generator. You have been asked to build notes for the given transcripts.\
                    Your task is to explain the topics in detail with difficulty level for this course being undergrad. \
                    Also, try to include genuine 1-2 citations sometimes if facts have been taken from other resources. \
                    Note you must stick to the transcript while explaining the concepts."
            },
            {
                "role": "user",
                "content": f"Build notes based on the user-requested transcript. The transcript  is {transcript}. Explain the concepts for an undergrad level."
            }
        ]
    elif i==1:
        return [
            {
                "role": "system",
                "content": "You are an expert notes generator. You have been asked to build notes for the given transcripts.\
                    Your task is to explain the topics in detail with difficulty level for this course being kids/teenagers. Try to be more creative and include more\
                     examples to make the content more understandable. Also, try to include genuine 1-2 citations sometimes if facts have been taken from other resources.\
                    Note you must stick to the transcript while explaining the concepts."
            },
            {
                "role": "user",
                "content": f"Build notes based on the user-requested transcript. The transcript  is {transcript}. Explain the concepts for an kids/teen level. "  
            }
        ]
    else:
        return [
            {
                "role": "system",
                "content": "You are an expert notes generator. You have been asked to build notes for the given transcripts.\
                    Your task is to explain the topics in detail with difficulty level for this course being expert level.  Try to be more factful and include few complex\
                     terms to make the content more appealing. Also, try to include genuine 1-2 citations sometimes if facts have been taken from other resources.\
                        Note you must stick to the transcript while explaining the concepts."
            },
            {
                "role": "user",
                "content": f"Build notes based on the user-requested transcript. The transcript  is {transcript}. Explain the concepts for an expert level."  
            }
        ]
    

def lecture_notes_generator(course_name,week, transcript):
    init_dic = {}
    for i in range(3):
        text = str()
        # if i !=0:
        #     context = init_dic['undergrad']

        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages= message(i,transcript),
            # temperature=0.08 for repititive content generation
            temperature=0.08,
            max_tokens=1024,
            top_p=1,
            stream=True,
            stop=None,
        )

        for chunk in completion:
            # print(chunk.choices[0].delta.content or "", end="")
            text += chunk.choices[0].delta.content or ""           

        init_dic[dic[i]] = text
    
    return init_dic