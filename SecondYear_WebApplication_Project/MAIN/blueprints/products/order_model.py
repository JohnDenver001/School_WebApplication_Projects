from app import db
from blueprints.auth.models import User

class Order(db.Model):
    __tablename__ = "orders"

    order_id = db.Column(db.Integer, primary_key = True)
    uid = db.Column(db.Integer, db.ForeignKey(User.uid))
    total = db.Column(db.Float, nullable = False)