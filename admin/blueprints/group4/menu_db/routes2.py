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



## DATABASE GET REQUEST GET FUNCTIONS ##
@menu.route("/get_courses", methods=["GET"])
def get_courses_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return response.content


@menu.route("/get_ingredients", methods=["GET"])
def get_ingredients_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return response.content


@menu.route("/get_allergenes", methods=["GET"])
def get_allergenes_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return response.content


@menu.route("/get_categories", methods=["GET"])
def get_categories_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return response.content


@menu.route("/get_selections", methods=["GET"])
def get_selections_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return response.content


@menu.route("/get_selection_categories", methods=["GET"])
def get_selection_categories_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return response.content
    

# DATABASE GET REQUEST REMOVE FUNCTIONS ##

# COURSES ##
@menu.route("/remove_course", methods=["GET"])
def remove_course_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

@menu.route("/remove_ingredient_from_course", methods=["GET"])
def remove_ingredient_from_course_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

@menu.route("/remove_selection_from_course", methods=["GET"])
def remove_selection_from_course_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

## INGREDIENTS ##
@menu.route("/remove_ingredient", methods=["GET"])
def remove_ingredient_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

@menu.route("/remove_allergene_from_ingredient", methods=["GET"])
def remove_ingredient_allergene_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

## "allergenes"
@menu.route("/remove_allergene", methods=["GET"])
def remove_allergene_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

## CATEGORIES
@menu.route("/remove_category", methods=["GET"])
def remove_category_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

## "selections"
@menu.route("/remove_selection", methods=["GET"])
def remove_selection_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

## "selections"
@menu.route("/remove_selection_category", methods=["GET"])
def remove_selection_category_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

## DATABASE GET REQUEST INSERT FUNCTIONS ##

## COURSES ##
@menu.route("/add_course", methods=["GET"])
def insert_course_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""


@menu.route("/add_ingredient_to_course", methods=["GET"])
def insert_course_ingredient_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""


@menu.route("/add_selection_to_course", methods=["GET"])
def insert_course_selection_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

## INGREDIENT ##
@menu.route("/add_ingredient", methods=["GET"])
def insert_ingredient_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""


@menu.route("/add_allergene_to_ingredient", methods=["GET"])
def insert_ingredient_allergene_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""


## ALLERGENE ##
@menu.route("/add_allergene", methods=["GET"])
def insert_allergene_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

## CATEGORY ##
@menu.route("/add_category", methods=["GET"])
def insert_category_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""


## SELECTION ##
@menu.route("/add_selection", methods=["GET"])
def insert_selection_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

## SELECTION CATEGORY ##
@menu.route("/add_selection_category", methods=["GET"])
def insert_selection_category_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""


## DATABASE GET REQUEST UPDATE FUNCTIONS ##

## EDIT COURSES ##
@menu.route("/edit_course_name", methods=["GET"])
def update_course_name_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

@menu.route("/edit_course_price", methods=["GET"])
def update_course_price_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

@menu.route("/edit_course_category", methods=["GET"])
def update_course_category_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

@menu.route("/edit_course_description", methods=["GET"])
def update_course_description_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

## EDIT INGREDIENTS ##
@menu.route("/edit_ingredient_name", methods=["GET"])
def update_ingredient_name_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""


@menu.route("/edit_ingredient_available", methods=["GET"])
def update_ingredient_availability_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""


## EDIT "allergenes" ##
@menu.route("/edit_allergene_name", methods=["GET"])
def update_allergene_name_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

## EDIT CATEGORIES ##
@menu.route("/edit_category_name", methods=["GET"])
def update_category_name_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

## EDIT "selections" ##
@menu.route("/edit_selection_name", methods=["GET"])
def update_selection_name_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

@menu.route("/edit_selection_selection_category", methods=["GET"])
def update_selection_selection_category_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

@menu.route("/edit_selection_ingredient", methods=["GET"])
def update_selection_ingredient_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""
@menu.route("/edit_selection_price", methods=["GET"])
def update_selection_price_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""

## EDIT SELECTION CATEGORIES ##
@menu.route("/edit_selection_category_name", methods=["GET"])
def update_selection_category_name_db():
    response = requests.get("http://menu_database_api:80"+request.full_path.replace("/menu/","/"), timeout=10)
    return ""