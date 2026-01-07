from flask import render_template, jsonify, request, flash, redirect, url_for, session
from flask_login import current_user
from . import products_bp
from .product_model import Product
from .order_model import Order
from .ordered_items_model import Ordered_Item
from .wishlist_model import Wishlist
from app import db

#product model
@products_bp.route('/products')
def products():
    products = Product.query.all()

    product_data = []
    for product in products:
        product_data.append(product.to_dict())
    
    return render_template('products/products.html', products = products, product_data = product_data)

@products_bp.route('/api/products')
def api_products():
    products = Product.query.all()

    product_list = []
    for product in products:
        product_list.append(product.to_dict())
    
    return jsonify(product_list)


@products_bp.route('/add-to-cart', methods = ['POST'])
def add_to_cart():
    if not current_user.is_authenticated:
        flash("Please Login First!", "error")
        return jsonify({'success': False}), 401

    data = request.get_json()

    if not data:
        flash("No Data Provided", 'error')
        return jsonify({'success': False}), 400

    pid = str(data.get('pid'))
    quantity = int(data.get('quantity', 1))

    if 'cart' not in session:
        session['cart'] = {}

    cart = session['cart']
    if pid in cart:
        cart[pid] += quantity
    else:
        cart[pid] = quantity

    session.modified = True
    return jsonify({'success': True, 'message': 'Item added to cart'})

@products_bp.route('/update-cart', methods = ['POST'])
def update_cart():
    data = request.get_json()
    pid = str(data.get('pid'))
    action = data.get('action')

    if 'cart' not in session:
        return jsonify({'success': False})
    
    cart = session['cart']

    if pid in cart:
        if action == 'increase':
            cart[pid] += 1
        elif action == 'decrease':
            cart[pid] -= 1

            if cart[pid] <= 0:
                del cart[pid]
        elif action == 'remove':
            del cart[pid]
        
        session.modified = True

    return jsonify({'success': True})

@products_bp.route('/get-cart')
def get_cart():
    if 'cart' not in session:
        return jsonify({'items': [], 'total': 0})
    
    cart = session['cart']
    items = []
    total = 0

    for pid, quantity in cart.items():
        product = Product.query.get(int(pid))
        if product:
            item_total = product.product_price * quantity
            total += item_total
            items.append({
                'id': product.pid,
                'name': product.product_name,
                'price': product.product_price,
                'image': f'/images/Products/{product.product_image}',
                'quantity': quantity
            })

    return jsonify({'items': items, 'total': total})

@products_bp.route('/check_out', methods = ['POST'])
def check_out():
    if not current_user.is_authenticated:
        flash("Please Login First", 'error')
        return jsonify({'success': False}), 401
    
    cart = session.get('cart', {})

    if not cart:
        flash("Cart is empty", 'error')
        return jsonify({'success': False}), 400
    
    total_amount = 0
    valid_items = []

    for pid, quantity in cart.items():
        product = Product.query.get(int(pid))

        if product:
            line_total = product.product_price * quantity
            total_amount = total_amount + line_total

            valid_items.append({
                'pid': product.pid,
                'quantity': quantity,
                'price': product.product_price,
                'line_total': line_total
            })
    
    user_order = Order(uid = current_user.uid, total = total_amount)
    db.session.add(user_order)
    db.session.commit()

    for item in valid_items:
        ordered_item = Ordered_Item(order_id = user_order.order_id, pid = item['pid'], quantity = item['quantity'], product_price = item['price'], line_total = item['line_total'])
        db.session.add(ordered_item)

    db.session.commit()

    flash("Check Out Successfully!", 'success')
    session.pop('cart', None)
    return jsonify({'success': True})


#wishlist model
@products_bp.route('/wishlist/toggle', methods = ['POST'])
def toggle_wishlist():
    if not current_user.is_authenticated:
        flash("Please Login First!", 'error')
        return jsonify({'success': False}), 401
    
    data = request.get_json()
    pid = data.get('pid')
    
    item = Wishlist.query.filter_by(uid = current_user.uid, pid = pid).first()
    
    try:
        if item:
            db.session.delete(item)
            action = 'removed'
            message = 'Removed from wishlist'
        else:
            new_item = Wishlist(uid = current_user.uid, pid = pid)
            db.session.add(new_item)
            action = 'added'
            message = 'Added to wishlist'

        db.session.commit()
        return jsonify({'success': True, 'action': action, 'message': message})
    
    except Exception as e:
        db.session.rollback()
        flash("Error updating wishlist", 'error')
        return jsonify({'success'})

@products_bp.route('/wishlist/check/<int:pid>')
def check_wishlist(pid):
    if not current_user.is_authenticated:
        return jsonify({'in_wishlist': False})
    
    item = Wishlist.query.filter_by(uid = current_user.uid, pid = pid).first()
    return jsonify({'in_wishlist': bool(item)})
