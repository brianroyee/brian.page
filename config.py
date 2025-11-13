# config.py

import os
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'default-fallback-secret-key'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # --- THIS IS THE KEY CHANGE ---
    # Get the production database URL from the environment variables.
    DATABASE_URL = os.environ.get('DATABASE_URL')
    
    # If a DATABASE_URL is provided (which it will be on Vercel),
    # force SQLAlchemy to use it.
    # This is more robust than checking for the VERCEL variable.
    if DATABASE_URL:
        # Important: Some services like Heroku provide "postgres://" which SQLAlchemy
        # no longer supports. This line ensures it's always "postgresql://".
        if DATABASE_URL.startswith("postgres://"):
            DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        # If no DATABASE_URL is set, THEN fall back to the local SQLite database for development.
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'portfolio.db')
        
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME') or 'admin'
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD') or 'password'