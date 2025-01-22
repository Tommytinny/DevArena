#!/usr/bin/python3
"""
Module of Tasks view
"""
from models import storage
from models.user import User
from models.project import Project
from models.task  import Task
from models.test_case import TestCase
from models.test_result import TestResult
from api.v1.auth.session_auth import SessionAuth
from flask import jsonify, abort, request
from api.v1.views import app_views
from werkzeug.utils import secure_filename
import os
import subprocess

@app_views.route("/projects/<project_id>/tasks", methods=['POST'],
                 strict_slashes=False)
def create_task(project_id):
    """
    Creates a task
    """
    project = storage.get(Project, project_id)
    if project is None:
        abort(404)
    try:
        req = request.get_json()  
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    if type(req) is not dict:
        return abort(400, {'message': 'Not a JSON'})
    
    req['project_id'] = project_id
    """if 'name' not in req:
        return abort(400, {'message': 'Missing name'})"""

    new_task = Task(**req)
    new_task.save()

    return jsonify(new_task.to_dict()), 201


@app_views.route("/projects/<project_id>/tasks", methods=['GET'],
                 strict_slashes=False)
def tasks_under_project(project_id):
    """
    Retrieves the list of all Task objects under a Project
    """
    projects = storage.get(Project, project_id)
    if projects is None:
        abort(404)
        
    tasks = storage.all(Task).values()
    task_list = [task.to_dict() for task in tasks if task.project_id == project_id]
    return jsonify(task_list)


@app_views.route("/projects/<project_id>/tasks/<task_id>", methods=['GET'],
                 strict_slashes=False)
def retrieve_task(project_id, task_id):
    """
    Retrieves a Task object
    """
    project = storage.get(Project, project_id)
    if project is None:
        abort(404, {"message": "Project doesn't exist"})
        
    task = storage.get(Task, task_id)
    if task is None:
        abort(404, {"message": "Task doesn't exist"})
    
    
    return jsonify(task.to_dict())


@app_views.route("/projects/<project_id>/tasks/<task_id>", methods=['DELETE'],
                 strict_slashes=False)
def delete_task(task_id):
    """
    Deletes a Task object
    """
    task = storage.get(Task, task_id)
    if not task:
        abort(404)
    task.delete()
    storage.save()
    return jsonify({}), 200


@app_views.route("/projects/<project_id>/tasks/<task_id>", methods=['PUT'],
                 strict_slashes=False)
def update_task(task_id):
    """
    Updates a task object
    """
    task = storage.get(Task, task_id)
    if not task:
        abort(404)
    try:
        req = request.get_json()
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    check = ["id", "__class__", "project_id", "created_at", "updated_at"]

    for k, v in req.items():
        if k not in check:
            setattr(task, k, v)
    storage.save()
    return jsonify(task.to_dict()), 200



@app_views.route("/projects/<project_id>/tasks/<task_id>/checkers", methods=['POST'],
                 strict_slashes=False)
def code_checker(task_id):
    """
    Task code checker
    """
    task = storage.get(Task, task_id)
    if task is None:
        abort(404)

    try:
        req = request.get_json()  
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    if type(req) is not dict:
        return abort(400, {'message': 'Not a JSON'})
    
    user = SessionAuth.current_user(req)
    if user is None:
        abort(404)
    
    test_cases = storage.all(TestCase).values
    test_case_list = [test_case.to_dict() for test_case in test_cases if test_case.task_id == task_id]
    
    if 'file' not in req.files:
        return abort(400, {'message': 'No file uploaded'})
    
    file = req.files['files']
    
    if file.filename == '':
        return abort(400, {'message': 'No file selected'})
    if '.' not in file.filename and file.filename.rsplit('.', 1)[1].lower() not in {'py'}:
        return abort(400, {'message': 'Invalid file type'})
    
    filename = secure_filename(file.filename)
    file_path = os.path.join('./upload', filename)
    file.save(file_path)
    
    
        
    results = []
    
    for test_case in test_case_list:
        try:
            with open(file_path, 'a') as f:
                f.write("\n" + test_case.code)
            
            result = subprocess.run(["python3", file_path], capture_output=True, text=True)
            if result.returncode == 0:
                results.append({
                    "user_id": user.id,
                    "task_id": task_id,
                    "test_case_id": test_case.id,
                    "passed": True
                })
            else:
                if 'AssertionError' in result.stderr:
                    lines = result.stderr.split('\n')
                    for line in lines:
                        if line.startswith("AssertionError"):
                            error_msg = line.split(': ')[1]
                            
                results.append({
                    "user_id": user.id,
                    "task_id": task_id,
                    "test_case_id": test_case.id,
                    "passed": False,
                    "error_message": error_msg
                })
        except Exception as e:
            results.append({
                "user_id": user.id,
                "task_id": task_id,
                "test_case_id": test_case.id,
                "passed": False,
                "error_message": str(e)
            })
    
    for result in results:
        new_test_result = TestResult(**result)
    
    new_test_result.save()
    
    test_results = storage.all(TestResult).values()
    test_result_list = [test_result.to_dict() for test_result in test_results if test_result.user_id == user.id and test_result.task_id == task_id]
    
    os.remove(file_path)
    
    return jsonify(test_result_list.to_dict()), 201
