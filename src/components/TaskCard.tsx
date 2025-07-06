
import React, { useState } from 'react';
import { Task } from '@/types';
import { Calendar, Users, Edit, Trash2, MoreVertical, Share } from 'lucide-react';
import { ShareTaskModal } from './ShareTaskModal';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  className = '',
  style,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'todo': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <>
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ${className} ${
          isOverdue ? 'border-red-200 bg-red-50' : ''
        }`}
        style={style}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={() => {
                const nextStatus = task.status === 'todo' ? 'in-progress' : 
                                task.status === 'in-progress' ? 'completed' : 'todo';
                onStatusChange(task.id, nextStatus);
              }}
              className={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 transition-colors ${getStatusColor(task.status)}`}
            >
              {task.status === 'completed' && (
                <svg className="w-3 h-3 text-white m-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-600 mt-1 text-sm">{task.description}</p>
              )}
            </div>
          </div>
          
          <div className="relative ml-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setShowShareModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            
            {task.dueDate && (
              <div className={`flex items-center space-x-1 text-sm ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(task.dueDate).toLocaleDateString()}
                  {isOverdue && ' (Overdue)'}
                </span>
              </div>
            )}
            
            {task.sharedWith.length > 0 && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{task.sharedWith.length} shared</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-400">
            Updated {new Date(task.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareTaskModal
          task={task}
          onClose={() => setShowShareModal(false)}
          onShare={(emails) => {
            // Handle task sharing logic
            console.log('Sharing task with:', emails);
            setShowShareModal(false);
          }}
        />
      )}
    </>
  );
};
