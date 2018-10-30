'''The standard views of the review part of the application.'''

from flask import (
	Flask, g, jsonify, make_response, request, Blueprint
)

bp = Blueprint('reviews', __name__, url_prefix='/reviews')


# Blueprints:
@bp.route('/hello/', methods=['GET', 'POST'])
def reviews():
	return "Hello, Reviews!"