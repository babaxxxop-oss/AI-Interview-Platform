import os

class Config:

    # Secret Key
    SECRET_KEY = os.environ.get(
        "SECRET_KEY",
        "my_super_secret_key_2026"
    )

    # Database
    DATABASE = "database/users.db"

    # Debug Mode
    DEBUG = True