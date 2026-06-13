import { useState } from 'react';
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
  ChevronDown,
  ChevronUp,
  ChevronRight,
  AlertCircle,
  Lightbulb
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
import { Modal } from '../components/common/Modal';
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
  type: 'assessment' | 'interview' | 'report' | 'report_sent' | 'task';
  title: string;
  date: string;
  icon: any;
  color: string;
  status?: string;
  details?: string;
  expandedContent?: React.ReactNode;
}

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, deleteClient } = useClientStore();
  const assessments = useAssessmentStore((state) => state.assessments);
  const interviews = useInterviewStore((state) => state.interviews);
  const reports = useReportStore((state) => state.reports);
  const tasks = useTaskStore((state) => state.tasks);
  
  const [expandedTimelineId, setExpandedTimelineId] = useState<string | null>(null);
  const [showSendHistoryModal, setShowSendHistoryModal] = useState(false);
  const [selectedSendRecord, setSelectedSendRecord] = useState<any>(null);

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
  const pendingTasks = clientTasks.filter((t) => t.status !== 'completed');

  const latestReport = clientReports[0];
  const latestAssessment = clientAssessments.find((a) => a.status === 'completed' && a.result);
  const sentReports = clientReports.filter((r) => r.status === 'sent' && r.sentAt);
  const latestSentReport = sentReports[0];

  const timeline: TimelineItem[] = [];
  
  clientAssessments.forEach(a => {
    const completedCount = a.status === 'completed' ? 1 : 0;
    timeline.push({
      id: a.id,
      type: 'assessment',
      title: a.assessmentType.name,
      date: a.completedAt || a.sentAt,
      icon: Brain,
      color: 'blue',
      status: a.status === 'completed' ? '已完成' : '待完成',
      details: a.result ? `${a.result.scores.length}个维度` : undefined,
      expandedContent: a.result ? (
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600 mb-3">{a.result.interpretation}</p>
          <div className="space-y-2">
            {a.result.scores.map((score) => (
              <div key={score.dimension} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{score.dimension}</span>
                <span className="font-medium text-gray-800">{score.score}分</span>
              </div>
            ))}
          </div>
        </div>
      ) : undefined,
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
      expandedContent: (
        <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-xs text-gray-500 mb-1">困惑类型</p>
            <div className="flex flex-wrap gap-1">
              {i.confusionTypes.map((type) => (
                <Badge key={type} size="sm" variant="warning">{type}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">访谈摘要</p>
            <p className="text-sm text-gray-700">{i.summary}</p>
          </div>
          {i.strengths.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">优势</p>
              <div className="flex flex-wrap gap-1">
                {i.strengths.map((s, idx) => (
                  <Badge key={idx} size="sm" variant="success">{s}</Badge>
                ))}
              </div>
            </div>
          )}
          {i.limitations.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">限制因素</p>
              <div className="flex flex-wrap gap-1">
                {i.limitations.map((l, idx) => (
                  <Badge key={idx} size="sm" variant="warning">{l}</Badge>
                ))}
              </div>
            </div>
          )}
          {i.nextSteps && (
            <div>
              <p className="text-xs text-gray-500 mb-1">下一步计划</p>
              <p className="text-sm text-gray-700">{i.nextSteps}</p>
            </div>
          )}
        </div>
      ),
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
      details: `${r.careerRecommendations.length}个推荐方向`,
      expandedContent: (
        <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{r.content}</p>
          {r.careerRecommendations.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">职业推荐</p>
              <div className="space-y-2">
                {r.careerRecommendations.map((rec, idx) => (
                  <div key={idx} className="p-2 bg-white rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-800">{rec.careerName}</span>
                      <Badge size="sm" variant="success">{rec.matchScore}%</Badge>
                    </div>
                    <p className="text-xs text-gray-500">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    });
  });
  
  sentReports.forEach(r => {
    timeline.push({
      id: `${r.id}-sent`,
      type: 'report_sent',
      title: `发送摘要给来访者`,
      date: r.sentAt || '',
      icon: Send,
      color: 'green',
      status: '已发送',
      details: r.sentSummary?.substring(0, 30) + '...',
      expandedContent: r.sentSummary ? (
        <div className="p-4 bg-green-50 rounded-xl">
          <p className="text-xs text-gray-500 mb-2">发送内容</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{r.sentSummary}</p>
        </div>
      ) : undefined,
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
      expandedContent: (
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-700">{t.description}</p>
        </div>
      ),
    });
  });
  
  timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getNextSteps = () => {
    const steps: { priority: number; action: string; description: string }[] = [];
    
    if (clientAssessments.filter(a => a.status === 'completed').length === 0) {
      steps.push({ priority: 1, action: '发放测评', description: '建议先进行职业兴趣测评，了解来访者职业倾向' });
    }
    
    if (clientInterviews.length === 0) {
      steps.push({ priority: 2, action: '安排访谈', description: '进行初次访谈，了解来访者职业困惑和诉求' });
    }
    
    if (latestReport?.status === 'draft') {
      steps.push({ priority: 3, action: '完成报告', description: '继续撰写诊断报告内容' });
    }
    
    if (latestReport?.status === 'completed' && !latestSentReport) {
      steps.push({ priority: 4, action: '发送报告', description: '将完成的报告发送给来访者' });
    }
    
    if (pendingTasks.length > 0) {
      steps.push({ priority: 5, action: '跟进任务', description: `有${pendingTasks.length}个任务待完成，记得跟进` });
    }
    
    if (steps.length === 0) {
      steps.push({ priority: 0, action: '持续跟进', description: '当前阶段任务已完成，保持定期跟进' });
    }
    
    return steps.sort((a, b) => a.priority - b.priority);
  };

  const nextSteps = getNextSteps();

  const handleDelete = () => {
    if (window.confirm('确定要删除此档案吗？此操作不可撤销。')) {
      deleteClient(client.id);
      navigate('/clients');
    }
  };

  const toggleTimelineItem = (itemId: string) => {
    setExpandedTimelineId(expandedTimelineId === itemId ? null : itemId);
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

      <Card className="border-l-4 border-l-[#f5a623]">
        <CardHeader className="bg-amber-50/50">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#f5a623]" />
            <h3 className="font-semibold text-gray-800">咨询阶段复盘</h3>
            <Badge variant={stageBadgeVariant[client.currentStage]}>
              {CLIENT_STAGE_LABELS[client.currentStage]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">已完成测评</span>
              </div>
              <p className="text-xl font-bold text-gray-800">
                {clientAssessments.filter(a => a.status === 'completed').length} / {clientAssessments.length}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-gray-600">访谈次数</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{clientInterviews.length}次</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">报告状态</span>
              </div>
              <p className="text-sm font-bold text-gray-800">
                {latestReport ? reportStatusConfig[latestReport.status].label : '暂无报告'}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">待完成任务</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{pendingTasks.length}个</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#f5a623]" />
              下一步建议
            </p>
            <div className="space-y-2">
              {nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#f5a623] text-white text-xs flex items-center justify-center font-medium flex-shrink-0">
                    {step.priority}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{step.action}</p>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent>
              <div className="text-center">
                <Avatar src={client.avatar} name={client.name} size="lg" />
                <h2 className="text-xl font-bold text-gray-800 mt-4">{client.name}</h2>
                <p className="text-gray-500">{client.occupation}</p>
                <Badge variant={stageBadgeVariant[client.currentStage]} className="mt-3">
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
                  <Button variant="ghost" size="sm" onClick={() => navigate('/assessments')}>
                    查看全部测评
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {sentReports.length > 0 && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-800">发送记录</h3>
                    <Badge variant="success">{sentReports.length}次</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowSendHistoryModal(true)}>
                    查看全部 <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {latestSentReport && (
                  <div className="p-3 bg-white rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-500">最近发送于 {latestSentReport.sentAt}</p>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{latestSentReport.sentSummary}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">完整咨询进展</h3>
                <Badge>{timeline.length}条记录</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {timeline.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">暂无咨询记录</p>
                </div>
              ) : (
                <div className="relative max-h-[600px] overflow-y-auto">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-2">
                    {timeline.map((item) => {
                      const IconComponent = item.icon;
                      const colorClasses: Record<string, string> = {
                        blue: 'bg-blue-100 text-blue-600',
                        amber: 'bg-amber-100 text-amber-600',
                        purple: 'bg-purple-100 text-purple-600',
                        green: 'bg-green-100 text-green-600',
                      };
                      const isExpanded = expandedTimelineId === item.id;
                      
                      return (
                        <div key={`${item.type}-${item.id}`} className="relative">
                          <button
                            onClick={() => toggleTimelineItem(`${item.type}-${item.id}`)}
                            className="relative flex items-start gap-4 pl-12 w-full text-left hover:bg-gray-50 rounded-xl p-2 transition-colors"
                          >
                            <div className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center ${colorClasses[item.color]}`}>
                              <IconComponent className="w-3 h-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-800">{item.title}</p>
                                <div className="flex items-center gap-2">
                                  {item.status && (
                                    <Badge size="sm" variant={item.status === '已完成' || item.status === '已发送' ? 'success' : 'warning'}>
                                      {item.status}
                                    </Badge>
                                  )}
                                  {item.expandedContent && (
                                    isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {item.date}
                                {item.details && ` · ${item.details}`}
                              </p>
                            </div>
                          </button>
                          {isExpanded && item.expandedContent && (
                            <div className="ml-12 mt-2 animate-in">
                              {item.expandedContent}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showSendHistoryModal}
        onClose={() => setShowSendHistoryModal(false)}
        title="发送历史记录"
        size="lg"
      >
        <div className="p-6">
          {sentReports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">暂无发送记录</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sentReports.map((report) => (
                <div key={report.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{report.title}</p>
                      <p className="text-xs text-gray-500">发送于 {report.sentAt}</p>
                    </div>
                  </div>
                  {report.sentSummary && (
                    <div className="mt-2 p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{report.sentSummary}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
