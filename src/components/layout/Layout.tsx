import { Header } from '@components/Header';
import { Menu } from '@components/Menu/Menu';
import { Box, Container, Grid } from '@mantine/core';
import classes from './Layout.module.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header></Header>
      <Box>
        <Container fluid>
          <Grid gutter="md" columns={12} miw={1170}>
            <Grid.Col span={{ base: 3, xl: 2 }} className={classes.menu}>
              <Menu />
            </Grid.Col>
            <Grid.Col span={{ base: 9, xl: 10 }}>
              <Grid gutter="md" columns={12}>
                {children}
              </Grid>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
