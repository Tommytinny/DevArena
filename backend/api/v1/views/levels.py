#!/usr/bin/python3
"""
index file
"""
from models import storage
from models.level import Level
from flask import jsonify, abort, request
from api.v1.views import app_views


@app_views.route("/levels", methods=['GET'],
                 strict_slashes=False)
def list_all_levels():
    """
    Retrieves the list of all Level objects
    """
    levels = storage.all(Level).values()
    levels_list = [level.to_dict() for level in levels]
    return jsonify(levels_list)



@app_views.route("/levels/<level_id>", methods=['GET'],
                 strict_slashes=False)
def retrieve_level(level_id):
    """
    Retrieves a Level object
    """
    level = storage.get(Level, level_id)
    if level is None:
        abort(404)
    return jsonify(level.to_dict())


@app_views.route("/levels/<level_id>", methods=['DELETE'],
                 strict_slashes=False)
def delete_level(level_id):
    """
    Deletes a Level object
    """
    level = storage.get(Level, level_id)
    if not level:
        abort(404)
    level.delete()
    storage.save()
    return jsonify({}), 200


@app_views.route("/levels", methods=['POST'],
                 strict_slashes=False)
def create_level():
    """
    Creates a level
    """
    try:
        req = request.get_json()
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    if type(req) is not dict:
        return abort(400, {'message': 'Not a JSON'})

    """if 'name' not in req:
        return abort(400, {'message': 'Missing name'})"""

    new_level = Level(**req)
    new_level.save()

    return jsonify(new_level.to_dict()), 201


@app_views.route("/levels/<level_id>", methods=['PUT'],
                 strict_slashes=False)
def update_level(level_id):
    """
    Updates a Level object
    """
    level = storage.get(Level, level_id)
    if not level:
        abort(404)
    try:
        req = request.get_json()
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    check = ["id", "__class__",  "created_at", "updated_at"]

    for k, v in req.items():
        if k not in check:
            setattr(level, k, v)
    storage.save()
    return jsonify(level.to_dict()), 200
