import { Layout } from '@components/Layout/Layout';
import { AuthGuard } from '@guards/AuthGuard';
import { Grid, Skeleton } from '@mantine/core';

export default function DashboardPage() {
  // Content
  const child = <Skeleton height={140} radius="md" animate={false} />;
  return (
    <AuthGuard>
      <Layout>
        <Grid.Col span={{ base: 12, xs: 4 }}>{child}</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 8 }}>{child}</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 8 }}>{child}</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 4 }}>{child}</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 3 }}>{child}</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 3 }}>{child}</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>{child}</Grid.Col>
      </Layout>
    </AuthGuard>
  );
}
