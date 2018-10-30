'''The standard event views of the application.'''

from flask import (
	Flask, g, jsonify, make_response, request, Blueprint
)

bp = Blueprint('events', __name__, url_prefix='/events')


# Blueprints:
@bp.route('/hello/', methods=['GET', 'POST'])
def events():
    return "Hello, Events!"