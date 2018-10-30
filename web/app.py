from web import create_app
from flask.cli import with_appcontext

import click


app = create_app()

@click.command('local')
def run_local():
    click.echo("Starting Development Server @localhost.")
    config = {
        'DB_CONFIG': {
            'host': 'localhost',
            'port': 3306,
            'user': 'root',
            'pswrd': 'root'
        },
        'DEBUG': True,
    }
    app = create_app(config)
    app.run(host='localhost', port='5000')


if __name__ == '__main__':
	app.run(host='0.0.0.0', port='80')