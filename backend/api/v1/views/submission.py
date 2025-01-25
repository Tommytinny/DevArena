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
from models.submission import Submission
from flask import jsonify, abort, request
from api.v1.views import app_views
from api.v1.app import app
from werkzeug.utils import secure_filename
import os
import subprocess
from api.v1.app import cache


app.config['UPLOAD_FOLDER'] = './uploads'
app.config['TEST_FOLDER'] = './tests'
app.config['ALLOWED_EXTENSIONS'] = {'py', 'c', 'cpp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app_views.route("/submissions", methods=['POST'],
                 strict_slashes=False)
def create_submission():
    """
    Creates a submission
    """
    from api.v1.app import auth
    user = auth.current_user(request)
    if user is None:
        abort(404)
    
    file = request.files['file']
    language = request.form['language']
    if file:
        if file.filename == '':
            abort(400, {'message': 'No file selected'})
        
        extension = file.filename.rsplit('.', 1)[1].lower()
        if '.' not in file.filename and extension not in {'py', 'c', 'cpp'}:
            abort(400, {'message': 'Invalid file type'})
        
        if language == 'Python' and extension != 'py':
            abort(400, {'message': 'Not a Python file type'})
        
        if language == 'C' and extension != 'c':
            abort(400, {'message': 'Not a C file type'})
        
        if language == 'C++' and extension != 'cpp':
            abort(400, {'message': 'Not a C++ file type'})
        
        if allowed_file(file.filename):
            filename = secure_filename(file.filename)
            if not os.path.exists(app.config['UPLOAD_FOLDER']):
                os.makedirs(app.config['UPLOAD_FOLDER'])
            file_name = user.id + '_' + filename
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], file_name)
            if os.path.exists(filepath):
                return abort(400, {'message': 'File already exist'})
            
            file.save(filepath)
            request_data = request.form.to_dict()
            request_data['file_url'] = filepath
            request_data['student_id'] = user.id
    
    new_submission = Submission(**request_data)
    new_submission.save()

    return jsonify(new_submission.to_dict()), 201


@app_views.route("/projects/<project_id>/submissions", methods=['GET'],
                 strict_slashes=False)
def all_submission(project_id):
    """
    Retrieves the list of all Submission objects
    """
    
    from api.v1.app import auth
    user = auth.current_user(request)
    if user is None:
        abort(404)
    
    projects = storage.get(Project, project_id)
    if projects is None:
        abort(404)
        
    submissions = storage.all(Submission).values()
    submission_list = [submission.to_dict() for submission in submissions if submission.project_id == project_id and submission.student_id == user.id]
    
    
    return jsonify(submission_list)


@app_views.route("/projects/<project_id>/tasks/<task_id>/submissions", methods=['GET'],
                 strict_slashes=False)
def retrieve_submission(project_id, task_id):
    """
    Retrieves a Submission object
    """
    
    from api.v1.app import auth
    user = auth.current_user(request)
    if user is None:
        abort(404)
    
    
    project = storage.get(Project, project_id)
    if project is None:
        abort(404)
    
    task = storage.get(Task, task_id)
    if task is None:
        abort(404)
    
    submissions = storage.all(Submission).values()
    submission = [submission.to_dict() for submission in submissions if submission.task_id == task_id and submission.project_id == project_id and submission.student_id == user.id]
    
    
    return jsonify(submission)



@app_views.route("/submissions/<submission_id>", methods=['PUT'],
                 strict_slashes=False)
def update_submission(submission_id):
    """
    Updates a submission object
    """
    submission = storage.get(Submission, submission_id)
    if submission is None:
        abort(404)
    from api.v1.app import auth
    user = auth.current_user(request)
    file = request.files['file']
    language = request.form['language']
    if file:
        if file.filename == '':
            return abort(400, {'message': 'No file selected'})
        
        extension = file.filename.rsplit('.', 1)[1].lower()
        if '.' not in file.filename and extension not in {'py', 'c', 'cpp'}:
            return abort(400, {'message': 'Invalid file type'})
        
        if language == 'Python' and extension != 'py':
            return abort(400, {'message': 'Not a Python file type'})
        
        if language == 'C' and extension != 'c':
            return abort(400, {'message': 'Not a C file type'})
        
        if language == 'C++' and extension != 'cpp':
            return abort(400, {'message': 'Not a C++ file type'})
        
        if allowed_file(file.filename):
            filename = secure_filename(file.filename)
            if not os.path.exists(app.config['UPLOAD_FOLDER']):
                os.makedirs(app.config['UPLOAD_FOLDER'])
            
            file_name = user.id + '_' + filename
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], file_name)
            if os.path.exists(filepath):
                os.remove(filepath)
            
            file.save(filepath)
            request_data = request.form.to_dict()
            request_data['file_url'] = filepath
            request_data['student_id'] = user.id
            
    check = ["id", "__class__", "created_at", "updated_at"]
    for k, v in request_data.items():
        if k not in check:
            setattr(submission, k, v)
    storage.save()
    
    test_results = storage.all(TestResult).values()
    for test_result in test_results:
        if test_result.submission_id == submission.id:
            test_result.delete()
    storage.save()

    #for k, v in req.items():
        #if k not in check:
            #setattr(submission, k, v)
    #storage.save()SW
    
    return jsonify(submission.to_dict()), 200



@app_views.route("/tasks/<task_id>/submissions/<submission_id>", methods=['POST'],
                 strict_slashes=False)
def submission_checker(task_id, submission_id):
    """
    Task code checker
    """
    try:
        req = request.get_json()  
    except Exception as e:
        return abort(400, {'message': 'Not a JSON'})

    if type(req) is not dict:
        return abort(400, {'message': 'Not a JSON'})
    
    from api.v1.app import auth
    user = auth.current_user(request)
    if user is None:
        abort(404, {"message": "No current session"})
        
    project = storage.get(Project, req['project_id'])
    if project is None:
        abort(404, {"message": "Project doesn't exist"})
        
    submission = storage.get(Submission, submission_id)
    if submission is None:
        abort(404, {"message": "Submission doesn't exist"})
        
    task = storage.get(Task, task_id)
    if task is None:
        abort(404, {"message": "Task doesn't exist"})
      
    
    test_cases = storage.all(TestCase).values()
    test_case_list = [test_case.to_dict() for test_case in test_cases if test_case.task_id == task_id]
    
    results = []
    

    if not os.path.exists(submission.file_url):
         return abort(404, {"message": "File submitted doesn't exist anymore, please submit new file"})
    
    folder = app.config['TEST_FOLDER'] + '_' + user.id
    if not os.path.exists(folder):
        os.makedirs(folder)
    for test_case in test_case_list:
        try:
            code_result = ''
            test_result = ''
            #with open(file_path, 'a') as f:
                #f.write(test_case.input)
            if req['language'] == 'Python':
                code_result = subprocess.run(["python3", submission.file_url], capture_output=True, text=True)
                test_file = test_case['id'] + '.py'
                test_filepath = os.path.join(folder, test_file)
                with open(test_filepath, 'w') as f:
                    f.write(f"{test_case['input']}\n")
                test_result = subprocess.run(["python3", test_filepath], capture_output=True, text=True)
                #os.remove(test_filepath)
            elif req['language'] == 'C':
                compiled = subprocess.run([f'gcc {submission.file_url} -o {submission_id}'], stderr=subprocess.PIPE, text=True)
                if compiled.stderr:
                    results.append({
                    "submission_id": submission_id,
                    "test_case_id": test_case['id'],
                    "name": test_case['name'],
                    "status": "failed",
                    "passed": False,
                    "actual_output": compiled.stderr
                    })
                    for result in results:
                        new_test_result = TestResult(**result)
                    new_test_result.save()
                    return jsonify(new_test_result.to_dict()), 201
                test_file = test_case['id'] + '.c'
                test_filepath = os.path.join(folder, test_file)
                subprocess.run([f'gcc {test_filepath} -o test_{submission_id}'], stderr=subprocess.PIPE, text=True)
                test_result = subprocess.run([f'./test_{submission_id}'], capture_output=True, text=True)
                code_result = subprocess.run([f'./{submission_id}'], capture_output=True, text=True)
                #os.remove(test_filepath)
            elif req[' language'] == 'C++':
                compiled = subprocess.run([f'g++ {submission.file_url} -o {submission_id}'], stderr=subprocess.PIPE, text=True)
                if compiled.stderr:
                    results.append({
                    "submission_id": submission_id,
                    "task_id": task_id,
                    "test_case_id": test_case['id'],
                    "name": test_case['name'],
                    "status": "failed",
                    "passed": False,
                    "actual_output": compiled.stderr
                    })
                    for result in results:
                        new_test_result = TestResult(**result)
                    new_test_result.save()
                    #os.remove(file_path)
                    return jsonify(new_test_result.to_dict()), 201
                test_file = test_case['id'] + '.cpp'
                test_filepath = os.path.join(folder, test_file)
                subprocess.run([f'g++ {test_filepath} -o test_{submission_id}'], stderr=subprocess.PIPE, text=True)
                test_result = subprocess.run([f'./test_{submission_id}'], capture_output=True, text=True) 
                code_result = subprocess.run([f'./{submission_id}'], capture_output=True, text=True)
                #os.remove(test_filepath)
            if code_result.stdout == test_result.stdout:
                results.append({
                    "submission_id": submission_id,
                    "task_id": task_id,
                    "test_case_id": test_case['id'],
                    "name": test_case['name'],
                    "status": "passed",
                    "passed": True
                })
            else:
                results.append({
                    "submission_id": submission_id,
                    "task_id": task_id,
                    "test_case_id": test_case['id'],
                    "name": test_case['name'],
                    "status": "failed",
                    "passed": False,
                    "actual_output": "Incorrect output"
                })
                            
                
        except Exception as e:
            print(str(e))
            results.append({
                "submission_id": submission_id,
                "task_id": task_id,
                "test_case_id": test_case['id'],
                "name": test_case['name'],
                "status": "failed",
                "passed": False,
                "actual_output": str(e)
            })
    failed = False
    for result in results:
        if result['status'] == "failed":
            failed = True
        new_test_result = TestResult(**result)
    
    new_test_result.save()
    
    if failed:
        
        setattr(submission, "status", "failed")
    else:
        setattr(submission, "status", "passed")
    
    storage.save()
  
    return jsonify([new_test_result.to_dict()]), 201
