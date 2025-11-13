# config.py

import os
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'default-fallback-secret-key-for-dev'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME') or 'admin'
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD') or 'password'

    # --- THIS IS THE CRITICAL CHANGE ---
    
    # Check if the application is running on Vercel. Vercel sets this variable automatically.
    IS_VERCEL = os.environ.get('VERCEL') == '1'

    if IS_VERCEL:
        # If on Vercel, the DATABASE_URL MUST exist.
        DATABASE_URL = os.environ.get('DATABASE_URL')
        if not DATABASE_URL:
            raise ValueError("DATABASE_URL is not set in Vercel environment variables.")

        # Vercel's Postgres (and some others) provide a "postgres://" URL.
        # SQLAlchemy requires "postgresql://". This line fixes it.
        if DATABASE_URL.startswith("postgres://"):
            DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
        
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        # If NOT on Vercel, we are in local development. Use the local SQLite file.
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'portfolio.db')
    
    # --- END OF CHANGE ---