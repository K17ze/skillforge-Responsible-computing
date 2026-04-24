# SkillForge — AI Build Plan (Prototype → Final)

## Context

SkillForge is a React Native Expo Snack app for tracking personal learning skills. The prototype scored 9.6/20 because the tutor couldn't reach the Add Skill screen during testing and back navigation was missing. The final is worth 45 points and is due 28 April 2026.

**Platform:** Expo Snack (snack.expo.dev) — NOT a local project. Must run in Snack.
**Framework:** React Native with React Navigation (stack navigator)
**Persistence:** AsyncStorage (required by brief)
**Auth:** None — the brief forbids signup/login flows

---

## Current Prototype Codebase

### File Structure
```
App.js
screens/WelcomeScreen.js
screens/SkillsScreen.js
screens/AddSkillScreen.js
components/SkillCard.js
package.json
```

### Current package.json
```json
{
  "dependencies": {
    "@react-navigation/native": "*",
    "@react-navigation/stack": "*",
    "react-native-screens": "*",
    "react-native-safe-area-context": "*",
    "@react-native-masked-view/masked-view": "*"
  }
}
```

### App.js (current)
```jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import SkillsScreen from './screens/SkillsScreen';
import AddSkillScreen from './screens/AddSkillScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Skills" component={SkillsScreen} />
        <Stack.Screen name="AddSkill" component={AddSkillScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### screens/SkillsScreen.js (current)
- Renders a hardcoded `SKILLS_DATA` array of 6 skills via FlatList
- Each skill object: `{ id, name, category, progress, status, priority, nextMilestone }`
- The 6 skills: React Native, Python, UI/UX Design, Node.js, TypeScript, GraphQL
- Summary chips show counts for High Priority, In Progress, Advanced
- Average progress badge in header
- FAB button navigates to AddSkill screen
- No sorting, no filtering, no state management — purely static display

### screens/AddSkillScreen.js (current)
- Form fields: skill name (TextInput), category (8 chip options), priority (3 colour-coded buttons), level (4 chip options), notes (TextInput)
- Validates skill name and category
- On submit: shows an Alert with skill details, alert button navigates to Skills screen
- Does NOT save the skill anywhere — no state update, no AsyncStorage
- Has a `← Back` text button that calls `navigation.goBack()`

### components/SkillCard.js (current)
- Receives `skill` prop, renders card with name, category, priority badge, progress bar, status dot, next milestone
- On tap: shows an Alert with skill details (placeholder)
- Colour maps: priority (red/amber/green), status (green/purple/amber/grey)

### screens/WelcomeScreen.js (current)
- Branded splash with app name, tagline, 3 feature highlights
- "Get Started" button navigates to Skills screen
- Footer: "No account needed · Data stays on device"

### Visual Style (IMPORTANT — use this, not the dark theme)
The user restyled the app to a warm cream/beige colour scheme:
- Background: cream/off-white (#F5F0E8 or similar)
- Cards: light sage/olive tint with subtle borders
- Accents: warm brown/olive tones
- Priority colours: red (High), amber (Medium), green (Low)
- Typography: clean sans-serif, large headings
- Dark elements: black buttons, dark card headers
- **Do NOT use the dark purple theme (#0A0A1A, #8B5CF6) from the original code**

---

## What Must Change for the Final

### Critical Fixes (from tutor feedback)
1. **Navigation must be bulletproof** — every screen reachable, back buttons visible on every screen
2. **Form must save data** — adding a skill must make it appear in the skills list
3. **AsyncStorage** — required by assignment brief

### Required Features (from rubric + tutor feedback)
4. **Data transformation** — sort, filter, enrich — not just display a static list
5. **Sorting** — by priority, progress, alphabetical, date added
6. **Filtering** — by category, by priority, by status
7. **Skill detail/edit screen** — tap a card to view and edit (not just an alert)
8. **Gestures** — tutor requested: swipe to edit/archive, pull to refresh, long press for quick actions
9. **Milestones** — sub-goals within each skill that auto-update progress

### Differentiating Features
10. **Skill dependencies** — mark prerequisites between skills
11. **Progress visualisation** — visual summary beyond just numbers

---

## Target File Structure (Final)

```
App.js                       — Navigation + SkillsContext provider
screens/WelcomeScreen.js     — Landing (minimal changes)
screens/SkillsScreen.js      — Main list with sort/filter/gestures
screens/AddSkillScreen.js    — Form that saves to context + AsyncStorage
screens/SkillDetailScreen.js — NEW: full detail view with edit + milestones
components/SkillCard.js      — Updated: long press, navigate to detail
components/FilterBar.js      — NEW: category/priority/sort controls
components/MilestoneItem.js  — NEW: checkbox milestone row
data/initialSkills.json      — NEW: default data loaded on first launch
package.json                 — Updated dependencies
```

---

## Detailed Implementation Plan

### Step 1: Update package.json

```json
{
  "dependencies": {
    "@react-navigation/native": "*",
    "@react-navigation/stack": "*",
    "react-native-screens": "*",
    "react-native-safe-area-context": "*",
    "@react-native-masked-view/masked-view": "*",
    "@react-native-async-storage/async-storage": "*",
    "react-native-gesture-handler": "*"
  }
}
```

### Step 2: Create data/initialSkills.json

Move hardcoded data here. Expand each skill object with new fields:

```json
[
  {
    "id": "1",
    "name": "React Native",
    "category": "Mobile Dev",
    "progress": 65,
    "status": "In Progress",
    "priority": "High",
    "nextMilestone": "Build navigation flows",
    "milestones": [
      { "id": "m1", "text": "Setup Expo project", "completed": true },
      { "id": "m2", "text": "Build navigation flows", "completed": false },
      { "id": "m3", "text": "Implement AsyncStorage", "completed": false },
      { "id": "m4", "text": "Add gesture handling", "completed": false }
    ],
    "notes": "",
    "level": "Intermediate",
    "createdAt": "2026-01-15T00:00:00Z",
    "dependencies": []
  },
  {
    "id": "2",
    "name": "Python",
    "category": "Backend",
    "progress": 80,
    "status": "Advanced",
    "priority": "Medium",
    "nextMilestone": "Complete FastAPI project",
    "milestones": [
      { "id": "m1", "text": "Learn syntax basics", "completed": true },
      { "id": "m2", "text": "Build CLI tools", "completed": true },
      { "id": "m3", "text": "Complete FastAPI project", "completed": false }
    ],
    "notes": "",
    "level": "Advanced",
    "createdAt": "2025-11-01T00:00:00Z",
    "dependencies": []
  },
  {
    "id": "3",
    "name": "UI/UX Design",
    "category": "Design",
    "progress": 40,
    "status": "In Progress",
    "priority": "High",
    "nextMilestone": "Finish wireframing module",
    "milestones": [
      { "id": "m1", "text": "Study design principles", "completed": true },
      { "id": "m2", "text": "Finish wireframing module", "completed": false },
      { "id": "m3", "text": "Build a case study", "completed": false }
    ],
    "notes": "",
    "level": "Some Exposure",
    "createdAt": "2026-02-10T00:00:00Z",
    "dependencies": []
  },
  {
    "id": "4",
    "name": "Node.js",
    "category": "Backend",
    "progress": 55,
    "status": "In Progress",
    "priority": "Medium",
    "nextMilestone": "Build REST API",
    "milestones": [
      { "id": "m1", "text": "Understand event loop", "completed": true },
      { "id": "m2", "text": "Build REST API", "completed": false },
      { "id": "m3", "text": "Deploy to production", "completed": false }
    ],
    "notes": "",
    "level": "Intermediate",
    "createdAt": "2026-01-20T00:00:00Z",
    "dependencies": ["2"]
  },
  {
    "id": "5",
    "name": "TypeScript",
    "category": "Frontend",
    "progress": 25,
    "status": "Beginner",
    "priority": "Low",
    "nextMilestone": "Learn type annotations",
    "milestones": [
      { "id": "m1", "text": "Learn type annotations", "completed": false },
      { "id": "m2", "text": "Convert a JS project", "completed": false }
    ],
    "notes": "",
    "level": "Complete Beginner",
    "createdAt": "2026-03-01T00:00:00Z",
    "dependencies": []
  },
  {
    "id": "6",
    "name": "GraphQL",
    "category": "API",
    "progress": 10,
    "status": "Just Started",
    "priority": "Low",
    "nextMilestone": "Complete intro tutorial",
    "milestones": [
      { "id": "m1", "text": "Complete intro tutorial", "completed": false },
      { "id": "m2", "text": "Build a schema", "completed": false }
    ],
    "notes": "",
    "level": "Complete Beginner",
    "createdAt": "2026-03-10T00:00:00Z",
    "dependencies": ["4"]
  }
]
```

### Step 3: Rewrite App.js — Add Context Provider

Create a `SkillsContext` using React Context API inside App.js (or a separate file if preferred, but keeping it in App.js is simpler for Snack).

**SkillsContext must provide:**
- `skills` — the array
- `loading` — boolean, true until AsyncStorage read completes
- `addSkill(skill)` — adds to array + saves to AsyncStorage
- `updateSkill(id, updates)` — merges updates into skill + saves
- `deleteSkill(id)` — removes from array + saves
- `toggleMilestone(skillId, milestoneId)` — toggles completion, recalculates progress/status/nextMilestone + saves

**AsyncStorage logic:**
```
On mount:
  1. Try AsyncStorage.getItem('@skillforge_skills')
  2. If found: parse and set as skills
  3. If not found: load initialSkills.json, set as skills, save to AsyncStorage
  4. Set loading = false

On any mutation:
  1. Update state
  2. AsyncStorage.setItem('@skillforge_skills', JSON.stringify(updatedSkills))
```

**Auto-derived fields (recalculate on every mutation):**
- `progress` = `Math.round((completed / total milestones) * 100)` — if no milestones, keep manual value
- `status` = progress < 25 → "Just Started", < 50 → "Beginner", < 75 → "In Progress", >= 75 → "Advanced"
- `nextMilestone` = first milestone where completed === false, or "All complete!"

**Navigator update:**
```jsx
<Stack.Screen name="SkillDetail" component={SkillDetailScreen} />
```

Export a `useSkills()` custom hook:
```jsx
export const useSkills = () => React.useContext(SkillsContext);
```

### Step 4: Update screens/SkillsScreen.js

**Remove:** hardcoded SKILLS_DATA constant

**Add:**
- `const { skills, loading, deleteSkill } = useSkills();`
- Loading spinner while `loading === true`
- **FilterBar component** above FlatList:
  - Category filter: horizontal scroll of chips (All + all categories from skills)
  - Sort picker: Priority, Progress ↑, Progress ↓, A-Z, Recent
- **Filter/sort logic** in the component:
  ```
  let displayed = [...skills];
  if (activeFilter !== 'All') displayed = displayed.filter(s => s.category === activeFilter);
  switch (sortMode) {
    case 'priority': sort by High > Medium > Low
    case 'progress_asc': sort by progress ascending
    case 'progress_desc': sort by progress descending
    case 'alpha': sort by name alphabetically
    case 'recent': sort by createdAt descending
  }
  ```
- **Pull to refresh**: `<FlatList refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} />`
  - `onRefresh`: reload from AsyncStorage (or just set refreshing true briefly for the animation)
- **Empty state**: when `displayed.length === 0`, show helpful message + button to AddSkill
- **Summary chips**: compute dynamically from `skills` array
- **Long press on card**: `onLongPress` prop on SkillCard → show Alert with buttons: "Edit" (navigate to SkillDetail), "Delete" (confirm + deleteSkill), "Cancel"

### Step 5: Update screens/AddSkillScreen.js

**Keep:** existing form layout and validation

**Add:**
- `const { addSkill } = useSkills();`
- **Milestones input section** below Notes:
  - TextInput for milestone text + "Add" button
  - List of added milestones with delete buttons (MilestoneItem component)
  - Each milestone: `{ id: 'm' + Date.now(), text: inputText, completed: false }`
- **On submit:**
  ```jsx
  const newSkill = {
    id: Date.now().toString(),
    name: skillName.trim(),
    category: selectedCategory,
    priority: selectedPriority || 'Medium',
    level: selectedLevel || 'Complete Beginner',
    notes: notes.trim(),
    milestones: milestones,   // the array built from the input
    progress: 0,
    status: 'Just Started',
    nextMilestone: milestones.length > 0 ? milestones[0].text : 'Set your first milestone',
    createdAt: new Date().toISOString(),
    dependencies: [],
  };
  addSkill(newSkill);
  navigation.navigate('Skills');
  ```
- **Remove** the Alert-based confirmation — the skill appearing in the list IS the confirmation. This is a deliberate improvement over the prototype (good for the video comparison section).

### Step 6: Create screens/SkillDetailScreen.js (NEW)

Receives `route.params.skillId`. Looks up skill from context.

**Layout (top to bottom):**
1. **Header**: back button (← Back) + skill name + priority badge
2. **Progress display**: large progress number + progress bar + status label
3. **Info row**: category chip, level chip, "Added: [date]"
4. **Milestones section**:
   - Header: "Milestones (X/Y complete)"
   - List of MilestoneItem components with toggleable checkboxes
   - "Add Milestone" input + button at bottom of list
   - Toggling a milestone calls `toggleMilestone(skillId, milestoneId)` from context → progress bar updates live
5. **Dependencies section** (if skill has dependencies):
   - Header: "Prerequisites"
   - List of dependency skill names with their progress
   - If dependency incomplete: show warning text "Complete [skill name] first"
6. **Notes section**: display notes, tappable to edit
7. **Action buttons at bottom**:
   - "Edit Skill" → could toggle form fields to editable, or navigate to an edit mode
   - "Delete Skill" → Alert confirmation → `deleteSkill(id)` → `navigation.goBack()`

### Step 7: Update components/SkillCard.js

**Changes:**
- `onPress` → `navigation.navigate('SkillDetail', { skillId: skill.id })` instead of Alert
- Need `navigation` prop — either pass from parent or use `useNavigation()` hook
- Add `onLongPress` prop — parent (SkillsScreen) passes a handler that shows action menu
- If dependencies exist and are incomplete, show a small ⚠️ icon on the card
- Keep existing visual layout (name, category, priority badge, progress bar, status, milestone)

### Step 8: Create components/FilterBar.js (NEW)

**Props:** `categories` (array), `activeFilter` (string), `onFilterChange` (callback), `sortMode` (string), `onSortChange` (callback)

**Layout:**
- Row 1: horizontal ScrollView of category chips. "All" + each unique category from skills
- Row 2: "Sort:" label + tappable sort mode text that cycles through options on tap

**Style:** match the cream/beige theme. Active chip = filled dark, inactive = outlined

### Step 9: Create components/MilestoneItem.js (NEW)

**Props:** `milestone`, `onToggle` (optional), `onDelete` (optional)

**Layout:** `[checkbox] milestone text [delete button]`
- Checkbox: filled circle if completed, empty circle if not
- Completed milestones: text has line-through style
- onToggle: called when checkbox tapped (used in SkillDetailScreen)
- onDelete: shows X button (used in AddSkillScreen during creation)

### Step 10: Update screens/WelcomeScreen.js

Minimal changes:
- Ensure navigation works
- Optionally check if skills exist in AsyncStorage and show "Continue Your Journey" instead of "Get Started"

---

## Data Schema (Final)

```
Skill {
  id: string                     // Date.now().toString()
  name: string                   // required
  category: string               // required, from: Mobile Dev, Frontend, Backend, Design, Data Science, DevOps, API, Other
  progress: number               // 0-100, auto-calculated from milestones
  status: string                 // auto-derived: Just Started / Beginner / In Progress / Advanced
  priority: 'High' | 'Medium' | 'Low'
  nextMilestone: string          // auto-set to first incomplete milestone text
  milestones: Milestone[]
  notes: string
  level: string                  // Complete Beginner / Some Exposure / Intermediate / Advanced
  createdAt: string              // ISO date
  dependencies: string[]         // array of skill IDs
}

Milestone {
  id: string                     // 'm' + Date.now()
  text: string
  completed: boolean
}
```

**Auto-derived fields (recalculate on every change):**
- `progress` = `Math.round((completed count / total count) * 100)` — default 0 if no milestones
- `status`: 0-24% → "Just Started", 25-49% → "Beginner", 50-74% → "In Progress", 75-100% → "Advanced"
- `nextMilestone`: first `milestone.text` where `completed === false`, or "All complete!"

---

## AsyncStorage Keys

| Key | Value | Purpose |
|---|---|---|
| `@skillforge_skills` | JSON string of skills array | All user skills |
| `@skillforge_sort` | String sort mode | Persisted sort preference |
| `@skillforge_filter` | String category or "All" | Persisted filter preference |

---

## Styling Rules

**Use the cream/beige theme from the screenshots, NOT the dark purple theme from the original code.**

| Element | Colour |
|---|---|
| Screen background | Cream/off-white (#F5F0E8) |
| Card background | Light sage/olive tint (#EDEADF or similar) with subtle border |
| Primary text | Dark brown/black (#1A1A1A) |
| Secondary text | Muted (#8B8577 or similar) |
| Accent/brand | Warm olive/brown |
| Priority High | Red (#C44) |
| Priority Medium | Amber (#B8860B) |
| Priority Low | Green (#2D6A4F) |
| Buttons | Black/dark (#1A1A1A) with light text |
| Active filter chip | Dark filled |
| Inactive filter chip | Light outlined |

---

## Build Order (Follow Exactly)

1. Create `data/initialSkills.json` with expanded skill objects
2. Rewrite `App.js` — SkillsContext provider + AsyncStorage + SkillDetailScreen in navigator
3. Create `components/FilterBar.js`
4. Create `components/MilestoneItem.js`
5. Update `screens/SkillsScreen.js` — context, filter/sort, pull-to-refresh, empty state, long press
6. Update `screens/AddSkillScreen.js` — save via context, milestones input, navigate back
7. Create `screens/SkillDetailScreen.js` — full detail, milestone toggles, edit, delete
8. Update `components/SkillCard.js` — navigate to detail, long press, dependency indicator
9. Update `screens/WelcomeScreen.js` — minor tweaks
10. Update `package.json` — add AsyncStorage + gesture handler
11. Test everything in Expo Snack

---

## Testing Checklist

Every item here must work in the Expo Snack URL before submission:

1. [ ] App loads without errors on Snack
2. [ ] Welcome → Skills navigation works
3. [ ] Skills screen shows list with data
4. [ ] "+ Add Skill" FAB → navigates to form
5. [ ] Back button on form → returns to Skills
6. [ ] Fill form + submit → new skill appears in list
7. [ ] Tap skill card → navigates to detail screen
8. [ ] Back button on detail → returns to Skills
9. [ ] Toggle milestone → progress updates in real time
10. [ ] Filter by category works
11. [ ] Sort changes work
12. [ ] Close + reopen app → data persists
13. [ ] Delete a skill → removed from list
14. [ ] Long press card → action menu appears
15. [ ] Pull to refresh → refresh animation
16. [ ] Delete all skills → empty state message shown
17. [ ] Add milestones during skill creation → they appear in detail view

---

## Expo Snack Gotchas

- Import paths are relative: `./screens/X` not `/screens/X`
- `react-native-gesture-handler` may not work fully in Snack — if Swipeable breaks, use long-press + Alert menus as fallback for ALL gesture features. Working > fancy.
- AsyncStorage import: `import AsyncStorage from '@react-native-async-storage/async-storage'`
- No Node.js APIs (fs, path, etc.)
- Test on iOS, Android, AND Web previews in Snack
- If a package doesn't resolve, check Expo SDK compatibility
- JSON file import: `import initialSkills from './data/initialSkills.json'` should work in Snack
