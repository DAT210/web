from flask import Blueprint, render_template
import requests, json

# This variable will be imported in 'restaurant/create_app.py/create_app(...)'
delivery = Blueprint('delivery',__name__, url_prefix="/delivery")

@delivery.route("/<int:order_id>/map")
def index(order_id):
    #  send request to api run as a docker container
    # response = requests.get("https://delivery_api:1337/", timeout=10)
    # do something with response
    # Javascript file sends request to delivery_api and displays info
    # if response.status_code is 200:
        # return render_template("/group2/map.html")
    # else:
    #     return "ERROR: " + str(response._content)

    return render_template("/group2/map.html")
