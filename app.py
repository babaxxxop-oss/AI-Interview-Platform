from flask import Flask, render_template, request, redirect, url_for
import sqlite3

# Create the Flask application
app = Flask(__name__)

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

#LOGIN PAGE ROUTE
@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        username = request.form["username"]

        password = request.form["password"]

        print("Username:", username)

        print("Password:", password)

    return render_template("login.html")


#REGISTER PAGE ROUTE
 
@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form["username"]

        email = request.form["email"]

        password = request.form["password"]

        confirm_password = request.form["confirm_password"]

        # Check if passwords match
        if password != confirm_password:

            return "Passwords do not match!"

        # Connect to database
        connection = sqlite3.connect("database/users.db")

        cursor = connection.cursor()

        # Insert new user
        cursor.execute(
            """
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?)
            """,
            (username, email, password)
        )

        connection.commit()

        connection.close()

        return redirect(url_for("login"))

    return render_template("register.html")



# --------------------------
# Run the Flask App
# --------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)