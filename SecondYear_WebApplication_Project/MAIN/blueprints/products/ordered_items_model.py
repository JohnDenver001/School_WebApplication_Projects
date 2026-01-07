from app import db
from blueprints.products.product_model import Product
from blueprints.products.order_model import Order

class Ordered_Item(db.Model):
    __tablename__ = "orderedItems"

    item_id = db.Column(db.Integer, primary_key = True)
    order_id = db.Column(db.Integer, db.ForeignKey(Order.order_id))
    pid = db.Column(db.Integer, db.ForeignKey(Product.pid))
    quantity = db.Column(db.Integer, nullable = False)
    product_price = db.Column(db.Integer, nullable = False)
    line_total = db.Column(db.Integer, nullable = False)