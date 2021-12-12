import hashlib
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask.helpers import make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from string import ascii_letters, digits, punctuation
import random
from flask_cors import CORS


app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = 'FFFFFFFFFFFFFFFFFFFF'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    login = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    salt = db.Column(db.String(10))

class Todo(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    description = db.Column(db.String(1000))
    status = db.Column(db.Boolean)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))     


salt_symbols = ascii_letters + digits + punctuation


@app.route('/login', methods=["POST"])
def login():
    login = request.json.get("login")
    password = request.json.get("password")
    cur_user = Users.query.filter_by(login=login).first()
    if cur_user:
        if hashlib.sha512(bytes(password + cur_user.salt, encoding='utf-8')).hexdigest() == cur_user.password:
            session["login"] = login
            session["id"] = cur_user.id
            return jsonify(id=cur_user.id, login=login), 200
        else:                
            return jsonify(error="Incorrect Login or Password"), 403
    else:
        return jsonify(error="Incorrect Login or Password"), 403


@app.route('/register', methods=["POST"])
def register():
    login = request.json.get("login")
    password = request.json.get("password")
    cur_user = Users.query.filter_by(login=login).first()
    if cur_user:
        session["error"] = dict(login=login, password=password, error="User already exists")
        return jsonify(error='User already exists'), 200
    else:
        salt = ''.join(random.choice(salt_symbols) for _ in range(10))
        salt_password = hashlib.sha512(bytes(password + salt, encoding='utf-8')).hexdigest()
        new_user = Users(login=login, password=salt_password, salt=salt)
        db.session.add(new_user)
        db.session.flush()
        db.session.refresh(new_user)
        db.session.commit()
        session["login"] = login
        session["id"] = new_user.id
        return jsonify(id=new_user.id, login=login), 200


@app.route('/logout')
def logout():
    session.clear()
    return  make_response('', 200)


@app.route('/get-all')
def index():
    if "login" in session and session["login"]:
        todo_list = [todo.to_dict() for todo in list(Todo.query.filter_by(user_id=int(session["id"])))]
        if not todo_list: 
            todo_list = []
        return jsonify(todo_list), 200
    else:
        return make_response('', 401)


@app.route('/add_item', methods=["POST"])
def add_item():
    if "login" in session and session["login"]:
        title = request.json.get("title")
        description = request.json.get("description")
        new_todo = Todo(title=title, description=description, status=False, user_id=int(session["id"]))
        db.session.add(new_todo)
        db.session.commit()
        return jsonify(), 201
    else:
        return make_response('', 401)


@app.route('/view_item/<int:todo_id>')
def view(todo_id):
    if "login" in session and session["login"]:
        todo = Todo.query.filter_by(id=todo_id).filter_by(user_id=session['id']).first()
        return jsonify(todo.to_dict()), 200
    else:
        return make_response('', 401)    


@app.route('/update-status', methods=["POST"])
def update_status():
    if "login" in session and session["login"]:
        json = request.json
        item = Todo.query.filter_by(id=json['id']).update(dict(status=json['status']))
        db.session.commit()
        return jsonify(), 200
    else:
        return make_response('', 401) 


@app.route('/delete-task', methods=["POST"])
def delete_task():
    if "login" in session and session["login"]:
        json = request.json
        item = Todo.query.filter_by(id=json['id']).first()
        db.session.delete(item)
        db.session.commit()
        return jsonify(), 200
    else:
        return make_response('', 401) 


@app.route('/user', methods=["GET"])
def user():
    return jsonify(login=session.get("login", None), id=session.get("id", None)), 200


if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)