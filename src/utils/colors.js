export const COLORS = {
  // Farmer Theme
  farmer: {
    primary: '#16a34a',
    secondary: '#22c55e',
    light: '#dcfce7',
    dark: '#15803d',
  },
  // Supermarket Theme
  supermarket: {
    primary: '#2563eb',
    secondary: '#3b82f6',
    light: '#dbeafe',
    dark: '#1e40af',
  },
  // Admin Theme
  admin: {
    primary: '#9333ea',
    secondary: '#a855f7',
    light: '#f3e8ff',
    dark: '#7e22ce',
  },
  // Common Colors
  common: {
    white: '#ffffff',
    black: '#000000',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  }
};

export const getThemeColors = (userType) => {
  switch(userType) {
    case 'farmer':
      return COLORS.farmer;
    case 'supermarket':
      return COLORS.supermarket;
    case 'admin':
      return COLORS.admin;
    default:
      return COLORS.farmer;
  }
};