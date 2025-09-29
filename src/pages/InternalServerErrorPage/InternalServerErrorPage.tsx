import { Button, Container, Group, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classes from './InternalServerErrorPage.module.css';

export default function InternalServerErrorPage() {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Content
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.code}>500</div>
        <Title className={classes.title}>{t('internalServerErrorTitle')}</Title>
        <Text size="lg" ta="center" className={classes.description}>
          {t('internalServerErrorDescription')}
        </Text>
        <Group justify="center">
          <Button variant="white" color="grape" size="md" onClick={() => navigate('/')}>
            {t('internalServerErrorButton')}
          </Button>
        </Group>
      </Container>
    </div>
  );
}
