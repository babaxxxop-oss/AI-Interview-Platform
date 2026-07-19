from flask import Blueprint, render_template, session, redirect, url_for, flash
import json
from database.db import get_db_connection


# ==================================================
# History Blueprint
# ==================================================

history_bp = Blueprint("history", __name__)

# ==================================================
# Interview History
# ==================================================

@history_bp.route("/history")
def history():

    if "username" not in session:
        flash("Please login first!", "warning")
        return redirect(url_for("auth.login"))

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT id, category, difficulty, date
        FROM interviews
        WHERE username = ?
        ORDER BY id DESC
    """, (session["username"],))

    interviews = cursor.fetchall()

    connection.close()

    return render_template(
        "history.html",
        interviews=interviews
    )

# ==================================================
# Interview Details
# ==================================================

@history_bp.route("/history/<int:interview_id>")
def interview_details(interview_id):

    if "username" not in session:
        flash("Please login first!", "warning")
        return redirect(url_for("auth.login"))

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT category,
               difficulty,
               questions,
               answers,
               date
        FROM interviews
        WHERE id = ? AND username = ?
    """, (interview_id, session["username"]))

    interview = cursor.fetchone()

    connection.close()

    if interview is None:
        flash("Interview not found!", "danger")
        return redirect(url_for("history.history"))

    questions = json.loads(interview[2])
    answers = json.loads(interview[3])

    return render_template(
        "interview_details.html",
        category=interview[0],
        difficulty=interview[1],
        date=interview[4],
        questions=questions,
        answers=answers
    )