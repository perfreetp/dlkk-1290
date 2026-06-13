import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, ThumbsUp, AlertTriangle } from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';
import { useClientStore } from '../store/useClientStore';
import { useClientStore as updateClientStage } from '../store/useClientStore';
import { ConfusionType, CONFUSION_TYPE_LABELS } from '../types';
import { Input, Select, Textarea } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export default function InterviewNew() {
  const navigate = useNavigate();
  const { clients } = useClientStore();
  const { addInterview } = useInterviewStore();
  const { updateClientStage } = useClientStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    clientId: '',
    interviewDate: new Date().toISOString().split('T')[0],
    duration: 60,
    summary: '',
    confusionTypes: [] as ConfusionType[],
    strengths: [''],
    limitations: [''],
    nextSteps: '',
  });

  const handleAddStrength = () => {
    setFormData({ ...formData, strengths: [...formData.strengths, ''] });
  };

  const handleAddLimitation = () => {
    setFormData({ ...formData, limitations: [...formData.limitations, ''] });
  };

  const handleRemoveStrength = (index: number) => {
    setFormData({
      ...formData,
      strengths: formData.strengths.filter((_, i) => i !== index),
    });
  };

  const handleRemoveLimitation = (index: number) => {
    setFormData({
      ...formData,
      limitations: formData.limitations.filter((_, i) => i !== index),
    });
  };

  const handleStrengthChange = (index: number, value: string) => {
    const newStrengths = [...formData.strengths];
    newStrengths[index] = value;
    setFormData({ ...formData, strengths: newStrengths });
  };

  const handleLimitationChange = (index: number, value: string) => {
    const newLimitations = [...formData.limitations];
    newLimitations[index] = value;
    setFormData({ ...formData, limitations: newLimitations });
  };

  const toggleConfusionType = (type: ConfusionType) => {
    if (formData.confusionTypes.includes(type)) {
      setFormData({
        ...formData,
        confusionTypes: formData.confusionTypes.filter((t) => t !== type),
      });
    } else {
      setFormData({
        ...formData,
        confusionTypes: [...formData.confusionTypes, type],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const filteredStrengths = formData.strengths.filter((s) => s.trim() !== '');
      const filteredLimitations = formData.limitations.filter((l) => l.trim() !== '');

      addInterview({
        ...formData,
        strengths: filteredStrengths,
        limitations: filteredLimitations,
      });

      if (formData.clientId) {
        updateClientStage(formData.clientId, 'interview');
      }

      navigate('/interviews');
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
          <h1 className="text-2xl font-bold text-gray-800">新建访谈记录</h1>
          <p className="text-gray-500 mt-1">记录访谈要点，标注困惑类型和优劣势</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  label="访谈日期"
                  type="date"
                  value={formData.interviewDate}
                  onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                  required
                />
                <Select
                  label="访谈时长"
                  value={String(formData.duration)}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  options={[
                    { value: '30', label: '30分钟' },
                    { value: '45', label: '45分钟' },
                    { value: '60', label: '60分钟' },
                    { value: '90', label: '90分钟' },
                    { value: '120', label: '120分钟' },
                  ]}
                />
              </div>

              <Textarea
                label="访谈摘要"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="记录本次访谈的主要内容和发现..."
                rows={6}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  职业困惑类型
                </label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(CONFUSION_TYPE_LABELS) as ConfusionType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleConfusionType(type)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        formData.confusionTypes.includes(type)
                          ? 'bg-[#f5a623] text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {CONFUSION_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <ThumbsUp className="w-4 h-4 text-[#10b981]" />
                      优势
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAddStrength}
                    >
                      <Plus className="w-4 h-4" />
                      添加
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={strength}
                          onChange={(e) => handleStrengthChange(index, e.target.value)}
                          placeholder="输入优势..."
                          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981]"
                        />
                        {formData.strengths.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStrength(index)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                      限制因素
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAddLimitation}
                    >
                      <Plus className="w-4 h-4" />
                      添加
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={limitation}
                          onChange={(e) => handleLimitationChange(index, e.target.value)}
                          placeholder="输入限制因素..."
                          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b]"
                        />
                        {formData.limitations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLimitation(index)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Textarea
                label="下一步计划"
                value={formData.nextSteps}
                onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                placeholder="记录后续的咨询计划和行动项..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                取消
              </Button>
              <Button type="submit" variant="primary" loading={loading}>
                保存记录
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
