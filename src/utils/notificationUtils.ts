import { notifications } from '@mantine/notifications';
import { ReactNode } from 'react';

export interface sendNotificationProps {
  id: string;
  title: ReactNode;
  message: ReactNode;
}
export const sendErrorNotification = ({ id, title, message }: sendNotificationProps) => {
  notifications.show({
    id: id,
    position: 'top-right',
    withCloseButton: true,
    autoClose: 5000,
    title: title,
    message: message,
    color: 'red',
    withBorder: true,
    loading: false,
  });
};
