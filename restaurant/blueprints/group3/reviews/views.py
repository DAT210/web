'''The standard views of the review part of the application.'''

from flask import (
	Flask, g, jsonify, make_response, request, Blueprint, render_template,
	session, url_for, redirect, flash, current_app
)
import requests
import json
from random import randint
from ..reviews.forms import ReviewForm
from ..reviews.customer import get_cid, get_headers

bp = Blueprint('reviews', __name__, url_prefix='/reviews')

@bp.route("/testhistbtn/", methods=['GET'])
def test_hist_btn():
	return render_template("group3/reviews/testhistbtn.html")


@bp.route("/historybutton/", methods=['GET'])
def history_button():
	correct_cid = get_cid()
	return redirect(url_for("reviews.show_history", customer_id = correct_cid)) 

@bp.route("/history/<string:customer_id>/", methods=['GET'])
def show_history(customer_id):
	try:
		response_orders = requests.api.get(f"http://python-api:80/orders/api/customerorders/{customer_id}", timeout=30.0)
	except:
		flash("The server couldn't reach the API.", category='info')
		return redirect(url_for('reviews.hello')), 500 # TODO: fix redirect
	if response_orders.status_code is 200:
		try:
			previous_orders = response_orders.json()
		except json.decoder.JSONDecodeError as err:
			return str(err.msg) # TODO: Fix return.
		try:
			for order in previous_orders:
				response_meals = requests.api.get(f"http://python-api:80/orders/api/courses/{int(order['OrderID'])}", timeout=30.0)
				if response_meals.status_code is 200:
					try: 
						meals = response_meals.json()
						current_app.logger.info(meals)
						for meal in meals: #TODO fikse nye orderID
							id = meal.get('CourseID')
							current_app.logger.info(id)
							name = meal.get('CourseName')
							current_app.logger.info(name)
							data = {'data': [{'id': id, 'name': name}]}
							meals_add = requests.api.post("http://review_api:80/api/1.0/reviews/", json=data)
					except json.decoder.JSONDecodeError as err:
						return str(err.msg) # TODO: Fix return.
					current_app.logger.info(meals)
					order.update({'meals': meals})
				current_app.logger.info(order)
		except:
			return "wrong" 
		current_app.logger.info(previous_orders)
		return render_template("group3/reviews/history.html", previous_orders=previous_orders)
	return "Faulty"
	

@bp.route('/hello/', methods=['GET', 'POST'])
def hello():
	return "500 ERROR"


@bp.route("/<string:meal_id>/", methods=['POST', 'GET'])
def show_form(meal_id):
	form = ReviewForm()
	if request.method == 'POST':
		if form.validate_on_submit:
			review_values = request.form.to_dict()
			try:
				ratingInt = int(review_values.pop('rating', 'None'))
			except ValueError:
				flash('The rating must be set.', category='warning')
				return redirect(url_for('reviews.show_form', meal_id=meal_id))
			comment_len = len(form.comments.data)
			if 4 > comment_len or comment_len > 255:
				flash("The comment must be between 4 and 255 characters.", category='warning')
				return redirect(url_for('reviews.show_form', meal_id=meal_id))
			payload = {
				'data': {
					'id': meal_id,
					'rating': ratingInt,
					'comment': review_values.pop('comments')
				}
			}
			try:
				api_response = requests.api.patch("http://review_api:80/api/1.0/reviews/", json=payload, timeout=30.0)
			except:
				flash("The server couldn't reach the API.", category='info')
				return redirect(url_for('reviews.show_form', meal_id=meal_id))
			try:
				status = api_response.json().get('status')
			except json.decoder.JSONDecodeError as err:
				return str(err.msg) # TODO: Fix return.
			if status == 'success':
				flash('The review has successfully been added!', category='success')
				return redirect(url_for("reviews.show_history", customer_id="100"))
		flash("The form couldn't be validated.", category='warning')	
		return redirect(url_for('reviews.show_form', meal_id=meal_id))
	try:
		response = requests.api.get(f"http://review_api:80/api/1.0/reviews/{meal_id}/", timeout=30.0)
	except:
		flash("The server couldn't reach the API.", category='info')
		return redirect(url_for('reviews.hello')), 500
	if response.status_code is 200:
		review = response.json()['data']['review']	
		current_app.logger.info(review)
		return render_template("group3/reviews/set_review.html", form=form, review=review)
	else:
		return redirect(url_for('reviews.show_form', meal_id=meal_id))


@bp.route("/list/", methods=['GET'])
def list_all():
	try:
		response = requests.api.get(f"http://review_api:80/api/1.0/reviews/", timeout=30.0)
	except:
		flash("The server couldn't reach the API.", category='info')
		return redirect(url_for('reviews.hello')), 500 #TODO:fix redirect
	if response.status_code is 200:
		try: 
			all_reviews = response.json()['data']['reviews']
		except json.decoder.JSONDecodeError as err:
			return str(err.msg) # TODO: Fix return.
		current_app.logger.info(all_reviews)
		return render_template('group3/reviews/list_reviews.html', all_reviews=all_reviews)
	else:
		return "wrong"


@bp.route("/list/<string:meal_id>/", methods=['GET'])
def show_review(meal_id):
	try:
		response = requests.api.get(f"http://review_api:80/api/1.0/reviews/{meal_id}/", timeout=30.0)
	except:
		flash("The server couldn't reach the API.", category='info')
		return redirect(url_for('reviews.hello')), 500 #TODO:fix redirect
	if response.status_code is 200:
		try: 
			the_review = response.json()['data']['review']
		except json.decoder.JSONDecodeError as err:
			return str(err.msg) # TODO: Fix return.
		current_app.logger.info(the_review)
		return render_template('group3/reviews/show_review.html', the_review=the_review)
	else:
		return "wrong"

