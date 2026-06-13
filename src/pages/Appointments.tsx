import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Video, X } from 'lucide-react';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { useClientStore } from '../store/useClientStore';
import { Appointment } from '../types';
import { Card, CardContent } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { Modal } from '../components/common/Modal';
import { Input, Select, Textarea } from '../components/common/Input';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function Appointments() {
  const appointments = useAppointmentStore((state) => state.appointments);
  const { clients } = useClientStore();
  const { addAppointment, deleteAppointment } = useAppointmentStore();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    clientId: '',
    scheduledAt: '',
    time: '10:00',
    duration: 60,
    method: 'offline' as 'offline' | 'online',
    notes: '',
  });

  const getClient = (clientId: string) => {
    return clients.find((c) => c.id === clientId);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfWeek = monthStart.getDay();
  const paddingDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter((a) => a.scheduledAt.startsWith(dateStr));
  };

  const selectedDateAppointments = selectedDate
    ? getAppointmentsForDay(selectedDate)
    : [];

  const today = new Date();

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddAppointment = () => {
    if (formData.clientId && formData.scheduledAt && formData.time) {
      setLoading(true);
      setTimeout(() => {
        const scheduledAt = `${formData.scheduledAt} ${formData.time}`;
        addAppointment({
          clientId: formData.clientId,
          scheduledAt,
          duration: formData.duration,
          method: formData.method,
          notes: formData.notes,
          status: 'scheduled',
        });
        setShowAddModal(false);
        setFormData({
          clientId: '',
          scheduledAt: '',
          time: '10:00',
          duration: 60,
          method: 'offline',
          notes: '',
        });
        setLoading(false);
      }, 500);
    }
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('确定要删除此预约吗？')) {
      deleteAppointment(id);
    }
  };

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">预约管理</h1>
          <p className="text-gray-500 mt-1">管理来访者预约日程</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          新建预约
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                {format(currentMonth, 'yyyy年 MMMM', { locale: zhCN })}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: paddingDays }).map((_, i) => (
                <div key={`padding-${i}`} className="aspect-square" />
              ))}
              {daysInMonth.map((day) => {
                const dayAppointments = getAppointmentsForDay(day);
                const isToday = isSameDay(day, today);
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    className={`
                      aspect-square p-1 rounded-xl transition-all relative
                      ${isToday ? 'bg-[#1e3a5f] text-white' : ''}
                      ${isSelected && !isToday ? 'bg-[#1e3a5f]/10 ring-2 ring-[#1e3a5f]' : ''}
                      ${!isToday && !isSelected ? 'hover:bg-gray-100' : ''}
                    `}
                  >
                    <span className={`text-sm ${isToday ? 'font-bold' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {dayAppointments.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayAppointments.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isToday ? 'bg-white' : 'bg-[#f5a623]'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="font-semibold text-gray-800 mb-4">
              {selectedDate
                ? format(selectedDate, 'MM月dd日', { locale: zhCN })
                : '选择日期查看预约'}
            </h3>

            {selectedDate ? (
              selectedDateAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">当日暂无预约</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateAppointments.map((appointment) => {
                    const client = getClient(appointment.clientId);
                    const time = appointment.scheduledAt.split(' ')[1];

                    return (
                      <div
                        key={appointment.id}
                        className="p-4 bg-gray-50 rounded-xl relative group"
                      >
                        <button
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-all"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                        <div className="flex items-center gap-3">
                          <Avatar name={client?.name || ''} src={client?.avatar} size="sm" />
                          <div>
                            <p className="font-medium text-gray-800">{client?.name}</p>
                            <p className="text-xs text-gray-500">{client?.occupation}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {time}
                          </span>
                          <span className="flex items-center gap-1">
                            {appointment.method === 'offline' ? (
                              <MapPin className="w-4 h-4" />
                            ) : (
                              <Video className="w-4 h-4" />
                            )}
                            {appointment.method === 'offline' ? '线下' : '线上'}
                          </span>
                        </div>
                        {appointment.notes && (
                          <p className="mt-2 text-xs text-gray-500">{appointment.notes}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">点击左侧日期查看预约详情</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="新建预约"
        size="md"
      >
        <div className="p-6 space-y-4">
          <Select
            label="选择来访者"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            options={[
              { value: '', label: '请选择来访者' },
              ...clients.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="预约日期"
              type="date"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            />
            <Select
              label="预约时间"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              options={timeSlots.map((t) => ({ value: t, label: t }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="咨询时长"
              value={String(formData.duration)}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              options={[
                { value: '30', label: '30分钟' },
                { value: '45', label: '45分钟' },
                { value: '60', label: '60分钟' },
                { value: '90', label: '90分钟' },
              ]}
            />
            <Select
              label="咨询方式"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value as 'offline' | 'online' })}
              options={[
                { value: 'offline', label: '线下咨询' },
                { value: 'online', label: '线上咨询' },
              ]}
            />
          </div>
          <Textarea
            label="备注"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="添加预约备注..."
            rows={3}
          />
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              取消
            </Button>
            <Button
              variant="primary"
              onClick={handleAddAppointment}
              loading={loading}
              disabled={!formData.clientId || !formData.scheduledAt}
            >
              创建预约
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
