from app import db

class Product(db.Model):
    __tablename__ = 'products'

    pid = db.Column(db.Integer, primary_key = True)
    product_name = db.Column(db.String, nullable = False)
    product_price = db.Column(db.Float, nullable = False)
    product_stock = db.Column(db.Integer, nullable = False)
    product_rating = db.Column(db.Integer)
    product_reviews = db.Column(db.Integer)
    product_description = db.Column(db.String, nullable = False)
    product_category = db.Column(db.String, nullable = False)
    product_image = db.Column(db.String, nullable = False)

    def to_dict(self):
        return {
            'id': self.pid,
            'name': self.product_name,
            'price': float(self.product_price),
            'stock': self.product_stock,
            'rating': self.product_rating,
            'reviews': self.product_reviews,
            'description': self.product_description,
            'category': self.product_category,
            'image': f'/images/Products/{self.product_image}'
        }