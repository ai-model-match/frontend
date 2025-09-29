import { Button, Container, Group, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classes from './NotFoundPage.module.css';

export default function NotFoundPage() {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Content
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.code}>404</div>
        <Title className={classes.title}>{t('notFoundTitle')}</Title>
        <Text size="lg" ta="center" className={classes.description}>
          {t('notFoundDescription')}
        </Text>
        <Group justify="center">
          <Button variant="white" size="md" color="indigo" onClick={() => navigate('/')}>
            {t('notFoundButton')}
          </Button>
        </Group>
      </Container>
    </div>
  );
}
