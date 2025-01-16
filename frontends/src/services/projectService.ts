import axiosInstance from './axiosInstance';

/**
 * Service class for handling project-related API calls
 */
export  default class ProjectService {
  /**
   * Fetches project progress for a specific project
   * @param projectId - The ID of the project
   * @returns Progress percentage (0-100)
   */
  static async getProjectProgress(projectId: string): Promise<number> {
    try {
      const current_user = await axiosInstance.get('/users/me');
      const studentId = current_user.data.id;
      const allTask = await axiosInstance.get(`projects/${projectId}/tasks`);
      const taskNumber = allTask.data.length;
      
      if (taskNumber === 0) return 0;
      
      const submissionResponse = await axiosInstance.get(`/projects/${projectId}/submissions`);
      const totalPassedTask = submissionResponse.data.filter(
        (sub: any) => sub.student_id === studentId && 
                      sub.project_id === projectId && 
                      sub.status === 'passed'
      ).length;
      
      return Math.round((100 / taskNumber) * totalPassedTask);
    } catch(error) {
      console.error('Error calculating project progress:', error);
      return 0;
    }
  }

  /**
   * Checks if a project is completed
   * @param projectId - The ID of the project
   * @returns Boolean indicating if project is completed
   */
  static async isProjectCompleted(projectId: string): Promise<boolean> {
    try {
      const current_user = await axiosInstance.get('/users/me');
      const studentId = current_user.data.id;
      const allTasks = await axiosInstance.get(`projects/${projectId}/tasks`);
      const taskCount = allTasks.data.length;
      
      if (taskCount === 0) return false;
      
      const submissions = await axiosInstance.get(`/projects/${projectId}/submissions`);
      const passedSubmissions = submissions.data.filter(
        (sub: any) => sub.student_id === studentId && 
                      sub.project_id === projectId && 
                      sub.status === 'passed'
      ).length;
      
      return passedSubmissions === taskCount;
    } catch (error) {
      console.error('Error checking project completion:', error);
      return false;
    }
  }
}