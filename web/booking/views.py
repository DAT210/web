'''The standard booking views of the application.'''

from flask import (
	Flask, g, jsonify, make_response, request, Blueprint
)

bp = Blueprint('booking', __name__, url_prefix='/booking')


# Blueprints:
@bp.route('/hello/', methods=['GET', 'POST'])
def booking():
    return "Hello, Booking!"