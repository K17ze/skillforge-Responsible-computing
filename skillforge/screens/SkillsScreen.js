import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSkills } from '../App';
import SkillCard from '../components/SkillCard';
import FilterBar from '../components/FilterBar';

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

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 };

export default function SkillsScreen({ navigation }) {
  const { skills, loading, deleteSkill } = useSkills();
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortMode, setSortMode] = useState('priority');
  const [refreshing, setRefreshing] = useState(false);

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  // Unique categories from skills
  const categories = [...new Set(skills.map((s) => s.category))];

  // Filter + sort logic
  let displayed = [...skills];
  if (activeFilter !== 'All') {
    displayed = displayed.filter((s) => s.category === activeFilter);
  }
  switch (sortMode) {
    case 'priority':
      displayed.sort((a, b) => (PRIORITY_RANK[a.priority] ?? 3) - (PRIORITY_RANK[b.priority] ?? 3));
      break;
    case 'progress_asc':
      displayed.sort((a, b) => a.progress - b.progress);
      break;
    case 'progress_desc':
      displayed.sort((a, b) => b.progress - a.progress);
      break;
    case 'alpha':
      displayed.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'recent':
      displayed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }

  // Dynamic stats
  const highPriorityCount = skills.filter((s) => s.priority === 'High').length;
  const inProgressCount = skills.filter((s) => s.status === 'In Progress').length;
  const advancedCount = skills.filter((s) => s.status === 'Advanced').length;
  const avgProgress =
    skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.progress, 0) / skills.length)
      : 0;

  // Long-press handler
  const handleLongPress = (skill) => {
    Alert.alert(skill.name, 'Choose an action', [
      {
        text: 'Edit',
        onPress: () => navigation.navigate('SkillDetail', { skillId: skill.id }),
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Delete Skill', `Remove "${skill.name}" from your roadmap?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteSkill(skill.id) },
          ]);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={C.accent} />
        <Text style={{ color: C.muted, marginTop: 12 }}>Loading your skills…</Text>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.heroSubtitle}>{skills.length} tracked</Text>
        </View>
        <View style={styles.avgCircle}>
          <Text style={styles.avgValue}>{avgProgress}%</Text>
          <Text style={styles.avgLabel}>avg</Text>
        </View>
      </View>

      {/* Stats strip */}
      <View style={styles.statsStrip}>
        <StatItem value={highPriorityCount} label="High Priority" color={C.danger} />
        <View style={styles.statDivider} />
        <StatItem value={inProgressCount} label="In Progress" color={C.accent} />
        <View style={styles.statDivider} />
        <StatItem value={advancedCount} label="Advanced" color={C.success} />
      </View>

      {/* Filter bar */}
      <FilterBar
        categories={categories}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortMode={sortMode}
        onSortChange={setSortMode}
      />

      {/* Section label */}
      <View style={styles.sectionLabelRow}>
        <Text style={styles.sectionLabel}>ACTIVE SKILLS</Text>
        <View style={styles.sectionLine} />
      </View>
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No skills found</Text>
      <Text style={styles.emptySub}>
        {activeFilter !== 'All'
          ? `No skills in "${activeFilter}". Try a different filter.`
          : 'Start building your roadmap by adding your first skill.'}
      </Text>
      <TouchableOpacity
        style={styles.emptyBtn}
        onPress={() => navigation.navigate('AddSkill')}
        activeOpacity={0.8}
      >
        <Text style={styles.emptyBtnText}>+ Add Skill</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <FlatList
        data={displayed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SkillCard
            skill={item}
            onLongPress={() => handleLongPress(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={C.accent}
            colors={[C.accent]}
          />
        }
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
    marginBottom: 20,
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: C.bgDark,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: C.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyBtn: {
    backgroundColor: C.bgDark,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
  },
  emptyBtnText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
