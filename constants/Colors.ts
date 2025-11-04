export const Colors = {
  // Primary colors
  primary: '#E63946', // Red for blood donation theme
  primaryDark: '#C1121F',
  primaryLight: '#FF5A67',
  
  // Secondary colors
  secondary: '#457B9D', // Calm blue
  secondaryDark: '#1D3557',
  secondaryLight: '#A8DADC',
  
  // Status colors
  success: '#06D6A0',
  successDark: '#05B589',
  successLight: '#7FFFD4',
  
  warning: '#FFB703',
  warningDark: '#FB8500',
  warningLight: '#FFD60A',
  
  error: '#D62828',
  errorDark: '#9D0208',
  errorLight: '#F77F00',
  
  info: '#4895EF',
  infoDark: '#4361EE',
  infoLight: '#4CC9F0',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Grays
  gray50: '#F8F9FA',
  gray100: '#F1F3F5',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#6C757D',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundTertiary: '#F1F3F5',
  
  // Text colors
  text: '#212529',
  textSecondary: '#6C757D',
  textTertiary: '#ADB5BD',
  textInverse: '#FFFFFF',
  
  // Border colors
  border: '#DEE2E6',
  borderLight: '#E9ECEF',
  borderDark: '#CED4DA',
  
  // Species colors
  dog: '#FF6B6B',
  cat: '#4ECDC4',
  horse: '#95E1D3',
  
  // Eligibility status colors
  eligible: '#06D6A0',
  pending: '#FFB703',
  ineligible: '#D62828',
  temporaryIneligible: '#FB8500',
  reVerificationRequired: '#4895EF',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
};

export type ColorKey = keyof typeof Colors;
