from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Interview Simulator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "AI Interview Simulator Backend is Running!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/analyze")
def analyze_answer(data: dict):
    answer = data.get("answer", "").strip()

    if not answer:
        return {
            "success": False,
            "message": "No answer was provided."
        }

    word_count = len(answer.split())

    if word_count < 10:
        communication = 45
        confidence = 40
        technical = 40
        feedback = "Your answer is too short. Try explaining your answer with more detail."
    elif word_count < 30:
        communication = 65
        confidence = 60
        technical = 60
        feedback = "Good start. Add an example to make your answer stronger."
    else:
        communication = 85
        confidence = 82
        technical = 80
        feedback = "Good answer. You explained your point clearly and with enough detail."

    overall = round(
        (technical + communication + confidence) / 3
    )

    return {
        "success": True,
        "technical": technical,
        "communication": communication,
        "confidence": confidence,
        "overall": overall,
        "feedback": feedback,
        "word_count": word_count
    }