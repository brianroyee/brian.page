from flask import Flask
from models import db

# --- PASTE YOUR NEW ONRENDER CONNECTION STRING HERE ---
DATABASE_URI = "postgresql://brian_page_db_user:52HSp0xLPGHMRz9RzPvnpg3WJ61rCkDk@dpg-d4b1t3q4d50c73cvkk5g-a.oregon-postgres.render.com/brian_page_db"

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

def create_tables():
    with app.app_context():
        print("Connecting to the OnRender database...")
        db.create_all()
        print("Success! Database tables created in OnRender.")
        print("You can now delete this script.")

if __name__ == "__main__":
    if "PASTE_YOUR_ONRENDER" in DATABASE_URI:
        print("\nERROR: Please open this script and paste your OnRender connection string.\n")
    else:
        create_tables()