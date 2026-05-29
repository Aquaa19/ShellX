# Coder AI Prompt — Phase 1.4: Part 3 (Linting and Final Static Checks)

Please resolve the following 5 ESLint errors and 2 warnings to make the static linting gate pass with 0 errors.

---

### ⚠️ IMPORTANT: STRICT RULE ON EXTERNAL CONTEXT
You do not have direct access to our local files. **DO NOT guess, assume, or hallucinate the contents, exports, or types of any existing project files.**
* If you need to see the exact implementation of any existing file to write your code correctly, **you must explicitly stop and ask the user to provide that file.**
* Do not make assumptions about sibling files or dependency structures.

---

## 📂 Active ESLint Issues to Resolve

### 1. `/src/atoms/badges/TrafficLightDots.tsx`
* **Issue:** `'activeState'` is assigned a value but never used (unused variable).
* **Fix:** Remove the unused `activeState` variable or prefix it with an underscore `_activeState` (or remove it from props/destructuring if it is indeed redundant).

### 2. `/src/atoms/buttons/TerminalKeyButton.tsx`
* **Issue:** Inline style warning `react-native/no-inline-styles`: `Inline style: { minWidth: ... }`.
* **Fix:** Move the style evaluation to the `StyleSheet.create` structure or compute it outside the inline definition to satisfy the stylesheet constraint.

### 3. `/src/components/filesystem/FileTreeBranch.tsx`
* **Issue:** `'Theme'` is defined but never used (unused import).
* **Fix:** Remove the unused `Theme` import.

### 4. `/src/navigation/MainTabNavigator.tsx`
* **Issue:** Warning: `Do not define components during render` (`react/no-unstable-nested-components`).
* **Fix:** Move the tab bar render function into a separate standalone function component defined outside `MainTabNavigator` (e.g. `renderTabBar` or `CustomTabBar`), or add an eslint-disable comment for `react/no-unstable-nested-components` if the inline tabBar prop is required by React Navigation conventions.

### 5. `/src/screens/FileSystemScreen.tsx`
* **Issue:** `'FolderRow'` is defined but never used (unused import).
* **Fix:** Remove the unused `FolderRow` import.

### 6. `/src/screens/LessonsScreen.tsx`
* **Issue:** `'activeFilter'` is assigned a value but never used (unused state).
* **Fix:** Remove the unused state or mark it as unused if it is a placeholder for future state.

### 7. `/src/screens/TerminalScreen.tsx`
* **Issue:** `'setShowLessonContext'` is assigned a value but never used (unused function).
* **Fix:** Remove the unused function from destructuring or use it to toggle the context view.
