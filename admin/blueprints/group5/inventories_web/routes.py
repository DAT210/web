from flask import Blueprint, current_app, render_template, request, redirect
import requests, json
inventory = Blueprint('inventory', __name__, url_prefix="/inventories")


@inventory.route("/", methods=['GET'])
def locations():
    token = request.cookies.get('access_token_cookie')
    if token == None:
        return redirect("/inventories/login")
    valid_token = requests.get("https://192.168.99.100:25101/v1/locations/auth", headers={'Authorization' : "Bearer " + token}, timeout=10, verify=False)
    if valid_token.status_code == 200:
        response = requests.get("https://192.168.99.100:25101/v1/locations/", headers={'Authorization' : "Bearer " + token}, timeout=10, verify=False)
        return render_template('/group5/locations.html', locations=response.json()['locations'])
    return redirect("/inventories/login")

@inventory.route("/<int:locId>", methods=['GET'])
def ingredients(locId):
    token = request.cookies.get('access_token_cookie')
    if token == None:
        return redirect("/inventories/login")
    valid_token = requests.get("https://192.168.99.100:25101/v1/locations/auth", headers={'Authorization' : "Bearer " + token}, timeout=10, verify=False)
    if valid_token.status_code == 200:
        response = requests.get("https://192.168.99.100:25101/v1/locations/" + str(locId) + "/ingredients", headers={'Authorization' : "Bearer " + token}, timeout=10, verify=False)
        location = requests.get("https://192.168.99.100:25101/v1/locations/" + str(locId), headers={'Authorization' : "Bearer " + token}, timeout=10, verify=False)
        return render_template('/group5/ingredients.html', ingredients=response.json()['ingredients'], location=location.json())
    return redirect("/inventories/login")
    
@inventory.route('/login', methods=['GET'])
def login():
    return render_template('/group5/login.html')