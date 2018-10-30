'''The Flask Application Factory'''

# Imports:
import os
from flask import (
	Flask
)


def create_app(test_config=None):
	"""Create and configure an instance of the Flask application."""
	app = Flask(__name__, instance_relative_config=True)
	app.config.from_mapping(
		# a default secret that should be overridden by instance config
		TIME_STAMP=1540286354,
		SECRET_KEY='dev',
	)

	if test_config is None:
		# load the instance config, if it exists, when not testing
		app.config.from_pyfile('config.py', silent=True)
	else:
		# load the test config if passed in
		app.config.update(test_config)

	# ensure the instance folder exists
	try:
		os.makedirs(app.instance_path)
	except OSError:
		pass

	from web import db
	app.teardown_appcontext(db.tear_down)

	#from web import app as app_cli
	#app.cli.add_command(app_cli.run_local)

	# Register Blueprints
	from web import views
	app.register_blueprint(views.bp)
	from web.admin import views
	app.register_blueprint(views.bp)
	from web.reviews import views
	app.register_blueprint(views.bp)
	from web.booking import views
	app.register_blueprint(views.bp)
	from web.menu import views
	app.register_blueprint(views.bp)
	from web.events import views
	app.register_blueprint(views.bp)
	from web.games import views
	app.register_blueprint(views.bp)

	return app