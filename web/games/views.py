'''The standard game views of the application.'''

from flask import (
	Flask, g, jsonify, make_response, request, Blueprint
)

bp = Blueprint('games', __name__, url_prefix='/games')


# Blueprints:
@bp.route('/hello/', methods=['GET', 'POST'])
def games():
    return "Hello, Games!"