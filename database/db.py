import sqlite3
from flask import current_app


def get_db_connection():
    """
    Returns a connection to the SQLite database.
    """

    connection = sqlite3.connect(
        current_app.config["DATABASE"]
    )

    connection.row_factory = sqlite3.Row

    return connection