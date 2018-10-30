"""Flask Admin Forms"""

# Imports:
from flask_wtf import FlaskForm, csrf
from wtforms import StringField, PasswordField, BooleanField, SubmitField, FileField, TextAreaField, BooleanField
from wtforms.validators import DataRequired, Length, EqualTo, InputRequired
from flask_wtf.file import FileRequired, FileAllowed


# Form classes:
class AdminForm(FlaskForm):
    message = 'Missing input.'
    username = StringField('Username', validators=[DataRequired(message=message)])
    password = PasswordField('Password', validators=[DataRequired(message=message)])
    remember = BooleanField('Remember Password')

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=4, max=12)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6, max=16), EqualTo('confirm', message='Passwords must match')])
    confirm = PasswordField('Repeat Password')   