from flask import Flask, redirect, url_for, render_template, request, flash
from sqlalchemy import or_
from . import admin_bp
from blueprints.auth.models import User
from blueprints.products.product_model import Product
from blueprints.products.order_model import Order
from app import db

@admin_bp.route('/admin_dashboard')
def admin():
    total_users = 0
    total_products = 0
    total_orders = 0
    users = User.query.all()
    products = Product.query.all()

    for order in Order.query.all():
        total_orders += 1

    for user in users:
        total_users += 1

    for product in products:
        total_products += 1

    return render_template('admin/index.html', total_users = total_users, total_products = total_products, total_orders = total_orders, users = users, recent_products = products)

@admin_bp.route('/add_products', methods = ['GET', 'POST'])
def add_products():
    if request.method == 'POST':
        product_name = request.form.get('product_name')
        product_price = float(request.form.get('product_price'))
        product_stock = int(request.form.get('product_stock'))
        product_category = request.form.get('product_category')
        product_image = str(request.files.get('product_image'))
        product_description = request.form.get('product_description')
        product_rating = int(request.form.get('product_rating'))
        product_reviews = 0

        product = Product(product_name = product_name, product_price = product_price,
                          product_stock = product_stock, product_category = product_category,
                          product_image = product_image, product_description = product_description, product_rating = product_rating, product_reviews = product_reviews)
        
        db.session.add(product)
        db.session.commit()
        
        flash("Added Products Successfully!", 'success')
        return redirect(url_for('admin.admin'))

    return render_template('/admin/add_products.html')

@admin_bp.route('/delete_products/<int:product_id>', methods = ['POST'])
def delete_products(product_id):
    products = Product.query.all()

    for product in products:
        if product_id == product.pid:
            db.session.delete(product)
            db.session.commit()

            flash("Deleted Product Successfully!", 'success')
            return redirect(url_for('admin.manage_products'))



@admin_bp.route('/manage_products', methods = ['GET', 'POST'])
def manage_products():
    search_query = request.args.get('search', '').strip()
    category_filter = request.args.get('category', '').strip()

    query = Product.query

    if search_query:
        query = query.filter(or_(Product.product_name.contains(search_query), Product.product_description.contains(search_query)))

    if category_filter:
        query = query.filter(Product.product_category == category_filter)

    products = query.all()
    return render_template('/admin/manage_products.html', products = products)


@admin_bp.route('/manage_users', methods = ['GET', 'POST'])
def manage_users():
    search_query = request.args.get('search', '').strip()

    if search_query:
        users = User.query.filter(User.username.contains(search_query)).all()
    else:
        users = User.query.all()

    return render_template('/admin/manage_users.html', users = users)

@admin_bp.route('/delete_user/<int:uid>', methods = ['GET', 'POST'])
def delete_user(uid):
    for user in User.query.all():
        if user.uid == uid:
            db.session.delete(user)
            db.session.commit()

            flash("Deleted User Successfully!", 'success')
            return redirect(url_for('admin.manage_users'))
