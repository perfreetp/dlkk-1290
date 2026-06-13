import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ClientForm } from '../components/client/ClientForm';
import { useClientStore } from '../store/useClientStore';
import { Client } from '../types';

export default function ClientNew() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { clients } = useClientStore();
  const [editClient, setEditClient] = useState<Client | null>(null);

  useEffect(() => {
    if (id) {
      const client = clients.find((c) => c.id === id);
      if (client) {
        setEditClient(client);
      }
    }
  }, [id, clients]);

  const isEditMode = Boolean(id && editClient);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? '编辑来访者档案' : '新建来访者档案'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditMode ? '修改来访者档案信息' : '创建新的来访者档案信息'}
          </p>
        </div>
      </div>

      <ClientForm mode={isEditMode ? 'edit' : 'create'} initialData={editClient || undefined} />
    </div>
  );
}
