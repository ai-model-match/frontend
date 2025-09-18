import { Box, Container, Grid } from '@mantine/core';
import Header from '../header/header.component';
import { MenuComponent } from '../menu/menu.component';
import classes from './layout.module.css';

export default function LayoutComponent({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Header></Header>
            <Box>
                <Container fluid>
                    <Grid gutter="md" columns={12} miw={950}>
                        <Grid.Col span={{ base: 3, xl: 2 }} className={classes.menu}>
                            <MenuComponent />
                        </Grid.Col>
                        <Grid.Col span={{ base: 9, xl: 10 }}>
                            <Grid gutter="md" columns={12}>
                                {children}
                            </Grid>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Box>
        </div>
    );
}
