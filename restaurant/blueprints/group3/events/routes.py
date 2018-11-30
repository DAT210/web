from flask import Blueprint, render_template
import requests
import json

menu = Blueprint("menu",__name__, url_prefix="/events")

@menu.route("/")
def index():
    response = requests.get("http://events:4500/", timeout=10)
    patoMenu = response.json()["patoMenu"]
    alternateMenu= response.json()["alternateMenu"]

    if response.status_code is 200: 
        return render_template("/group3/events.html",patoMenu=patoMenu,alternateMenu=alternateMenu)
    else:
        return "ERROR " + str(response.content)
