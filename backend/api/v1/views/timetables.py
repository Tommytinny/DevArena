#!/usr/bin/python3
"""
index file
"""
from models import storage
from models.timetable import Timetable
from flask import jsonify, abort, request
from api.v1.views import app_views


@app_views.route("/timetables", methods=['GET'],
                 strict_slashes=False)
def list_all_timetables():
    """
    Retrieves the list of all Timetables objects
    """
    timetables = storage.all(Timetable).values()
    timetables_list = [timetable.to_dict() for timetable in timetables]
    return jsonify(timetables_list)



@app_views.route("/timetables/<timetable_id>", methods=['GET'],
                 strict_slashes=False)
def retrieve_timetable(timetable_id):
    """
    Retrieves a Timetables object
    """
    timetable = storage.get(Timetable, timetable_id)
    if timetable is None:
        abort(404)
    return jsonify(timetable.to_dict())


@app_views.route("/timetables/<timetable_id>", methods=['DELETE'],
                 strict_slashes=False)
def delete_timetable(timetable_id):
    """
    Deletes a Timetables object
    """
    timetable = storage.get(Timetable, timetable_id)
    if not timetable:
        abort(404)
    timetable.delete()
    storage.save()
    return jsonify({}), 200


@app_views.route("/timetables", methods=['POST'],
                 strict_slashes=False)
def create_timetable():
    """
    Creates a timetable
    """
    try:
        req = request.get_json()
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    if type(req) is not dict:
        return abort(400, {'message': 'Not a JSON'})

    """if 'name' not in req:
        return abort(400, {'message': 'Missing name'})"""

    new_timetable = Timetable(**req)
    new_timetable.save()

    return jsonify(new_timetable.to_dict()), 201


@app_views.route("/timetables/<timetable_id>", methods=['PUT'],
                 strict_slashes=False)
def update_timetable(timetable_id):
    """
    Updates a Timetable object
    """
    timetable = storage.get(Timetable, timetable_id)
    if not timetable:
        abort(404)
    try:
        req = request.get_json()
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    check = ["id", "__class__",  "created_at", "updated_at"]

    for k, v in req.items():
        if k not in check:
            setattr(timetable, k, v)
    storage.save()
    return jsonify(timetable.to_dict()), 200
