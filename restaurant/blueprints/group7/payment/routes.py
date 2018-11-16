from flask import Blueprint
import requests

# This variable will be imported in 'restaurant/create_app.py/create_app(...)'
payment = Blueprint('payment',__name__, url_prefix="/payment")

@payment.route("/<int:order_id>")
def index(order_id):
    response = requests.get("https://dat210payment.azurewebsites.net/payment-pages/%d?page=payment" % order_id)
    return response
