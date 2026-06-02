# ShellX — Roadmap 3: Web Dashboard (ShellX Nexus)
## Masterclass-Tier Production Build Plan
### Target: Admin Command Center (Vite + React + TypeScript + CSS Variables)

---

> **Document Authority:** This file is the singular, uncompromised source of truth for the Antigravity verification system and the coder AI agent during the dashboard implementation. Every checkbox below represents one discrete, mandatory, atomic build action. No file may be modified, created, or wired without a corresponding checked box. Build order is strictly chronological.

---

## ⚙️ Suggested Build Order (Macro)

```
Phase 3.1 ──────→ Phase 3.2 ──────→ Phase 3.3 ──────→ Phase 3.4 ──────→ Phase 3.5 ──────→ Phase 3.6
    ↓                  ↓                  ↓                  ↓                  ↓                  ↓
Design Tokens      Routing Flow &     Dashboard Core     Student Directory  Curriculum CMS     Gateway Registry
& Base Atoms       Firebase Auth      & Live PTY Feed    & Audit Logger     & Validation Engine  & Security Alerts
```

---

## 🔖 Legend

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[x]` | Completed |
| `⚡` | Critical path item — blocks all downstream work in this phase |
| `🔒` | Foundational contract file — do not modify after tests pass without full re-verification |
| `📐` | Must pass 44×44px click target check |
| `📱` | Responsive layout — must stack/scroll gracefully on mobile screens |
| `🌑` | Must render pure #000000 background — no off-black substitution |
| `🔥` | Firebase lifecycle dependency — handles dynamic Auth and Firestore bindings |
| `🔌` | WebSocket/Net connection — handles live PTY feeds and terminal socket lifecycles |

---

---

# PHASE 3.1 — Design Tokens, CSS Variables & Core UI Atoms

> **Goal:** Create the visual foundation of ShellX Nexus. Import all color, spacing, radius, and typography tokens from the React Native application design system and represent them as CSS variables. Build the atomic text, button, and input primitives.

---

## Sub-Phase 3.1.A — Directory Bootstrap & Styling Scaffolding

- [ ] ⚡ 🔒 Create `/ShellX-Nexus/src/index.css`
  * **Description:** Global stylesheet defining the visual design system. Zero default margins. Enforces the True Dark background.
  * **Code Layout:**
    ```css
    :root {
      /* Colors */
      --color-background-floor: #000000;
      --color-background-elevated: #0D0D0D;
      --color-background-input: #000000;
      
      --color-surface-default: #0D0D0D;
      --color-surface-raised: #111111;
      --color-surface-sunken: #000000;
      --color-surface-active: #141414;
      
      --color-border-subtle: #1F2937;
      --color-border-strong: #374151;
      --color-border-focus: #3B82F6;
      --color-border-error: #EF4444;
      --color-border-success: #4FDF94;
      
      --color-primary-default: #3B82F6;
      --color-primary-dim: #1D4ED8;
      
      --color-semantic-success: #4FDF94;
      --color-semantic-warning: #F59E0B;
      --color-semantic-error: #EF4444;
      
      --color-text-primary: #F9FAFB;
      --color-text-secondary: #9CA3AF;
      --color-text-tertiary: #6B7280;
      
      --color-syntax-blue: #ADC6FF;
      --color-syntax-green: #6FFBBE;
      --color-syntax-orange: #FFDDB8;
      --color-syntax-red: #FF8A80;
      --color-syntax-purple: #D0B0FF;
      --color-syntax-gray: #6B7280;

      /* Spacing */
      --spacing-xs: 4px;
      --spacing-sm: 8px;
      --spacing-md: 16px;
      --spacing-lg: 24px;
      --spacing-xl: 32px;

      /* Borders */
      --radius-sm: 2px;
      --radius-default: 4px;
      --radius-lg: 8px;
      --radius-xl: 12px;
      --radius-full: 9999px;
      
      --border-hairline: 1px;
      --border-medium: 2px;
    }

    body {
      margin: 0;
      background-color: var(--color-background-floor);
      color: var(--color-text-primary);
      font-family: 'Inter', -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    ```

- [ ] ⚡ 🔒 Create `/ShellX-Nexus/src/types/index.ts`
  * **Description:** Shared types for components, matching the structures used in the React Native project.

---

## Sub-Phase 3.1.B — Atomic Text Components

- [ ] Create `/ShellX-Nexus/src/components/atoms/SafeText.tsx`
  * **Props:** `children`, `color`, `style`, `className`
  * **Constraint:** Default color `var(--color-text-primary)`. Restricts standard browser typography overrides.

- [ ] Create `/ShellX-Nexus/src/components/atoms/MonoText.tsx`
  * **Props:** `children`, `size`, `weight`, `color`, `className`
  * **Constraint:** Enforces JetBrains Mono or local monospace family.

- [ ] Create `/ShellX-Nexus/src/components/atoms/HeadlineText.tsx`
  * **Props:** `children`, `size`, `weight`, `className`
  * **Constraint:** Max size 30px, bold font-weight.

- [ ] Create `/ShellX-Nexus/src/components/atoms/LabelCapsText.tsx`
  * **Props:** `children`, `size`, `className`
  * **Constraint:** `text-transform: uppercase`, `letter-spacing: 0.1em`.

---

## Sub-Phase 3.1.C — Action & Input Atoms

- [ ] 📐 Create `/ShellX-Nexus/src/components/atoms/PrimaryButton.tsx`
  * **Constraint:** Height min 44px. Background: `var(--color-primary-default)`. Font: weight 600, color inverse (black). Zero shadows.

- [ ] 📐 Create `/ShellX-Nexus/src/components/atoms/SecondaryButton.tsx`
  * **Constraint:** Border: 1px solid `var(--color-border-subtle)`. Background: transparent.

- [ ] 📐 Create `/ShellX-Nexus/src/components/atoms/IconButton.tsx`
  * **Constraint:** Touch target area min 44×44px. Centered glyph icon.

- [ ] 📐 Create `/ShellX-Nexus/src/components/atoms/TextInput.tsx`
  * **Constraint:** Monospace font for input typing. Border: 1px solid `var(--color-border-subtle)`. Focused border: `var(--color-border-focus)`. No default browser outlines.

---

## Sub-Phase 3.1.D — Layout & Navigation Chrome

- [ ] 🌑 Create `/ShellX-Nexus/src/components/layout/DesktopSideNav.tsx`
  * **Constraint:** Persistent vertical navigation sidebar on left of width 256px. Background: `var(--color-background-elevated)`. Right boundary border: 1px solid `var(--color-border-subtle)`.
  * **Contents:** Profile header block (avatar image + `"root@shellx"` title), navigation links (Dashboard, Students, Curriculum, Gateways, Audits) using `NavLink` active class highlights.

- [ ] 🌑 Create `/ShellX-Nexus/src/components/layout/AppHeader.tsx`
  * **Constraint:** Top bar height 64px, width full. Flex layout.
  * **Contents:** Brand mark logo on left (`"ShellX_Nexus"` in JetBrains Mono success green), user sign-out action button on right.

- [ ] Create `/ShellX-Nexus/src/components/layout/AppLayout.tsx`
  * **Constraint:** Composes `AppHeader`, `DesktopSideNav`, and center main viewport scroll container.

---

---

# PHASE 3.2 — Routing, Session Guard & Firebase Auth Integration

> **Goal:** Wire the Firebase core config, setup React Router for navigation, and implement the secure Admin credentials verification flow.

---

## Sub-Phase 3.2.A — Firebase Setup & Env Wrapping

- [ ] ⚡ Create `/ShellX-Nexus/.env`
  * **Variables:** `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.

- [ ] ⚡ Create `/ShellX-Nexus/src/config/firebase.ts`
  * **Action:** Initialize Firebase App, Auth, and Firestore instances using Vite environment variables.

---

## Sub-Phase 3.2.B — Authentication Context

- [ ] 🔒 🔥 Create `/ShellX-Nexus/src/context/AuthContext.tsx`
  * **Action:** React Auth context provider. Tracks `user` object and `isAuthLoading` state.
  * **Methods:** `signInWithEmailAndPassword`, `signOut`.
  * **Admin Guard Logic:** Checks user metadata or specific admin collection path (e.g. `/admins/{uid}`) to verify the logged-in user has owner clearance before setting active state.

---

## Sub-Phase 3.2.C — Router Layout & Guards

- [ ] ⚡ Create `/ShellX-Nexus/src/navigation/AppRouter.tsx`
  * **Action:** Configure React Router paths:
    * `/login` (Public route)
    * `/dashboard`, `/students`, `/curriculum`, `/gateways`, `/audits` (Private admin routes wrapped in `<AppLayout>`).
  * **Guard Router Wrapper:** Redirects unauthenticated users to `/login`. Redirects authenticated users accessing `/login` back to `/dashboard`.

---

## Sub-Phase 3.2.D — Login Screen

- [ ] 🌑 ⌨️ Create `/ShellX-Nexus/src/screens/LoginScreen.tsx`
  * **Action:** Simulated CLI terminal login card.
  * **Aesthetic:** Horizontal centered 400px card. Simulated terminal title header (`"nexus_auth_session.sh"` + traffic lights). Displays boot initializer logs. Email and password forms styled with monospace font. Show any Firebase failures inside the mockup terminal logs in red syntax (`[ ERROR ] Invalid credentials`).

---

---

# PHASE 3.3 — Dashboard Overview & Real-Time PTY Feeds

> **Goal:** Build the main administrator view containing live client connection load widgets, server health graphs, and a live terminal commands audit feed.

---

## Sub-Phase 3.3.A — Live Analytics & Health Cards

- [ ] Create `/ShellX-Nexus/src/screens/DashboardScreen.tsx`
  * **Action:** Core layout for the overview page. Multi-column grid.

- [ ] Create `/ShellX-Nexus/src/components/dashboard/MetricsGrid.tsx`
  * **Action:** Grid of 4 counters: Active Connections, Average Latency, Sandbox Memory overhead, Daily Completions.

- [ ] Create `/ShellX-Nexus/src/components/dashboard/ServerResourceGraph.tsx`
  * **Action:** Graphic CPU/RAM resource tracker of the remote host container server.

---

## Sub-Phase 3.3.B — PTY Socket Audit Feed

- [ ] 🔌 Create `/ShellX-Nexus/src/components/dashboard/PTYCommandLogFeed.tsx`
  * **Action:** Auto-scrolling, monospace-styled console container that logs user command inputs in real-time.
  * **WS Integration:** Opens a WebSocket stream to the node-pty bridge gateway, listening for command audit logs. Displays username, timestamp, lesson reference, command typed, and status code.

---

---

# PHASE 3.4 — Student Directory & Audit Profiler

> **Goal:** Build the directory index of active/inactive users and the student details panel capable of auditing session logs.

---

## Sub-Phase 3.4.A — Student Directory Screen

- [ ] Create `/ShellX-Nexus/src/screens/StudentsScreen.tsx`
  * **Action:** Filterable grid/table of users. Contains query searches for name/email and filters by active/inactive states.

- [ ] Create `/ShellX-Nexus/src/components/students/StudentsTable.tsx`
  * **Action:** Columns: Name, Email, Active Status (success/error status dot), Joined Date, Current Lesson, Actions (Inspect details).

---

## Sub-Phase 3.4.B — Student Profiler & Live Console Attach

- [ ] Create `/ShellX-Nexus/src/screens/StudentDetailScreen.tsx`
  * **Action:** Comprehensive student logs audit panel.
  * **Sub-components:**
    * **Command Timeline Log:** Database listing of all terminal lines executed by this user, filterable by date and exit codes.
    * **Progress Matrix:** Visual checklist of completed/in-progress/locked modules.
    * **Live Console Mirror:** A terminal emulator block (`xterm.js` component) attached as a read-only stream to the student's active remote shell process for diagnostics.
    * **Console Actions Panel:** Wipe home folder, reset environment quota, delete/ban account.

---

---

# PHASE 3.5 — Curriculum Builder & Task Check Validation Engine

> **Goal:** Build the curriculum content management screen to dynamically manage Firestore modules, markdown instructions, and validation scripts.

---

## Sub-Phase 3.5.A — Curriculum Structure Organizer

- [ ] Create `/ShellX-Nexus/src/screens/CurriculumScreen.tsx`
  * **Action:** Main screen for editing modules and lessons.
  * **curriculum layout:** Drag-and-drop ordered list to arrange Module entries and reorder lessons within modules.

---

## Sub-Phase 3.5.B — Lesson Editor & Validation Settings

- [ ] Create `/ShellX-Nexus/src/components/curriculum/LessonDetailsForm.tsx`
  * **Action:** Editor form with:
    * Lesson name, description, estimated time, and module ordering keys.
    * Lesson instructions: Markdown text-area previewer.
    * Hints list builder.

- [ ] Create `/ShellX-Nexus/src/components/curriculum/ValidationEngineForm.tsx`
  * **Action:** Form elements to define validation commands:
    * `validationCommand` editor: The script run on checking (e.g. `[ -x /home/student/test.sh ]`).
    * `validationExpected`: Match output string constraint.

- [ ] Create `/ShellX-Nexus/src/components/curriculum/PublishStagingActions.tsx`
  * **Action:** Draft/Staging preview button (makes lesson visible to specific test UID profiles) and Publish/Production release button.

---

---

# PHASE 3.6 — Gateway VM Node Managers & Security Alerts

> **Goal:** Create views to configure remote node-pty host server details, review CPU limits per client container, and review flagged sentinel script activity.

---

## Sub-Phase 3.6.A — Gateway Node List & Templates

- [ ] Create `/ShellX-Nexus/src/screens/GatewaysScreen.tsx`
  * **Action:** Monitoring view for SSH VMs.
  * **Server Node Cards:** CPU, Memory, and network traffic gauges. Uptime counters. Active user limits configuration.
  * **Wipe Node Tool:** Remote command triggers to wipe container images or re-provision templates.

---

## Sub-Phase 3.6.B — Security Audits Sentinel

- [ ] Create `/ShellX-Nexus/src/screens/SecurityScreen.tsx`
  * **Action:** Audit logs of flagged commands (e.g. `sudo`, recursive fork loops, unauthorized port scans).
  * **Components:**
    * Flagged command alerts logs table.
    * Suspicious activity regex configuration form (define command pattern lists to trigger notifications).

---

---

# PHASE 3.7 — Production Deployment & Build Optimizations

- [ ] Run `npm run build` locally, verifying zero TypeScript errors in Vite compiling bundles.
- [ ] Configure ESLint rules checklist, enforcing type assertions safety.
- [ ] Deploy production bundle to Firebase Hosting or custom staging VM.
