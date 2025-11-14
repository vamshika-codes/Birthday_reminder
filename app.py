from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from config import Config
import os

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)

# ==============================
# Database Model
# ==============================
class Friend(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    birthday = db.Column(db.String(20), nullable=False)
    note = db.Column(db.String(250))

    def __repr__(self):
        return f"<Friend {self.name}>"

# Create tables if not exist
with app.app_context():
    db.create_all()


# ==============================
# Routes
# ==============================
@app.route("/")
def index():
    friends = Friend.query.all()

    # Sort by upcoming birthday
    def sort_key(friend):
        today = datetime.now().date()
        b = datetime.strptime(friend.birthday, "%Y-%m-%d").date()
        b_this_year = b.replace(year=today.year)
        if b_this_year < today:
            b_this_year = b_this_year.replace(year=today.year + 1)
        return b_this_year

    friends_sorted = sorted(friends, key=sort_key)

    return render_template("index.html", friends=friends_sorted)


@app.route("/add", methods=["GET", "POST"])
def add():
    if request.method == "POST":
        name = request.form["name"].strip()
        birthday = request.form["birthday"]
        note = request.form["note"]

        if not name or not birthday:
            flash("Name and Birthday are required!")
            return redirect(url_for("add"))

        new_friend = Friend(name=name, birthday=birthday, note=note)
        db.session.add(new_friend)
        db.session.commit()
        flash("Friend added successfully!")
        return redirect(url_for("index"))

    return render_template("add.html")


@app.route("/edit/<int:id>", methods=["GET", "POST"])
def edit(id):
    friend = Friend.query.get_or_404(id)

    if request.method == "POST":
        friend.name = request.form["name"]
        friend.birthday = request.form["birthday"]
        friend.note = request.form["note"]

        db.session.commit()
        flash("Updated successfully!")
        return redirect(url_for("index"))

    return render_template("edit.html", friend=friend)


@app.route("/delete/<int:id>")
def delete(id):
    friend = Friend.query.get_or_404(id)
    db.session.delete(friend)
    db.session.commit()
    flash("Deleted successfully!")
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(debug=True)
