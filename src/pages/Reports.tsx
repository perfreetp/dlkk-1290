import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, Send, Edit, Eye, Trash2, Star, AlertCircle } from 'lucide-react';
import { useReportStore } from '../store/useReportStore';
import { useClientStore } from '../store/useClientStore';
import { Report } from '../types';
import { Card, CardContent, CardHeader } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { Modal } from '../components/common/Modal';
import { Textarea } from '../components/common/Input';

const statusConfig = {
  draft: { label: '草稿', variant: 'warning' as const },
  completed: { label: '已完成', variant: 'info' as const },
  sent: { label: '已发送', variant: 'success' as const },
};

export default function Reports() {
  const reports = useReportStore((state) => state.reports);
  const { clients } = useClientStore();
  const { sendReport, deleteReport } = useReportStore();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [sendMessage, setSendMessage] = useState('');

  const getClient = (clientId: string) => {
    return clients.find((c) => c.id === clientId);
  };

  const handlePreview = (report: Report) => {
    setSelectedReport(report);
    setShowPreviewModal(true);
  };

  const handleEdit = (report: Report) => {
    window.location.href = `/reports/${report.id}`;
  };

  const handleSendClick = (report: Report) => {
    setSelectedReport(report);
    setShowSendModal(true);
    setSendMessage(`您好，您的职业发展诊断报告已完成。报告中包含了对您职业兴趣、性格特点的分析，以及适合您的职业方向推荐。请查收。`);
  };

  const handleSendConfirm = () => {
    if (selectedReport && selectedReport.status !== 'draft') {
      sendReport(selectedReport.id, sendMessage);
      setShowSendModal(false);
      setSelectedReport(null);
      setSendMessage('');
    }
  };

  const handleDelete = (reportId: string) => {
    if (window.confirm('确定要删除此报告吗？此操作不可撤销。')) {
      deleteReport(reportId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">诊断报告</h1>
          <p className="text-gray-500 mt-1">生成和管理诊断报告，推荐职业方向</p>
        </div>
        <Link to="/reports/new">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            新建报告
          </Button>
        </Link>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">暂无诊断报告</h3>
              <p className="text-sm text-gray-500 mb-4">创建第一个诊断报告开始您的咨询工作</p>
              <Link to="/reports/new">
                <Button variant="primary">
                  <Plus className="w-4 h-4" />
                  创建报告
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report) => {
            const client = getClient(report.clientId);
            const isDraft = report.status === 'draft';
            const canSend = report.status === 'completed';

            return (
              <Card key={report.id}>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar name={client?.name || ''} src={client?.avatar} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{report.title}</h3>
                          <p className="text-sm text-gray-500">{client?.name}</p>
                        </div>
                        <Badge variant={statusConfig[report.status].variant}>
                          {statusConfig[report.status].label}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                        {report.content.substring(0, 150)}...
                      </p>

                      {report.careerRecommendations.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-500 mb-2">推荐职业方向</p>
                          <div className="flex flex-wrap gap-2">
                            {report.careerRecommendations.slice(0, 3).map((rec) => (
                              <div
                                key={rec.id}
                                className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg"
                              >
                                <Star className="w-3 h-3 text-[#f5a623]" />
                                <span className="text-xs font-medium text-gray-700">
                                  {rec.careerName}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {rec.matchScore}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-400">
                          {report.sentAt ? `发送于 ${report.sentAt}` : `更新于 ${report.updatedAt}`}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(report)}
                          >
                            <Eye className="w-4 h-4" />
                            预览
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(report)}
                          >
                            <Edit className="w-4 h-4" />
                            编辑
                          </Button>
                          {canSend && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendClick(report)}
                            >
                              <Send className="w-4 h-4" />
                              发送
                            </Button>
                          )}
                          {isDraft && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(report.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="报告预览"
        size="lg"
      >
        {selectedReport && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">{selectedReport.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {getClient(selectedReport.clientId)?.name} · {selectedReport.createdAt}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={statusConfig[selectedReport.status].variant}>
                  {statusConfig[selectedReport.status].label}
                </Badge>
                {selectedReport.sentAt && (
                  <span className="text-xs text-gray-400">发送于 {selectedReport.sentAt}</span>
                )}
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {selectedReport.content}
              </div>
            </div>
            {selectedReport.careerRecommendations.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">推荐职业方向</h3>
                <div className="space-y-3">
                  {selectedReport.careerRecommendations.map((rec, index) => (
                    <div key={rec.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#1e3a5f] text-white text-xs flex items-center justify-center font-medium">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-800">{rec.careerName}</span>
                        </div>
                        <Badge variant="success">{rec.matchScore}% 匹配</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                      <div className="flex flex-wrap gap-2">
                        {rec.explorationTasks.map((task, i) => (
                          <Badge key={i} size="sm" variant="info">
                            {task}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        title="发送报告摘要"
        size="md"
      >
        {selectedReport && (
          <div className="p-6">
            {selectedReport.status === 'draft' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">无法发送草稿报告</h3>
                <p className="text-sm text-gray-500 mb-4">
                  请先将报告标记为"已完成"后再发送
                </p>
                <Button variant="outline" onClick={() => setShowSendModal(false)}>
                  知道了
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">发送给</p>
                  <p className="font-medium text-gray-800">
                    {getClient(selectedReport.clientId)?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {getClient(selectedReport.clientId)?.email}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    发送消息
                  </label>
                  <Textarea
                    value={sendMessage}
                    onChange={(e) => setSendMessage(e.target.value)}
                    rows={5}
                    placeholder="输入要发送给来访者的消息..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <Button variant="ghost" onClick={() => setShowSendModal(false)}>
                    取消
                  </Button>
                  <Button variant="primary" onClick={handleSendConfirm}>
                    <Send className="w-4 h-4" />
                    确认发送
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
