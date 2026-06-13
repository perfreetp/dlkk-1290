import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus } from '../types';
import { mockTasks } from '../utils/mockData';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  getClientTasks: (clientId: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: mockTasks,
      loading: false,

      fetchTasks: () => {
        set({ loading: true });
        setTimeout(() => {
          set({ loading: false });
        }, 500);
      },

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: `t${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },

      updateTask: (id, data) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...data } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      updateTaskStatus: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status } : task
          ),
        }));
      },

      getClientTasks: (clientId) => {
        return get().tasks.filter((t) => t.clientId === clientId);
      },

      getTasksByStatus: (status) => {
        return get().tasks.filter((t) => t.status === status);
      },
    }),
    {
      name: 'task-storage',
    }
  )
);
