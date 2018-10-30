from mysql import connector
from flask import (
    g, current_app
)

def get():
    if not hasattr(g, '_database'):
        db_config = current_app.config['DB_CONFIG']
        g._database = connector.connect(
            host=db_config['host'],
            port=db_config['port'],
            user=db_config['user'],
            password=db_config['pswrd']
        )
    return g._database

def tear_down(error):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()