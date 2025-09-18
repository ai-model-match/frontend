import { Grid, Skeleton } from '@mantine/core';
import LayoutComponent from '../../components/layout/layout.component';
import AuthGuard from '../../core/auth/auth.guard';

export default function DashboardPage() {
    const child = <Skeleton height={140} radius="md" animate={false} />;

    // Content
    return (
        <AuthGuard>
            <LayoutComponent>
                <Grid.Col span={{ base: 12, xs: 4 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 8 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 8 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 4 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 3 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 3 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6 }}>{child}</Grid.Col>
            </LayoutComponent>
        </AuthGuard>
    );
}
