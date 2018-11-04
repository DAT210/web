# Central Flask Server Using Blueprints

## Introduction
-------------------------
As discussed with the other groups, the plan is to use a central (simplistic) Flask server for the customer-facing page where the groups can work with as little conflict as possible. As such, this page uses the Flask feature Blueprints to allow people to create Flask routes in individual files, with a specified `url_prefix` (e.g. /menu) which defines the URL that the route can be reached by. 

The website should have a common/consistent theme, so it should use some common CSS and header/footer portions for each page. Each group is responsible for their respective parts of the domain (e.g. /menu or /order) and should implement the blueprints for this section of the website and find a way to generate the body of the respective HTML pages.

The plan is to use Docker to run all the servers etc. for each group, and have some Docker containers communicate with each other using User Defined Networks in Docker. Alternatively a group could run their server another way as long as their API is reachable by means of GET/POST requests.

## Suggestion for how cross-group communication could work
-------------------------
There is a bit of uncertainty about how the communication between the services of each group should communicate among each other. Our suggestion is the following:

Each group creates an API which can be reached at a certain domain:port. This could either be a standalone server or done simply by using Docker and communicating between Docker containers. All API Docker containers should connect to the same User Defined Docker Network as this central server so that they can communicate with each other.

The API should use a format which is easy to use (e.g. JSON) and the groups using/implementing the API should agree on which structure to use.

The server defined on this page should be the only customer-facing server there is, or the customer should be redirected to another page (e.g. payment) if it is necessary.

You can communicate with your own services (e.g. Flask servers run in Docker containers) from this server, and get the information you need through an API you have defined.

If anything is unclear or you disagree with something/have a better idea, please speak up.

## How to use this server
-------------------------
* Navigate to the folder containing the `docker-compose.yml` file in a terminal. 
* Run the following command: `docker-compose up --build`
* Open your browser.
* Go to the URL: `http://localhost`
    * Note: We use port 80 by default. You can change this in the `docker-compose.yml` file.


## Structure
-------------------------
```bash
├─restaurant    
│ ├───blueprints
│ │   ├───group1
│ │   :   └───yourAPI
│ │   :  
│ │   └───groupN
│ │       └───yourAPI
│ ├───restaurant
│ │   ├─__init__.py
│ │   └─routes.py
│ ├───static
│ │   ├───group1
│ │   :   ├───css
│ │   :   ├───fonts
│ │   :   ├───images
│ │   :   ├───js
│ │   :   └───vendor
│ │   :
│ │   ├───groupN
│ │   │   ├───css
│ │   │   ├───fonts
│ │   │   ├───images
│ │   │   ├───js
│ │   │   └───vendor
│ │   └───origin
│ │       ├───css
│ │       ├───fonts
│ │       ├───images
│ │       ├───js
│ │       └───vendor
│ ├───templates
│ │   ├─footer.html
│ │   ├─header.html
│ │   ├─layout.html
│ │   ├───group1
│ │   :
│ │   ├───groupN
│ │   └───origin
│ ├───config.py
│ ├───create_app.py
│ ├───docker-compose.yml
│ ├───Dockerfile
│ ├───README.md
│ ├───requirements.txt
│_├───run.py

```
### Folder contents
`/restaurant/blueprints/restaurant`  
Default pages such as the index page for the whole website.

`/restaurant/blueprints/groupN`  
**NOTE:** *N matches your group number. Create your blueprints here. Include an `__init__.py` file (can be empty) to allow it to be imported as a module in another folder.*

`/restaurant/static/origin`  
Default CSS, JS, etc. files.

`/restaurant/static/groupN`  
**NOTE:** *N matches your group number. Put your custom CSS, JS, etc. files here.*

`/restaurant/templates/footer.html`  
`/restaurant/templates/header.html`  
`/restaurant/templates/layout.html`  
**NOTE:** *These files should be used as templates for most pages to ensure consistency across the whole website.*

`/restaurant/templates/origin`  
Default template pages, e.g. the landing page. 

`/restaurant/templates/groupN`  
*Create your own HTML templates here.*  
**NOTE:** There is a base template in each group's folder called `yourPage.html`.


`/restaurant/create_app.py`  
Contains the `create_app()` method which will create the server.  
**NOTE:** *You will have to import and register your blueprints within this file.*

`/restaurant/config.py`  
Can be used for configuration parameters (things that would normally be put in `app.py` as `app.config[...] = ...`), simply `key=value` pairs. This will be useful if we decide later on to use a shared database. 

## How to use Blueprints
-------------------------
Reference: http://flask.pocoo.org/docs/1.0/blueprints/  
Tutorial using blueprints: https://www.youtube.com/watch?v=Wfx4YBzg16s

Blueprints is a Flask feature which is very similar to `@app.route(...)` which you may be used to. Blueprints basically allow you to create blueprints/modules of routes that will be registered/tied to an application. Then when the app gets a request to that route, it will look in the corresponding blueprint and execute the code there.

### Creating a blueprint
Create a subfolder of groupN with the name of your blueprint. E.g. `web/blueprints/groupN/<blueprint_name>`. Make a separate folder for each blueprint you wish to create.

Inside of this folder, create two files: `__init__.py` and `routes.py`.

**NOTE:** We have included a template blueprint for each group in `blueprints/groupN/yourAPI/routes.py` (the folder yourAPI should be renamed to your API name).
#### Modify `<blueprint_name>/routes.py`:
```py
from flask import Blueprint

blueprint_name = Blueprint('blueprint_name',__name__, url_prefix="/blueprint_route")

@blueprint_name.route("/")
def index():
    # ...
    # Return something
    return ""

# Add some routes as necessary...
@blueprint_name.route("/some_route")
def some_route():
    # ...
    # Return something
    return ""
```
For simplicity we use `blueprint_name` for the name of the folder, the variable and the blueprint's `name` input parameter. The blueprint name should be representative of the purpose of the blueprint (e.g. menu). In the example above, a blueprint called `blueprint_name` was created.  

We used the `url_prefix` parameter to indicate the prefix of the routes defined by this blueprint. By doing this, the routes belonging to the blueprint will be reached by: <a>some.domain:port/blueprint_route/...</a>.

### Registering the blueprint on the app
After the blueprint has been created, it has to be registered to (tied to) the Flask application so that it can access the routes of the blueprint.

#### Modify `/restaurant/create_app.py`:
```py
# ...

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    # ...

    """ 
    Add your blueprints here:
    
    Syntax:
        from frontend.<group_number>.<blueprint_folder>.routes import <blueprint_variable_name>
        app.register_blueprint(<blueprint_variable_name>)

    Example beneath:
    """

    # Group 4: Menu etc.
    from frontend.group4.menu.routes import menu
    app.register_blueprint(menu)

    # ...

    return app
```
As shown above, you simply import the blueprint and register it to the app by using `app.register_blueprint(...)`. Now the routes of the blueprint are accessible on the server.
### Accessing the blueprint using `url_for` in Jinja templates
In Jinja templating, you may use the following syntax to request some data from certain routes in the application within an HTML file:
```jinja
{{ url_for("route") }}
```
However when the route is defined in a  blueprint you have to prepend the blueprint name to the route to be able to access it. For example:
```jinja
{{ url_for("blueprint_name.route") }}
```



## Importing Python modules
-------------------------
If you need to import non-default Python modules in your code, you have to define them in `requirements.txt`. You have to add a new line with the name of the module that you would need if you were to install it with pip. E.g.:
* Want to use `mysql.connector` module in Python. This module could be installed locally using `pip install mysql-connector-python`.
* Open `requirements.txt`.
* Add the following line to allow this module to be used in the Docker container:
    * `mysql-connector-python`
* The module will be installed the next time you run the server.


## How to use Docker networks/your API as a Docker container
-------------------------
Our Docker containers on the same machine (eventually on Azure) can communicate with each other as long as they are part of the same User Defined Network. The frontend server is configured to run on a User Defined Docker Network called `frontend`, as defined in its `docker-compose.yml` file. 

In order to allow it to communicate with your docker container, the container should join the `frontend` network. 
* When you run a docker container you can do this by using the `--network` parameter, like this:  
 `docker run --network=frontend ...`
* If you want to use Docker compose instead, you have to join the frontend network on the docker container which contains the API and specify the `frontend` network in the `networks:` parameter in the same way as done in the `docker-compose.yml` specifying this server. Note: You have to use version 3.5 or later in `docker-compose.yml` to do this. I.e.:
```yml
version: '3.7' #Version 3.5 or above.
services: 
  your_api_service:
    # ...

    networks: 
      - frontend
      # ...

networks: 
  # ...
  frontend:
  # The following line ensures the full name of the network will be 'frontend'
    name: frontend
```

## Example of GET request to another Docker container
-------------------------
```py
from flask import Blueprint, render_template
import requests
import json

menu = Blueprint("menu",__name__, url_prefix="/menu")

@menu.route("/")
def index():
    # Making a GET request to our API (menu_api is the name of a Docker container)
    response = requests.get("http://menu_api:80/get_ingredients", timeout=10)
    if response.status_code is 200: 
        # Do something with response.content
        return # ...
    else:
        return "ERROR " + str(response.status_code)
```
From the code snippet above:
* We make a GET request to `http://menu_api:80/get_ingredients`.
    * `menu_api` is the name of the Docker container running the API for the menu. `menu_api` will also be an alias for its IP-address within User Defined Docker Networks (i.e. within the `frontend` network).
    * The Docker container running the API for the menu is set to run on port 80 locally (so it can be reached on this port within the `frontend` network).
    * `/get_ingredients` is a route within the API which returns some data in the JSON format.
    * If it works correctly `response.content` will contain a JSON structure. We can treat this in several ways. One way is to convert the JSON to a Python structure and handle the data, by using `some_variable = json.loads(response.content)` and then handling the data from `some_variable`.

## Adding app.config parameters
-------------------------
If you need to add parameters to `app.config` you should do this in the file `config.py`. Within this file you can add `KEY = VALUE` parameters that will be automatically used in `app.config` in the following way: `app.config[KEY] = VALUE`.
