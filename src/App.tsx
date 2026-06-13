import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import ClientNew from './pages/ClientNew';
import Assessments from './pages/Assessments';
import Interviews from './pages/Interviews';
import InterviewNew from './pages/InterviewNew';
import Reports from './pages/Reports';
import ReportNew from './pages/ReportNew';
import Tracking from './pages/Tracking';
import Appointments from './pages/Appointments';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/new" element={<ClientNew />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="clients/:id/edit" element={<ClientNew />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="interviews/new" element={<InterviewNew />} />
          <Route path="interviews/:id" element={<InterviewNew />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/new" element={<ReportNew />} />
          <Route path="reports/:id" element={<ReportNew />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>
      </Routes>
    </Router>
  );
}
