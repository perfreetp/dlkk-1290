import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Send, Edit, Eye, Trash2, Star } from 'lucide-react';
import { useReportStore } from '../store/useReportStore';
import { useClientStore } from '../store/useClientStore';
import { Report } from '../types';
import { Card, CardContent, CardHeader } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { Modal } from '../components/common/Modal';

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
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const getClient = (clientId: string) => {
    return clients.find((c) => c.id === clientId);
  };

  const handlePreview = (report: Report) => {
    setSelectedReport(report);
    setShowPreviewModal(true);
  };

  const handleSend = (reportId: string) => {
    if (window.confirm('确定要发送此报告给来访者吗？')) {
      sendReport(reportId);
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
                          更新于 {report.updatedAt}
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
                          {!isDraft && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSend(report.id)}
                            >
                              <Send className="w-4 h-4" />
                              发送
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(report.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
    </div>
  );
}
