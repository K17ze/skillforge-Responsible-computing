import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const C = {
  bg: '#F5F0E8',
  bgDark: '#1C1917',
  accent: '#8B6F5E',
  muted: '#9E8E80',
  border: '#D8CEBD',
  cardBg: '#EDE8DE',
  white: '#FFFFFF',
};

const SORT_LABELS = {
  priority: 'Priority',
  progress_asc: 'Progress ↑',
  progress_desc: 'Progress ↓',
  alpha: 'A → Z',
  recent: 'Recent',
};

const SORT_ORDER = ['priority', 'progress_asc', 'progress_desc', 'alpha', 'recent'];

export default function FilterBar({
  categories,
  activeFilter,
  onFilterChange,
  sortMode,
  onSortChange,
}) {
  const handleCycleSort = () => {
    const currentIndex = SORT_ORDER.indexOf(sortMode);
    const nextIndex = (currentIndex + 1) % SORT_ORDER.length;
    onSortChange(SORT_ORDER[nextIndex]);
  };

  return (
    <View style={styles.container}>
      {/* Category filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScroll}
      >
        {['All', ...categories].map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onFilterChange(cat)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sort selector */}
      <TouchableOpacity style={styles.sortRow} onPress={handleCycleSort} activeOpacity={0.7}>
        <Text style={styles.sortLabel}>Sort:</Text>
        <Text style={styles.sortValue}>{SORT_LABELS[sortMode] || 'Priority'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  chipScroll: {
    paddingVertical: 4,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: C.cardBg,
  },
  chipActive: {
    backgroundColor: C.bgDark,
    borderColor: C.bgDark,
  },
  chipText: {
    fontSize: 12,
    color: C.muted,
    letterSpacing: 0.3,
  },
  chipTextActive: {
    color: C.white,
    fontWeight: '500',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  sortLabel: {
    fontSize: 11,
    color: C.muted,
    letterSpacing: 0.5,
  },
  sortValue: {
    fontSize: 12,
    color: C.bgDark,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
