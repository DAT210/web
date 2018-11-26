from flask import Blueprint,render_template
import requests


# This variable will be imported in 'restaurant/create_app.py/create_app(...)'
booking = Blueprint('booking',__name__, url_prefix="/booking")

@booking.route("/")
def index():
    response = requests.get("http://127.0.0.1:4001/", timeout=10,)
    restaurantSelection=response.text
    if response.status_code is 200:
        return render_template("/group1/booking.html",restaurantSelection=restaurantSelection)
    else:
        return "ERROR " + str(response.content)
