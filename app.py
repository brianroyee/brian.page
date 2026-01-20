from flask import Flask, render_template, jsonify, request
from config import Config
from models import db, CreativeWork, Visitor
from admin import init_admin

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
init_admin(app)


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
        db.session.rollback()  # Rollback on error to prevent broken sessions
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