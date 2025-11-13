# config.py

import os
from dotenv import load_dotenv

# Find the absolute path of the root directory of the project.
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
# Load the .env file from the root directory.
load_dotenv(os.path.join(BASE_DIR, '.env'))

class Config:
    """
    Base configuration settings for the Flask application.
    This class reads sensitive information from environment variables (loaded from .env)
    and provides sensible default values for development if a variable is not set.
    """
    
    # SECRET_KEY: A secret key is required by Flask for session management and security.
    # It is loaded from the .env file.
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-default-fallback-secret-key-for-dev'
    
    # DATABASE_URI: Defines the location of the database.
    # We use SQLite for simplicity, creating a 'portfolio.db' file in the root directory.
    # This can be overridden by a DATABASE_URL environment variable for production (e.g., PostgreSQL).
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(BASE_DIR, 'portfolio.db')
        
    # SQLALCHEMY_TRACK_MODIFICATIONS: This is set to False to disable a Flask-SQLAlchemy
    # feature that we don't need, which helps save system resources.
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # --- Admin Panel Credentials ---
    # These are securely loaded from your .env file, with fallback values for convenience.
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME') or 'admin'
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD') or 'password'