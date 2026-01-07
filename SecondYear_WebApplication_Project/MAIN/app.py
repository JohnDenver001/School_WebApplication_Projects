import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__, template_folder = 'templates', static_folder = 'static', static_url_path = '/')
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./main.db'
    app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key')
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)

    from blueprints.products.product_model import Product
    from blueprints.products.order_model import Order
    from blueprints.products.ordered_items_model import Ordered_Item
    from blueprints.auth.models import User

    @login_manager.user_loader
    def load_user(uid):
        return User.query.get(uid)
    
    from blueprints.auth import auth_bp
    from blueprints.core import core_bp
    from blueprints.products import products_bp
    from blueprints.admin_panel import admin_bp

    app.register_blueprint(core_bp)
    app.register_blueprint(auth_bp, url_prefix = '/auth')
    app.register_blueprint(products_bp, url_prefix = '/products')
    app.register_blueprint(admin_bp, url_prefix = '/admin')

    migrate = Migrate(app, db)

    return app