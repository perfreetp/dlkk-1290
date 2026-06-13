import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Report, CareerRecommendation } from '../types';
import { mockReports } from '../utils/mockData';

type NewReportData = {
  clientId: string;
  title: string;
  content: string;
  careerRecommendations: Omit<CareerRecommendation, 'id'>[];
  status: 'draft' | 'completed' | 'sent';
};

interface ReportState {
  reports: Report[];
  loading: boolean;
  fetchReports: () => void;
  addReport: (report: NewReportData) => void;
  updateReport: (id: string, data: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  sendReport: (id: string, summary?: string) => void;
  addCareerRecommendation: (reportId: string, recommendation: Omit<CareerRecommendation, 'id'>) => void;
  removeCareerRecommendation: (reportId: string, recommendationId: string) => void;
  getClientReports: (clientId: string) => Report[];
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: mockReports,
      loading: false,

      fetchReports: () => {
        set({ loading: true });
        setTimeout(() => {
          set({ loading: false });
        }, 500);
      },

      addReport: (reportData) => {
        const newReport: Report = {
          ...reportData,
          careerRecommendations: reportData.careerRecommendations.map((rec) => ({
            ...rec,
            id: `cr${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          })),
          id: `r${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          reports: [...state.reports, newReport],
        }));
      },

      updateReport: (id, data) => {
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === id
              ? { ...report, ...data, updatedAt: new Date().toISOString().split('T')[0] }
              : report
          ),
        }));
      },

      deleteReport: (id) => {
        set((state) => ({
          reports: state.reports.filter((report) => report.id !== id),
        }));
      },

      sendReport: (id, summary?: string) => {
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === id && report.status !== 'draft'
              ? { 
                  ...report, 
                  status: 'sent', 
                  sentAt: new Date().toISOString().split('T')[0],
                  sentSummary: summary || '',
                  updatedAt: new Date().toISOString().split('T')[0] 
                }
              : report
          ),
        }));
      },

      addCareerRecommendation: (reportId, recommendation) => {
        const newRecommendation: CareerRecommendation = {
          ...recommendation,
          id: `cr${Date.now()}`,
        };
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === reportId
              ? {
                  ...report,
                  careerRecommendations: [...report.careerRecommendations, newRecommendation],
                  updatedAt: new Date().toISOString().split('T')[0],
                }
              : report
          ),
        }));
      },

      removeCareerRecommendation: (reportId, recommendationId) => {
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === reportId
              ? {
                  ...report,
                  careerRecommendations: report.careerRecommendations.filter(
                    (r) => r.id !== recommendationId
                  ),
                  updatedAt: new Date().toISOString().split('T')[0],
                }
              : report
          ),
        }));
      },

      getClientReports: (clientId) => {
        return get().reports.filter((r) => r.clientId === clientId);
      },
    }),
    {
      name: 'report-storage',
    }
  )
);
