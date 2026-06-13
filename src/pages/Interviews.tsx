import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Clock, ChevronRight, ThumbsUp, AlertTriangle } from 'lucide-react';
import { useInterviewStore } from '../store/useInterviewStore';
import { useClientStore } from '../store/useClientStore';
import { Interview, CONFUSION_TYPE_LABELS, ConfusionType } from '../types';
import { Card, CardContent, CardHeader } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';

export default function Interviews() {
  const interviews = useInterviewStore((state) => state.interviews);
  const { clients } = useClientStore();

  const getClient = (clientId: string) => {
    return clients.find((c) => c.id === clientId);
  };

  const sortedInterviews = [...interviews].sort(
    (a, b) => new Date(b.interviewDate).getTime() - new Date(a.interviewDate).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">访谈记录</h1>
          <p className="text-gray-500 mt-1">记录和管理所有访谈要点、困惑标注</p>
        </div>
        <Link to="/interviews/new">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            新建访谈
          </Button>
        </Link>
      </div>

      {interviews.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">暂无访谈记录</h3>
              <p className="text-sm text-gray-500 mb-4">创建第一个访谈记录开始您的咨询工作</p>
              <Link to="/interviews/new">
                <Button variant="primary">
                  <Plus className="w-4 h-4" />
                  创建访谈
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedInterviews.map((interview) => {
            const client = getClient(interview.clientId);
            
            return (
              <Link key={interview.id} to={`/interviews/${interview.id}`}>
                <Card hover>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar name={client?.name || ''} src={client?.avatar} size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800">{client?.name}</h3>
                            <p className="text-sm text-gray-500">{client?.occupation}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>

                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {interview.interviewDate}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {interview.duration}分钟
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                          {interview.summary}
                        </p>

                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">困惑类型:</span>
                            <div className="flex flex-wrap gap-1">
                              {interview.confusionTypes.map((type) => (
                                <Badge key={type} size="sm" variant="warning">
                                  {CONFUSION_TYPE_LABELS[type]}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-start gap-2">
                            <ThumbsUp className="w-4 h-4 text-[#10b981] mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 mb-1">优势</p>
                              <div className="flex flex-wrap gap-1">
                                {interview.strengths.slice(0, 2).map((s, i) => (
                                  <Badge key={i} size="sm" variant="success">
                                    {s}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-[#f59e0b] mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 mb-1">限制因素</p>
                              <div className="flex flex-wrap gap-1">
                                {interview.limitations.slice(0, 2).map((l, i) => (
                                  <Badge key={i} size="sm" variant="warning">
                                    {l}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
