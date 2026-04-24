import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const C = {
  bgDark: '#1C1917',
  accent: '#8B6F5E',
  muted: '#9E8E80',
  border: '#D8CEBD',
  cardBg: '#EDE8DE',
  success: '#5A8A6A',
  danger: '#B85C50',
  white: '#FFFFFF',
};

export default function MilestoneItem({ milestone, onToggle, onDelete }) {
  return (
    <View style={styles.row}>
      {/* Checkbox */}
      {onToggle && (
        <TouchableOpacity onPress={onToggle} style={styles.checkArea} activeOpacity={0.6}>
          <View style={[styles.checkbox, milestone.completed && styles.checkboxFilled]}>
            {milestone.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
      )}

      {/* Text */}
      <Text
        style={[styles.text, milestone.completed && styles.textCompleted]}
        numberOfLines={2}
      >
        {milestone.text}
      </Text>

      {/* Delete button */}
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteArea} activeOpacity={0.6}>
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 10,
  },
  checkArea: {
    padding: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxFilled: {
    backgroundColor: C.success,
    borderColor: C.success,
  },
  checkmark: {
    color: C.white,
    fontSize: 12,
    fontWeight: '700',
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: C.bgDark,
    letterSpacing: 0.1,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: C.muted,
  },
  deleteArea: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 14,
    color: C.danger,
    fontWeight: '600',
  },
});
