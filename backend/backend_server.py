# Description: This file contains the backend server code for the GenAI project.

# Imports
import uvicorn
import os
import re
import pymongo
import bcrypt
import yt_dlp as youtube_dl
from fastapi import FastAPI
from groq import Groq
from dotenv import load_dotenv
from transcriptor import transcriptor
from notes_generator import lecture_notes_generator
from translator import translate
from course_layout import generate_Layout
from quiz import quiz_generator
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel




app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Loading Env Variables
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
mongodb = os.getenv("DB")


# Routes
# Base Route
@app.get("/")
def read_root():
    return {"Hello": "World"}


class SignupData(BaseModel):
    username: str
    password: str
    
    
# Login Route
@app.post("/login")
def login(data : SignupData):
    username = data.username
    password = data.password
    
    print("login function is running")

    
    db_client = pymongo.MongoClient(
        mongodb.replace("<username>", db_user).replace("<password>", db_password)
    )
    db = db_client["genai"]
    collection = db["users"]
    # Check if user exists
    user = collection.find_one({"username": username})
    # Check if password is correct
    if user:
        if bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
            return {"message": "Login successful"}
        else:
            return {"message": "Invalid password"}
    else:
        return {"message": "User not found"}

# Signup Route
@app.post("/signup")
def signup(data : SignupData):
    username = data.username
    password = data.password
    
    print("signup function is running")
    # Connect to MongoDB
    db_client = pymongo.MongoClient(
        mongodb.replace("<username>", db_user).replace("<password>", db_password)
    )
    db = db_client["genai"]
    collection = db["users"]
    # Check if user already exists
    existing_user = collection.find_one({"username": username})
    # Create new user
    if existing_user:
        return {"message": "Username already taken"}

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    new_user = {"username": username, "password": hashed_password.decode("utf-8")}
    # Insert new user into MongoDB
    collection.insert_one(new_user)
    return {"message": "User created successfully"}


# Generate Course Layout
@app.post("/generate_layout/")
def course_layout_generator(content, context, course_name):
    # Generate course layout
    final_dic = generate_Layout(content, context)

    # Connect to MongoDB
    db_client = pymongo.MongoClient(
        mongodb.replace("<username>", db_user).replace("<password>", db_password)
    )
    db = db_client["genai"]
    collection = db["course_layouts"]
    collection.insert_one({course_name: final_dic})

    return


@app.post("/store_video/")
def store_video(video_url: str, week: int, topic_name: str, course_name: str):
    # Connect to MongoDB
    db_client = pymongo.MongoClient(
        mongodb.replace("<username>", db_user).replace("<password>", db_password)
    )
    db = db_client["genai"]
    collection = db["videos"]
    video = {
        "video_url": video_url,
        "week": week,
        "topic_name": topic_name,
        "course_name": course_name,
    }
    collection.insert_one(video)

    return {"message": "Video stored successfully"}


@app.post("/generate_summary/")
def weekwise_summary(course_name: str, week: int):
    # Connect to MongoDB
    db_client = pymongo.MongoClient(
        mongodb.replace("<username>", db_user).replace("<password>", db_password)
    )
    db = db_client["genai"]
    collection = db["videos"]

    # Get all videos for the given course_name and week
    videos = collection.find({"course_name": course_name, "week": week})

    audio_files = []
    # Download audio files for each video
    for video in videos:
        video_url = video["video_url"]
        topic_name = video["topic_name"]
        ydl_opts = {
            "format": "bestaudio/best",
            "postprocessors": [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }
            ],
            "outtmpl": f"temp_audio/{topic_name}.%(ext)s",  # Save audio files with topic_name
            "verbose": True,  # Enable verbose output
            "ffmpeg_location": "C:/ffmpeg/bin",  # Specify the location of FFmpeg executable
        }
        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])
            audio_files.append([topic_name, f"temp_audio/{topic_name}.mp3"])

    # Transcribe audio files
    transcripts = ""
    for topic, audio in audio_files:
        text = topic + " : " + transcriptor(audio)
        transcripts = transcripts + ", " + text

    # Generate lecture notes
    summary = lecture_notes_generator(course_name, week, transcripts)

    # Check if course_name already exists in the summary table
    collection = db["summary"]
    existing_summary = collection.find_one({"course_name": course_name})

    if existing_summary:
        # Update existing summary with new week:summary
        existing_summary["summary"].append({str(week): summary})
        collection.update_one(
            {"course_name": course_name},
            {"$set": {"summary": existing_summary["summary"]}},
        )
    else:
        # Create new entry for course_name in the summary table
        new_summary = {"course_name": course_name, "summary": [{str(week): summary}]}
        collection.insert_one(new_summary)

    return


@app.post("/generate_quiz")
def quiz_generator(course_name, week):

    summary_content = ""
    # Connect to MongoDB
    db_client = pymongo.MongoClient(
        mongodb.replace("<username>", db_user).replace("<password>", db_password)
    )
    db = db_client["genai"]
    collection = db["summary"]
    summary = collection.find_one({"course_name": course_name})
    if summary:
        for week_summary in summary["summary"]:
            if str(week) in week_summary:
                summary_content = week_summary[str(week)]["undergrad"]
    else:
        return "Summary not found for the given course and week"

    init_dic = quiz_generator(summary_content)

    # Connect to MongoDB
    db_client = pymongo.MongoClient(
        mongodb.replace("<username>", db_user).replace("<password>", db_password)
    )
    db = db_client["genai"]
    collection = db["quizzes"]
    existing_quiz = collection.find_one({"course_name": course_name})

    if existing_quiz:
        # Update existing quiz with new week:quiz
        existing_quiz["quizzes"].append({str(week): str(init_dic)})
        collection.update_one(
            {"course_name": course_name},
            {"$set": {"quizzes": existing_quiz["quizzes"]}},
        )
    else:
        # Create new entry for course_name in the quizzes table
        new_quiz = {"course_name": course_name, "quizzes": [{str(week): str(init_dic)}]}
        collection.insert_one(new_quiz)

    return {"message": "Quiz saved successfully"}


@app.post("/translate/")
def translate_text(course_name, week, level, target_language_code):
    # Connect to MongoDB
    db_client = pymongo.MongoClient(
        mongodb.replace("<username>", db_user).replace("<password>", db_password)
    )
    db = db_client["genai"]
    collection = db["summary"]

    summary = collection.find_one({"course_name": course_name})
    if summary:
        for week_summary in summary["summary"]:
            if str(week) in week_summary:
                content = week_summary[str(week)][level]

    # Translate content to target language
    translated = translate(content, target_language_code)
    return translated


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)