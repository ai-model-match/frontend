import { Group, Image, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classes from './HeaderLogo.module.css';

export function HaderLogo() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Group
      gap={10}
      justify="flex-start"
      wrap="nowrap"
      onClick={() => navigate('/')}
      style={{ cursor: 'pointer' }}
    >
      <Image src="/icon.svg" alt="Logo Icon" className={classes.logo} />
      <Title textWrap="nowrap" order={3} mb={0}>
        {t('appName')}
      </Title>
    </Group>
  );
}
