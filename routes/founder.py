from flask import Blueprint, render_template, request, redirect, url_for, flash

founder_bp = Blueprint("founder", __name__)

SECRET_CODE = "ADMINLOVEADITI"


@founder_bp.route("/founder")
def secret_login():
    return render_template("founder_login.html")


@founder_bp.route("/founder/check", methods=["POST"])
def check_secret():
    code = request.form.get("code", "").strip()

    if code == SECRET_CODE:
        return redirect(url_for("founder.founder_page"))

    flash("Incorrect secret code.", "danger")
    return redirect(url_for("founder.secret_login"))


@founder_bp.route("/founder/profile")
def founder_page():
    return render_template("founder.html")