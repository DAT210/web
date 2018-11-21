from flask import Flask
from config import config

def create_app(config_class='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_class])

    """ 
    Add your blueprints here:
    
    Syntax:
        from blueprints.<group_number>.<blueprint_folder>.routes import <blueprint_variable_name>
        app.register_blueprint(<blueprint_variable_name>)

    """

    # Index page etc.
    from restaurant.routes import restaurant
    app.register_blueprint(restaurant)

    #Group 3:
    from blueprints.group3.reviews import views
    app.register_blueprint(views.bp)

    # Group 4: Menu etc.'
    from blueprints.group4.menu.routes import menu
    app.register_blueprint(menu)

    return app