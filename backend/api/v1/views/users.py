#!/usr/bin/python3
"""
Module of Users view
"""
from models import storage
from models.user import User
from flask import jsonify, abort, request
from api.v1.views import app_views
from api.v1.app import auth


@app_views.route("/users", methods=['GET'],
                 strict_slashes=False)
def all_users():
    """
    Retrieves the list of all State objects
    """
    users = storage.all(User).values()
    users_list = [user.to_dict() for user in users]
    return jsonify(users_list)


@app_views.route("/users/<user_id>", methods=['GET'],
                 strict_slashes=False)
def retrieve_user(user_id):
    """
    Retrieves a User object
    """
    if user_id is None:
        abort(404)
    if user_id == "me":
        if request.current_user is None:
            abort(404)
        else:
            return jsonify(request.current_user.to_dict())
    else:
        users = storage.get(User, user_id)
        if users is None:
            abort(404)
        return jsonify(users.to_dict())


@app_views.route("/users/<user_id>", methods=['DELETE'],
                 strict_slashes=False)
def delete_user(user_id):
    """
    Deletes a User object
    """
    user = storage.get(User, user_id)
    if not user:
        abort(404)
    user.delete()
    storage.save()
    return jsonify({}), 200


@app_views.route("/users", methods=['POST', 'OPTIONS'],
                 strict_slashes=False)
def create_user():
    """
    Creates a user
    """
    if request.method == 'OPTIONS':
        return jsonify({'message': 'Preflight OK'}), 200
    
    try:
        req = request.get_json()
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    if type(req) is not dict:
        return abort(400, {'message': 'Not a JSON'})

    dictt = {}
        
    dictt["email"] = request.form.get("email")

    user_exist = storage.search(User, dictt)
    if user_exist:
        return jsonify({"error": "Email address exist already"}), 404

    new_user = User(**req)
    new_user.save()

    return jsonify(new_user.to_dict()), 201


@app_views.route("/users/<user_id>", methods=['PUT'],
                 strict_slashes=False)
def update_user(user_id):
    """
    Updates a User object
    """
    user = storage.get(User, user_id)
    if not user:
        abort(404)
    try:
        req = request.get_json()
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    check = ["id", "__class__", "created_at", "updated_at"]

    for k, v in req.items():
        if k not in check:
            setattr(user, k, v)
    storage.save()
    return jsonify(user.to_dict()), 200
