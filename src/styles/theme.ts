import {
  createTheme,
  CSSVariablesResolver,
  MantineTheme,
  MantineThemeOverride,
} from '@mantine/core';

export const mantineTheme: MantineThemeOverride = createTheme({
  fontFamily: 'Inter, sans-serif',
  colors: {
    dark: [
      '#d0d0d0',
      '#b6b6b6',
      '#9b9b9b',
      '#818181',
      '#676767',
      '#4d4d4dff',
      '#383838ff',
      '#1f1f1fff',
      '#080808',
      '#000000',
    ],
    red: [
      '#FFDCE1',
      '#FFB3B7',
      '#FF8990',
      '#FF6068',
      '#FF3641',
      '#FF0C1A',
      '#E6001B',
      '#CC001C',
      '#BA0024',
      '#9A001F',
    ],
    brand: [
      '#e6fcf5',
      '#c3fae8',
      '#96f2d7',
      '#63e6be',
      '#38d9a9',
      '#20c997',
      '#12b886',
      '#0ca678',
      '#099268',
      '#087f5b',
    ],
  },
  other: {
    darkBgGradientBgStart: '#099268',
    darkBgGradientBgEnd: '#0b525b',
    lightBgGradientBgStart: '#35a785ff',
    lightBgGradientBgEnd: '#29707aff',
    bpPaperDark: '#252525',
    bpPaperLight: '#efefef',
  },
  shadows: {
    md: '0px 2px 5px rgba(0, 0, 0, .20)',
    lg: '0px 2px 5px rgba(0, 0, 0, .20)',
    xl: '0px 2px 5px rgba(0, 0, 0, .20)',
  },
  primaryColor: 'brand',
  defaultRadius: 'md',
  components: {
    Drawer: {
      defaultProps: {
        padding: 0,
        position: 'right',
        overlayProps: { backgroundOpacity: 0.5, blur: 4 },
        withCloseButton: false,
        offset: 10,
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        shadow: '',
        p: 'md',
        bg: 'var(--aimm-bg-paper)',
      },
    },
    Title: {
      defaultProps: {
        mb: 'xl',
      },
    },
    Text: {
      defaultProps: {
        size: 'sm',
      },
    },
    Anchor: {
      defaultProps: {
        size: 'sm',
      },
    },
    TextInput: {
      defaultProps: {
        size: 'sm',
      },
    },
    PasswordInput: {
      defaultProps: {
        size: 'sm',
      },
    },
    NumberInput: {
      defaultProps: {
        size: 'sm',
        stepHoldDelay: 500,
        stepHoldInterval: (t: number) => Math.max(1000 / t ** 2, 25),
      },
    },
    Tooltip: {
      defaultProps: {
        fz: 'xs',
      },
    },
    Textarea: {
      defaultProps: {
        size: 'sm',
      },
    },
    Button: {
      defaultProps: {
        size: 'sm',
      },
    },
    Modal: {
      defaultProps: {
        padding: 'md',
        size: 'lg',
        withCloseButton: false,
        overlayProps: { backgroundOpacity: 0.5, blur: 4 },
      },
    },
    Alert: {
      defaultProps: {
        p: 'sm',
        variant: 'filled',
      },
    },
    SegmentedControl: {
      defaultProps: {
        size: 'sm',
      },
    },
    Card: {
      defaultProps: {
        bg: `var(--aimm-segmented-control-bg)`,
      },
    },
    Pagination: {
      defaultProps: {
        size: 'sm',
      },
    },
    Code: {
      styles: (theme: MantineTheme) => ({
        root: {
          fontSize: 'var(--mantine-font-size-xs)',
          overflow: 'hidden',
          color: theme.colors.brand[7],
          border: `1px solid ${theme.colors.brand[7]}`,
        },
      }),
    },
    Stepper: {
      defaultProps: {
        size: 'md',
      },
    },
    Fieldset: {
      styles: () => ({
        root: {
          overflow: 'hidden',
        },
      }),
    },
  },
});

export const cssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: {},
  light: {
    '--aimm-svg-color': theme.colors.brand[7],
    '--aimm-bg-paper': theme.other.bpPaperLight,
    '--aimm-gradient-bg-start': theme.other.lightBgGradientBgStart,
    '--aimm-gradient-bg-end': theme.other.lightBgGradientBgEnd,
    '--aimm-gradient-bg': `linear-gradient(135deg, ${theme.other.lightBgGradientBgStart} 0%, ${theme.other.lightBgGradientBgEnd} 70%)`,
    '--aimm-segmented-control-bg': theme.white,
  },
  dark: {
    '--aimm-svg-color': theme.colors.brand[7],
    '--aimm-bg-paper': theme.other.bpPaperDark,
    '--aimm-gradient-bg-start': theme.other.darkBgGradientBgStart,
    '--aimm-gradient-bg-end': theme.other.darkBgGradientBgEnd,
    '--aimm-gradient-bg': `linear-gradient(135deg, ${theme.other.darkBgGradientBgStart} 0%, ${theme.other.darkBgGradientBgEnd} 70%)`,
    '--aimm-segmented-control-bg': theme.colors.dark[6],
  },
});
