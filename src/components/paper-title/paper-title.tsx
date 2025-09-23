import { ActionIcon, Button, Group, Text, TextInput, ThemeIcon } from '@mantine/core';
import { type Icon, IconSearch, IconX } from '@tabler/icons-react';
import debounce from 'lodash.debounce';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface PaperTitleProps {
  mb: number;
  icon: Icon;
  title: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string | undefined) => void;
  btnIcon?: Icon;
  onBtnClick?: () => void;
}

export default function PaperTitle({
  mb,
  icon: Icon,
  title,
  showSearch,
  searchValue,
  onSearchChange,
  btnIcon: BtnIcon,
  onBtnClick: btnClick,
}: PaperTitleProps) {
  // Services
  const { t } = useTranslation();
  const [searchKeyValue, setSearchKeyValue] = useState<string>();

  // This is a function that does not change across rendering, making it stable
  const debouncedSearch = useRef(
    debounce((value: string | undefined) => {
      // call callback if defined with the new value
      if (onSearchChange) {
        onSearchChange(value);
      }
    }, 300)
  ).current;

  // Effects

  // When the input searchValue changes, it could caused by the parent that want to force a specific search value
  useEffect(() => {
    setSearchKeyValue(searchValue);
  }, [searchValue]);

  // When the searchKeyValue change, call the debounced function
  useEffect(() => {
    debouncedSearch(searchKeyValue);
  }, [searchKeyValue, debouncedSearch]);

  // If the showSearch change status, stop any in-execution debouncing
  useEffect(() => {
    if (!showSearch) {
      debouncedSearch.cancel();
    }
  }, [showSearch, debouncedSearch]);

  // If the debouncedSearch change (e.g. unmounting), stop any in-execution debouncing
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handlers
  const onClearBtnClick = () => {
    setSearchKeyValue(undefined);
  };

  const onTextInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyValue(event.currentTarget.value);
  };

  // Content
  return (
    <Group justify="space-between" align="center" mb={mb}>
      <Group justify="left" align="center">
        <ThemeIcon variant="filled" c={'white'} size={30}>
          <Icon size={18} />
        </ThemeIcon>
        <Text size={'lg'}>{title}</Text>
      </Group>
      <Group justify="right" align="flex-end">
        {showSearch && (
          <TextInput
            id="searchField"
            radius="xl"
            value={searchKeyValue ?? ''}
            onChange={onTextInputChange}
            leftSection={<IconSearch size={18} />}
            rightSection={
              searchKeyValue && (
                <ActionIcon onClick={onClearBtnClick} radius={'xl'}>
                  <IconX size={18} />
                </ActionIcon>
              )
            }
            placeholder={t('searchPlaceholderField')}
            w={250}
            ta={'right'}
          />
        )}
        {BtnIcon && btnClick && (
          <Button size="xs" p={5} mb={3} onClick={btnClick}>
            <BtnIcon />
          </Button>
        )}
      </Group>
    </Group>
  );
}
