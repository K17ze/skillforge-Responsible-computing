import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from './screens/WelcomeScreen';
import SkillsScreen from './screens/SkillsScreen';
import AddSkillScreen from './screens/AddSkillScreen';
import SkillDetailScreen from './screens/SkillDetailScreen';
import initialSkills from './data/initialSkills.json';

const STORAGE_KEY = '@skillforge_skills';

// ─── Derived-field helpers ─────────────────────────────────────────────────────
function recalcDerived(skill) {
  const s = { ...skill };
  if (s.milestones && s.milestones.length > 0) {
    const completed = s.milestones.filter((m) => m.completed).length;
    s.progress = Math.round((completed / s.milestones.length) * 100);
  }
  const p = s.progress;
  if (p < 25) s.status = 'Just Started';
  else if (p < 50) s.status = 'Beginner';
  else if (p < 75) s.status = 'In Progress';
  else s.status = 'Advanced';

  if (s.milestones && s.milestones.length > 0) {
    const next = s.milestones.find((m) => !m.completed);
    s.nextMilestone = next ? next.text : 'All complete!';
  }
  return s;
}

// ─── Context ───────────────────────────────────────────────────────────────────
const SkillsContext = createContext();
export const useSkills = () => useContext(SkillsContext);

function SkillsProvider({ children }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSkills(JSON.parse(stored));
        } else {
          const initial = initialSkills.map((s) => recalcDerived(s));
          setSkills(initial);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        }
      } catch (e) {
        setSkills(initialSkills.map((s) => recalcDerived(s)));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback((updated) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
  }, []);

  const addSkill = useCallback((skill) => {
    setSkills((prev) => {
      const enriched = recalcDerived(skill);
      const updated = [...prev, enriched];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const updateSkill = useCallback((id, updates) => {
    setSkills((prev) => {
      const updated = prev.map((s) => {
        if (s.id === id) return recalcDerived({ ...s, ...updates });
        return s;
      });
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const deleteSkill = useCallback((id) => {
    setSkills((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const toggleMilestone = useCallback((skillId, milestoneId) => {
    setSkills((prev) => {
      const updated = prev.map((s) => {
        if (s.id === skillId) {
          const newMilestones = s.milestones.map((m) => {
            if (m.id === milestoneId) return { ...m, completed: !m.completed };
            return m;
          });
          return recalcDerived({ ...s, milestones: newMilestones });
        }
        return s;
      });
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  return (
    <SkillsContext.Provider
      value={{ skills, loading, addSkill, updateSkill, deleteSkill, toggleMilestone }}
    >
      {children}
    </SkillsContext.Provider>
  );
}

// ─── Navigator ─────────────────────────────────────────────────────────────────
const Stack = createStackNavigator();

export default function App() {
  return (
    <SkillsProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Skills" component={SkillsScreen} />
          <Stack.Screen name="AddSkill" component={AddSkillScreen} />
          <Stack.Screen name="SkillDetail" component={SkillDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SkillsProvider>
  );
}
