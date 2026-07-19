from flask import Blueprint, render_template, request, redirect, url_for, flash, session
import json

from database.db import get_db_connection
from services.ai_service import chat_with_ai

interview_bp = Blueprint("interview", __name__)


# ==================================================
# Setup
# ==================================================

@interview_bp.route("/setup", methods=["GET", "POST"])
def setup():

    if "username" not in session:
        flash("Please login first!", "warning")
        return redirect(url_for("auth.login"))

    if request.method == "POST":

        session["category"] = request.form["category"]
        session["difficulty"] = request.form["difficulty"]
        session["num_questions"] = int(request.form["num_questions"])

        # Start AI Conversation
        session["chat_history"] = [
            {
                "role": "user",
                "content": f"""
Start a professional interview.

Category: {session['category']}
Difficulty: {session['difficulty']}

Introduce yourself briefly.

Then ask ONLY the FIRST interview question.

Do not ask multiple questions.
"""
            }
        ]

        session["question_number"] = 1

        return redirect(url_for("interview.interview"))

    return render_template("setup.html")


# ==================================================
# Interview
# ==================================================

@interview_bp.route("/interview", methods=["GET", "POST"])
def interview():

    if "username" not in session:
        flash("Please login first!", "warning")
        return redirect(url_for("auth.login"))

    if "chat_history" not in session:
        flash("Please setup interview first!", "warning")
        return redirect(url_for("interview.setup"))

    # -----------------------------
    # FIRST QUESTION
    # -----------------------------
    if len(session["chat_history"]) == 1:

        ai_question = chat_with_ai(session["chat_history"])

        session["chat_history"].append(
            {
                "role": "assistant",
                "content": ai_question
            }
        )

        session.modified = True

    # -----------------------------
    # USER ANSWERS
    # -----------------------------
    if request.method == "POST":

        answer = request.form["answer"]

        session["chat_history"].append(
            {
                "role": "user",
                "content": answer
            }
        )

        session["question_number"] += 1

        # Interview Finished?
        if session["question_number"] > session["num_questions"]:

            connection = get_db_connection()
            cursor = connection.cursor()

            cursor.execute("""
                INSERT INTO interviews
                (username, category, difficulty, questions, answers, score, date)
                VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
            """, (

                session["username"],
                session["category"],
                session["difficulty"],
                json.dumps(session["chat_history"]),
                json.dumps(session["chat_history"]),
                None

            ))

            connection.commit()
            connection.close()

            session.pop("chat_history", None)
            session.pop("question_number", None)

            return """
            <h1>🎉 Interview Completed!</h1>

            <p>Your interview has been saved.</p>

            <a href="/dashboard">
                Back to Dashboard
            </a>
            """

        ai_question = chat_with_ai(session["chat_history"])

        session["chat_history"].append(
            {
                "role": "assistant",
                "content": ai_question
            }
        )

        session.modified = True

    current_question = session["chat_history"][-1]["content"]

    return render_template(

        "interview.html",

        question=current_question,

        question_number=session["question_number"],

        total_questions=session["num_questions"]

    )