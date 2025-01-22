import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, project_id }: { tasks: any[], project_id: string }) {
  return (
    <section className="mt-2">
      <h1 className="text-2xl font-bold text-gray-800 pl-2 my-4">Tasks {tasks.length}</h1>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} projectId={project_id} />
      ))}
    </section>
  );
}
