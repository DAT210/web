from flask import Blueprint,render_template,request
import requests


# This variable will be imported in 'restaurant/create_app.py/create_app(...)'
booking = Blueprint('booking',__name__, url_prefix="/booking")

@booking.route("/")
def index():
    response = requests.get("http://booking:4001/", timeout=10,)
    restaurantSelection=response.text
    if response.status_code is 200:
        return render_template("/group1/booking.html",restaurantSelection=restaurantSelection)
    else:
        return "ERROR " + str(response.content)

@booking.route("/summary/<bid>",methods=["POST"])
def summary(bid):
    url="http://booking:4001/editpage/bookingsummary/"+bid
    response = requests.post(url, timeout=10,data={'theName': request.form["theName"], 'thePhone': request.form["thePhone"], 'theEmail': request.form["theEmail"], 'theRestaurant': request.form["theRestaurant"],'thePeople': request.form["thePeople"],'theDate': request.form["theDate"],'theTime': request.form["theTime"]})
    bookingSummary=response.text
    if response.status_code is 200:
        return render_template("/group1/bookingSummary.html",bookingSummary=bookingSummary)
    else:
        return "ERROR " + str(response.content)


@booking.route("/updatebooking/<bid>",methods=["POST"])
def updateBooking(bid):
    response = requests.post("http://booking:4001/editpage/updatebooking/"+bid, timeout=10,data={'theName': request.form["theName"], 'thePhone': request.form["thePhone"], 'theEmail': request.form["theEmail"], 'theRestaurant': request.form["theRestaurant"],'thePeople': request.form["thePeople"],'theDate': request.form["theDate"],'theTime': request.form["theTime"]})
    updateBooking=response.text
    if response.status_code is 200:
        return render_template("/group1/updateBooking.html",updateBooking=updateBooking)
    else:
        return "ERROR " + str(response.content)

@booking.route("/removebooking/<bid>",methods=["POST"])
def removeBooking(bid):
    response = requests.post("http://booking:4001/editpage/removebooking/"+bid,timeout=10)
    removeBooking=response.text
    if response.status_code is 200:
        return render_template("/group1/removebooking.html",removeBooking=removeBooking)
    else:
        return "ERROR " + str(response.content)
