/**
 * User interface representing the authenticated user
 */
export interface User {
    id: string;
    first_name: string;
    last_name: string;
    level_id: string;
    role: string;
  }
  
  /**
   * Course interface representing a course in the system
   */
  export interface Course {
    id: string;
    course_code: string;
    title: string;
    instructor_id: string;
    instructor_name: string;
    level_id: string;
    projectCount: number;
    completedProjectCount: number;
  }
  
  /**
   * Project interface representing a project in the system
   */
  export interface Project {
    id: string;
    name: string;
    deadline: string;
    start: string;
    code: string;
    progress?: number;
  }
  
  /**
   * Time remaining interface for countdown calculations
   */
  export interface TimeRemaining {
    days: number;
    hrs: number;
    mins: number;
    secs: number;
  }