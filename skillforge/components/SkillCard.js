import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const PRIORITY_COLORS = {
  High: '#EF4444',
  Medium: '#F59E0B',
  Low: '#10B981',
};

const STATUS_COLORS = {
  Advanced: '#10B981',
  'In Progress': '#8B5CF6',
  Beginner: '#F59E0B',
  'Just Started': '#6B7280',
};

export default function SkillCard({ skill }) {
  const handlePress = () => {
    Alert.alert(
      skill.name,
      `📁 Category: ${skill.category}\n📊 Progress: ${skill.progress}%\n🎯 Status: ${skill.status}\n⚡ Priority: ${skill.priority}\n\n🔜 Next milestone:\n${skill.nextMilestone}\n\n(Full skill detail view coming in the final app)`,
      [{ text: 'Close' }]
    );
  };

  const priorityColor = PRIORITY_COLORS[skill.priority] || '#6B7280';
  const statusColor = STATUS_COLORS[skill.status] || '#6B7280';

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.75}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{skill.name}</Text>
          <Text style={styles.category}>{skill.category}</Text>
        </View>
        <View style={[styles.priorityBadge, { borderColor: priorityColor, backgroundColor: priorityColor + '20' }]}>
          <Text style={[styles.priorityText, { color: priorityColor }]}>{skill.priority}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${skill.progress}%` }]} />
        </View>
        <Text style={styles.progressPct}>{skill.progress}%</Text>
      </View>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <View style={[styles.statusDot, { backgroundColor: statusColor + '25' }]}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{skill.status}</Text>
        </View>
        <Text style={styles.milestone} numberOfLines={1}>→ {skill.nextMilestone}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#13132A',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D2D50',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  nameBlock: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  category: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
  },
  priorityBadge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    backgroundColor: '#2D2D50',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  progressPct: {
    color: '#9CA3AF',
    fontSize: 12,
    width: 34,
    textAlign: 'right',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusDot: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  milestone: {
    color: '#4B5563',
    fontSize: 11,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
});
