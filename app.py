from flask import Flask, render_template, request, redirect, url_for, flash, session
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

# ==================================================
# Create Flask App
# ==================================================

app = Flask(__name__)
app.secret_key = "my_super_secret_key_2026"


# ==================================================
# Interview Questions
# ==================================================

QUESTIONS = [
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
]


# ==================================================
# Home Route
# ==================================================

@app.route("/")
def home():
    return render_template("index.html")


# ==================================================
# Dashboard Route
# ==================================================

@app.route("/dashboard")
def dashboard():

    if "username" not in session:
        flash("Please login first!", "warning")
        return redirect(url_for("login"))

    return render_template(
        "dashboard.html",
        username=session["username"]
    )
###################################
#SET UP ROUTE
###################################
@app.route("/setup", methods=["GET", "POST"])
def setup():

    if "username" not in session:
        flash("Please login first!", "warning")
        return redirect(url_for("login"))

    if request.method == "POST":

        session["category"] = request.form["category"]
        session["difficulty"] = request.form["difficulty"]
        session["num_questions"] = int(request.form["num_questions"])

        return redirect(url_for("interview"))

    return render_template("setup.html")

# ==================================================
# Interview Route
# ==================================================

@app.route("/interview", methods=["GET", "POST"])
def interview():

    if "username" not in session:
        flash("Please login first!", "warning")
        return redirect(url_for("login"))

    # --------------------------
    # Start Interview
    # --------------------------
    if "question_index" not in session:
        session["question_index"] = 0
        session["answers"] = []

    # --------------------------
    # Next Question
    # --------------------------
    if request.method == "POST":

        answer = request.form["answer"]

        session["answers"].append(answer)

        session["question_index"] += 1

    # --------------------------
    # Interview Finished
    # --------------------------
    if session["question_index"] >= len(QUESTIONS):

        total_answers = len(session["answers"])

        # Clear interview session
        session.pop("question_index", None)
        session.pop("answers", None)

        return f"""
        <h1>🎉 Interview Completed!</h1>
        <h2>You answered {total_answers} questions.</h2>
        <br>
        <a href='/dashboard'>Back to Dashboard</a>
        """

    # --------------------------
    # Current Question
    # --------------------------
    current_index = session["question_index"]

    current_question = QUESTIONS[current_index]
    print("Category:", session["category"])
    print("Difficulty:", session["difficulty"])
    print("Questions:", session["num_questions"])
    return render_template(
        "interview.html",
        question=current_question,
        question_number=current_index + 1,
        total_questions=len(QUESTIONS)
    )


# ==================================================
# Login Route
# ==================================================

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        username = request.form["username"]
        password = request.form["password"]

        connection = sqlite3.connect("database/users.db")
        cursor = connection.cursor()

        cursor.execute(
            "SELECT * FROM users WHERE username = ?",
            (username,)
        )

        user = cursor.fetchone()

        connection.close()

        if user:

            if check_password_hash(user[3], password):

                session["username"] = user[1]

                flash("Login Successful!", "success")

                return redirect(url_for("dashboard"))

            else:

                flash("Incorrect Password!", "danger")

        else:

            flash("Username does not exist!", "danger")

    return render_template("login.html")


# ==================================================
# Logout Route
# ==================================================

@app.route("/logout")
def logout():

    session.pop("username", None)

    flash("Logged out successfully!", "danger")

    return redirect(url_for("login"))


# ==================================================
# Register Route
# ==================================================

@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]
        confirm_password = request.form["confirm_password"]

        if password != confirm_password:
            flash("Passwords do not match!", "danger")
            return redirect(url_for("register"))

        hashed_password = generate_password_hash(password)

        connection = sqlite3.connect("database/users.db")
        cursor = connection.cursor()

        # Check Username
        cursor.execute(
            "SELECT * FROM users WHERE username = ?",
            (username,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            connection.close()
            flash("Username already exists!", "danger")
            return redirect(url_for("register"))

        # Check Email
        cursor.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,)
        )

        existing_email = cursor.fetchone()

        if existing_email:
            connection.close()
            flash("Email already registered!", "danger")
            return redirect(url_for("register"))

        # Insert User
        cursor.execute(
            """
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?)
            """,
            (username, email, hashed_password)
        )

        connection.commit()
        connection.close()

        flash("Registration Successful! Please login.", "success")

        return redirect(url_for("login"))

    return render_template("register.html")


# ==================================================
# Run App
# ==================================================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)