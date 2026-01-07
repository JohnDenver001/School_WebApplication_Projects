from flask import render_template
from . import core_bp

@core_bp.route('/')
def index():
    return render_template('core/index.html')

@core_bp.route('/about')
def about():
    return render_template('core/aboutUs.html')

@core_bp.route('/contact')
def contact():
    return render_template('core/contactUs.html')

