import '@fontsource/ubuntu';
import '@mantine/charts/styles.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './core/lang/i18n';

import { DirectionProvider, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './core/auth/auth.context';
import DashboardPage from './pages/dashboard/dashboard.page';
import InternalServerErrorPage from './pages/internal-server-error/internal-server-error.page';
import LoginPage from './pages/login/login.page';
import LogoutPage from './pages/logout/logout.page';
import NotFound from './pages/not-found/not-found.page';
import UseCaseStepPage from './pages/use-case-step/use-case-step.page';
import UseCasePage from './pages/use-case/use-case.page';
import { cssVariablesResolver, mantineTheme } from './theme';

/*
Import all assets to be used as components.
We can apply style of SVGs
*/
export const assets = import.meta.glob('./assets/*.svg', {
  eager: true,
  import: 'ReactComponent',
});

export default function App() {
  return (
    <DirectionProvider>
      <MantineProvider theme={mantineTheme} cssVariablesResolver={cssVariablesResolver} defaultColorScheme="auto">
        <Notifications />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Protected main page */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/use-cases" element={<UseCasePage />} />
              <Route path="/use-cases/:id/steps" element={<UseCaseStepPage />} />
              <Route path="/logout" element={<LogoutPage />} />

              {/* Public login page */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/internal-server-error" element={<InternalServerErrorPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </MantineProvider>
    </DirectionProvider>
  );
}
