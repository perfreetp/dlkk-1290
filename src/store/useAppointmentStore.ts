import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Appointment, AppointmentStatus } from '../types';
import { mockAppointments } from '../utils/mockData';

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  fetchAppointments: () => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  getClientAppointments: (clientId: string) => Appointment[];
  getAppointmentsByDate: (date: string) => Appointment[];
  getTodayAppointments: () => Appointment[];
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      appointments: mockAppointments,
      loading: false,

      fetchAppointments: () => {
        set({ loading: true });
        setTimeout(() => {
          set({ loading: false });
        }, 500);
      },

      addAppointment: (appointmentData) => {
        const newAppointment: Appointment = {
          ...appointmentData,
          id: `ap${Date.now()}`,
        };
        set((state) => ({
          appointments: [...state.appointments, newAppointment],
        }));
      },

      updateAppointment: (id, data) => {
        set((state) => ({
          appointments: state.appointments.map((appointment) =>
            appointment.id === id ? { ...appointment, ...data } : appointment
          ),
        }));
      },

      deleteAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.filter((appointment) => appointment.id !== id),
        }));
      },

      updateAppointmentStatus: (id, status) => {
        set((state) => ({
          appointments: state.appointments.map((appointment) =>
            appointment.id === id ? { ...appointment, status } : appointment
          ),
        }));
      },

      getClientAppointments: (clientId) => {
        return get().appointments.filter((a) => a.clientId === clientId);
      },

      getAppointmentsByDate: (date) => {
        return get().appointments.filter((a) => a.scheduledAt.startsWith(date));
      },

      getTodayAppointments: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().getAppointmentsByDate(today);
      },
    }),
    {
      name: 'appointment-storage',
    }
  )
);
