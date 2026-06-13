import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Send, CheckCircle, Clock, AlertCircle, History } from 'lucide-react';
import { useAssessmentStore } from '../store/useAssessmentStore';
import { useClientStore } from '../store/useClientStore';
import { ASSESSMENT_TYPES, AssessmentType, Assessment } from '../types';
import { Card, CardContent, CardHeader } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Select } from '../components/common/Input';
import { Avatar } from '../components/common/Avatar';

const statusConfig = {
  pending: { icon: Clock, color: 'warning', label: '待完成' },
  completed: { icon: CheckCircle, color: 'success', label: '已完成' },
  expired: { icon: AlertCircle, color: 'danger', label: '已过期' },
};

export default function Assessments() {
  const assessments = useAssessmentStore((state) => state.assessments);
  const { clients } = useClientStore();
  const { sendAssessment } = useAssessmentStore();
  const [showSendModal, setShowSendModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const getClient = (clientId: string) => {
    return clients.find((c) => c.id === clientId);
  };

  const handleSendAssessment = () => {
    if (selectedClient && selectedType) {
      const assessmentType = ASSESSMENT_TYPES.find((t) => t.id === selectedType);
      if (assessmentType) {
        sendAssessment(selectedClient, assessmentType);
        setShowSendModal(false);
        setSelectedClient('');
        setSelectedType('');
      }
    }
  };

  const handleViewResult = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setShowResultModal(true);
  };

  const completedAssessments = assessments.filter((a) => a.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">测评中心</h1>
          <p className="text-gray-500 mt-1">管理测评量表，发放和查看测评结果</p>
        </div>
        <Button variant="primary" onClick={() => setShowSendModal(true)}>
          <Send className="w-4 h-4" />
          发放测评
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-800">测评量表库</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ASSESSMENT_TYPES.map((type) => (
                <div key={type.id} className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-medium text-gray-800">{type.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {type.dimensions.slice(0, 3).map((dim) => (
                      <Badge key={dim} size="sm" variant="info">
                        {dim}
                      </Badge>
                    ))}
                    {type.dimensions.length > 3 && (
                      <Badge size="sm" variant="default">
                        +{type.dimensions.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-800">测评记录</h2>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">暂无测评记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assessments.map((assessment) => {
                  const client = getClient(assessment.clientId);
                  const StatusIcon = statusConfig[assessment.status].icon;
                  
                  return (
                    <div
                      key={assessment.id}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar name={client?.name || ''} src={client?.avatar} size="sm" />
                          <div>
                            <p className="font-medium text-sm text-gray-800">
                              {client?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {assessment.assessmentType.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={statusConfig[assessment.status].color as any}
                            size="sm"
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[assessment.status].label}
                          </Badge>
                          {assessment.status === 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewResult(assessment)}
                            >
                              查看结果
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        发放于 {assessment.sentAt}
                        {assessment.completedAt && ` · 完成于 ${assessment.completedAt}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {completedAssessments.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-800">历史对比</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { name: '现实型', 首次: 45, 本次: 50 },
                  { name: '研究型', 首次: 40, 本次: 55 },
                  { name: '艺术型', 首次: 55, 本次: 60 },
                  { name: '社会型', 首次: 50, 本次: 52 },
                  { name: '企业型', 首次: 35, 本次: 48 },
                  { name: '常规型', 首次: 42, 本次: 45 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="首次" stroke="#94a3b8" strokeWidth={2} />
                  <Line type="monotone" dataKey="本次" stroke="#1e3a5f" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        title="发放测评"
        size="md"
      >
        <div className="p-6 space-y-4">
          <Select
            label="选择来访者"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            options={[
              { value: '', label: '请选择来访者' },
              ...clients.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
          <Select
            label="选择测评量表"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={[
              { value: '', label: '请选择测评' },
              ...ASSESSMENT_TYPES.map((t) => ({ value: t.id, label: t.name })),
            ]}
          />
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowSendModal(false)}>
              取消
            </Button>
            <Button
              variant="primary"
              onClick={handleSendAssessment}
              disabled={!selectedClient || !selectedType}
            >
              发放测评
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        title="测评结果"
        size="lg"
      >
        {selectedAssessment && selectedAssessment.result && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-72">
                <h4 className="font-medium text-gray-800 mb-4">测评雷达图</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={selectedAssessment.result.scores}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" />
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
                <h4 className="font-medium text-gray-800 mb-4">详细解读</h4>
                <div className="space-y-3">
                  {selectedAssessment.result.scores.map((score) => (
                    <div key={score.dimension} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{score.dimension}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1e3a5f] rounded-full"
                            style={{ width: `${score.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-800 w-8">
                          {score.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-800 mb-2">综合解读</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {selectedAssessment.result.interpretation}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
