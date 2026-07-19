from flask import Flask
from routes.main import main_bp
from routes.auth import auth_bp
from routes.interview import interview_bp
from routes.history import history_bp
import sqlite3
import json



app = Flask(__name__)
app.config.from_object("config.Config")



# ==================================================
# Register Blueprints
# ==================================================

app.register_blueprint(main_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(interview_bp)
app.register_blueprint(history_bp)



print("\n===== REGISTERED ROUTES =====")
print(app.url_map)
print("=============================\n")


# ==================================================
# Run App
# ==================================================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)