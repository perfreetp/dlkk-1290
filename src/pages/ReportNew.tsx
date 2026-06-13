import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, Star, Trash2, Save, CheckCircle, Edit2, Eye } from 'lucide-react';
import { useReportStore } from '../store/useReportStore';
import { useClientStore } from '../store/useClientStore';
import { Report, CareerRecommendation } from '../types';
import { Input, Textarea, Select } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

interface EditableRecommendation extends Omit<CareerRecommendation, 'id'> {
  id: string;
  isNew?: boolean;
  isEditing?: boolean;
}

export default function ReportNew() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { reports, addReport, updateReport } = useReportStore();
  const { clients } = useClientStore();
  const [loading, setLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewReport, setPreviewReport] = useState<Report | null>(null);

  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    content: '',
  });

  const [recommendations, setRecommendations] = useState<EditableRecommendation[]>([]);
  const [newRec, setNewRec] = useState({
    careerName: '',
    matchScore: 80,
    reason: '',
    explorationTasks: [''],
  });

  const existingReport = id ? reports.find((r) => r.id === id) : null;
  const isEditMode = Boolean(id && existingReport);

  useEffect(() => {
    if (existingReport) {
      setFormData({
        clientId: existingReport.clientId,
        title: existingReport.title,
        content: existingReport.content,
      });
      setRecommendations(
        existingReport.careerRecommendations.map((rec) => ({
          ...rec,
          isNew: false,
          isEditing: false,
        }))
      );
    }
  }, [existingReport]);

  const handleAddRecommendation = () => {
    if (newRec.careerName && newRec.reason) {
      const newRecommendation: EditableRecommendation = {
        id: `new-${Date.now()}`,
        careerName: newRec.careerName,
        matchScore: newRec.matchScore,
        reason: newRec.reason,
        explorationTasks: newRec.explorationTasks.filter(t => t.trim() !== ''),
        isNew: true,
        isEditing: false,
      };
      setRecommendations([...recommendations, newRecommendation]);
      setNewRec({
        careerName: '',
        matchScore: 80,
        reason: '',
        explorationTasks: [''],
      });
    }
  };

  const handleRemoveRecommendation = (id: string) => {
    setRecommendations(recommendations.filter((r) => r.id !== id));
  };

  const handleEditRecommendation = (id: string) => {
    setRecommendations(recommendations.map(r => 
      r.id === id ? { ...r, isEditing: true } : r
    ));
  };

  const handleCancelEdit = (id: string) => {
    if (recommendations.find(r => r.id === id)?.isNew) {
      handleRemoveRecommendation(id);
    } else {
      const original = existingReport?.careerRecommendations.find(r => r.id === id);
      if (original) {
        setRecommendations(recommendations.map(r => 
          r.id === id ? { ...original, isNew: false, isEditing: false } : r
        ));
      } else {
        setRecommendations(recommendations.map(r => 
          r.id === id ? { ...r, isEditing: false } : r
        ));
      }
    }
  };

  const handleUpdateRecommendation = (id: string, field: keyof CareerRecommendation, value: any) => {
    setRecommendations(recommendations.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const handleAddTask = (recId: string) => {
    setRecommendations(recommendations.map(r => 
      r.id === recId ? { ...r, explorationTasks: [...r.explorationTasks, ''] } : r
    ));
  };

  const handleRemoveTask = (recId: string, taskIndex: number) => {
    setRecommendations(recommendations.map(r => 
      r.id === recId ? { ...r, explorationTasks: r.explorationTasks.filter((_, i) => i !== taskIndex) } : r
    ));
  };

  const handleTaskChange = (recId: string, taskIndex: number, value: string) => {
    setRecommendations(recommendations.map(r => 
      r.id === recId ? { ...r, explorationTasks: r.explorationTasks.map((t, i) => i === taskIndex ? value : t) } : r
    ));
  };

  const handleAddNewTask = () => {
    setNewRec({
      ...newRec,
      explorationTasks: [...newRec.explorationTasks, ''],
    });
  };

  const handleRemoveNewTask = (index: number) => {
    setNewRec({
      ...newRec,
      explorationTasks: newRec.explorationTasks.filter((_, i) => i !== index),
    });
  };

  const handleNewTaskChange = (index: number, value: string) => {
    setNewRec({
      ...newRec,
      explorationTasks: newRec.explorationTasks.map((t, i) => i === index ? value : t),
    });
  };

  const handleSave = (status: 'draft' | 'completed') => {
    setLoading(true);

    setTimeout(() => {
      const filteredRecommendations = recommendations
        .filter(r => r.careerName.trim() !== '')
        .map((rec, index) => ({
          careerName: rec.careerName,
          matchScore: rec.matchScore,
          reason: rec.reason,
          explorationTasks: rec.explorationTasks.filter(t => t.trim() !== ''),
          id: rec.isNew ? `cr${Date.now()}-${index}` : rec.id,
        }));

      if (isEditMode && existingReport) {
        updateReport(existingReport.id, {
          clientId: formData.clientId,
          title: formData.title,
          content: formData.content,
          careerRecommendations: filteredRecommendations,
          status,
        });
        const updatedReport = useReportStore.getState().reports.find(r => r.id === existingReport.id);
        if (updatedReport) {
          setPreviewReport(updatedReport);
        }
      } else {
        const newReportId = addReport({
          clientId: formData.clientId,
          title: formData.title,
          content: formData.content,
          careerRecommendations: filteredRecommendations,
          status,
        });
        const savedReport = useReportStore.getState().reports.find(r => r.id === newReportId);
        if (savedReport) {
          setPreviewReport(savedReport);
        }
      }

      setLoading(false);
      setShowPreviewModal(true);
    }, 500);
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setPreviewReport(null);
    navigate('/reports');
  };

  const handleBackToEdit = () => {
    setShowPreviewModal(false);
    setPreviewReport(null);
  };

  const getClient = (clientId: string) => {
    return clients.find((c) => c.id === clientId);
  };

  const statusConfig = {
    draft: { label: '草稿', variant: 'warning' as const },
    completed: { label: '已完成', variant: 'info' as const },
    sent: { label: '已发送', variant: 'success' as const },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? '编辑诊断报告' : '新建诊断报告'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditMode ? '修改诊断报告内容' : '编写诊断报告，推荐职业方向'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => handleSave('draft')} loading={loading}>
            <Save className="w-4 h-4" />
            保存草稿
          </Button>
          <Button variant="primary" onClick={() => handleSave('completed')} loading={loading}>
            <CheckCircle className="w-4 h-4" />
            标记完成
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent>
              <div className="space-y-6">
                <Select
                  label="选择来访者"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  options={[
                    { value: '', label: '请选择来访者' },
                    ...clients.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  required
                />

                <Input
                  label="报告标题"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例如：张明职业发展诊断报告"
                  required
                />

                <Textarea
                  label="报告内容"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="编写详细的诊断报告内容..."
                  rows={15}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent>
              <h3 className="font-semibold text-gray-800 mb-4">职业推荐</h3>

              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="p-3 bg-gray-50 rounded-xl">
                    {rec.isEditing ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-blue-600 font-medium">编辑中</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleCancelEdit(rec.id)}
                              className="p-1 hover:bg-gray-200 rounded text-xs text-gray-500"
                            >
                              取消
                            </button>
                          </div>
                        </div>
                        <Input
                          label="职业名称"
                          value={rec.careerName}
                          onChange={(e) => handleUpdateRecommendation(rec.id, 'careerName', e.target.value)}
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            匹配度: {rec.matchScore}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={rec.matchScore}
                            onChange={(e) => handleUpdateRecommendation(rec.id, 'matchScore', parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <Textarea
                          label="推荐理由"
                          value={rec.reason}
                          onChange={(e) => handleUpdateRecommendation(rec.id, 'reason', e.target.value)}
                          rows={2}
                        />
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">探索任务</label>
                            <Button type="button" variant="ghost" size="sm" onClick={() => handleAddTask(rec.id)}>
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {rec.explorationTasks.map((task, taskIndex) => (
                              <div key={taskIndex} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={task}
                                  onChange={(e) => handleTaskChange(rec.id, taskIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                />
                                {rec.explorationTasks.length > 1 && (
                                  <button
                                    onClick={() => handleRemoveTask(rec.id, taskIndex)}
                                    className="p-2 hover:bg-gray-200 rounded-lg"
                                  >
                                    <X className="w-4 h-4 text-gray-400" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-[#f5a623]" />
                            <span className="font-medium text-gray-800">{rec.careerName}</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditRecommendation(rec.id)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Edit2 className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => handleRemoveRecommendation(rec.id)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Trash2 className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                        <Badge variant="success" size="sm">
                          {rec.matchScore}% 匹配
                        </Badge>
                        <p className="text-xs text-gray-600 mt-2">{rec.reason}</p>
                        {rec.explorationTasks.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {rec.explorationTasks.map((task, i) => (
                              <Badge key={i} size="sm" variant="info">
                                {task}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 border-2 border-dashed border-gray-200 rounded-xl">
                <h4 className="font-medium text-sm text-gray-700 mb-3">添加新推荐</h4>
                
                <div className="space-y-3">
                  <Input
                    label="职业名称"
                    value={newRec.careerName}
                    onChange={(e) => setNewRec({ ...newRec, careerName: e.target.value })}
                    placeholder="例如：产品经理"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      匹配度: {newRec.matchScore}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={newRec.matchScore}
                      onChange={(e) => setNewRec({ ...newRec, matchScore: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <Textarea
                    label="推荐理由"
                    value={newRec.reason}
                    onChange={(e) => setNewRec({ ...newRec, reason: e.target.value })}
                    placeholder="为什么推荐这个职业..."
                    rows={2}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">探索任务</label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleAddNewTask}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {newRec.explorationTasks.map((task, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={task}
                            onChange={(e) => handleNewTaskChange(index, e.target.value)}
                            placeholder="探索任务..."
                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                          />
                          {newRec.explorationTasks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveNewTask(index)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4 text-gray-400" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddRecommendation}
                    disabled={!newRec.careerName}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4" />
                    添加推荐
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showPreviewModal}
        onClose={handleClosePreview}
        title="报告预览"
        size="lg"
      >
        {previewReport && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">{previewReport.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {getClient(previewReport.clientId)?.name} · {previewReport.createdAt}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={statusConfig[previewReport.status].variant}>
                  {statusConfig[previewReport.status].label}
                </Badge>
                {previewReport.sentAt && (
                  <span className="text-xs text-gray-400">发送于 {previewReport.sentAt}</span>
                )}
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {previewReport.content}
              </div>
            </div>
            {previewReport.careerRecommendations.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">推荐职业方向</h3>
                <div className="space-y-3">
                  {previewReport.careerRecommendations.map((rec, index) => (
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
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={handleBackToEdit}>
                返回编辑
              </Button>
              <Button variant="primary" onClick={handleClosePreview}>
                完成
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
