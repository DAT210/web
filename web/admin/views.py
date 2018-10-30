'''The administration views of the application.'''

from flask import (
	Flask, g, jsonify, make_response, request, Blueprint, render_template
)
from .forms import AdminForm

bp = Blueprint('admin', __name__, url_prefix='/admin')


# Blueprints:
@bp.route('/hello/', methods=['GET', 'POST'])
def admin():
    return "Hello, Admin!"

@bp.route('/', methods=['GET', 'POST'])
def default():
    form = AdminForm()
    if form.validate_on_submit():
        return "Hello!"
    return render_template("admin/admin.html", form=form)