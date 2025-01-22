#!/usr/bin/python3
"""
index file
"""
from models import storage
from models.course import Course
from models.project import Project
from flask import jsonify, abort, request
from api.v1.views import app_views


@app_views.route("/courses", methods=['GET'],
                 strict_slashes=False)
def list_all_courses():
    """
    Retrieves the list of all Course objects
    """
    courses = storage.all(Course).values()
    courses_list = [course.to_dict() for course in courses]
    return jsonify(courses_list)



@app_views.route("/courses/<course_id>", methods=['GET'],
                 strict_slashes=False)
def retrieve_course(course_id):
    """
    Retrieves a Course object
    """
    course = storage.get(Course, course_id)
    if course is None:
        abort(404)
    projects = storage.all(Project).values()
    project_list = [project.to_dict() for project in projects if project.course_id == course_id]
    if project_list:
        course.__dict__['projects'] = project_list
    return jsonify(course.to_dict())


@app_views.route("/courses/<course_id>", methods=['DELETE'],
                 strict_slashes=False)
def delete_course(course_id):
    """
    Deletes a Course object
    """
    course = storage.get(Course, course_id)
    if not course:
        abort(404)
    course.delete()
    storage.save()
    return jsonify({}), 200


@app_views.route("/courses", methods=['POST'],
                 strict_slashes=False)
def create_course():
    """
    Creates a course
    """
    try:
        req = request.get_json()
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    if type(req) is not dict:
        return abort(400, {'message': 'Not a JSON'})

    """if 'name' not in req:
        return abort(400, {'message': 'Missing name'})"""

    new_course = Course(**req)
    new_course.save()

    return jsonify(new_course.to_dict()), 201


@app_views.route("/courses/<course_id>", methods=['PUT'],
                 strict_slashes=False)
def update_course(course_id):
    """
    Updates a Course object
    """
    course = storage.get(Course, course_id)
    if not course:
        abort(404)
    try:
        req = request.get_json()
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    check = ["id", "__class__", "created_at", "updated_at"]

    for k, v in req.items():
        if k not in check:
            setattr(course, k, v)
    storage.save()
    return jsonify(course.to_dict()), 200
