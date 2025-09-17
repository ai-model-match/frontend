import "@fontsource/ubuntu";
import "@mantine/core/styles.css";
import './core/lang/i18n';

import { DirectionProvider, MantineProvider } from "@mantine/core";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./core/auth/auth.context";
import DashboardPage from "./pages/dashboard/dashboard";
import LoginPage from "./pages/login/login.page";
import LogoutPage from "./pages/logout/logout.page";
import NotFound from "./pages/not-found/not-found.page";
import UseCasePage from "./pages/use-case/use-case";
import { cssVariablesResolver, mantineTheme } from "./theme";

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
        <DirectionProvider >
            <MantineProvider theme={mantineTheme} cssVariablesResolver={cssVariablesResolver} defaultColorScheme="auto">
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            {/* Protected main page */}
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/use-cases" element={<UseCasePage />} />
                            <Route path="/logout" element={<LogoutPage />} />

                            {/* Public login page */}
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </MantineProvider >
        </DirectionProvider >
    );
}
