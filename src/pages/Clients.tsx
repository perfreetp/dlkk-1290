import { useState, useMemo } from 'react';
import { useClientStore } from '../store/useClientStore';
import { ClientList } from '../components/client/ClientList';

export default function Clients() {
  const clients = useClientStore((state) => state.clients);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<string | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.occupation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStage = !filterStage || client.currentStage === filterStage;

      return matchesSearch && matchesStage;
    });
  }, [clients, searchQuery, filterStage]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">来访者档案</h1>
        <p className="text-gray-500 mt-1">管理所有来访者档案，跟踪咨询进度</p>
      </div>

      <ClientList
        clients={filteredClients}
        onSearch={setSearchQuery}
        onFilter={setFilterStage}
      />
    </div>
  );
}
