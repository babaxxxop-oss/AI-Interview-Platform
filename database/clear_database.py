import sqlite3

connection = sqlite3.connect("users.db")
cursor = connection.cursor()

cursor.execute("DELETE FROM users")

connection.commit()
connection.close()

print("All users deleted successfully!")