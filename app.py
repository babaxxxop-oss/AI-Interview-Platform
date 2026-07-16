from flask import Flask, render_template

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
@app.route("/login")
def login():
    return render_template("login.html")


# --------------------------
# Run the Flask App
# --------------------------
if __name__ == "__main__":
    app.run(debug=True)