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

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A1A" />
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Roadmap</Text>
            <Text style={styles.headerSubtitle}>{SKILLS_DATA.length} skills tracked</Text>
          </View>
          <View style={styles.avgBadge}>
            <Text style={styles.avgLabel}>Avg.</Text>
            <Text style={styles.avgValue}>{avgProgress}%</Text>
          </View>
        </View>

        {/* Summary row */}
        <View style={styles.summaryRow}>
          <SummaryChip label="High Priority" value={highPriorityCount} color="#EF4444" />
          <SummaryChip label="In Progress" value={SKILLS_DATA.filter(s => s.status === 'In Progress').length} color="#8B5CF6" />
          <SummaryChip label="Advanced" value={SKILLS_DATA.filter(s => s.status === 'Advanced').length} color="#10B981" />
        </View>

        {/* List */}
        <FlatList
          data={SKILLS_DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SkillCard skill={item} />}
          contentContainerStyle={styles.list}
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
      </View>
    </SafeAreaView>
  );
}

function SummaryChip({ label, value, color }) {
  return (
    <View style={[styles.chip, { borderColor: color + '60' }]}>
      <Text style={[styles.chipValue, { color }]}>{value}</Text>
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0A0A1A',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8B5CF6',
    marginTop: 3,
  },
  avgBadge: {
    alignItems: 'center',
    backgroundColor: '#8B5CF620',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  avgLabel: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  avgValue: {
    color: '#8B5CF6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  chip: {
    flex: 1,
    backgroundColor: '#13132A',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  chipValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chipLabel: {
    color: '#6B7280',
    fontSize: 10,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
