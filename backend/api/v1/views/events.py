#!/usr/bin/python3
"""
index file
"""
from models import storage
from models.event import Event
from flask import jsonify, abort, request
from api.v1.views import app_views


@app_views.route("/events", methods=['GET'],
                 strict_slashes=False)
def list_all_events():
    """
    Retrieves the list of all Level objects
    """
    events = storage.all(Event).values()
    events_list = [event.to_dict() for event in events]
    return jsonify(events_list)



@app_views.route("/events/<event_id>", methods=['GET'],
                 strict_slashes=False)
def retrieve_event(event_id):
    """
    Retrieves a Event object
    """
    event = storage.get(Event, event_id)
    if event is None:
        abort(404)
    return jsonify(event.to_dict())


@app_views.route("/events/<event_id>", methods=['DELETE'],
                 strict_slashes=False)
def delete_event(event_id):
    """
    Deletes a Event object
    """
    event = storage.get(Event, event_id)
    if not event:
        abort(404)
    event.delete()
    storage.save()
    return jsonify({}), 200


@app_views.route("/events", methods=['POST'],
                 strict_slashes=False)
def create_event():
    """
    Creates a event
    """
    try:
        req = request.get_json()
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    if type(req) is not dict:
        return abort(400, {'message': 'Not a JSON'})

    """if 'name' not in req:
        return abort(400, {'message': 'Missing name'})"""

    new_event = Event(**req)
    new_event.save()

    return jsonify(new_event.to_dict()), 201


@app_views.route("/events/<event_id>", methods=['PUT'],
                 strict_slashes=False)
def update_event(event_id):
    """
    Updates a Event object
    """
    event = storage.get(Event, event_id)
    if not event:
        abort(404)
    try:
        req = request.get_json()
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    check = ["id", "__class__",  "created_at", "updated_at"]

    for k, v in req.items():
        if k not in check:
            setattr(event, k, v)
    storage.save()
    return jsonify(event.to_dict()), 200
