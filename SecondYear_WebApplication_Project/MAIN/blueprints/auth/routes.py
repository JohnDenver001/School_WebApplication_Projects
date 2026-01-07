from flask import render_template, redirect, url_for, request, flash
from flask_login import login_user, logout_user, current_user
from . import auth_bp
from app import db, bcrypt
from .models import User


@auth_bp.route('/signup', methods = ['GET', 'POST'])
def signup():
    if request.method == 'GET':
        return render_template('auth/signup.html')
    
    elif request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        users = User.query.all()

        for user in users:
            if user.username == username:
                flash("User Already Exists!", 'error')
                return redirect(url_for('auth.signup'))
            
        if password != confirm_password:
            flash("Wrong password confirmation!", 'error')
            return redirect(url_for('auth.signup'))

        hashed_password = bcrypt.generate_password_hash(password)

        user = User(username = username, password = hashed_password)

        db.session.add(user)
        db.session.commit()

        flash("Account created successfully!", 'success')
        return redirect(url_for('auth.login'))
        

@auth_bp.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('auth/login.html')
    
    elif request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username = username).first()
        
        if not user:
            flash("User doesn't exists!", 'error')
            return redirect(url_for('auth.login'))

        if bcrypt.check_password_hash(user.password, password):
            if user.username == 'admin':
                login_user(user)
                flash("Login Successfully!", 'success')
                return redirect(url_for('admin.admin'))

            login_user(user)
            flash("Login Successfully!", 'success')
            return redirect(url_for('core.index'))
        
        else:
            flash("Login Failed!", 'error')
            return redirect(url_for('auth.login'))

@auth_bp.route('/profile')
def profile():
    from blueprints.products.order_model import Order
    from blueprints.products.ordered_items_model import Ordered_Item
    from blueprints.products.wishlist_model import Wishlist
    

    user_orders = (db.session.query(Ordered_Item).join(Order).filter(Order.uid == current_user.uid).all())
    my_wishlist = Wishlist.query.filter_by(uid = current_user.uid).all()

    return render_template('auth/profile.html', user_orders = user_orders, wishlist_items = my_wishlist)

@auth_bp.route('/logout')
def logout():
    if current_user.is_authenticated:
        logout_user()
        flash("Logout Successfully!", 'success')
        return redirect(url_for('core.index'))
    else:
        flash("Needs to be LOG IN FIRST", 'error')
        return redirect(url_for('core.index'))

