#!/usr/bin/python3
"""
Module of Projects view
"""
from models import storage
from models.project import Project
from models.course import Course
from models.task  import Task
from models.resource import Resource
from flask import jsonify, abort, request
from api.v1.views import app_views

@app_views.route("/courses/<course_id>/projects", methods=['POST'],
                 strict_slashes=False)
def create_project(course_id):
    """
    Creates a project
    """
    course = storage.get(Course, course_id)
    if course is None:
        abort(404)
    try:
        req = request.get_json()  
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    if type(req) is not dict:
        return abort(400, {'message': 'Not a JSON'})
    
    req['course_id'] = course_id
    """if 'name' not in req:
        return abort(400, {'message': 'Missing name'})"""

    new_project = Project(**req)
    new_project.save()

    return jsonify(new_project.to_dict()), 201

@app_views.route("/projects", methods=['GET'],
                 strict_slashes=False)
def list_all_projects():
    """
    Retrieves the list of all Project objects
    """
    projects = storage.all(Project).values()
    projects_list = [project.to_dict() for project in projects]
    return jsonify(projects_list)


@app_views.route("/courses/<course_id>/projects", methods=['GET'],
                 strict_slashes=False)
def projects_under_course(course_id):
    """
    Retrieves the list of all Project objects under a Course
    """
    courses = storage.get(Course, course_id)
    if courses is None:
        abort(404)
        
    projects = storage.all(Project).values()
    projects_list = [project.to_dict() for project in projects if project.course_id == course_id]
    return jsonify(projects_list)


@app_views.route("/projects/<project_id>", methods=['GET'],
                 strict_slashes=False)
def retrieve_project(project_id):
    """
    Retrieves a Project object
    """
    project = storage.get(Project, project_id)
    if project is None:
        abort(404)
    
    resources = storage.all(Resource).values()
    resource_list = [resource.to_dict() for resource in resources if resource.project_id == project_id]
    if resource_list:
        project.__dict__['resources'] = resource_list
    
    tasks = storage.all(Task).values()
    task_list = [task.to_dict() for task in tasks if task.project_id == project_id]
    if task_list:
        project.__dict__['tasks'] = task_list
    return jsonify(project.to_dict())


@app_views.route("/projects/<project_id>", methods=['DELETE'],
                 strict_slashes=False)
def delete_project(project_id):
    """
    Deletes a Project object
    """
    project = storage.get(Project, project_id)
    if not project:
        abort(404)
    project.delete()
    storage.save()
    return jsonify({}), 200


@app_views.route("/projects/<project_id>", methods=['PUT'],
                 strict_slashes=False)
def update_project(project_id):
    """
    Updates a Project object
    """
    project = storage.get(Project, project_id)
    if not project:
        abort(404)
    try:
        req = request.get_json()
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    check = ["id", "course_id", "created_at", "updated_at"]

    for k, v in req.items():
        if k not in check:
            setattr(project, k, v)
    storage.save()
    return jsonify(project.to_dict()), 200
