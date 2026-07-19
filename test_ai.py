from services.ai_service import ask_gemini

prompt = """
You are a professional HR interviewer.

Ask only ONE interview question for a fresher applying for a Python Developer role.

Do not ask multiple questions.
"""

response = ask_gemini(prompt)

print(response)