import os
import tempfile
from contextlib import asynccontextmanager
from typing import Annotated

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from transcription import TranscriptionService

load_dotenv()

class CleanRequest(BaseModel):
    text: str
    system_prompt: str | None = None


service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global service
    print("🚀 Starting AI Transcript App...")
    service = TranscriptionService(
        whisper_model=os.getenv("WHISPER_MODEL"),
        llm_base_url=os.getenv("LLM_BASE_URL"),
        llm_api_key=os.getenv("LLM_API_KEY"),
        llm_model=os.getenv("LLM_MODEL"),
    )
    print("✅ Ready!")
    yield


app = FastAPI(title="AI Transcript App", lifespan=lifespan)
