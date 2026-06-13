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
  CheckSquare,
  CheckCircle,
  Clock,
  Send
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
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

const reportStatusConfig = {
  draft: { label: '草稿', variant: 'warning' as const },
  completed: { label: '已完成', variant: 'info' as const },
  sent: { label: '已发送', variant: 'success' as const },
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

  const clientAssessments = assessments
    .filter((a) => a.clientId === client.id)
    .sort((a, b) => new Date(b.completedAt || b.sentAt).getTime() - new Date(a.completedAt || a.sentAt).getTime());
  
  const clientInterviews = interviews
    .filter((i) => i.clientId === client.id)
    .sort((a, b) => new Date(b.interviewDate).getTime() - new Date(a.interviewDate).getTime());
  
  const clientReports = reports
    .filter((r) => r.clientId === client.id)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  
  const clientTasks = tasks.filter((t) => t.clientId === client.id);
  const completedTasks = clientTasks.filter((t) => t.status === 'completed').length;

  const latestReport = clientReports[0];
  const latestAssessment = clientAssessments.find((a) => a.status === 'completed' && a.result);

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

          {latestAssessment && latestAssessment.result && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">最新测评结果</h3>
                  </div>
                  <Badge variant="success">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    已完成
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={latestAssessment.result.scores}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                        <Radar
                          name="得分"
                          dataKey="score"
                          stroke="#1e3a5f"
                          fill="#1e3a5f"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-3">
                      {latestAssessment.assessmentType.name}
                    </p>
                    <div className="space-y-2">
                      {latestAssessment.result.scores.slice(0, 4).map((score) => (
                        <div key={score.dimension} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{score.dimension}</span>
                          <span className="font-medium text-gray-800">{score.score}分</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    完成于 {latestAssessment.completedAt}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/assessments')}
                  >
                    查看全部测评
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {latestReport && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-800">最新诊断报告</h3>
                  </div>
                  <Badge variant={reportStatusConfig[latestReport.status].variant}>
                    {reportStatusConfig[latestReport.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{latestReport.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {latestReport.content.substring(0, 200)}...
                  </p>
                  
                  {latestReport.careerRecommendations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">推荐职业</p>
                      <div className="flex flex-wrap gap-2">
                        {latestReport.careerRecommendations.slice(0, 3).map((rec) => (
                          <span
                            key={rec.id}
                            className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-700"
                          >
                            {rec.careerName} ({rec.matchScore}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {latestReport.sentAt ? (
                        <>
                          <span className="flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            已发送于 {latestReport.sentAt}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            更新于 {latestReport.updatedAt}
                          </span>
                        </>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/reports/${latestReport.id}`)}
                    >
                      查看详情
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {clientInterviews.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-gray-800">最近访谈</h3>
                </div>
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
