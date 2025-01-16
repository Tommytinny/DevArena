import { API_CONFIG } from '../../config/api.config';
import axios from 'axios';

//CREATE/POST Api Section
export async function login(formData: { 
  email: string;
  password: string;
 }) {
  axios.defaults.withCredentials = true;
  const response = await axios.post(`${API_CONFIG.BASE_URL}/auth_session/login`, formData);
  if (response.status !== 200) {
    const error = await response.statusText;
    throw new Error(error || 'Failed to login');
  }
  
  return response.data;
}


export async function createLevel(levelData: { 
  name: string;
  academic_year: string;
  semester: string;
 }) {
  axios.defaults.withCredentials = true;
  const response = await axios.post(`${API_CONFIG.BASE_URL}/levels`, levelData);
  if (response.status !== 201) {
    const error = await response.statusText;
    throw new Error(error || 'Failed to create level');
  }
  
  return response.data;
}

export async function createUser(submitData: { 
  title: string;
  first_name: string;
  last_name: string;
  matric_number: string;
  email: string;
  password: string;
  role: string;
  level_id: string;
 }) {
  axios.defaults.withCredentials = true;
  const response = await axios.post(`${API_CONFIG.BASE_URL}/users`, submitData);
  if (response.status !== 201) {
    const error = response.statusText;
    throw new Error(error || 'Failed to create user');
  }
  
  return response.data;
}

export async function createCourse(courseData: { 
  title: string;
  course_code: string;
  description: string;
  units: string;
  instructor_id: string;
  level_id: string;
 }) {
  axios.defaults.withCredentials = true;
  const response = await axios.post(`${API_CONFIG.BASE_URL}/courses`, courseData);
  if (response.status !== 201) {
    const error = await response.statusText;
    throw new Error(error || 'Failed to crete coursea');
  }
  
  return response.data;
}

export async function createProject(courseId: string, projectData: { 
  name: string;
  description: string;
  instruction: string;
  start: string;
  deadline: string;
  project_type: string;
  project_review: string;
 }) {
  axios.defaults.withCredentials = true;
  const response = await axios.post(`${API_CONFIG.BASE_URL}/courses/${courseId}/projects`, projectData);
  if (response.status !== 201) {
    const error = response.statusText;
    throw new Error(error || 'Failed to create project');
  }
  
  return response.data;
}

export async function createResource(projectId: string, resourceData: {
  title: string;
  type: string;
  url: string;
}) {
  axios.defaults.withCredentials = true;
  const response = await axios.post(`${API_CONFIG.BASE_URL}/projects/${projectId}/resources`, resourceData);
  if (response.status !== 201) {
    const error = response.statusText;
    throw new Error(error || 'Failed to create resource');
  }
  
  return response.data;
}

export async function createTask(projectId: string, taskData: {
  name: string;
  description: string;
  instruction: string;
  points: string;
  order_index: string;
  type: string;
  difficulty: string;
  language: string;
  code_output: string;
}) {
  axios.defaults.withCredentials = true;
  const response = await axios.post(`${API_CONFIG.BASE_URL}/projects/${projectId}/tasks`, taskData);
  if (response.status !== 201) {
    const error = response.statusText;
    throw new Error(error || 'Failed to create task');
  }
  
  return response.data;
}

export async function createTestCase(taskId: string, testCaseData: {
  name: string;
  input: string;
  expected: string;
  errorMessage: string;
  points: string;
}) {

  axios.defaults.withCredentials = true;
  const response = await axios.post(`${API_CONFIG.BASE_URL}/tasks/${taskId}/test_cases`, testCaseData);
  if (response.status !== 201) {
    const error = response.statusText;
    throw new Error(error || 'Failed to create testcase');
  }
  
  return response.data;
}

// GET Api Section
export async function fetchAllLevel() {
  axios.defaults.withCredentials = true;
  const response = await axios.get(`${API_CONFIG.BASE_URL}/levels`);
  
  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to fetch level');
  }
  
  return response.data;
}

export async function fetchAllUser() {
  axios.defaults.withCredentials = true;
  const response = await axios.get(`${API_CONFIG.BASE_URL}/users`);
  
  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to fetch user');
  }
  
  return response.data;
}




export async function fetchAllProject() {
  axios.defaults.withCredentials = true;
  const response = await axios.get(`${API_CONFIG.BASE_URL}/projects`);
  
  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to fetch project');
  }
  
  return response.data;
}

export async function fetchAllResource(projectId: any) {
  axios.defaults.withCredentials = true;
  const response = await axios.get(`${API_CONFIG.BASE_URL}/projects/${projectId}/resources`);
  
  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to fetch resource');
  }
  
  return response.data;
}

export async function fetchAllTask(projectId: any) {
  axios.defaults.withCredentials = true;
  const response = await axios.get(`${API_CONFIG.BASE_URL}/projects/${projectId}/tasks`);
  
  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to fetch task');
  }
  
  return response.data;
}


export async function fetchAllTestcase(taskId: string) {
  axios.defaults.withCredentials = true;
  const response = await axios.get(`${API_CONFIG.BASE_URL}/tasks/${taskId}/test_cases`);
  
  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to fetch testcase');
  }
  
  return response.data;
}


export async function fetchOneLevel(levelId: string) {
  axios.defaults.withCredentials = true;
  const response = await axios.get(`${API_CONFIG.BASE_URL}/levels/${levelId}`);
  
  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to fetch level');
  }
  
  return response.data;
}

export async function fetchOneUser(userId: string) {
  axios.defaults.withCredentials = true;
  const response = await axios.get(`${API_CONFIG.BASE_URL}/users/${userId}`);
  
  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to fetch user');
  }
  
  return response.data;
}


export async function fetchOneProject(id: any) {
  axios.defaults.withCredentials = true;
  const response = await axios.get(`${API_CONFIG.BASE_URL}/projects/${id}`);
  
  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to fetch project');
  }
  
  return response.data;
}

// UPDATE Api Section
export async function updateUser(userData: { 
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  matric_number: string;
  email: string;
  password: string;
  role: string;
  level_id: string;
 }) {
  axios.defaults.withCredentials = true;
  const response = await axios.put(`${API_CONFIG.BASE_URL}/users/${userData.id}`, userData);
  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to update user');
  }
  
  return response.data;
}

export async function updateLevel(levelData: { 
  id: string;
  name: string;
  academic_year: string;
  semester: string;
 }) {
  axios.defaults.withCredentials = true;
  const response = await axios.put(`${API_CONFIG.BASE_URL}/levels/${levelData.id}`, levelData);
  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to update level');
  }

  return response.data;
}

export async function updateCourse(courseData: { 
  id: string;
  title: string;
  course_code: string;
  description: string;
  units: string;
  instructor_id: string;
  level_id: string;
 }) {
  axios.defaults.withCredentials = true;
  const response = await axios.put(`${API_CONFIG.BASE_URL}/courses/${courseData.id}`, courseData);
  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to update course');
  }
  
  return response.data;
}

// DELETE Api section
export async function deleteLevel(levelId: string) {
  axios.defaults.withCredentials = true;
  const response = await axios.delete(`${API_CONFIG.BASE_URL}/levels/${levelId}`);

  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to delete level');
  }
  
  return response.data;
}

export async function deleteUser(userId: string) {
  axios.defaults.withCredentials = true;
  const response = await axios.delete(`${API_CONFIG.BASE_URL}/users/${userId}`);

  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to delete user');
  }
  
  return response.data;
}


export async function deleteCourse(courseId: string) {
  axios.defaults.withCredentials = true;
  const response = await axios.delete(`${API_CONFIG.BASE_URL}/courses/${courseId}`);

  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to delete course');
  }

  return response.data;
}

export async function deleteProject(projectId: string) {
  axios.defaults.withCredentials = true;
  const response = await axios.delete(`${API_CONFIG.BASE_URL}/projects/${projectId}`);

  if (response.status !== 200) {
    const error = response.statusText;
    throw new Error(error || 'Failed to delete project');
  }
  
  return response.data;
}
