from app import db
from blueprints.auth.models import User
from blueprints.products.product_model import Product

class Wishlist(db.Model):
    __tablename__ = 'wishlist'

    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Integer, db.ForeignKey('users.uid'), nullable=False)
    pid = db.Column(db.Integer, db.ForeignKey('products.pid'), nullable=False)
    product = db.relationship('Product', backref='wishlisted_by')