import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#F5F0E8',
  bgDark: '#1C1917',
  accent: '#8B6F5E',
  accentLight: '#C4A882',
  muted: '#9E8E80',
  border: '#D8CEBD',
  cardBg: '#EDE8DE',
  white: '#FFFFFF',
  danger: '#B85C50',
  success: '#5A8A6A',
  warn: '#B08040',
};

const CATEGORIES = ['Mobile Dev', 'Frontend', 'Backend', 'Design', 'Data Science', 'DevOps', 'API', 'Other'];
const PRIORITIES = ['High', 'Medium', 'Low'];
const LEVELS = ['Complete Beginner', 'Some Exposure', 'Intermediate', 'Advanced'];

const PRIORITY_COLORS = {
  High:   { active: '#B85C50', bg: '#F5E8E6' },
  Medium: { active: '#B08040', bg: '#F5EDDF' },
  Low:    { active: '#5A8A6A', bg: '#E6F0E9' },
};

export default function AddSkillScreen({ navigation }) {
  const [skillName, setSkillName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!skillName.trim()) {
      Alert.alert('Missing Field', 'Please enter a skill name to continue.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Missing Field', 'Please select a category.');
      return;
    }
    Alert.alert(
      'Skill Added',
      `"${skillName}" has been added to your roadmap.\n\nPriority: ${selectedPriority || 'Not set'}\nCurrent Level: ${selectedLevel || 'Not set'}`,
      [{ text: 'View Roadmap', onPress: () => navigation.navigate('Skills') }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Top nav */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.brandMark}>SF</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Page hero */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Add Skill</Text>
          <Text style={styles.heroSub}>What do you want to master next?</Text>
        </View>

        {/* ── Skill Name ── */}
        <SectionLabel text="SKILL NAME" required />
        <TextInput
          style={styles.input}
          placeholder="e.g. Kubernetes, Swift, Figma..."
          placeholderTextColor={C.muted}
          value={skillName}
          onChangeText={setSkillName}
        />

        {/* ── Category ── */}
        <SectionLabel text="CATEGORY" required />
        <View style={styles.chipWrap}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, selectedCategory === cat && styles.chipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Priority ── */}
        <SectionLabel text="PRIORITY" />
        <View style={styles.priorityRow}>
          {PRIORITIES.map(p => {
            const pc = PRIORITY_COLORS[p];
            const isSelected = selectedPriority === p;
            return (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityBtn,
                  { borderColor: pc.active },
                  isSelected && { backgroundColor: pc.bg },
                ]}
                onPress={() => setSelectedPriority(p)}
              >
                <View style={[styles.priorityDot, { backgroundColor: pc.active }]} />
                <Text style={[styles.priorityText, { color: pc.active }]}>{p}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Level ── */}
        <SectionLabel text="CURRENT LEVEL" />
        <View style={styles.chipWrap}>
          {LEVELS.map(l => (
            <TouchableOpacity
              key={l}
              style={[styles.chip, selectedLevel === l && styles.chipActive]}
              onPress={() => setSelectedLevel(l)}
            >
              <Text style={[styles.chipText, selectedLevel === l && styles.chipTextActive]}>
                {l}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Notes ── */}
        <SectionLabel text="NOTES (OPTIONAL)" />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Why do you want to learn this? Any resources in mind?"
          placeholderTextColor={C.muted}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Save CTA */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Add to My Roadmap</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ text, required }) {
  return (
    <View style={styles.sectionLabelRow}>
      <Text style={styles.sectionLabel}>{text}</Text>
      {required && <Text style={styles.requiredDot}> *</Text>}
      <View style={styles.sectionLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backArrow: {
    fontSize: 14,
    color: C.bgDark,
    letterSpacing: 0.3,
  },
  brandMark: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 3,
    color: C.bgDark,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
  },
  heroSection: {
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '300',
    color: C.bgDark,
    letterSpacing: -0.8,
    lineHeight: 48,
  },
  heroSub: {
    fontSize: 14,
    color: C.muted,
    marginTop: 6,
    letterSpacing: 0.2,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginTop: 24,
  },
  sectionLabel: {
    fontSize: 9,
    color: C.muted,
    letterSpacing: 2.5,
    fontWeight: '700',
  },
  requiredDot: {
    color: C.danger,
    fontSize: 12,
    marginTop: -2,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  input: {
    backgroundColor: C.cardBg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: C.bgDark,
    letterSpacing: 0.1,
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: C.cardBg,
  },
  chipActive: {
    backgroundColor: C.bgDark,
    borderColor: C.bgDark,
  },
  chipText: {
    color: C.muted,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  chipTextActive: {
    color: C.white,
    fontWeight: '500',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  priorityText: {
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  saveBtn: {
    backgroundColor: C.bgDark,
    borderRadius: 100,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 32,
  },
  saveBtnText: {
    color: C.white,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 1.5,
  },
});
