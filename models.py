# models.py

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

# Initialize SQLAlchemy. This object will be used to interact with the database.
db = SQLAlchemy()

class CreativeWork(db.Model):
    """
    Database model for a single creative work (e.g., a blog post link, a project).
    Each attribute of this class represents a column in the 'creative_work' table.
    """
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False, comment="The title of the work.")
    url = db.Column(db.String(300), nullable=False, comment="The direct URL to the work.")
    description = db.Column(db.String(200), nullable=True, comment="An optional short description.")
    date_created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), index=True, comment="Timestamp of when the entry was created.")
    is_published = db.Column(db.Boolean, default=True, nullable=False, index=True, comment="Controls visibility on the public site.")

    def __repr__(self):
        """A developer-friendly representation of the object, useful for debugging."""
        return f'<CreativeWork {self.title}>'

class Visitor(db.Model):
    """
    Database model to log each visit to the website.
    This helps in tracking basic analytics.
    """
    id = db.Column(db.Integer, primary_key=True)
    ip_address = db.Column(db.String(45), nullable=True, comment="Visitor's IP address.")
    user_agent = db.Column(db.String(200), nullable=True, comment="Visitor's browser/device information.")
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), index=True, comment="The exact time of the visit.")

    def __repr__(self):
        """A developer-friendly representation of the object."""
        return f'<Visitor from {self.ip_address} on {self.timestamp.strftime("%Y-%m-%d %H:%M")}>'