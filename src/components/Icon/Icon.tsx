import { ComponentType } from 'react';

export interface IconProps {
  size?: number;
  stroke?: number;
}

export type Icon = ComponentType<IconProps>;
