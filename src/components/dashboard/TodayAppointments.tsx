import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Video, ExternalLink } from 'lucide-react';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { useClientStore } from '../../store/useClientStore';
import { Avatar } from '../common/Avatar';
import { Card, CardContent } from '../common/Card';

export function TodayAppointments() {
  const appointments = useAppointmentStore((state) => state.appointments);
  const clients = useClientStore((state) => state.clients);

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments
    .filter((a) => a.scheduledAt.startsWith(today) && a.status === 'scheduled')
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));

  const getClient = (clientId: string) => {
    return clients.find((c) => c.id === clientId);
  };

  const formatTime = (scheduledAt: string) => {
    const time = scheduledAt.split(' ')[1];
    return time;
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1e3a5f]" />
            <h3 className="font-semibold text-gray-800">今日预约</h3>
          </div>
          <Link
            to="/appointments"
            className="text-sm text-[#1e3a5f] hover:underline flex items-center gap-1"
          >
            查看全部
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">今日暂无预约</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((appointment) => {
              const client = getClient(appointment.clientId);
              if (!client) return null;

              return (
                <div
                  key={appointment.id}
                  className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Avatar src={client.avatar} name={client.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800">
                        {client.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {client.occupation}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-medium text-[#1e3a5f]">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(appointment.scheduledAt)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        {appointment.method === 'offline' ? (
                          <>
                            <MapPin className="w-3 h-3" />
                            <span>线下</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-3 h-3" />
                            <span>线上</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {appointment.notes && (
                    <p className="mt-2 text-xs text-gray-500 pl-9">
                      {appointment.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
