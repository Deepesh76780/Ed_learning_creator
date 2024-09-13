# This file contains the function to generate the course layout for the user-requested content.

#Imports
from groq import Groq
from dotenv import load_dotenv
import os
import re
# Load the environment variables
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
# Function to generate the course layout
def generate_Layout(content, context):
    text = str()
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": "You are an expert course layout creator. You have been asked to build a course layout for a user-requested content. \
                    The difficulty level for this course is for an undergrad student. Course layout should be similar to the NPTEL courses format.\
                    It should only and only contain the following - About the Course, Intended audience, Pre-requisites, Course layout in the form of various weeks,\
                    books and references, and the grading policy for earning certificates.",
            },
            {
                "role": "user",
                "content": f"Build a course layout for the user-requested content. The content is {content}. Make sure to include {context} while building the layout.",
            },
        ],
        # temperature=0.05 for repititive content layout and error-less generation
        temperature=0.05,
        max_tokens=2048,
        top_p=1,
        stream=True,
        stop=None,
    )

    for chunk in completion:
        # print(chunk.choices[0].delta.content or "", end="")
        text += chunk.choices[0].delta.content or ""

    # pre-processing the text
    init_dic = {}
    content_layout = {}
    pattern = r"Week\s\d{1}"
    text = text.replace("\n", "")
    text = text.split("**")

    for i in range(1, len(text)):
        if "About the Course" in text[i]:
            init_dic["description"] = text[i + 1]
        elif "Intended audience" in text[i]:
            init_dic["intended_audience"] = text[i + 1]
        elif "Pre-requisites" in text[i]:
            init_dic["pre_requisites"] = text[i + 1]
        elif bool(re.search(pattern, text[i])):
            content_layout[text[i]] = text[i + 1]
            init_dic["content_layout"] = content_layout
        elif "Books and References" in text[i]:
            init_dic["references"] = text[i + 1]
        elif "Grading Policy" in text[i]:
            init_dic["grading_policy"] = text[i + 1]

    final_dic = {content: init_dic}
    return final_dic