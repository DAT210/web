from flask import Blueprint, render_template
import requests
import json

# This variable will be imported in 'frontend/__init__.py/create_app(...)'
admin = Blueprint("admin",__name__, url_prefix="/")

@admin.route("/")
def index():
    return render_template("origin/index.html")