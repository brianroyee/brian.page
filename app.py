# app.py

# --- Import necessary libraries ---
from flask import Flask, render_template, jsonify
from config import Config
from models import db, CreativeWork, Visitor
from admin import init_admin # <-- IMPORT THE NEW FUNCTION

# --- 1. FLASK APPLICATION INITIALIZATION ---
# Create the main Flask application instance.
app = Flask(__name__)
# Load all configuration settings from the Config object.
app.config.from_object(Config)
# Initialize the database with our Flask app.
db.init_app(app)

# --- 2. ADMIN PANEL INITIALIZATION ---
# Call the function from admin.py to set up the entire admin panel.
# We pass it the app instance so it can register routes and views.
init_admin(app)

# --- 3. PUBLIC API ENDPOINTS ---
# These routes provide data to the frontend JavaScript.
@app.route('/api/creatives')
def get_creatives():
    """API endpoint to fetch all published creative works, ordered by most recent."""
    works = CreativeWork.query.filter_by(is_published=True).order_by(CreativeWork.date_created.desc()).all()
    return jsonify([{'title': work.title, 'url': work.url} for work in works])

@app.route('/api/track-visit', methods=['POST'])
def track_visit():
    """API endpoint to log a new website visitor in the database."""
    try:
        from flask import request
        new_visitor = Visitor(ip_address=request.remote_addr, user_agent=request.headers.get('User-Agent'))
        db.session.add(new_visitor)
        db.session.commit()
        return jsonify({'status': 'success'}), 201
    except Exception as e:
        app.logger.error(f"Error tracking visit: {e}")
        return jsonify({'status': 'error'}), 500

# --- 4. FRONTEND PAGE ROUTES ---
# These routes render and serve the HTML pages to the user's browser.
@app.route('/')
def index():
    """Serves the main portfolio homepage (index.html)."""
    return render_template('index.html')

@app.route('/creatives')
def creatives():
    """Serves the creatives page (creative.html)."""
    return render_template('creative.html')

# --- 5. CUSTOM COMMAND-LINE INTERFACE (CLI) COMMAND ---
@app.cli.command("init-db")
def init_db_command():
    """Creates a custom terminal command `flask init-db` to set up the database."""
    with app.app_context():
        db.create_all()
    print("Database tables created successfully.")

# --- 6. MAIN EXECUTION POINT ---
if __name__ == '__main__':
    # This block allows the app to be run directly with `python app.py` for development.
    app.run(debug=True)