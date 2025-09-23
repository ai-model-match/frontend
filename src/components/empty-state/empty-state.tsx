import { Box, Button, Stack, Text, Title } from '@mantine/core';
import { assets } from '../../App';

interface EmptyStateProps {
  title: string;
  text?: string;
  suggestion?: string;
  image: string;
  btnText?: string;
  btnHandle?: () => void;
}

export default function EmptyState(props: EmptyStateProps) {
  // Import image based on name
  const Image = assets[`./assets/${props.image}.svg`] as React.FC<React.SVGProps<SVGSVGElement>>;

  // Content
  return (
    <Stack align="center" gap="xs">
      <Box w={200} maw={200}>
        <Box mt={30} component={Image} />
      </Box>
      <Title order={3} mt={30} mb={0} maw={550}>
        {props.title}
      </Title>
      {props.text && (
        <Text size="sm" ta={'center'} maw={400}>
          {props.text}
        </Text>
      )}
      {props.suggestion && (
        <Text maw={400} fs={'italic'} size="sm" ta={'center'} mt={20}>
          {props.suggestion}
        </Text>
      )}
      {props.btnText && props.btnHandle ? (
        <Button mt={20} mb={40} onClick={props.btnHandle}>
          {props.btnText}
        </Button>
      ) : (
        <Box mb={40} />
      )}
    </Stack>
  );
}
