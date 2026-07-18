import sqlite3

connection = sqlite3.connect("database/users.db")

cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS interviews (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT NOT NULL,

    category TEXT NOT NULL,

    difficulty TEXT NOT NULL,

    questions TEXT NOT NULL,

    answers TEXT NOT NULL,

    score INTEGER,

    date TEXT NOT NULL

)
""")

connection.commit()

connection.close()

print("Interview table created successfully!")