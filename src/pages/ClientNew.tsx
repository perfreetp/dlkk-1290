import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ClientForm } from '../components/client/ClientForm';

export default function ClientNew() {
  const navigate = useNavigate();

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
          <h1 className="text-2xl font-bold text-gray-800">新建来访者档案</h1>
          <p className="text-gray-500 mt-1">创建新的来访者档案信息</p>
        </div>
      </div>

      <ClientForm mode="create" />
    </div>
  );
}
