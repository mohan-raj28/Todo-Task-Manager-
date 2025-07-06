
import React, { useState, useEffect } from 'react';
import { TaskDashboard } from '@/components/TaskDashboard';
import { AuthModal } from '@/components/AuthModal';
import { Navbar } from '@/components/Navbar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Task, User } from '@/types';

const Index = () => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Simulate real-time updates (in production, this would be WebSocket connection)
    const interval = setInterval(() => {
      // This would be replaced with actual WebSocket listeners
      console.log('Checking for real-time updates...');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
  };

  const handleTaskUpdate = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                TaskFlow
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Collaborative Task Management
              </p>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Welcome Back
                </h2>
                <p className="text-gray-600 mb-8">
                  Sign in to manage your tasks and collaborate with your team
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
        {showAuthModal && (
          <AuthModal onLogin={handleLogin} onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      <TaskDashboard 
        user={user} 
        tasks={tasks} 
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
};

export default Index;
