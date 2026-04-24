import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { useSkills } from '../App';

// ─── Design Tokens ─────────────────────────────────────────────────────────
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
};

const PRIORITY_MAP = {
  High: { dot: '#B85C50', label: '#B85C50', bg: '#F5E8E6' },
  Medium: { dot: '#B08040', label: '#B08040', bg: '#F5EDDF' },
  Low: { dot: '#5A8A6A', label: '#5A8A6A', bg: '#E6F0E9' },
};

const STATUS_MAP = {
  Advanced: '#5A8A6A',
  'In Progress': C.accent,
  Beginner: '#B08040',
  'Just Started': C.muted,
};

export default function SkillCard({ skill, onLongPress, onDelete }) {
  const navigation = useNavigation();
  const { skills } = useSkills();

  const handlePress = () => {
    navigation.navigate('SkillDetail', { skillId: skill.id });
  };

  const pm = PRIORITY_MAP[skill.priority] || { dot: C.muted, label: C.muted, bg: C.cardBg };
  const statusColor = STATUS_MAP[skill.status] || C.muted;

  // Check if any dependency is incomplete
  const hasIncompleteDep =
    skill.dependencies &&
    skill.dependencies.length > 0 &&
    skill.dependencies.some((depId) => {
      const dep = skills.find((s) => s.id === depId);
      return dep && dep.progress < 75;
    });

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity onPress={onDelete} style={styles.deleteAction} activeOpacity={0.8}>
        <Animated.Text style={[styles.deleteText, { transform: [{ scale }] }]}>
          Delete
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={onDelete ? renderRightActions : undefined} friction={2} overshootRight={false}>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        onLongPress={onLongPress}
        activeOpacity={1} // use 1 since Swipeable manages its own opacity logic mostly, but let's keep it clean
        delayLongPress={400}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.nameBlock}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{skill.name}</Text>
              {hasIncompleteDep && <Text style={styles.depWarning}>⚠️</Text>}
            </View>
            <Text style={styles.category}>{skill.category}</Text>
          </View>
          <View style={[styles.priorityPill, { backgroundColor: pm.bg }]}>
            <View style={[styles.priorityDot, { backgroundColor: pm.dot }]} />
            <Text style={[styles.priorityLabel, { color: pm.label }]}>{skill.priority}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Progress section */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <View style={styles.statusPill}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>{skill.status}</Text>
            </View>
            <Text style={styles.progressPct}>{skill.progress}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${skill.progress}%` }]} />
          </View>
        </View>

        {/* Milestone */}
        <Text style={styles.milestone} numberOfLines={1}>
          → {skill.nextMilestone}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.cardBg,
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  deleteAction: {
    backgroundColor: C.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 16,
    marginBottom: 10,
    marginLeft: 10,
  },
  deleteText: {
    color: C.white,
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  nameBlock: {
    flex: 1,
    marginRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: C.bgDark,
    letterSpacing: -0.2,
  },
  depWarning: {
    fontSize: 14,
  },
  category: {
    fontSize: 11,
    color: C.muted,
    marginTop: 3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginBottom: 12,
  },
  progressSection: {
    marginBottom: 10,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  progressPct: {
    fontSize: 13,
    fontWeight: '600',
    color: C.bgDark,
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: C.accent,
    borderRadius: 2,
  },
  milestone: {
    fontSize: 11,
    color: C.muted,
    letterSpacing: 0.3,
    marginTop: 2,
  },
});
