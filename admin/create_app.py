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
    from admin.routes import admin
    app.register_blueprint(admin)

    # Group 4: Menu etc.'
    from blueprints.group4.menu_db.routes import menu
    app.register_blueprint(menu)

    return app