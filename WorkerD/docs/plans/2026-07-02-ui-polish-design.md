# UI/UX Polish Design Document

**Date:** 2026-07-02  
**Feature:** UI/UX Polish & Dynamic Language Simplification  

---

## 1. Overview
The current UI of `WorkerD` utilizes hardcoded bilingual text slashes (e.g. `Home / घर`) and emoji icons (e.g. 🏠, 👷) across tabs and screens. While functional, it introduces visual clutter, makes translation handling rigid, and degrades the premium feel of the mobile application.

This design document establishes the guidelines for polishing the screens one by one, shifting to a dynamic single-language approach (using the selected language from `i18n`) and upgrading emojis to high-quality vector icons (`Ionicons`).

---

## 2. Key Design Enhancements

### A. Navigation System
- **Worker & Hirer Navigators (`WorkerNavigator.tsx`, `HirerNavigator.tsx`)**:
  - Replace all emoji icons with Ionicons.
  - Dynamically translate tab bar titles using translations from `i18n` (no bilingual text slashes).

### B. Onboarding & Authentication (`AuthScreen.tsx`)
- Modern input boxes with clear outlines and styling based on M3 design principles.
- Clean language selection cards with proper highlighted states.
- Clean role selection and trade selection using professional vector icons or custom styled card boxes.
- Better alignment, margins, and typography sizes.

### C. Worker & Hirer Dashboards (`WorkerDashboard.tsx`, `HirerDashboard.tsx`)
- Resolve all bilingual slashes in headers, stats titles, and subheadings to use dynamic translation helper calls.
- Replace emojis (`💰`, `📝`, `⭐`, `💸`, `🔍`, `📅`, `🛠️`) with Ionicons.
- Clean and consistent spacing using spacing tokens.

### D. Job Search & Management
- **Find Jobs (`FindJobsScreen.tsx`)**: Polish the search bar, filter tabs, and job listing card items.
- **Post Job (`PostJobScreen.tsx`)**: Style fields, input borders, and helper text dynamically.
- **My Jobs (`MyJobsScreen.tsx`)**: Style list status tabs and filters.

### E. Chat Room & Profile
- **Chat list & room (`ChatListScreen.tsx`, `ChatRoomScreen.tsx`)**: WhatsApp-like conversation bubble style with active icons.
- **Profile Screen (`ProfileScreen.tsx`)**: Section-based neat professional card layouts.

---

## 3. Tech Stack & Dependencies
- **Core Components:** React Native, TypeScript
- **Styling:** React Native Stylesheet (using `theme` layout, colors, typography tokens)
- **Icons:** `react-native-vector-icons/Ionicons`
- **Translations:** `i18next`, `react-i18next`
