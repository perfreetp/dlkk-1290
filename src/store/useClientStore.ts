import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client, ClientStage } from '../types';
import { mockClients } from '../utils/mockData';

interface ClientState {
  clients: Client[];
  currentClient: Client | null;
  loading: boolean;
  fetchClients: () => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  setCurrentClient: (client: Client | null) => void;
  updateClientStage: (id: string, stage: ClientStage) => void;
}

export const useClientStore = create<ClientState>()(
  persist(
    (set, get) => ({
      clients: mockClients,
      currentClient: null,
      loading: false,

      fetchClients: () => {
        set({ loading: true });
        setTimeout(() => {
          set({ loading: false });
        }, 500);
      },

      addClient: (clientData) => {
        const newClient: Client = {
          ...clientData,
          id: `c${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          clients: [...state.clients, newClient],
        }));
      },

      updateClient: (id, data) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id
              ? { ...client, ...data, updatedAt: new Date().toISOString().split('T')[0] }
              : client
          ),
        }));
      },

      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        }));
      },

      setCurrentClient: (client) => {
        set({ currentClient: client });
      },

      updateClientStage: (id, stage) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id
              ? { ...client, currentStage: stage, updatedAt: new Date().toISOString().split('T')[0] }
              : client
          ),
        }));
      },
    }),
    {
      name: 'client-storage',
    }
  )
);
