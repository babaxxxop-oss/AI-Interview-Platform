import sqlite3


def create_database():

    connection = sqlite3.connect("database/users.db")

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT NOT NULL UNIQUE,

            email TEXT NOT NULL UNIQUE,

            password TEXT NOT NULL

        )
    """)

    connection.commit()

    connection.close()

    print("Database created successfully!")


create_database()