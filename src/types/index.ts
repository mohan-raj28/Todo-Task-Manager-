
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'github' | 'facebook';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  sharedWith: string[];
  tags: string[];
}

export interface TaskFilter {
  status?: 'todo' | 'in-progress' | 'completed' | 'all';
  priority?: 'low' | 'medium' | 'high' | 'all';
  dueDate?: 'today' | 'overdue' | 'upcoming' | 'all';
  search?: string;
}
