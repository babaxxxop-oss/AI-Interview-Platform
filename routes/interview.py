from flask import Blueprint, render_template, request, redirect, url_for, flash, session
import json

from database.db import get_db_connection
from services.interview_engine import InterviewEngine

interview_bp = Blueprint("interview", __name__)


# ==================================================
# Setup Interview
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

        session["question_number"] = 1

        # Conversation starts empty.
        # InterviewEngine now builds the system prompt.
        session["chat_history"] = []

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

    # ==================================================
    # Create Interview Engine
    # ==================================================

    engine = InterviewEngine(
        category=session["category"],
        difficulty=session["difficulty"],
        total_questions=session["num_questions"],
        current_question=session["question_number"],
        chat_history=session["chat_history"]
    )

    # ==================================================
    # Generate First Question
    # ==================================================

    if len(session["chat_history"]) == 0:

        ai_question = engine.next_question()

        session["chat_history"] = engine.get_chat_history()

        session.modified = True

    # ==================================================
    # Candidate submits answer
    # ==================================================

    if request.method == "POST":

        answer = request.form["answer"].strip()

        engine.add_candidate_answer(answer)

        engine.increment_question()

        session["question_number"] = engine.current_question

        # ==============================================
        # Interview Completed
        # ==============================================

        if engine.interview_finished():

            engine.complete()

            final_report = engine.generate_final_report()

            connection = get_db_connection()
            cursor = connection.cursor()

            cursor.execute(
                """
                INSERT INTO interviews
                (
                    username,
                    category,
                    difficulty,
                    questions,
                    answers,
                    score,
                    date
                )
                VALUES
                (?, ?, ?, ?, ?, ?, datetime('now'))
                """,
                (
                    session["username"],
                    session["category"],
                    session["difficulty"],
                    json.dumps(engine.get_chat_history()),
                    json.dumps(engine.get_chat_history()),
                    final_report,
                ),
            )

            connection.commit()
            connection.close()

            session.pop("chat_history", None)
            session.pop("question_number", None)
            session.pop("category", None)
            session.pop("difficulty", None)
            session.pop("num_questions", None)

            return render_template(
                "interview_complete.html",
                report=final_report
            )

        # ==============================================
        # Generate Next Question
        # ==============================================

        ai_question = engine.next_question()

        session["chat_history"] = engine.get_chat_history()

        session.modified = True

    # ==================================================
    # Current Question
    # ==================================================

    current_question = session["chat_history"][-1]["content"]

    return render_template(
        "interview.html",
        question=current_question,
        question_number=session["question_number"],
        total_questions=session["num_questions"],
    )
