# config.py

import os
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'default-fallback-secret-key'
    
    # --- THIS IS THE KEY CHANGE ---
    # On Vercel, the only writable directory is /tmp.
    # We check if the VERCEL environment variable exists. If it does, we use the /tmp path.
    # Otherwise (for local development), we use the regular portfolio.db file.
    if os.environ.get('VERCEL'):
        SQLALCHEMY_DATABASE_URI = "sqlite:////tmp/portfolio.db"
    else:
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
            'sqlite:///' + os.path.join(BASE_DIR, 'portfolio.db')
    # --- END OF CHANGE ---
        
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME') or 'admin'
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD') or 'password'