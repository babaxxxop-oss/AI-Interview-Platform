from flask import Blueprint, render_template, request, redirect, url_for, flash, session
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth", __name__)


# ==========================
# Login
# ==========================
@auth_bp.route("/login", methods=["GET", "POST"])
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

                return redirect(url_for("main.dashboard"))

            else:

                flash("Incorrect Password!", "danger")

        else:

            flash("Username does not exist!", "danger")

    return render_template("login.html")


# ==========================
# Logout
# ==========================
@auth_bp.route("/logout")
def logout():

    session.pop("username", None)

    flash("Logged out successfully!", "danger")

    return redirect(url_for("auth.login"))


# ==========================
# Register
# ==========================
@auth_bp.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]
        confirm_password = request.form["confirm_password"]

        if password != confirm_password:

            flash("Passwords do not match!", "danger")

            return redirect(url_for("auth.register"))

        hashed_password = generate_password_hash(password)

        connection = sqlite3.connect("database/users.db")
        cursor = connection.cursor()

        cursor.execute(
            "SELECT * FROM users WHERE username = ?",
            (username,)
        )

        existing_user = cursor.fetchone()

        if existing_user:

            connection.close()

            flash("Username already exists!", "danger")

            return redirect(url_for("auth.register"))

        cursor.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,)
        )

        existing_email = cursor.fetchone()

        if existing_email:

            connection.close()

            flash("Email already registered!", "danger")

            return redirect(url_for("auth.register"))

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

        return redirect(url_for("auth.login"))

    return render_template("register.html")