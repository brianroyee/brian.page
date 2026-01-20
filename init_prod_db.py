import os
from flask import Flask
from dotenv import load_dotenv
from models import db

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment variable (same as config.py)
DATABASE_URI = os.environ.get('DATABASE_URL')

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

def create_tables():
    with app.app_context():
        print("Connecting to the database...")
        db.create_all()
        print("Success! Database tables created.")
        print("You can now delete this script if no longer needed.")

if __name__ == "__main__":
    if not DATABASE_URI:
        print("\nERROR: DATABASE_URL environment variable is not set.")
        print("Please set it in your .env file or environment.\n")
    else:
        create_tables()