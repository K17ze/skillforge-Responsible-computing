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

const CATEGORIES = ['Mobile Dev', 'Frontend', 'Backend', 'Design', 'Data Science', 'DevOps', 'API', 'Other'];
const PRIORITIES = ['High', 'Medium', 'Low'];
const LEVELS = ['Complete Beginner', 'Some Exposure', 'Intermediate', 'Advanced'];

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
      '✅ Skill Added!',
      `"${skillName}" has been added to your roadmap.\n\nPriority: ${selectedPriority || 'Not set'}\nCurrent Level: ${selectedLevel || 'Not set'}`,
      [{ text: 'View Roadmap', onPress: () => navigation.navigate('Skills') }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A1A" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Add New Skill</Text>
        <Text style={styles.subtitle}>What do you want to learn next?</Text>

        {/* Skill Name */}
        <Text style={styles.label}>Skill Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Kubernetes, Swift, Figma..."
          placeholderTextColor="#4B5563"
          value={skillName}
          onChangeText={setSkillName}
        />

        {/* Category */}
        <Text style={styles.label}>Category <Text style={styles.required}>*</Text></Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, selectedCategory === cat && styles.chipSelected]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextSelected]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Priority */}
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => {
            const color = p === 'High' ? '#EF4444' : p === 'Medium' ? '#F59E0B' : '#10B981';
            const isSelected = selectedPriority === p;
            return (
              <TouchableOpacity
                key={p}
                style={[styles.priorityBtn, { borderColor: color }, isSelected && { backgroundColor: color }]}
                onPress={() => setSelectedPriority(p)}
              >
                <Text style={[styles.priorityText, { color: isSelected ? '#FFF' : color }]}>{p}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Current Level */}
        <Text style={styles.label}>Current Level</Text>
        <View style={styles.chipRow}>
          {LEVELS.map(l => (
            <TouchableOpacity
              key={l}
              style={[styles.chip, selectedLevel === l && styles.chipSelected]}
              onPress={() => setSelectedLevel(l)}
            >
              <Text style={[styles.chipText, selectedLevel === l && styles.chipTextSelected]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Why do you want to learn this? Any resources in mind?"
          placeholderTextColor="#4B5563"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Save */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveText}>Add to My Roadmap</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
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
  content: {
    padding: 24,
    paddingTop: 16,
  },
  backBtn: {
    marginBottom: 18,
  },
  backText: {
    color: '#8B5CF6',
    fontSize: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 28,
  },
  label: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 20,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#13132A',
    borderWidth: 1,
    borderColor: '#2D2D50',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#FFFFFF',
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#13132A',
  },
  chipSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  chipText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  priorityText: {
    fontWeight: '700',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
