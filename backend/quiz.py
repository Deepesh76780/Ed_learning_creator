# This file contains the function to generate quiz based on the content provided by the user.

#Imports
from groq import Groq
from dotenv import load_dotenv
import os
# Load the environment variables
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
# Function to generate the quiz
def quiz_generator(summary_content):
    text = str()
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": "You are an expert quiz creator. You have been asked to build a quiz for a user-requested content. The difficulty level for this\
                      course is for an undergrad student. Quiz should be similar to the NPTEL quiz format with an average of 10 or 20 questions based on content length\
                        with each quiz being marked for 1 for correct 0 for incorrect. Questions must be MCQs and should be based on the content provided.\
                        Don't include any additional details while generating. Just the questions and options and answers.",
            },
            {
                "role": "user",
                "content": f"Build a quiz for the user-requested content. The content is {summary_content}.",
            },
        ],
        # temperature=0.05 for repititive and error-less quiz generation
        temperature=0.05,
        max_tokens=2048,
        top_p=1,
        stream=True,
        stop=None,
    )

    for chunk in completion:
        # print(chunk.choices[0].delta.content or "", end="")
        text += chunk.choices[0].delta.content or ""

    # # pre-processing the text
    question = {}
    options = {}
    answer = {}
    text = text.split("\n\n")[1:]
    for i in range(1, len(text) - 1, 2):
        temp = text[i - 1].split("\n")
        question[int((i / 2) + 0.5)] = temp[0][5:-2]
        options[int((i / 2) + 0.5)] = temp[1:]
        answer[int((i / 2) + 0.5)] = text[i][8:]

    init_dic = {}
    init_dic["questions"] = question
    init_dic["options"] = options
    init_dic["answers"] = answer

    return init_dic