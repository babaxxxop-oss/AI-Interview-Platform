from flask import Blueprint, render_template, request, redirect, url_for, flash, session
import json

from database.db import get_db_connection
from data.questions import QUESTIONS
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

        session.pop("question_index", None)
        session.pop("answers", None)

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

    if "category" not in session:
        flash("Please setup your interview first!", "warning")
        return redirect(url_for("interview.setup"))

    if "question_index" not in session:
        session["question_index"] = 0
        session["answers"] = []

    selected_questions = QUESTIONS[
        session["category"]
    ][:session["num_questions"]]

    if request.method == "POST":

        answer = request.form["answer"]

        session["answers"].append(answer)

        session["question_index"] += 1

    if session["question_index"] >= len(selected_questions):

        questions_json = json.dumps(selected_questions)
        answers_json = json.dumps(session["answers"])

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
            questions_json,
            answers_json,
            None
        ))

        connection.commit()
        connection.close()

        total_answers = len(session["answers"])

        session.pop("question_index", None)
        session.pop("answers", None)

        return f"""
        <h1>🎉 Interview Completed!</h1>
        <h2>You answered {total_answers} questions.</h2>
        <p>Your interview has been saved successfully.</p>
        <br>
        <a href="{url_for('main.dashboard')}">Back to Dashboard</a>
        """

    current_index = session["question_index"]

    return render_template(
        "interview.html",
        question=selected_questions[current_index],
        question_number=current_index + 1,
        total_questions=len(selected_questions)
    )