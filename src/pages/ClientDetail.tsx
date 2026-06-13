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
  Send,
  Target,
  ChevronRight
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

interface TimelineItem {
  id: string;
  type: 'assessment' | 'interview' | 'report' | 'task';
  title: string;
  date: string;
  icon: any;
  color: string;
  status?: string;
  details?: string;
}

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
  
  const clientTasks = tasks
    .filter((t) => t.clientId === client.id)
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  
  const completedTasks = clientTasks.filter((t) => t.status === 'completed').length;

  const latestReport = clientReports[0];
  const latestAssessment = clientAssessments.find((a) => a.status === 'completed' && a.result);
  const latestSentReport = clientReports.find((r) => r.status === 'sent');

  const timeline: TimelineItem[] = [];
  
  clientAssessments.forEach(a => {
    timeline.push({
      id: a.id,
      type: 'assessment',
      title: a.assessmentType.name,
      date: a.completedAt || a.sentAt,
      icon: Brain,
      color: 'blue',
      status: a.status === 'completed' ? '已完成' : '待完成',
    });
  });
  
  clientInterviews.forEach(i => {
    timeline.push({
      id: i.id,
      type: 'interview',
      title: `访谈记录`,
      date: i.interviewDate,
      icon: ClipboardList,
      color: 'amber',
      details: `${i.duration}分钟`,
    });
  });
  
  clientReports.forEach(r => {
    timeline.push({
      id: r.id,
      type: 'report',
      title: r.title,
      date: r.updatedAt,
      icon: FileText,
      color: 'purple',
      status: reportStatusConfig[r.status].label,
    });
  });
  
  clientTasks.forEach(t => {
    timeline.push({
      id: t.id,
      type: 'task',
      title: t.title,
      date: t.dueDate,
      icon: Target,
      color: 'green',
      status: t.status === 'completed' ? '已完成' : t.status === 'in_progress' ? '进行中' : '待开始',
    });
  });
  
  timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
        <div className="lg:col-span-1 space-y-6">
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

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">咨询进度</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">测评</span>
                  <Badge variant={clientAssessments.length > 0 ? 'success' : 'default'}>
                    {clientAssessments.filter(a => a.status === 'completed').length}/{clientAssessments.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">访谈</span>
                  <Badge variant={clientInterviews.length > 0 ? 'success' : 'default'}>
                    {clientInterviews.length}次
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">报告</span>
                  <Badge variant={clientReports.length > 0 ? 'success' : 'default'}>
                    {clientReports.length}份
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">任务</span>
                  <Badge variant={completedTasks > 0 ? 'success' : 'default'}>
                    {completedTasks}/{clientTasks.length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
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

          {latestSentReport && latestSentReport.sentSummary && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-800">最新发送摘要</h3>
                  </div>
                  <Badge variant="success">已发送</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-white rounded-xl">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {latestSentReport.sentSummary}
                  </p>
                </div>
                <div className="mt-3 text-xs text-gray-400">
                  发送于 {latestSentReport.sentAt}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-800">咨询时间线</h3>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {timeline.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">暂无咨询记录</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-4">
                    {timeline.slice(0, 8).map((item, index) => {
                      const IconComponent = item.icon;
                      const colorClasses: Record<string, string> = {
                        blue: 'bg-blue-100 text-blue-600',
                        amber: 'bg-amber-100 text-amber-600',
                        purple: 'bg-purple-100 text-purple-600',
                        green: 'bg-green-100 text-green-600',
                      };
                      
                      return (
                        <div key={`${item.type}-${item.id}`} className="relative flex items-start gap-4 pl-12">
                          <div className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center ${colorClasses[item.color]}`}>
                            <IconComponent className="w-3 h-3" />
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-800">{item.title}</p>
                              {item.status && (
                                <Badge size="sm" variant={item.status === '已完成' ? 'success' : 'warning'}>
                                  {item.status}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.date}
                              {item.details && ` · ${item.details}`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {timeline.length > 8 && (
                    <div className="text-center pt-4">
                      <Button variant="ghost" size="sm" onClick={() => navigate('/tracking')}>
                        查看全部记录 <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

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
