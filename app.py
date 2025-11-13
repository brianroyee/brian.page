# app.py

from flask import Flask, render_template, jsonify
from config import Config
from models import db, CreativeWork, Visitor
from admin import init_admin

# --- 1. FLASK APPLICATION INITIALIZATION ---
app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

# --- 2. ADMIN PANEL INITIALIZATION ---
init_admin(app)

# --- 3. JUST-IN-TIME DATABASE CREATION (THE SOLUTION) ---
# This is a global flag to ensure create_all() is only called once per instance.
_db_initialized = False

@app.before_request
def before_request_func():
    """
    This function runs before every request.
    It ensures that the database tables are created if they don't exist.
    This is crucial for serverless environments like Vercel where the filesystem is ephemeral.
    """
    global _db_initialized
    if not _db_initialized:
        with app.app_context():
            db.create_all()
        _db_initialized = True

# --- 4. PUBLIC API ENDPOINTS ---
@app.route('/api/creatives')
def get_creatives():
    works = CreativeWork.query.filter_by(is_published=True).order_by(CreativeWork.date_created.desc()).all()
    return jsonify([{'title': work.title, 'url': work.url} for work in works])

@app.route('/api/track-visit', methods=['POST'])
def track_visit():
    try:
        from flask import request
        new_visitor = Visitor(ip_address=request.remote_addr, user_agent=request.headers.get('User-Agent'))
        db.session.add(new_visitor)
        db.session.commit()
        return jsonify({'status': 'success'}), 201
    except Exception as e:
        app.logger.error(f"Error tracking visit: {e}")
        return jsonify({'status': 'error'}), 500

# --- 5. FRONTEND PAGE ROUTES ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/creatives')
def creatives():
    return render_template('creative.html')

with app.app_context():
    db.create_all()

# --- 6. MAIN EXECUTION POINT ---
if __name__ == '__main__':
    app.run(debug=True)