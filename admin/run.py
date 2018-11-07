from create_app import create_app
# cross origin resource sharing
from flask_cors import CORS

app = create_app()
CORS(app)

app.run(host="0.0.0.0", port=80)
