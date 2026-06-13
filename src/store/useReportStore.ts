import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Report, CareerRecommendation, ReportSendRecord } from '../types';
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
  addReport: (report: NewReportData) => string;
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
        const newReportId = `r${Date.now()}`;
        const newReport: Report = {
          ...reportData,
          careerRecommendations: reportData.careerRecommendations.map((rec) => ({
            ...rec,
            id: `cr${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          })),
          id: newReportId,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          reports: [...state.reports, newReport],
        }));
        return newReportId;
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
        const report = get().reports.find(r => r.id === id);
        if (report && report.status !== 'draft') {
          const sendRecord: ReportSendRecord = {
            id: `send-${Date.now()}`,
            sentAt: new Date().toISOString().split('T')[0],
            summary: summary || '',
            reportVersion: `v${(report.sendHistory?.length || 0) + 1}.0`,
          };
          set((state) => ({
            reports: state.reports.map((r) =>
              r.id === id
                ? { 
                    ...r, 
                    status: 'sent', 
                    sentAt: sendRecord.sentAt,
                    sentSummary: summary || '',
                    sendHistory: [...(r.sendHistory || []), sendRecord],
                    updatedAt: new Date().toISOString().split('T')[0] 
                  }
                : r
            ),
          }));
        }
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
