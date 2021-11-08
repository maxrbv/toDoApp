import hashlib
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from string import ascii_letters, digits, punctuation
import random


app = Flask(__name__)
app.secret_key = 'FFFFFFFFFFFFFFFFFFFF'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    login = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    salt = db.Column(db.String(10))

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    description = db.Column(db.String(1000))
    status = db.Column(db.Boolean)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))


salt_symbols = ascii_letters + digits + punctuation


@app.route('/login', methods=["POST", "GET"])
def login():
    if "login" in session and session["login"]:
        return redirect(url_for("index"))
    else:
        if request.method == "GET":
            if "error" in session and session["error"]:
                return render_template('login.html', login=session["error"]["login"], password=session["error"]["password"], error=session["error"]["error"])
            else:
                return render_template('login.html')
        else:
            login = request.form.get("login")
            password = request.form.get("password")
            cur_user = Users.query.filter_by(login=login).first()
            if cur_user:
                if hashlib.sha512(bytes(password + cur_user.salt, encoding='utf-8')).hexdigest() == cur_user.password:
                    session["login"] = login
                    session["id"] = cur_user.id
                    session.pop("error", None)
                    return redirect(url_for("index"))
                else:                
                    session["error"] = dict(login=login, password=password, error="Incorrect Login or Password")
                    return redirect(url_for("login"))
            else:
                session["error"] = dict(login=login, password=password, error="Incorrect Login or Password")
                return redirect(url_for("login"))


@app.route('/register', methods=["POST"])
def register():
    if "login" in session and session["login"]:
        return redirect(url_for("index"))
    else:
        login = request.form.get("login")
        password = request.form.get("password")
        cur_user = Users.query.filter_by(login=login).first()
        if cur_user:
            session["error"] = dict(login=login, password=password, error="User already exists")
            return redirect(url_for("login"))
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
            session.pop("error", None)
            return redirect(url_for("index"))


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route('/')
def index():
    if "login" in session and session["login"]:
        todo_list = Todo.query.filter_by(user_id=int(session["id"]))
        user_info = Users.query.filter_by(id=int(session["id"]))
        return render_template('base.html', todo_list=todo_list, user_info=user_info)
    else:
        return redirect(url_for("login"))


@app.route('/add')
def add():
    if "login" in session and session["login"]:
        return render_template('add_item.html')
    else:
        return redirect(url_for('login'))


@app.route('/add_item', methods=["POST"])
def add_item():
    if "login" in session and session["login"]:
        title = request.form.get("title")
        description = request.form.get("description")
        new_todo = Todo(title=title, description=description, status=False, user_id=int(session["id"]))
        db.session.add(new_todo)
        db.session.commit()
        return redirect(url_for("index"))
    else:
        return redirect(url_for('login'))


@app.route('/view/<int:todo_id>')
def view(todo_id):
    if "login" in session and session["login"]:
        cur_user = Todo.query.filter_by(id=todo_id).first().user_id
        if session['id'] == cur_user:
            todo = Todo.query.filter_by(id=todo_id).first()
            return render_template('item.html', todo=todo)
        else:
            return redirect(url_for('index'))
    else:
        return redirect(url_for('login'))    


@app.route('/update-status', methods=["POST"])
def update_status():
    if "login" in session and session["login"]:
        json = request.json
        item = Todo.query.filter_by(id=json['id']).update(dict(status=json['status']))
        db.session.commit()
        return jsonify(), 200
    else:
        return redirect(url_for('login')) 


@app.route('/delete-task', methods=["POST"])
def delete_task():
    if "login" in session and session["login"]:
        json = request.json
        item = Todo.query.filter_by(id=json['id']).first()
        db.session.delete(item)
        db.session.commit()
        return jsonify(), 200
    else:
        return redirect(url_for('login')) 


if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)