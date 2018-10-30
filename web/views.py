'''The standard views of the application.'''

from flask import (
	Flask, g, jsonify, make_response, request, Blueprint
)

bp = Blueprint('index', __name__, url_prefix='/')


# Blueprints:
@bp.route('/hello/', methods=['GET', 'POST'])
def index():
	return "Hello, World!"