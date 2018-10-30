'''The standard menu views of the application.'''

from flask import (
	Flask, g, jsonify, make_response, request, Blueprint
)

bp = Blueprint('menu', __name__, url_prefix='/menu')


# Blueprints:
@bp.route('/hello/', methods=['GET', 'POST'])
def menu():
    return "Hello, Menu!"