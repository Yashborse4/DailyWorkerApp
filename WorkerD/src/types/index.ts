/**
 * Global TypeScript Interfaces for WorkerD
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  primaryVariant: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  success: string;
  warning: string;
  onPrimary: string;
  onSecondary: string;
  onBackground: string;
  onSurface: string;
  onError: string;
  white: string;
  black: string;
  worker: {
    base: string;
    light: string;
    dark: string;
  };
  hirer: {
    base: string;
    light: string;
    dark: string;
  };
  grey: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
  };
}

export interface TypographyStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700' | '800' | 'bold' | 'normal';
}

export interface TypographyScale {
  large: TypographyStyle;
  medium: TypographyStyle;
  small: TypographyStyle;
}

export interface ThemeTypography {
  headline: TypographyScale;
  title: TypographyScale;
  body: TypographyScale;
  label: TypographyScale;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeShape {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface MotionSpec {
  duration: {
    short1: number;
    short2: number;
    short3: number;
    short4: number;
    medium1: number;
    medium2: number;
    medium3: number;
    medium4: number;
    long1: number;
    long2: number;
  };
  easing: {
    standard: string;
    emphasized: string;
    decelerated: string;
    accelerated: string;
  };
}

export interface MD3Theme {
  colors: {
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    secondary: string;
    onSecondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiary: string;
    onTertiary: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    error: string;
    onError: string;
    errorContainer: string;
    onErrorContainer: string;
    background: string;
    onBackground: string;
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    outline: string;
    outlineVariant: string;
    shadow: string;
    scrim: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
    elevation: {
      level0: string;
      level1: string;
      level2: string;
      level3: string;
      level4: string;
      level5: string;
    };
    surfaceDisabled: string;
    onSurfaceDisabled: string;
    backdrop: string;
  };
  typography: {
    displayLarge: TypographyStyle;
    displayMedium: TypographyStyle;
    displaySmall: TypographyStyle;
    headlineLarge: TypographyStyle;
    headlineMedium: TypographyStyle;
    headlineSmall: TypographyStyle;
    titleLarge: TypographyStyle;
    titleMedium: TypographyStyle;
    titleSmall: TypographyStyle;
    bodyLarge: TypographyStyle;
    bodyMedium: TypographyStyle;
    bodySmall: TypographyStyle;
    labelLarge: TypographyStyle;
    labelMedium: TypographyStyle;
    labelSmall: TypographyStyle;
  };
}

export interface Theme {
  Colors: ThemeColors;
  Spacing: ThemeSpacing;
  Typography: ThemeTypography;
  Shape: ThemeShape;
  md3: MD3Theme;
  motion: MotionSpec;
}

export type UserRole = 'worker' | 'hirer';

export interface Project {
  id: number;
  name: string;
  location: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  companyName?: string;
  companyLocation?: string;
  location?: string;
  trade?: string;
  projects?: Project[];
  categories?: string[];
  workType?: string;
  verificationStatus?: 'unverified' | 'pending' | 'verified';
}

export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  postedBy: string; // Hirer ID
  category: string;
  hiringEntity: 'Company' | 'Building Construction';
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface Application {
  id: number;
  jobId: number;
  workerId: number;
  status: 'pending' | 'accepted' | 'rejected' | 'shortlisted';
  appliedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: number;
  text: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface ChatRoom {
  id: number;
  participants: string[];
  otherUserName: string;
  otherUserAvatar?: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  messages: ChatMessage[];
}

export type AuthStackParamList = {
  AuthUnified: undefined;
};

export type WorkerTabParamList = {
  WorkerDashboard: undefined;
  FindJobs: undefined;
  ChatList: undefined;
  WorkerProfile: undefined;
};

export type HirerTabParamList = {
  HirerDashboard: undefined;
  MyJobs: undefined;
  ChatList: undefined;
  PostJob: undefined;
  HirerProfile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  WorkerApp: undefined;
  HirerApp: undefined;
  ChatRoom: { roomId: number };
  Verification: undefined;
};
