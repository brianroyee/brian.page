from flask import Flask, render_template, jsonify, request
from config import Config
from models import db, CreativeWork, Visitor
from admin import init_admin

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
init_admin(app)

# --- SECRET DATABASE INITIALIZATION ROUTE ---
# This special URL will be used only ONCE to set up the production database.
@app.route('/_internal/setup-database/<secret_key>')
def setup_database_tables(secret_key):
    """
    A secret, one-time-use endpoint to create database tables in production.
    This bypasses the need to run any scripts on a local machine.
    """
    # We protect this route with the app's secret key to prevent unauthorized access.
    if secret_key == app.config['SECRET_KEY']:
        try:
            with app.app_context():
                db.create_all()
            return "SUCCESS: Production database tables were created (or already existed)."
        except Exception as e:
            return f"ERROR: An error occurred: {e}", 500
    else:
        return "ERROR: Invalid secret key.", 403


@app.route('/api/creatives')
def get_creatives():
    works = CreativeWork.query.filter_by(is_published=True).order_by(CreativeWork.date_created.desc()).all()
    return jsonify([{'title': work.title, 'url': work.url} for work in works])

@app.route('/api/track-visit', methods=['POST'])
def track_visit():
    try:
        new_visitor = Visitor(ip_address=request.remote_addr, user_agent=request.headers.get('User-Agent'))
        db.session.add(new_visitor)
        db.session.commit()
        return jsonify({'status': 'success'}), 201
    except Exception as e:
        app.logger.error(f"Error tracking visit: {e}")
        return jsonify({'status': 'error'}), 500

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/creatives')
def creatives():
    return render_template('creative.html')

if __name__ == '__main__':
    app.run(debug=True)