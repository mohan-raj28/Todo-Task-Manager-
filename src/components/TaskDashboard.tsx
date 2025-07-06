
import React, { useState, useMemo } from 'react';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';
import { TaskFilters } from './TaskFilters';
import { TaskStats } from './TaskStats';
import { Plus } from 'lucide-react';
import { Task, User, TaskFilter } from '@/types';

interface TaskDashboardProps {
  user: User;
  tasks: Task[];
  onTaskUpdate: (tasks: Task[]) => void;
}

export const TaskDashboard: React.FC<TaskDashboardProps> = ({
  user,
  tasks,
  onTaskUpdate,
}) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilter>({
    status: 'all',
    priority: 'all',
    dueDate: 'all',
    search: '',
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = filters.status === 'all' || task.status === filters.status;
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
      const matchesSearch = !filters.search || 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase());
      
      let matchesDueDate = true;
      if (filters.dueDate !== 'all' && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        switch (filters.dueDate) {
          case 'today':
            matchesDueDate = dueDate.toDateString() === today.toDateString();
            break;
          case 'overdue':
            matchesDueDate = dueDate < today && task.status !== 'completed';
            break;
          case 'upcoming':
            matchesDueDate = dueDate >= tomorrow;
            break;
        }
      }

      return matchesStatus && matchesPriority && matchesSearch && matchesDueDate;
    });
  }, [tasks, filters]);

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: taskData.title || '',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.id,
      sharedWith: taskData.sharedWith || [],
      tags: taskData.tags || [],
    };

    onTaskUpdate([...tasks, newTask]);
    setShowTaskForm(false);
  };

  const handleUpdateTask = (taskData: Partial<Task>) => {
    if (!editingTask) return;

    const updatedTask = {
      ...editingTask,
      ...taskData,
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = tasks.map(task =>
      task.id === editingTask.id ? updatedTask : task
    );

    onTaskUpdate(updatedTasks);
    setEditingTask(null);
    setShowTaskForm(false);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    onTaskUpdate(updatedTasks);
  };

  const handleTaskStatusChange = (taskId: string, status: Task['status']) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, status, updatedAt: new Date().toISOString() }
        : task
    );
    onTaskUpdate(updatedTasks);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user.name}! You have {filteredTasks.length} tasks
            </p>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>

        <TaskStats tasks={tasks} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <TaskFilters filters={filters} onFiltersChange={setFilters} />
        </div>
        <div className="lg:col-span-3">
          <TaskList
            tasks={filteredTasks}
            onEdit={(task) => {
              setEditingTask(task);
              setShowTaskForm(true);
            }}
            onDelete={handleDeleteTask}
            onStatusChange={handleTaskStatusChange}
          />
        </div>
      </div>

      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};
