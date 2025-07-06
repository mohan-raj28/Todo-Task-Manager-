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
    const interval = setInterval(() => {
      console.log('Syncing tasks...');
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    // Do not clear tasks here to persist them after logout
  };

  const handleTaskUpdate = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white text-gray-800">
        {/* Hero Section */}
        <section className="relative bg-blue-50 px-6 py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold leading-tight mb-4">Stay Organized with TaskFlow</h1>
            <p className="text-lg text-gray-600 mb-8">
              Manage your tasks, collaborate with your team, and achieve your goals faster—all in one place.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg transition"
            >
              Get Started
            </button>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Sign In</h3>
                <p className="text-gray-500">Securely log in and sync your tasks across devices.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2. Create Tasks</h3>
                <p className="text-gray-500">Organize tasks by category, deadline, or priority level.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">3. Track Progress</h3>
                <p className="text-gray-500">Mark tasks complete and monitor your productivity.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-100 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Features You'll Love</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                'Real-time collaboration',
                'Deadline reminders',
                'Project grouping',
                'Dark mode support',
                'Data persistence (local storage)',
                'Simple & fast interface',
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-semibold mb-2">✅ {feature}</h4>
                  <p className="text-gray-500 text-sm">
                    {feature === 'Real-time collaboration'
                      ? 'Work with teammates simultaneously and stay up to date instantly.'
                      : 'Enhance your productivity with this essential feature.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t py-6 text-center text-gray-400 text-sm mt-12">
          &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
        </footer>

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal onLogin={handleLogin} onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    );
  }

  // Logged-in dashboard
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="flex flex-1">
        <aside className="w-64 bg-white border-r p-5 hidden md:block">
          <h2 className="text-xl font-bold mb-6">Menu</h2>
          <nav className="flex flex-col space-y-3">
            <button className="text-gray-700 hover:text-blue-600 transition text-left">Dashboard</button>
            <button className="text-gray-700 hover:text-blue-600 transition text-left">My Tasks</button>
            <button className="text-gray-700 hover:text-blue-600 transition text-left">Settings</button>
          </nav>
        </aside>
        <section className="flex-1 p-6">
          <TaskDashboard user={user} tasks={tasks} onTaskUpdate={handleTaskUpdate} />
        </section>
      </main>
    </div>
  );
};

export default Index;
