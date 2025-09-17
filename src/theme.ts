// theme.ts
import { createTheme, CSSVariablesResolver, MantineThemeOverride } from '@mantine/core';


// Define the theme
export const mantineTheme: MantineThemeOverride = createTheme({
    /** Font family */
    fontFamily: 'Ubuntu, sans-serif',
    colors: {
        dark: [
            '#d0d0d0',
            '#b6b6b6',
            '#9b9b9b',
            '#818181',
            '#676767',
            '#202020',
            '#191919',
            '#181818',
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
            '#FFDCE1',
            '#FFB3B7',
            '#FF8990',
            '#FF6068',
            '#FF3641',
            '#FF0C1A',
            '#E6001B', // Primary for Light
            '#CC001C',
            '#BA0024', // Primary for Dark
            '#9A001F',
        ],
    },
    other: {
        darkBgGradientBgStart: '#9A001F',
        darkBgGradientBgEnd: '#4E0010',
        lightBgGradientBgStart: '#d2002a',
        lightBgGradientBgEnd: '#6f0016',
        bpPaperDark: '#252525',
        bpPaperLight: '#f3f3f3'
    },
    shadows: {
        md: '1px 1px 3px rgba(0, 0, 0, .40)',
        lg: '3px 3px 10px rgba(0, 0, 0, .40)',
        xl: '5px 5px 3px rgba(0, 0, 0, .40)',
    },
    primaryColor: "brand",
    defaultRadius: 'md',
    components: {
        Paper: {
            defaultProps: {
                shadow: 'lg',
                p: 'xl',
                bg: 'var(--aimm-bg-paper)'
            }
        },
        Title: {
            defaultProps: {
                mb: 'xl'
            }
        }
    },
});

export const cssVariablesResolver: CSSVariablesResolver = (theme) => ({
    variables: {
    },
    light: {
        "--aimm-svg-color": theme.colors.brand[8],
        "--aimm-bg-paper": theme.other.bpPaperLight,
        "--aimm-gradient-bg-start": theme.other.lightBgGradientBgStart,
        "--aimm-gradient-bg-end": theme.other.lightBgGradientBgEnd,
        "--aimm-gradient-bg": `linear-gradient(135deg, ${theme.other.lightBgGradientBgStart} 0%, ${theme.other.lightBgGradientBgEnd} 70%)`,
    },
    dark: {
        "--aimm-svg-color": theme.colors.brand[8],
        "--aimm-bg-paper": theme.other.bpPaperDark,
        "--aimm-gradient-bg-start": theme.other.darkBgGradientBgStart,
        "--aimm-gradient-bg-end": theme.other.darkBgGradientBgEnd,
        "--aimm-gradient-bg": `linear-gradient(135deg, ${theme.other.darkBgGradientBgStart} 0%, ${theme.other.darkBgGradientBgEnd} 70%)`,
    }
});