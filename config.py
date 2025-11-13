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
    # Get the production database URL from the environment variables.
    DATABASE_URL = os.environ.get('DATABASE_URL')

    # Check if the application is running on Vercel.
    IS_VERCEL = os.environ.get('VERCEL') == '1'

    if IS_VERCEL:
        # If on Vercel, the DATABASE_URL MUST exist.
        if not DATABASE_URL:
            raise ValueError("CRITICAL ERROR: DATABASE_URL is not set in Vercel environment variables.")
        
        # Use the provided DATABASE_URL.
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        # If not on Vercel (local development), use the local SQLite file.
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'portfolio.db')