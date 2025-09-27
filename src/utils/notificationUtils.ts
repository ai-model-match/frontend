import { notifications } from '@mantine/notifications';
import { ReactNode } from 'react';

export interface sendNotificationProps {
  id: string;
  title: ReactNode;
  message: ReactNode;
  icon?: ReactNode;
}
export const sendErrorNotification = ({
  id,
  title,
  message,
  icon,
}: sendNotificationProps) => {
  notifications.show({
    id: id,
    icon: icon,
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

export const sendSuccessNotification = ({
  id,
  title,
  message,
  icon,
}: sendNotificationProps) => {
  notifications.show({
    id: id,
    icon: icon,
    position: 'top-right',
    withCloseButton: true,
    autoClose: 5000,
    title: title,
    message: message,
    color: 'brand',
    withBorder: true,
    loading: false,
  });
};
