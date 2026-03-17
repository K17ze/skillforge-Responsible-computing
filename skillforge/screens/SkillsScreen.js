import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import SkillCard from '../components/SkillCard';

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

const SKILLS_DATA = [
  {
    id: '1',
    name: 'React Native',
    category: 'Mobile Dev',
    progress: 65,
    status: 'In Progress',
    priority: 'High',
    nextMilestone: 'Build navigation flows',
  },
  {
    id: '2',
    name: 'Python',
    category: 'Backend',
    progress: 80,
    status: 'Advanced',
    priority: 'Medium',
    nextMilestone: 'Complete FastAPI project',
  },
  {
    id: '3',
    name: 'UI/UX Design',
    category: 'Design',
    progress: 40,
    status: 'In Progress',
    priority: 'High',
    nextMilestone: 'Finish wireframing module',
  },
  {
    id: '4',
    name: 'Node.js',
    category: 'Backend',
    progress: 55,
    status: 'In Progress',
    priority: 'Medium',
    nextMilestone: 'Build REST API',
  },
  {
    id: '5',
    name: 'TypeScript',
    category: 'Frontend',
    progress: 25,
    status: 'Beginner',
    priority: 'Low',
    nextMilestone: 'Learn type annotations',
  },
  {
    id: '6',
    name: 'GraphQL',
    category: 'API',
    progress: 10,
    status: 'Just Started',
    priority: 'Low',
    nextMilestone: 'Complete intro tutorial',
  },
];

export default function SkillsScreen({ navigation }) {
  const highPriorityCount = SKILLS_DATA.filter(s => s.priority === 'High').length;
  const avgProgress = Math.round(
    SKILLS_DATA.reduce((acc, s) => acc + s.progress, 0) / SKILLS_DATA.length
  );

  const renderHeader = () => (
    <>
      {/* Top nav */}
      <View style={styles.topBar}>
        <Text style={styles.brandMark}>SF</Text>
        <Text style={styles.topBarSub}>My Roadmap</Text>
      </View>

      {/* Hero header */}
      <View style={styles.heroRow}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroTitle}>Skills</Text>
          <Text style={styles.heroSubtitle}>{SKILLS_DATA.length} tracked</Text>
        </View>
        {/* Circular avg progress badge */}
        <View style={styles.avgCircle}>
          <Text style={styles.avgValue}>{avgProgress}%</Text>
          <Text style={styles.avgLabel}>avg</Text>
        </View>
      </View>

      {/* Stats strip */}
      <View style={styles.statsStrip}>
        <StatItem value={highPriorityCount} label="High Priority" color={C.danger} />
        <View style={styles.statDivider} />
        <StatItem
          value={SKILLS_DATA.filter(s => s.status === 'In Progress').length}
          label="In Progress"
          color={C.accent}
        />
        <View style={styles.statDivider} />
        <StatItem
          value={SKILLS_DATA.filter(s => s.status === 'Advanced').length}
          label="Advanced"
          color={C.success}
        />
      </View>

      {/* Section label */}
      <View style={styles.sectionLabelRow}>
        <Text style={styles.sectionLabel}>ACTIVE SKILLS</Text>
        <View style={styles.sectionLine} />
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <FlatList
        data={SKILLS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SkillCard skill={item} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddSkill')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+ Add Skill</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function StatItem({ value, label, color }) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  listContent: {
    paddingBottom: 110,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 24,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  brandMark: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 3,
    color: C.bgDark,
  },
  topBarSub: {
    fontSize: 12,
    color: C.muted,
    letterSpacing: 1.5,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  heroLeft: {},
  heroTitle: {
    fontSize: 48,
    fontWeight: '300',
    color: C.bgDark,
    letterSpacing: -1,
    lineHeight: 52,
  },
  heroSubtitle: {
    fontSize: 13,
    color: C.muted,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  avgCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1.5,
    borderColor: C.accent,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: C.cardBg,
  },
  avgValue: {
    fontSize: 18,
    fontWeight: '600',
    color: C.accent,
    letterSpacing: -0.5,
  },
  avgLabel: {
    fontSize: 9,
    color: C.muted,
    letterSpacing: 1,
    marginTop: 1,
  },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: C.cardBg,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: C.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    color: C.muted,
    marginTop: 3,
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: C.border,
    marginHorizontal: 8,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    color: C.muted,
    letterSpacing: 2.5,
    fontWeight: '600',
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    backgroundColor: C.bgDark,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 100,
    elevation: 6,
    shadowColor: C.bgDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  fabText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.8,
  },
});
