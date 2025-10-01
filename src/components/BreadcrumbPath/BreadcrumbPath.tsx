import { Anchor, Breadcrumbs, Text } from '@mantine/core';
import { NavLink } from 'react-router-dom';

export interface BreadcrumbPathItem {
  title: string;
  href?: string;
}

export interface BreadcrumbPathProps {
  items: BreadcrumbPathItem[];
}
export function BreadcrumbPath({ items }: BreadcrumbPathProps) {
  return (
    <Breadcrumbs>
      {items.map((item) => {
        if (item.href == '#') {
          return <Text>{item.title}</Text>;
        } else {
          return (
            <Anchor component={NavLink} to={item.href || '#'}>
              {item.title}
            </Anchor>
          );
        }
      })}
    </Breadcrumbs>
  );
}
