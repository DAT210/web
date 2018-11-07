from flask import Blueprint

# This variable will be imported in 'restaurant/create_app.py/create_app(...)'
blueprint_name = Blueprint('blueprint_name',__name__, url_prefix="/blueprint_route")

@blueprint_name.route("/")
def index():
    # ...
    # Return something
    return ""

# Add some routes as necessary...
@blueprint_name.route("/some_route")
def some_route():
    # ...
    # Return something
    return ""