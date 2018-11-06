from flask import Flask
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    """ 
    Add your blueprints here:
    
    Syntax:
        from blueprints.<group_number>.<blueprint_folder>.routes import <blueprint_variable_name>
        app.register_blueprint(<blueprint_variable_name>)

    """

    # Index page etc.
    from restaurant.routes import restaurant
    app.register_blueprint(restaurant)

    # Group 4: Menu etc.'
    from blueprints.group4.menu.routes import menu
    app.register_blueprint(menu)

    return app