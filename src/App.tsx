import './locales/i18n';
import '@fontsource/ubuntu';
import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { DirectionProvider, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import FlowPage from '@pages/FlowPage/FlowPage';
import { cssVariablesResolver, mantineTheme } from '@styles/theme';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import InternalServerErrorPage from './pages/InternalServerErrorPage/InternalServerErrorPage';
import LoginPage from './pages/LoginPage/LoginPage';
import LogoutPage from './pages/LogoutPage/LogoutPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import UseCasePage from './pages/UseCasePage/UseCasePage';
import UseCaseStepPage from './pages/UseCaseStepPage/UseCaseStepPage';

export function App() {
  return (
    <DirectionProvider>
      <MantineProvider
        theme={mantineTheme}
        cssVariablesResolver={cssVariablesResolver}
        defaultColorScheme="auto"
      >
        <Notifications />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Protected main page */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/use-cases" element={<UseCasePage />} />
              <Route path="/use-cases/:id" element={<UseCaseStepPage />} />
              <Route path="/use-cases/:id/flows" element={<FlowPage />} />
              <Route path="/logout" element={<LogoutPage />} />

              {/* Public login page */}
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/internal-server-error"
                element={<InternalServerErrorPage />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </MantineProvider>
    </DirectionProvider>
  );
}
