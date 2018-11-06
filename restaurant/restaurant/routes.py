from flask import Blueprint, render_template
import requests
import json

# This variable will be imported in 'frontend/__init__.py/create_app(...)'
restaurant = Blueprint("restaurant",__name__, url_prefix="/")

@restaurant.route("/")
def index():
    return render_template("origin/index.html")
@restaurant.route("/about")
def about():
    return render_template("origin/about.html")
@restaurant.route("/blog")
def blog():
    return render_template("origin/blog.html")
@restaurant.route("/blog-detail")
def blog_detail():
    return render_template("origin/blog-detail.html")
@restaurant.route("/contact")
def contact():
    return render_template("origin/contact.html")
@restaurant.route("/gallery")
def gallery():
    return render_template("origin/gallery.html")
