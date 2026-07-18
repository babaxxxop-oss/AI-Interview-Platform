from flask import Blueprint, render_template, session, redirect, url_for, flash

main_bp = Blueprint("main", __name__)


# ==================================================
# Home Route
# ==================================================
@main_bp.route("/")
def home():
    return render_template("index.html")


# ==================================================
# Dashboard Route
# ==================================================
@main_bp.route("/dashboard")
def dashboard():

    if "username" not in session:
        flash("Please login first!", "warning")
        return redirect(url_for("login"))

    return render_template(
        "dashboard.html",
        username=session["username"]
    )