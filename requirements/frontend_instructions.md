# Rubbish Pickup Management App - Frontend Specifications (Next.js)

## 1. Project Overview
- **Framework**: Next.js with React for web application development.
- **Styling**: ShadCN and Tailwind CSS for rapid styling, responsive design, and a clean, professional look.
- **State Management**: React Context API or Redux for state management.
- **Database**: Supabase for real-time data handling.
- **Primary Packages**:
  - `react-icons` for icons in the UI.
  - `react-toastify` for notifications and alerts.
  - `chart.js` or `react-chartjs-2` for analytics and visualizations.
  
---

## 2. Screen and UI Specifications

### 1. **Login/Welcome Screen**
**Purpose**: Simple authentication screen to restrict access to the app.

**Elements**:
- **Login Form**: Email and password fields.
- **Remember Me** Checkbox: Option to keep users logged in.
  
**Features**:
- **Welcome Message**: Brief description of the app for new users.

**Design**:
- Minimalistic layout centered on the page.
- Submit button with loading animation.

---

### 2. **Home Screen (Dashboard)**
**Purpose**: Provide an overview of key metrics and links to core features.

**Elements**:
- **Daily Pickups Summary**: Count of scheduled and completed pickups.
- **Revenue Summary**: Total monthly revenue.
- **Pending Payments**: Shortcut to view unpaid accounts.
- **Quick Links**: Buttons for common actions (e.g., "Add Customer," "Today’s Pickups").

**Design**:
- Responsive grid layout with **card components** for each metric.
- Cards display icons and summaries; clicking on each card brings up more details.
  
**Features**:
- **Hover Effects** on cards for interactivity.
- **Dynamic Data Fetching** with Next.js API routes to keep data up-to-date.

---

### 3. **Customer Management Screen**
**Purpose**: Manage customers, add new ones, and view/edit details.

**Elements**:
- **Customer List**: Displays each customer’s name, unit, and subscription type.
- **Search Bar**: Allows searching by name, unit, or subscription.
- **Add Customer Button**: Opens a form to add new customers.
- **Customer Details Modal**: Form to edit a customer’s name, contact, subscription type, and payment status.

**Design**:
- **Table Layout** for customer list with sortable columns (name, unit, subscription).
- **Modal Form** for adding/editing customer details.

**Features**:
- **Responsive Table** with scroll for mobile views.
- **Filter and Sort Options** for easier data management.
- **Delete Confirmation**: Confirmation prompt before customer deletion.

---

### 4. **Subscription and Payment Tracking Screen**
**Purpose**: View, manage, and filter subscriptions and payment statuses.

**Elements**:
- **Subscription Table**: Filterable by active, expired, or unpaid.
- **Payment Status**: Icons or color coding for paid, overdue, and upcoming payments.
- **Add/Edit Subscription Modal**: Form to enter package type, start/end dates, and payment amount.

**Design**:
- Table with color-coded rows for payment status.
- **Dropdown Filters** for subscription type, status, and due dates.

**Features**:
- **Notifications/Reminders**: Buttons to send payment reminders via email or WhatsApp.
- **Inline Editing**: Quick updates to subscription info without opening a modal.

---

### 5. **Pickup Schedule Screen**
**Purpose**: Organize daily pickups and track completion status.

**Elements**:
- **Pickup List**: Displays customer name, unit, and buttons (call and message via phone or Whatsapp)
- **Completion Checkbox**: To mark pickups as completed.
- **Notes Section**: Field for notes on each customer (e.g., “Leave bag by door”).

**Design**:
- **List Layout** for a simplified view with checkboxes for completion.
- **Notes Icon** beside each entry for easy note-taking.

**Features**:
- **Realtime Update**: Automatically mark a pickup as complete when checked.
- auto reset customer completed status each time pickup time has ended (next pickup day)
- separate completed pickups from the upcoming pickups
- only update backend when pickup is completed

---

### 7. **Notifications Screen**
**Purpose**: Set automated reminders for pickups and payments.

**Elements**:
- **Notification Toggles**: Enable reminders for pickups and overdue payments.
- **Frequency Settings**: Options for daily, weekly, or monthly reminders.

**Design**:
- Switch components for enabling/disabling notifications.
- Dropdown menus to set reminder frequency.

**Features**:
- **Email/WhatsApp Reminders**: Scheduled notifications sent through configured API (Twilio or similar for WhatsApp).

---

### 8. **Settings Screen**
**Purpose**: Configure app settings, theme, and account details.

**Elements**:
- **Theme Switcher**: Light/Dark mode toggle.
- **Account Settings**: Profile details and password management (if authentication is used).
- **Data Backup and Sync Options**: Options for data export and backup.

**Features**:
- **Data Export Options**: Export data to Google Sheets or CSV.
- **Cloud Sync with Firebase**: Optional setup for data sync across devices.

---

# Design Notes
- **Consistency**: Use a consistent color scheme, such as blue or green tones.
- **Responsive Design**: Adjust layouts for mobile, tablet, and desktop views.
- **User-Friendly UI**: Prioritize readability and ease of use, especially for quick task management.

---

# Additional Notes
- Subscription types should be:
  - Monthly : RM 30
  - Quarterly : RM 80
  - Yearly : RM 250
- The pickup service is on every Monday, Wednesday, and Friday. (for all customers)
- The pickup time is between 8pm to 10pm.

# Rules
- All new components should be added to the components folder and be named like example-component.tsx unless otherwise specified.
- All new pages should be added to the app folder and be named like example-page.tsx unless otherwise specified.
- Do not change middleware.ts file.

This document provides a comprehensive breakdown of screens, UI elements, and features for developing the app in Next.js.
