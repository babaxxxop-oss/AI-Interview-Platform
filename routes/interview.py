from flask import Blueprint, render_template, request, redirect, url_for, flash, session
import sqlite3
import json

interview_bp = Blueprint("interview", __name__)

# ==================================================
# Interview Questions
# ==================================================

QUESTIONS = {

    "HR": [
        "Tell me about yourself.",
        "Why do you want to work at our company?",
        "What are your strengths?",
        "What is your biggest weakness?",
        "Describe a difficult situation you handled.",
        "Where do you see yourself in 5 years?",
        "Why should we hire you?",
        "Tell me about a team project you worked on.",
        "How do you handle pressure?",
        "Do you have any questions for us?"
    ],

    "Python": [
        "What is Python?",
        "What is a list in Python?",
        "What is a dictionary?",
        "Difference between list and tuple?",
        "What are functions?",
        "What is a module?",
        "What is pip?",
        "Explain OOP in Python.",
        "What are decorators?",
        "What are lambda functions?"
    ],

    "Java": [
        "What is Java?",
        "Explain JVM.",
        "Explain JDK and JRE.",
        "What is inheritance?",
        "What is polymorphism?",
        "What is encapsulation?",
        "What is abstraction?",
        "Difference between == and equals()?",
        "What are interfaces?",
        "Explain exception handling."
    ],

    "DSA": [
        "What is an array?",
        "What is a linked list?",
        "Explain stack.",
        "Explain queue.",
        "What is recursion?",
        "What is binary search?",
        "What is a tree?",
        "What is a graph?",
        "What is a hash table?",
        "Explain time complexity."
    ],

    "DBMS": [
        "What is DBMS?",
        "What is SQL?",
        "Difference between DELETE and TRUNCATE?",
        "What is a primary key?",
        "What is a foreign key?",
        "What is normalization?",
        "Explain joins.",
        "What is indexing?",
        "What is ACID?",
        "Difference between SQL and NoSQL?"
    ],

    "AI/ML": [
        "What is Artificial Intelligence?",
        "What is Machine Learning?",
        "Difference between AI and ML?",
        "What is Deep Learning?",
        "What is supervised learning?",
        "What is unsupervised learning?",
        "What is overfitting?",
        "What is underfitting?",
        "Explain neural networks.",
        "What is TensorFlow?"
    ]
}

# ==================================================
# Interview Setup
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

    # --------------------------
    # Start Interview
    # --------------------------

    if "question_index" not in session:
        session["question_index"] = 0
        session["answers"] = []

    selected_questions = QUESTIONS[
        session["category"]
    ][:session["num_questions"]]

    # --------------------------
    # Save Answer
    # --------------------------

    if request.method == "POST":

        answer = request.form["answer"]

        session["answers"].append(answer)

        session["question_index"] += 1

    # --------------------------
    # Interview Finished
    # --------------------------

    if session["question_index"] >= len(selected_questions):

        total_answers = len(session["answers"])

        questions_json = json.dumps(selected_questions)
        answers_json = json.dumps(session["answers"])

        connection = sqlite3.connect("database/users.db")
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

        session.pop("question_index", None)
        session.pop("answers", None)

        return f"""
        <h1>🎉 Interview Completed!</h1>
        <h2>You answered {total_answers} questions.</h2>
        <p>Your interview has been saved successfully.</p>
        <br>
        <a href="{url_for('main.dashboard')}">Back to Dashboard</a>
        """

    # --------------------------
    # Current Question
    # --------------------------

    current_index = session["question_index"]

    current_question = selected_questions[current_index]

    return render_template(
        "interview.html",
        question=current_question,
        question_number=current_index + 1,
        total_questions=len(selected_questions)
    )