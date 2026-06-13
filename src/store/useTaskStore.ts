import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus } from '../types';
import { mockTasks } from '../utils/mockData';

interface StatusHistoryEntry {
  taskId: string;
  previousStatus: TaskStatus;
  newStatus: TaskStatus;
  timestamp: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  statusHistory: StatusHistoryEntry[];
  fetchTasks: () => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  getClientTasks: (clientId: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTaskStatusHistory: (taskId: string) => StatusHistoryEntry[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: mockTasks,
      loading: false,
      statusHistory: [],

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
        const task = get().tasks.find((t) => t.id === id);
        if (task && task.status !== status) {
          const historyEntry: StatusHistoryEntry = {
            taskId: id,
            previousStatus: task.status,
            newStatus: status,
            timestamp: new Date().toISOString(),
          };
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, status } : task
            ),
            statusHistory: [...state.statusHistory, historyEntry],
          }));
        }
      },

      getTaskStatusHistory: (taskId) => {
        return get().statusHistory.filter((h) => h.taskId === taskId);
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
