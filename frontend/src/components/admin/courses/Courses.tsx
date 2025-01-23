import React, { useState, useEffect } from 'react';
import { Table } from './layout/Table';
import { AddCourseModal } from './layout/AddCourseModal';
import { EditCourseModal } from './layout/EditCourseModal';
import { DeleteCourseModal } from './layout/DeleteCourseModal';
import { Plus } from 'lucide-react';
import { TabsContent } from "@/components/ui/tabs";
import axiosInstance from '@/services/axiosInstance';

export type Course = {
  id: string;
  title: string;
  course_code: string;
  description: string;
  units: string;
  instructor_id: string;
  level_id: string;
};


export function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedCourses, setUpdatedCourses] = useState(null);

  const handleEditCourse = (updatedCourse: Course) => {
    setCourses(courses.map(course => course.id === updatedCourse.id ? updatedCourse : course));
    setIsEditModalOpen(false);
  };

  const fetchCourse = async () => {
    try {
      const response = await axiosInstance.get('/courses');

      if (response.status === 200) {
        const data = response.data;
        setCourses(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error', error);
    } 
  };
  

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get('/courses');
        if (response.status === 200) {
          return response.data; // Return the courses data
        }
        return [];
      } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
      }
    };
  
    const fetchLevel = async (id: string) => {
      try {
        const levelResponse = await axiosInstance.get(`/levels/${id}`);
        if (levelResponse.status === 200) {
          return `${levelResponse.data.name} - ${levelResponse.data.semester}`;
        }
      } catch (error) {
        console.error('Error fetching level:', error);
      }
      return '';
    };
  
    const fetchInstructor = async (id: string) => {
      try {
        const instructorResponse = await axiosInstance.get(`/users/${id}`);
        if (instructorResponse.status === 200) {
          return `${instructorResponse.data.title} ${instructorResponse.data.first_name} ${instructorResponse.data.last_name}`;
        }
      } catch (error) {
        console.error('Error fetching instructor:', error);
      }
      return '';
    };
  
    const fetchProject = async (id: string) => {
      try {
        const projectsResponse = await axiosInstance.get(`/courses/${id}/projects`);
        if (projectsResponse.status === 200) {
          return projectsResponse.data;
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
      return [];
    };
  
    const updateCourses = async () => {
      try {
        const courses = await fetchCourse();
        const newCourses = await Promise.all(
          courses.map(async (course: any) => ({
            ...course,
            level: await fetchLevel(course.level_id),
            instructor: await fetchInstructor(course.instructor_id),
            project_no: (await fetchProject(course.id)).length,
          }))
        );
        setUpdatedCourses(newCourses); // Update the state with enriched course data
        setLoading(false); // Set loading to false after updating
      } catch (error) {
        console.error('Error updating courses:', error);
      }
    };
  
    updateCourses();
  }, []);

  return (
    <>
    <TabsContent value="courses">
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Courses Management</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Course
          </button>
        </div>
      </div>

      <Table
        courses={updatedCourses}
        onEdit={(course) => {
          setSelectedCourse(course);
          setIsEditModalOpen(true);
        }}
        onDelete={(course) => {
          setSelectedCourse(course);
          setIsDeleteModalOpen(true);
        }}
        loading={loading}
      />

      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchCourse();
        }}
      />

      {selectedCourse && (
        <>
          <EditCourseModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              fetchCourse();
            }}
            course={selectedCourse}
            onEdit={handleEditCourse}
          />
          <DeleteCourseModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              fetchCourse();
            }}
            course={selectedCourse}
          />
        </>
      )}
    </div>
    </TabsContent>
    </>
  );
}