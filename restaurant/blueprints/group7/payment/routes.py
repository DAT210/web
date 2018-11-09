from flask import Blueprint
import requests

# This variable will be imported in 'restaurant/create_app.py/create_app(...)'
payment = Blueprint('payment',__name__, url_prefix="/payment")

@payment.route("/")
def index():
    response = requests.get("http://payment_api:81/payment-pages/5?page=payment")
    return response

@payment.route("/test")
def testroute():
    return "This works"
