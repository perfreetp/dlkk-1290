import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Star, Trash2 } from 'lucide-react';
import { useReportStore } from '../store/useReportStore';
import { useClientStore } from '../store/useClientStore';
import { CareerRecommendation } from '../types';
import { Input, Textarea, Select } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export default function ReportNew() {
  const navigate = useNavigate();
  const { clients } = useClientStore();
  const { addReport, addCareerRecommendation, removeCareerRecommendation } = useReportStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    content: '',
  });

  const [recommendations, setRecommendations] = useState<Omit<CareerRecommendation, 'id'>[]>([]);
  const [newRec, setNewRec] = useState({
    careerName: '',
    matchScore: 80,
    reason: '',
    explorationTasks: [''],
  });

  const handleAddRecommendation = () => {
    if (newRec.careerName && newRec.reason) {
      setRecommendations([...recommendations, { ...newRec }]);
      setNewRec({
        careerName: '',
        matchScore: 80,
        reason: '',
        explorationTasks: [''],
      });
    }
  };

  const handleRemoveRecommendation = (index: number) => {
    setRecommendations(recommendations.filter((_, i) => i !== index));
  };

  const handleAddTask = () => {
    setNewRec({
      ...newRec,
      explorationTasks: [...newRec.explorationTasks, ''],
    });
  };

  const handleRemoveTask = (index: number) => {
    setNewRec({
      ...newRec,
      explorationTasks: newRec.explorationTasks.filter((_, i) => i !== index),
    });
  };

  const handleTaskChange = (index: number, value: string) => {
    const newTasks = [...newRec.explorationTasks];
    newTasks[index] = value;
    setNewRec({ ...newRec, explorationTasks: newTasks });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const filteredRecommendations = recommendations.filter((r) => r.careerName.trim() !== '');
      const filteredTasks = recommendations
        .map((r) => ({
          ...r,
          explorationTasks: r.explorationTasks.filter((t) => t.trim() !== ''),
        }))
        .filter((r) => r.careerName.trim() !== '');

      addReport({
        ...formData,
        careerRecommendations: filteredTasks,
        status: 'draft',
      });

      navigate('/reports');
      setLoading(false);
    }, 500);
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">新建诊断报告</h1>
          <p className="text-gray-500 mt-1">编写诊断报告，推荐职业方向</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
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
                    rows={12}
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
                  {recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-[#f5a623]" />
                          <span className="font-medium text-gray-800">{rec.careerName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveRecommendation(index)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      <Badge variant="success" size="sm">
                        {rec.matchScore}% 匹配
                      </Badge>
                      <p className="text-xs text-gray-600 mt-2">{rec.reason}</p>
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
                          onClick={handleAddTask}
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
                              onChange={(e) => handleTaskChange(index, e.target.value)}
                              placeholder="探索任务..."
                              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                            />
                            {newRec.explorationTasks.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveTask(index)}
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

            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                取消
              </Button>
              <Button type="submit" variant="primary" loading={loading}>
                创建报告
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
