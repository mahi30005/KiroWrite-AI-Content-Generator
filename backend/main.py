from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from groq import Groq

# Load environment variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("❌ GROQ_API_KEY missing")

client = Groq(api_key=GROQ_API_KEY)

app = FastAPI(title="KiroWrite Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# MODELS
# -------------------------------

class ContentRequest(BaseModel):
    idea: str
    platform: str
    action: str

class LoginRequest(BaseModel):
    email: str
    password: str


# -------------------------------
# ROUTES
# -------------------------------

@app.get("/")
def root():
    return {"message": "🚀 KiroWrite Backend is running!"}


# -------------------------------
# AUTH (NEW – SAFE ADDITION)
# -------------------------------

@app.post("/login")
def login(req: LoginRequest):
    """
    Simple auth logic (safe for now)
    Later: replace with DB + JWT
    """
    username = req.email.split("@")[0]

    return {
        "success": True,
        "username": username,
        "email": req.email
    }


# -------------------------------
# PROMPT BUILDER
# -------------------------------

def build_prompt(req: ContentRequest) -> str:
    action_guide = """
Action rules:
- generate → create new content
- rewrite → improve clarity & engagement
- summarize → short bullet points
"""

    if req.platform.lower() == "instagram":
        return f"""
Create a catchy Instagram post.
Use emojis, short lines, and hashtags.

Idea: {req.idea}
Action: {req.action}

{action_guide}
"""
    elif req.platform.lower() == "linkedin":
        return f"""
Write a professional LinkedIn post.
Use a value-driven tone.

Idea: {req.idea}
Action: {req.action}

{action_guide}
"""
    else:
        return f"""
Write high-quality content.

Idea: {req.idea}
Action: {req.action}

{action_guide}
"""


# -------------------------------
# CONTENT GENERATION (UNCHANGED)
# -------------------------------

@app.post("/content")
def generate_content(req: ContentRequest):
    prompt = build_prompt(req)

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )

        return {
            "platform": req.platform,
            "action": req.action,
            "result": response.choices[0].message.content
        }

    except Exception as e:
        return {"error": str(e)}
