# SecondYear_WebApplication_Project

A full-stack e-commerce web application for eco-friendly products built with Flask and SQLite.

## Project Description

SecondYear_WebApplication_Project, also known as ReLeaf, is a Flask-based e-commerce platform designed to promote sustainable living through an eco-friendly product marketplace. The application features user authentication, product management, shopping cart functionality, wishlist support, and a comprehensive admin dashboard. This project was developed as a second-year school assignment to demonstrate proficiency in full-stack web development using Python and Flask.

## Features

- User registration and authentication with password hashing
- Secure login and logout functionality
- Product catalog with category filtering and search
- Shopping cart with session-based storage
- Checkout system with order history tracking
- Wishlist functionality for saving favorite products
- User profile page with order history and wishlist
- Admin dashboard with statistics overview
- Product management (add, edit, delete products)
- User management for administrators
- Responsive design with custom CSS styling
- RESTful API endpoints for product data
- Database migrations with Flask-Migrate

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (Vanilla)
- Jinja2 Templating Engine

### Backend

- Python 3.8+
- Flask (Web Framework)
- Flask-Login (User Session Management)
- Flask-Bcrypt (Password Hashing)
- Flask-Migrate (Database Migrations)

### Database

- SQLite
- Flask-SQLAlchemy (ORM)

### Tools and Libraries

- Alembic (Migration Engine)
- Werkzeug (WSGI Utilities)

## Project Structure

```
SecondYear_WebApplication_Project/
├── README.md                         # Project documentation
└── MAIN/
    ├── app.py                        # Flask application factory
    ├── run.py                        # Application entry point
    ├── blueprints/                   # Modular Flask blueprints
    │   ├── __init__.py
    │   ├── auth/                     # Authentication module
    │   │   ├── __init__.py
    │   │   ├── models.py             # User model
    │   │   ├── routes.py             # Auth routes (login, signup, logout)
    │   │   └── templates/auth/       # Auth templates
    │   ├── core/                     # Core pages module
    │   │   ├── __init__.py
    │   │   ├── routes.py             # Core routes (home, about, contact)
    │   │   └── templates/core/       # Core templates
    │   ├── products/                 # Products module
    │   │   ├── __init__.py
    │   │   ├── product_model.py      # Product model
    │   │   ├── order_model.py        # Order model
    │   │   ├── ordered_items_model.py # Ordered items model
    │   │   ├── wishlist_model.py     # Wishlist model
    │   │   ├── routes.py             # Product routes
    │   │   └── templates/products/   # Product templates
    │   └── admin_panel/              # Admin module
    │       ├── __init__.py
    │       ├── routes.py             # Admin routes
    │       └── templates/admin/      # Admin templates
    ├── static/                       # Static assets
    │   ├── js/                       # JavaScript files
    │   │   ├── script.js
    │   │   ├── cart-manager.js
    │   │   └── products-script.js
    │   ├── style/                    # CSS stylesheets
    │   │   ├── style.css
    │   │   └── admin.css
    │   └── images/                   # Image assets
    │       ├── Products/
    │       ├── logo/
    │       ├── Team_Picture/
    │       └── testimonials/
    ├── migrations/                   # Database migration files
    │   ├── alembic.ini
    │   ├── env.py
    │   └── versions/                 # Migration versions
    └── instance/                     # SQLite database location
```

## Installation and Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Git
- A modern web browser (Chrome, Firefox, Edge)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/JohnDenver001/School_WebApplication_Projects.git
   ```

2. Navigate to the project directory:
   ```bash
   cd School_WebApplication_Projects/SecondYear_WebApplication_Project
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

4. Activate the virtual environment:

   Windows (Command Prompt):
   ```bash
   venv\Scripts\activate
   ```

   Windows (PowerShell):
   ```powershell
   venv\Scripts\Activate.ps1
   ```

   macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

5. Install required packages:
   ```bash
   pip install flask flask-sqlalchemy flask-login flask-migrate flask-bcrypt
   ```

6. Navigate to the MAIN folder:
   ```bash
   cd MAIN
   ```

7. Initialize the database:
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

   Note: Skip this step if migrations already exist or if you encounter "Database already exists" errors.

8. Run the application:
   ```bash
   python run.py
   ```

9. Open your browser and navigate to:
   ```
   http://localhost:5555
   ```

## Usage

1. Open the application in your web browser at http://localhost:5555.
2. Browse products on the homepage or navigate to the Products page.
3. Create an account using the Sign Up page.
4. Log in with your credentials.
5. Add products to your cart or wishlist.
6. Proceed to checkout to complete your order.
7. View your order history and wishlist on your profile page.
8. Admin users can access the admin dashboard at http://localhost:5555/admin/admin_dashboard.

### Default Admin Account

- Username: admin
- Password: admin123

## API Documentation

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| GET    | /                     | Home page                            |
| GET    | /about                | About us page                        |
| GET    | /contact              | Contact us page                      |
| GET    | /auth/login           | Login page                           |
| POST   | /auth/login           | Process login                        |
| GET    | /auth/signup          | Signup page                          |
| POST   | /auth/signup          | Process registration                 |
| GET    | /auth/profile         | User profile page                    |
| GET    | /auth/logout          | Logout user                          |
| GET    | /products/products    | Products catalog page                |
| GET    | /products/api/products| Get all products (JSON)              |
| POST   | /products/add-to-cart | Add item to cart                     |
| POST   | /products/update-cart | Update cart item quantity            |
| GET    | /products/get-cart    | Get cart contents (JSON)             |
| POST   | /products/check_out   | Process checkout                     |
| POST   | /products/wishlist/toggle | Toggle wishlist item             |
| GET    | /products/wishlist/check/:pid | Check if item is in wishlist |
| GET    | /admin/admin_dashboard| Admin dashboard                      |
| GET    | /admin/add_products   | Add product page                     |
| POST   | /admin/add_products   | Create new product                   |
| GET    | /admin/manage_products| Manage products page                 |
| POST   | /admin/delete_products/:id | Delete product                  |
| GET    | /admin/manage_users   | Manage users page                    |
| POST   | /admin/delete_user/:uid | Delete user                        |

## Environment Variables

This project uses hardcoded configuration values. For production deployment, consider moving the following to environment variables:

| Variable              | Description                    | Default Value      |
|-----------------------|--------------------------------|--------------------|
| SECRET_KEY            | Flask secret key for sessions  | group-secret-key   |
| SQLALCHEMY_DATABASE_URI | Database connection string   | sqlite:///./main.db|

Example `.env` file for production:
```
SECRET_KEY=your-secure-secret-key
SQLALCHEMY_DATABASE_URI=sqlite:///./main.db
```

## Testing

This project does not include automated tests. Manual testing can be performed by:

1. Creating a new user account
2. Logging in and out
3. Adding products to cart and wishlist
4. Completing a checkout process
5. Verifying order history on profile page
6. Testing admin dashboard functionality

## Known Issues and Limitations

- Secret key is hardcoded and should be moved to environment variables for production
- No email verification for user registration
- No password reset functionality
- Product images are stored as filenames rather than uploaded files
- No payment gateway integration
- Admin authentication relies on username check only
- No pagination for product listings
- No input sanitization for product descriptions

## Roadmap and Future Improvements

- Implement environment variable configuration
- Add email verification for new users
- Implement password reset functionality
- Add file upload for product images
- Integrate payment gateway (Stripe, PayPal)
- Implement role-based access control
- Add pagination for product listings
- Implement product reviews and ratings
- Add order status tracking
- Implement email notifications for orders
- Add unit and integration tests
- Implement CSRF protection

## Contributing

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your commit message"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request

## License

This project is licensed under the MIT License.

## Author and Credits

- Author: [Your Name](https://github.com/JohnDenver001)
- School Project: Second Year Web Application Development (1st Semester, Final Term)

This is a school project developed as part of the web development curriculum. The project demonstrates full-stack development skills using Python, Flask, and modern web technologies.