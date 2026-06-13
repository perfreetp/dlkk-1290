import { Link } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';
import { useClientStore } from '../../store/useClientStore';
import { Client, CLIENT_STAGE_LABELS } from '../../types';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Card, CardContent } from '../common/Card';

const stageBadgeVariant: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
  initial_assessment: 'default',
  assessment: 'info',
  interview: 'warning',
  report_writing: 'secondary',
  follow_up: 'success',
};

interface ClientListProps {
  clients: Client[];
  onSearch: (query: string) => void;
  onFilter: (stage: string | null) => void;
}

export function ClientList({ clients, onSearch, onFilter }: ClientListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索来访者..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Link to="/clients/new">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            新建档案
          </Button>
        </Link>
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">暂无来访者</h3>
              <p className="text-sm text-gray-500 mb-4">创建第一个来访者档案开始您的咨询工作</p>
              <Link to="/clients/new">
                <Button variant="primary">
                  <Plus className="w-4 h-4" />
                  创建档案
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <Link key={client.id} to={`/clients/${client.id}`}>
              <Card hover>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar src={client.avatar} name={client.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {client.name}
                        </h3>
                        <Badge 
                          size="sm" 
                          variant={stageBadgeVariant[client.currentStage]}
                        >
                          {CLIENT_STAGE_LABELS[client.currentStage]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {client.occupation} · {client.age}岁
                      </p>
                      <p className="text-xs text-gray-400 mt-2 truncate">
                        {client.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>创建于 {client.createdAt}</span>
                      <span>更新于 {client.updatedAt}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
