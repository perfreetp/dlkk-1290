import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Interview, ConfusionType } from '../types';
import { mockInterviews } from '../utils/mockData';

interface InterviewState {
  interviews: Interview[];
  loading: boolean;
  fetchInterviews: () => void;
  addInterview: (interview: Omit<Interview, 'id' | 'createdAt'>) => void;
  updateInterview: (id: string, data: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;
  getClientInterviews: (clientId: string) => Interview[];
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      interviews: mockInterviews,
      loading: false,

      fetchInterviews: () => {
        set({ loading: true });
        setTimeout(() => {
          set({ loading: false });
        }, 500);
      },

      addInterview: (interviewData) => {
        const newInterview: Interview = {
          ...interviewData,
          id: `i${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          interviews: [...state.interviews, newInterview],
        }));
      },

      updateInterview: (id, data) => {
        set((state) => ({
          interviews: state.interviews.map((interview) =>
            interview.id === id ? { ...interview, ...data } : interview
          ),
        }));
      },

      deleteInterview: (id) => {
        set((state) => ({
          interviews: state.interviews.filter((interview) => interview.id !== id),
        }));
      },

      getClientInterviews: (clientId) => {
        return get().interviews.filter((i) => i.clientId === clientId);
      },
    }),
    {
      name: 'interview-storage',
    }
  )
);
