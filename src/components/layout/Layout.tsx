import { Header } from '@components/Header';
import { Menu } from '@components/Menu/Menu';
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Container,
  Grid,
} from '@mantine/core';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell header={{ height: 70 }} navbar={{ width: 250, breakpoint: '' }}>
      <AppShellHeader bd={0}>
        <Header />
      </AppShellHeader>
      <AppShellNavbar p="xs" pt={0} bd={0}>
        <Menu />
      </AppShellNavbar>
      <AppShellMain>
        <Container fluid miw={950}>
          <Grid gutter="md" columns={12}>
            {children}
          </Grid>
        </Container>
      </AppShellMain>
    </AppShell>
  );
}
