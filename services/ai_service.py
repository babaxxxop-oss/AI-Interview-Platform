import os
import re
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

MODEL = "deepseek/deepseek-chat-v3-0324"


# ==========================================================
# Clean AI Response
# ==========================================================

def clean_response(text: str) -> str:
    """
    Remove unwanted prefixes and leaked prompt instructions.
    """

    if not text:
        return ""

    text = text.strip()

    prefixes = [
        "Interviewer:",
        "Question:",
        "Question 1:",
        "Question 2:",
        "Question 3:",
        "Q1:",
        "Q2:",
        "Q3:",
        "AI:",
        "Nova:"
    ]

    for prefix in prefixes:
        if text.startswith(prefix):
            text = text[len(prefix):].strip()

    # Remove parenthesized instructions
    text = re.sub(r"\(.*?\)", "", text)

    # Remove multiple blank lines
    text = re.sub(r"\n{2,}", "\n", text)

    return text.strip()


# ==========================================================
# Send Request
# ==========================================================

def generate_ai_response(messages):
    """
    Sends messages to OpenRouter.

    Parameters
    ----------
    messages : list
        Fully prepared chat messages.

    Returns
    -------
    str
        Clean AI response.
    """

    try:

        response = client.chat.completions.create(

            model=MODEL,

            messages=messages,

            temperature=0.6,

            max_tokens=350

        )

        ai_reply = response.choices[0].message.content

        return clean_response(ai_reply)

    except Exception as e:

        print(e)

        return (
            "I'm sorry, I couldn't generate the next interview "
            "question because an unexpected error occurred."
        )