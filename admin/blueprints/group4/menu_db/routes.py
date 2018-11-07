from flask import Blueprint, render_template,request
import requests
import json

menu = Blueprint("menu",__name__, url_prefix="/menu")

@menu.route("/")
def index():
    response = requests.get("http://menu_database_api:80/", timeout=10)
    if response.status_code is 200: 
        courses = response.json()["courses"]
        ingredients = response.json()["ingredients"]
        allergenes = response.json()["allergenes"]
        categories = response.json()["categories"]
        selections = response.json()["selections"]
        selection_categories = response.json()["selection_categories"]
        isAdmin = response.json()["admin"]
        return render_template("group4/menu_database/menu_db_index.html", courses=courses, ingredients=ingredients, allergenes=allergenes, categories=categories, selections=selections, selection_categories=selection_categories, admin=isAdmin)   
    else:
        return "ERROR " + str(response.content)


## GET THE DISPLAYS ##
@menu.route("/get_course_display", methods=["GET"])
def get_course_display():
    response = requests.get("http://menu_database_api:80/get_course_display", timeout=10)
    if response.status_code is 200: 
        return render_template("group4/menu_database/course_display.html", courses=response.json()["courses"], categories=response.json()["categories"], admin=response.json()["admin"])
    else:
        return "ERROR " + str(response.content)


@menu.route("/get_ingredient_display", methods=["GET"])
def get_ingredient_display():
    response = requests.get("http://menu_database_api:80/get_ingredient_display", timeout=10)
    if response.status_code is 200: 
        return render_template("group4/menu_database/ingredient_display.html", ingredients=response.json()["ingredients"], admin=response.json()["admin"])
    else:
        return "ERROR " + str(response.content)



@menu.route("/get_allergene_display", methods=["GET"])
def get_allergene_display():
    response = requests.get("http://menu_database_api:80/get_allergene_display", timeout=10)
    if response.status_code is 200: 
        return render_template("group4/menu_database/allergene_display.html", allergenes=response.json()["allergenes"], admin=response.json()["admin"])
    else:
        return "ERROR " + str(response.content)



@menu.route("/get_category_display", methods=["GET"])
def get_category_display():
    response = requests.get("http://menu_database_api:80/get_category_display", timeout=10)
    if response.status_code is 200: 
        return render_template("group4/menu_database/category_display.html", categories=response.json()["categories"], admin=response.json()["admin"])
    else:
        return "ERROR " + str(response.content)



@menu.route("/get_selection_display", methods=["GET"])
def get_selection_display():
    response = requests.get("http://menu_database_api:80/get_selection_display", timeout=10)
    if response.status_code is 200: 
        return render_template("group4/menu_database/selection_display.html", selections=response.json()["selections"], selection_categories=response.json()["selection_categories"], ingredients=response.json()["ingredients"], admin=response.json()["admin"])
    else:
        return "ERROR " + str(response.content)



@menu.route("/get_selection_category_display", methods=["GET"])
def get_selection_category_display():
    response = requests.get("http://menu_database_api:80/get_selection_category_display", timeout=10)
    if response.status_code is 200: 
        return render_template("group4/menu_database/selection_category_display.html", selection_categories=response.json()["selection_categories"], ingredients=response.json()["ingredients"], admin=response.json()["admin"])
    else:
        return "ERROR " + str(response.content)



## DATABASE GET ROUTES ##
@menu.route("/get_ingredients", methods=["GET"])
@menu.route("/get_allergenes", methods=["GET"])
@menu.route("/get_categories", methods=["GET"])
@menu.route("/get_selections", methods=["GET"])
@menu.route("/get_selection_categories", methods=["GET"])
@menu.route("/get_courses", methods=["GET"])
def get_from_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return response.content

## DATABASE MODIFY ROUTES ##
@menu.route("/remove_course", methods=["GET"])
@menu.route("/remove_ingredient_from_course", methods=["GET"])
@menu.route("/remove_selection_from_course", methods=["GET"])
@menu.route("/remove_ingredient", methods=["GET"])
@menu.route("/remove_allergene_from_ingredient", methods=["GET"])
@menu.route("/remove_allergene", methods=["GET"])
@menu.route("/remove_category", methods=["GET"])
@menu.route("/remove_selection", methods=["GET"])
@menu.route("/remove_selection_category", methods=["GET"])
@menu.route("/add_course", methods=["GET"])
@menu.route("/add_ingredient_to_course", methods=["GET"])
@menu.route("/add_selection_to_course", methods=["GET"])
@menu.route("/add_ingredient", methods=["GET"])
@menu.route("/add_allergene_to_ingredient", methods=["GET"])
@menu.route("/add_allergene", methods=["GET"])
@menu.route("/add_category", methods=["GET"])
@menu.route("/add_selection", methods=["GET"])
@menu.route("/add_selection_category", methods=["GET"])
@menu.route("/edit_course_name", methods=["GET"])
@menu.route("/edit_course_price", methods=["GET"])
@menu.route("/edit_course_category", methods=["GET"])
@menu.route("/edit_course_description", methods=["GET"])
@menu.route("/edit_ingredient_name", methods=["GET"])
@menu.route("/edit_ingredient_available", methods=["GET"])
@menu.route("/edit_allergene_name", methods=["GET"])
@menu.route("/edit_category_name", methods=["GET"])
@menu.route("/edit_selection_name", methods=["GET"])
@menu.route("/edit_selection_selection_category", methods=["GET"])
@menu.route("/edit_selection_ingredient", methods=["GET"])
@menu.route("/edit_selection_price", methods=["GET"])
@menu.route("/edit_selection_category_name", methods=["GET"])
def modify_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""