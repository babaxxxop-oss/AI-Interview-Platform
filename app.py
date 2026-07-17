from flask import Flask, render_template, request, redirect, url_for, flash
import sqlite3

# Create the Flask application
app = Flask(__name__)

# Secret key for flash messages and sessions
app.secret_key = "ai_mock_secret_key"

# --------------------------
# Home Page Route
# --------------------------
@app.route("/")
def home():
    return render_template("index.html")


# --------------------------
# Interview Page Route
# --------------------------
@app.route("/interview")
def interview():
    return render_template("interview.html")


# --------------------------
# LOGIN PAGE ROUTE
# --------------------------
@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        username = request.form["username"]
        password = request.form["password"]

        print("Username:", username)
        print("Password:", password)

    return render_template("login.html")


# --------------------------
# REGISTER PAGE ROUTE
# --------------------------
@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]
        confirm_password = request.form["confirm_password"]

        # --------------------------
        # Check if passwords match
        # --------------------------
        if password != confirm_password:
            flash("Passwords do not match!", "danger")
            return redirect(url_for("register"))

        # --------------------------
        # Connect to Database
        # --------------------------
        connection = sqlite3.connect("database/users.db")
        cursor = connection.cursor()

        # --------------------------
        # Check if Username Exists
        # --------------------------
        cursor.execute(
            "SELECT * FROM users WHERE username = ?",
            (username,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            connection.close()
            flash("Username already exists!", "danger")
            return redirect(url_for("register"))

        # --------------------------
        # Check if Email Exists
        # --------------------------
        cursor.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,)
        )

        existing_email = cursor.fetchone()

        if existing_email:
            connection.close()
            flash("Email already registered!", "danger")
            return redirect(url_for("register"))

        # --------------------------
        # Insert New User
        # --------------------------
        cursor.execute(
            """
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?)
            """,
            (username, email, password)
        )

        connection.commit()
        connection.close()

        flash("Registration Successful! Please login.", "success")
        return redirect(url_for("login"))

    return render_template("register.html")


# --------------------------
# Run the Flask App
# --------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)