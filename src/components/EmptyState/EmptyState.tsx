import { Box, Button, Stack, Text, Title } from '@mantine/core';
import { assets } from '@styles/assets';

export interface EmptyStateProps {
  title: string;
  text?: string;
  suggestion?: string;
  imageName: string;
  btnText?: string;
  btnHandle?: () => void;
}

export function EmptyState({
  title,
  text,
  suggestion,
  imageName,
  btnText,
  btnHandle,
}: EmptyStateProps) {
  const Image = assets[`../assets/${imageName}.svg`];

  return (
    <Stack align="center" gap="xs">
      <Box w={200} maw={200}>
        <Box mt={30} component={Image} />
      </Box>
      <Title order={3} mt={30} mb={10} maw={550}>
        {title}
      </Title>
      {text && (
        <Text ta={'center'} maw={450} size="md">
          {text}
        </Text>
      )}
      {suggestion && (
        <Text maw={400} fs={'italic'} size="sm" ta={'center'} mt={20}>
          {suggestion}
        </Text>
      )}
      {btnText && btnHandle ? (
        <Button mt={20} mb={40} onClick={btnHandle}>
          {btnText}
        </Button>
      ) : (
        <Box mb={40} />
      )}
    </Stack>
  );
}
