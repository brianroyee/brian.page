# admin.py

from flask import request, redirect, url_for, session, render_template, flash
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from functools import wraps
from models import db, CreativeWork, Visitor

# --- (Security decorators and SecuredModelView remain the same) ---
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_logged_in' not in session:
            return redirect(url_for('admin_routes.admin_login'))
        return f(*args, **kwargs)
    return decorated_function

class SecuredModelView(ModelView):
    def is_accessible(self):
        return 'admin_logged_in' in session
    def _handle_view(self, name, **kwargs):
        if not self.is_accessible():
            return redirect(url_for('admin_routes.admin_login'))

# --- UPDATE MyAdminIndexView ---
class MyAdminIndexView(AdminIndexView):
    @expose('/')
    def index(self):
        if 'admin_logged_in' not in session:
            return redirect(url_for('admin_routes.admin_login'))
        
        # Query for BOTH stats now
        visitor_count = Visitor.query.count()
        creative_work_count = CreativeWork.query.count()
        
        # Pass both variables to our enhanced dashboard template
        return self.render('admin/index.html', 
                            visitor_count=visitor_count, 
                            creative_work_count=creative_work_count)

# --- (init_admin function remains mostly the same) ---
def init_admin(app):
    admin = Admin(app, name='Portfolio Admin', index_view=MyAdminIndexView())
    admin.add_view(SecuredModelView(CreativeWork, db.session))
    admin.add_view(SecuredModelView(Visitor, db.session))

    from flask import Blueprint
    admin_bp = Blueprint('admin_routes', __name__)

    # --- UPDATE the admin_login function ---
    @admin_bp.route('/admin/login', methods=['GET', 'POST'])
    def admin_login():
        if request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')
            if username == app.config['ADMIN_USERNAME'] and password == app.config['ADMIN_PASSWORD']:
                session['admin_logged_in'] = True
                return redirect(url_for('admin.index'))
            else:
                flash('Invalid username or password', 'error')
                return redirect(url_for('admin_routes.admin_login'))
        
        # Instead of a long string, we now render our beautiful HTML file
        return render_template('admin/login.html')

    @admin_bp.route('/admin/logout')
    @login_required
    def admin_logout():
        session.pop('admin_logged_in', None)
        return redirect(url_for('admin_routes.admin_login'))

    app.register_blueprint(admin_bp)