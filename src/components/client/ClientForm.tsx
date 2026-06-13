import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientStore } from '../../store/useClientStore';
import { Client, Gender, ClientStage } from '../../types';
import { Input, Select, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { Card, CardContent } from '../common/Card';

interface ClientFormProps {
  initialData?: Client;
  mode: 'create' | 'edit';
}

export function ClientForm({ initialData, mode }: ClientFormProps) {
  const navigate = useNavigate();
  const { addClient, updateClient } = useClientStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    gender: initialData?.gender || 'male' as Gender,
    age: initialData?.age || 25,
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    occupation: initialData?.occupation || '',
    education: initialData?.education || '',
    consultationBackground: initialData?.consultationBackground || '',
    currentStage: initialData?.currentStage || 'initial_assessment' as ClientStage,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        gender: initialData.gender || 'male',
        age: initialData.age || 25,
        phone: initialData.phone || '',
        email: initialData.email || '',
        occupation: initialData.occupation || '',
        education: initialData.education || '',
        consultationBackground: initialData.consultationBackground || '',
        currentStage: initialData.currentStage || 'initial_assessment',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (mode === 'create') {
        addClient(formData);
        navigate('/clients');
      } else if (initialData) {
        updateClient(initialData.id, formData);
        navigate(`/clients/${initialData.id}`);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="姓名"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入来访者姓名"
                required
              />
              <Select
                label="性别"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                options={[
                  { value: 'male', label: '男' },
                  { value: 'female', label: '女' },
                  { value: 'other', label: '其他' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="年龄"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                min={18}
                max={65}
                required
              />
              <Input
                label="联系电话"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="138xxxxx"
                required
              />
            </div>

            <Input
              label="电子邮箱"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="当前职业"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="软件工程师"
                required
              />
              <Select
                label="学历"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                options={[
                  { value: '高中', label: '高中' },
                  { value: '专科', label: '专科' },
                  { value: '本科', label: '本科' },
                  { value: '硕士', label: '硕士' },
                  { value: '博士', label: '博士' },
                ]}
              />
            </div>

            <Textarea
              label="咨询背景"
              value={formData.consultationBackground}
              onChange={(e) => setFormData({ ...formData, consultationBackground: e.target.value })}
              placeholder="请描述来访者的咨询背景和主要诉求..."
              rows={4}
            />

            {mode === 'edit' && (
              <Select
                label="当前阶段"
                value={formData.currentStage}
                onChange={(e) => setFormData({ ...formData, currentStage: e.target.value as ClientStage })}
                options={[
                  { value: 'initial_assessment', label: '初始评估' },
                  { value: 'assessment', label: '测评中' },
                  { value: 'interview', label: '访谈中' },
                  { value: 'report_writing', label: '报告撰写' },
                  { value: 'follow_up', label: '跟进中' },
                ]}
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              取消
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              {mode === 'create' ? '创建档案' : '保存修改'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
