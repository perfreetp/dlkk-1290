export type ClientStage = 
  | 'initial_assessment'
  | 'assessment'
  | 'interview'
  | 'report_writing'
  | 'follow_up';

export type Gender = 'male' | 'female' | 'other';

export type ConfusionType = 
  | 'career_positioning'
  | 'career_transition'
  | 'development_bottleneck'
  | 'skill_improvement'
  | 'salary_expectation'
  | 'workplace_relationship';

export type AssessmentStatus = 'pending' | 'completed' | 'expired';
export type ReportStatus = 'draft' | 'completed' | 'sent';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';
export type AppointmentMethod = 'offline' | 'online';

export interface Client {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  phone: string;
  email: string;
  occupation: string;
  education: string;
  consultationBackground: string;
  currentStage: ClientStage;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentType {
  id: string;
  name: string;
  description: string;
  dimensions: string[];
  icon: string;
}

export interface AssessmentScores {
  dimension: string;
  score: number;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  scores: AssessmentScores[];
  interpretation: string;
  createdAt: string;
}

export interface Assessment {
  id: string;
  clientId: string;
  assessmentType: AssessmentType;
  sentAt: string;
  completedAt?: string;
  status: AssessmentStatus;
  result?: AssessmentResult;
}

export interface Interview {
  id: string;
  clientId: string;
  interviewDate: string;
  duration: number;
  summary: string;
  confusionTypes: ConfusionType[];
  strengths: string[];
  limitations: string[];
  nextSteps: string;
  createdAt: string;
}

export interface CareerRecommendation {
  id: string;
  careerName: string;
  matchScore: number;
  reason: string;
  explorationTasks: string[];
}

export interface Report {
  id: string;
  clientId: string;
  title: string;
  content: string;
  careerRecommendations: CareerRecommendation[];
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
}

export interface Task {
  id: string;
  clientId: string;
  reportId?: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  scheduledAt: string;
  duration: number;
  method: AppointmentMethod;
  notes?: string;
  status: AppointmentStatus;
}

export const CLIENT_STAGE_LABELS: Record<ClientStage, string> = {
  initial_assessment: '初始评估',
  assessment: '测评中',
  interview: '访谈中',
  report_writing: '报告撰写',
  follow_up: '跟进中',
};

export const CONFUSION_TYPE_LABELS: Record<ConfusionType, string> = {
  career_positioning: '职业定位',
  career_transition: '职业转型',
  development_bottleneck: '发展瓶颈',
  skill_improvement: '能力提升',
  salary_expectation: '薪资期望',
  workplace_relationship: '人际关系',
};

export const ASSESSMENT_TYPES: AssessmentType[] = [
  {
    id: 'holland',
    name: '霍兰德职业兴趣测试',
    description: '测量个人的职业兴趣类型，帮助了解自己的职业倾向',
    dimensions: ['现实型(R)', '研究型(I)', '艺术型(A)', '社会型(S)', '企业型(E)', '常规型(C)'],
    icon: 'Compass',
  },
  {
    id: 'mbti',
    name: 'MBTI性格测试',
    description: '评估性格类型，帮助理解工作风格和沟通偏好',
    dimensions: ['外向-内向', '感觉-直觉', '思考-情感', '判断-知觉'],
    icon: 'Users',
  },
  {
    id: ' VALUES',
    name: '职业价值观测评',
    description: '识别个人的核心职业价值观',
    dimensions: ['成就感', '独立性', '社会认可', '利他主义', '物质回报', '创造力'],
    icon: 'Gem',
  },
  {
    id: 'skills',
    name: '职业技能测评',
    description: '评估可迁移技能和硬技能水平',
    dimensions: ['沟通能力', '领导力', '分析能力', '创新能力', '执行能力', '团队协作'],
    icon: 'Target',
  },
];
