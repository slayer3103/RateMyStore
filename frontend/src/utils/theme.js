import { createTheme } from '@mui/material/styles';

// ─── Color Palette ────────────────────────────────────────────────────────────
const primaryColor = '#6C63FF'; // vibrant violet-purple
const secondaryColor = '#FF6584'; // soft coral

// ─── Dark Theme ───────────────────────────────────────────────────────────────
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primaryColor,
      light: '#9B94FF',
      dark: '#4A43D9',
    },
    secondary: {
      main: secondaryColor,
      light: '#FF8FA3',
      dark: '#D93F5E',
    },
    background: {
      default: '#0F0F1A',
      paper: '#1A1A2E',
    },
    surface: {
      main: '#16213E',
    },
    text: {
      primary: '#E8E8F0',
      secondary: '#9494B8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 4px 20px rgba(108, 99, 255, 0.4)' },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${primaryColor}, #9B94FF)`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
          border: '1px solid rgba(108, 99, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': { borderColor: primaryColor },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#16213E',
            fontWeight: 700,
            color: primaryColor,
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*:focus-visible': {
          outline: `3px solid ${primaryColor}`,
          outlineOffset: '2px',
          borderRadius: '4px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
          border: '1px solid rgba(108, 99, 255, 0.15)',
          boxShadow: '0 16px 64px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          alignItems: 'center',
          fontWeight: 600,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        },
        filledSuccess: {
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          color: '#4CAF50',
          border: '1px solid rgba(76, 175, 80, 0.2)',
        },
        filledError: {
          backgroundColor: 'rgba(211, 47, 47, 0.1)',
          color: '#D32F2F',
          border: '1px solid rgba(211, 47, 47, 0.2)',
        },
      },
    },
  },
});

// ─── Light Theme ──────────────────────────────────────────────────────────────
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryColor,
      light: '#9B94FF',
      dark: '#4A43D9',
    },
    secondary: {
      main: secondaryColor,
      light: '#FF8FA3',
      dark: '#D93F5E',
    },
    background: {
      default: '#F4F4FF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#6B6B8A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 4px 20px rgba(108, 99, 255, 0.3)' },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${primaryColor}, #9B94FF)`,
          color: '#fff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 24px rgba(108, 99, 255, 0.1)',
          border: '1px solid rgba(108, 99, 255, 0.1)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#F0EEFF',
            fontWeight: 700,
            color: primaryColor,
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*:focus-visible': {
          outline: `3px solid ${primaryColor}`,
          outlineOffset: '2px',
          borderRadius: '4px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 16px 64px rgba(108, 99, 255, 0.15)',
          border: '1px solid rgba(108, 99, 255, 0.1)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          alignItems: 'center',
          fontWeight: 600,
          boxShadow: '0 4px 24px rgba(108, 99, 255, 0.1)',
        },
        standardSuccess: {
          backgroundColor: '#EDF7ED',
          color: '#1E4620',
        },
        standardError: {
          backgroundColor: '#FDEDED',
          color: '#5F2120',
        },
      },
    },
  },
});
