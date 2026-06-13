import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MoreHorizontal, Phone, Mail } from 'lucide-react';
import { useClientStore } from '../../store/useClientStore';
import { ClientStage, CLIENT_STAGE_LABELS } from '../../types';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

const stages: ClientStage[] = [
  'initial_assessment',
  'assessment',
  'interview',
  'report_writing',
  'follow_up',
];

const stageColors: Record<ClientStage, string> = {
  initial_assessment: 'bg-gray-100 border-gray-200',
  assessment: 'bg-blue-50 border-blue-200',
  interview: 'bg-amber-50 border-amber-200',
  report_writing: 'bg-purple-50 border-purple-200',
  follow_up: 'bg-green-50 border-green-200',
};

export function KanbanBoard() {
  const { clients, updateClientStage } = useClientStore();
  const [draggedClient, setDraggedClient] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<ClientStage | null>(null);

  const handleDragStart = (e: React.DragEvent, clientId: string) => {
    setDraggedClient(clientId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stage: ClientStage) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, stage: ClientStage) => {
    e.preventDefault();
    if (draggedClient) {
      updateClientStage(draggedClient, stage);
    }
    setDraggedClient(null);
    setDragOverStage(null);
  };

  const getClientsByStage = (stage: ClientStage) => {
    return clients.filter((c) => c.currentStage === stage);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">来访者看板</h2>
        <Link
          to="/clients"
          className="text-sm text-[#1e3a5f] hover:underline flex items-center gap-1"
        >
          查看全部
          <Users className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div
            key={stage}
            className={clsx(
              'flex-1 min-w-[220px] rounded-xl border-2 transition-colors',
              stageColors[stage],
              dragOverStage === stage && 'border-[#1e3a5f] bg-[#1e3a5f]/5'
            )}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage)}
          >
            <div className="p-3 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm text-gray-700">
                  {CLIENT_STAGE_LABELS[stage]}
                </h3>
                <Badge size="sm" variant={stage === 'follow_up' ? 'success' : 'default'}>
                  {getClientsByStage(stage).length}
                </Badge>
              </div>
            </div>

            <div className="p-2 space-y-2 min-h-[200px]">
              {getClientsByStage(stage).map((client) => (
                <Link
                  key={client.id}
                  to={`/clients/${client.id}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, client.id)}
                  className={clsx(
                    'block p-3 bg-white rounded-xl shadow-sm border border-gray-100',
                    'hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar src={client.avatar} name={client.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate">
                        {client.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {client.occupation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
