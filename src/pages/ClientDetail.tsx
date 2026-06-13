import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar,
  Brain,
  ClipboardList,
  FileText,
  CheckSquare
} from 'lucide-react';
import { useClientStore } from '../store/useClientStore';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { useInterviewStore } from '../store/useInterviewStore';
import { useReportStore } from '../store/useReportStore';
import { useTaskStore } from '../store/useTaskStore';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card, CardContent, CardHeader } from '../components/common/Card';
import { CLIENT_STAGE_LABELS } from '../types';

const stageBadgeVariant: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
  initial_assessment: 'default',
  assessment: 'info',
  interview: 'warning',
  report_writing: 'secondary',
  follow_up: 'success',
};

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, deleteClient } = useClientStore();
  const assessments = useAssessmentStore((state) => state.assessments);
  const interviews = useInterviewStore((state) => state.interviews);
  const reports = useReportStore((state) => state.reports);
  const tasks = useTaskStore((state) => state.tasks);

  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800">来访者不存在</h2>
        <Button variant="ghost" onClick={() => navigate('/clients')} className="mt-4">
          返回列表
        </Button>
      </div>
    );
  }

  const clientAssessments = assessments.filter((a) => a.clientId === client.id);
  const clientInterviews = interviews.filter((i) => i.clientId === client.id);
  const clientReports = reports.filter((r) => r.clientId === client.id);
  const clientTasks = tasks.filter((t) => t.clientId === client.id);
  const completedTasks = clientTasks.filter((t) => t.status === 'completed').length;

  const handleDelete = () => {
    if (window.confirm('确定要删除此档案吗？此操作不可撤销。')) {
      deleteClient(client.id);
      navigate('/clients');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">来访者详情</h1>
            <p className="text-gray-500 mt-1">ID: {client.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(`/clients/${client.id}/edit`)}>
            <Edit className="w-4 h-4" />
            编辑
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
            删除
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent>
              <div className="text-center">
                <Avatar src={client.avatar} name={client.name} size="lg" />
                <h2 className="text-xl font-bold text-gray-800 mt-4">{client.name}</h2>
                <p className="text-gray-500">{client.occupation}</p>
                <Badge 
                  variant={stageBadgeVariant[client.currentStage]}
                  className="mt-3"
                >
                  {CLIENT_STAGE_LABELS[client.currentStage]}
                </Badge>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">联系电话</p>
                    <p className="text-sm font-medium text-gray-800">{client.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">电子邮箱</p>
                    <p className="text-sm font-medium text-gray-800">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">创建时间</p>
                    <p className="text-sm font-medium text-gray-800">{client.createdAt}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">咨询背景</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {client.consultationBackground}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card hover onClick={() => navigate('/assessments')}>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{clientAssessments.length}</p>
                    <p className="text-xs text-gray-500">测评记录</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card hover onClick={() => navigate('/interviews')}>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{clientInterviews.length}</p>
                    <p className="text-xs text-gray-500">访谈记录</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card hover onClick={() => navigate('/reports')}>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{clientReports.length}</p>
                    <p className="text-xs text-gray-500">诊断报告</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card hover onClick={() => navigate('/tracking')}>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {completedTasks}/{clientTasks.length}
                    </p>
                    <p className="text-xs text-gray-500">完成任务</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {clientReports.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-800">最新诊断报告</h3>
              </CardHeader>
              <CardContent>
                {clientReports.slice(0, 1).map((report) => (
                  <div key={report.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{report.title}</h4>
                      <Badge 
                        variant={report.status === 'sent' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {report.status === 'sent' ? '已发送' : '草稿'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {report.content.substring(0, 200)}...
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => navigate(`/reports/${report.id}`)}
                    >
                      查看详情
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {clientInterviews.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-800">最近访谈</h3>
              </CardHeader>
              <CardContent>
                {clientInterviews.slice(0, 2).map((interview) => (
                  <div key={interview.id} className="p-4 bg-gray-50 rounded-xl mb-3 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800">
                        {interview.interviewDate}
                      </span>
                      <span className="text-xs text-gray-500">{interview.duration}分钟</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {interview.summary}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
