from pathlib import Path
from faster_whisper import WhisperModel
from openai import OpenAI

PROMPT_FILE = Path(__file__).parent / "system_prompt.txt"
SYSTEM_PROMPT = PROMPT_FILE.read_text().strip()

class TranscriptionService:

    def __init__(self, whisper_model, llm_base_url, llm_api_key, llm_model):
        print(f"🔄 Loading Whisper model '{whisper_model}'...")
        self.whisper = WhisperModel(
            whisper_model,
            device="auto",
            compute_type="int8",
        )
        print(f"✅ Whisper model '{whisper_model}' loaded!")

        print(f"🔄 Connecting to LLM at {llm_base_url}...")
        self.llm_client = OpenAI(base_url=llm_base_url, api_key=llm_api_key)
        self.llm_model = llm_model

        try:
            self.llm_client.models.list()
            print("✅ Connected to LLM API!")
        except Exception as e:
            print(f"⚠️  Warning: Could not connect to LLM: {e}")
