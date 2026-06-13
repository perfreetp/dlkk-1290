import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Assessment, AssessmentType } from '../types';
import { mockAssessments } from '../utils/mockData';

interface AssessmentState {
  assessments: Assessment[];
  loading: boolean;
  fetchAssessments: () => void;
  sendAssessment: (clientId: string, assessmentType: AssessmentType) => void;
  completeAssessment: (id: string) => void;
  getClientAssessments: (clientId: string) => Assessment[];
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      assessments: mockAssessments,
      loading: false,

      fetchAssessments: () => {
        set({ loading: true });
        setTimeout(() => {
          set({ loading: false });
        }, 500);
      },

      sendAssessment: (clientId, assessmentType) => {
        const newAssessment: Assessment = {
          id: `a${Date.now()}`,
          clientId,
          assessmentType,
          sentAt: new Date().toISOString().split('T')[0],
          status: 'pending',
        };
        set((state) => ({
          assessments: [...state.assessments, newAssessment],
        }));
      },

      completeAssessment: (id) => {
        set((state) => {
          const assessment = state.assessments.find(a => a.id === id);
          if (!assessment) return state;
          
          const resultScores = assessment.assessmentType.dimensions.map((dim) => ({
            dimension: dim,
            score: Math.floor(Math.random() * 40) + 50,
          }));
          
          const newResult = {
            id: `ar${Date.now()}`,
            assessmentId: id,
            scores: resultScores,
            interpretation: '测评完成，各维度得分已生成，综合分析详见详细报告',
            createdAt: new Date().toISOString().split('T')[0],
          };
          
          return {
            assessments: state.assessments.map((a) =>
              a.id === id
                ? {
                    ...a,
                    status: 'completed' as const,
                    completedAt: new Date().toISOString().split('T')[0],
                    result: newResult,
                  }
                : a
            ),
          };
        });
      },

      getClientAssessments: (clientId) => {
        return get().assessments.filter((a) => a.clientId === clientId);
      },
    }),
    {
      name: 'assessment-storage',
    }
  )
);
