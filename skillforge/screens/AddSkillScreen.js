import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Alert, StatusBar, SafeAreaView,
} from 'react-native';
import { useSkills } from '../App';
import MilestoneItem from '../components/MilestoneItem';

const C = {
  bg: '#F5F0E8', bgDark: '#1C1917', accent: '#8B6F5E',
  muted: '#9E8E80', border: '#D8CEBD', cardBg: '#EDE8DE',
  white: '#FFFFFF', danger: '#B85C50', success: '#5A8A6A', warn: '#B08040',
};

const CATEGORIES = ['Mobile Dev','Frontend','Backend','Design','Data Science','DevOps','API','Other'];
const PRIORITIES = ['High','Medium','Low'];
const LEVELS = ['Complete Beginner','Some Exposure','Intermediate','Advanced'];
const PCOL = {
  High:{active:'#B85C50',bg:'#F5E8E6'},
  Medium:{active:'#B08040',bg:'#F5EDDF'},
  Low:{active:'#5A8A6A',bg:'#E6F0E9'},
};

export default function AddSkillScreen({ navigation }) {
  const { skills, addSkill } = useSkills();
  const [skillName, setSkillName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [notes, setNotes] = useState('');
  const [milestones, setMilestones] = useState([]);
  const [milestoneInput, setMilestoneInput] = useState('');
  const [selectedDependencies, setSelectedDependencies] = useState([]);

  const handleAddMilestone = () => {
    const t = milestoneInput.trim();
    if (!t) return;
    setMilestones(p => [...p, {id:'m'+Date.now(), text:t, completed:false}]);
    setMilestoneInput('');
  };

  const toggleDependency = (id) => {
    if (selectedDependencies.includes(id)) {
      setSelectedDependencies(selectedDependencies.filter(dep => dep !== id));
    } else {
      setSelectedDependencies([...selectedDependencies, id]);
    }
  };

  const handleSave = () => {
    if (!skillName.trim()) { Alert.alert('Missing Field','Please enter a skill name.'); return; }
    if (!selectedCategory) { Alert.alert('Missing Field','Please select a category.'); return; }
    addSkill({
      id: Date.now().toString(), name: skillName.trim(), category: selectedCategory,
      priority: selectedPriority||'Medium', level: selectedLevel||'Complete Beginner',
      notes: notes.trim(), milestones, progress: 0, status: 'Just Started',
      nextMilestone: milestones.length>0 ? milestones[0].text : 'Set your first milestone',
      createdAt: new Date().toISOString(), dependencies: selectedDependencies,
    });
    navigation.navigate('Skills');
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <View style={s.topBar}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Text style={s.backArrow}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.brandMark}>SF</Text>
      </View>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.heroSection}>
          <Text style={s.heroTitle}>Add Skill</Text>
          <Text style={s.heroSub}>What do you want to master next?</Text>
        </View>

        <SectionLabel text="SKILL NAME" required />
        <TextInput style={s.input} placeholder="e.g. Kubernetes, Swift, Figma..." placeholderTextColor={C.muted} value={skillName} onChangeText={setSkillName} />

        <SectionLabel text="CATEGORY" required />
        <View style={s.chipWrap}>
          {CATEGORIES.map(c=>(
            <TouchableOpacity key={c} style={[s.chip, selectedCategory===c&&s.chipActive]} onPress={()=>setSelectedCategory(c)}>
              <Text style={[s.chipText, selectedCategory===c&&s.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionLabel text="PRIORITY" />
        <View style={s.priorityRow}>
          {PRIORITIES.map(p=>{const pc=PCOL[p];const sel=selectedPriority===p;return(
            <TouchableOpacity key={p} style={[s.priorityBtn,{borderColor:pc.active},sel&&{backgroundColor:pc.bg}]} onPress={()=>setSelectedPriority(p)}>
              <View style={[s.priorityDot,{backgroundColor:pc.active}]} />
              <Text style={[s.priorityText,{color:pc.active}]}>{p}</Text>
            </TouchableOpacity>
          );})}
        </View>

        <SectionLabel text="CURRENT LEVEL" />
        <View style={s.chipWrap}>
          {LEVELS.map(l=>(
            <TouchableOpacity key={l} style={[s.chip, selectedLevel===l&&s.chipActive]} onPress={()=>setSelectedLevel(l)}>
              <Text style={[s.chipText, selectedLevel===l&&s.chipTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionLabel text="MILESTONES" />
        <View style={s.milestoneSection}>
          {milestones.map(m=>(
            <MilestoneItem key={m.id} milestone={m} onDelete={()=>setMilestones(p=>p.filter(x=>x.id!==m.id))} />
          ))}
          <View style={s.addMRow}>
            <TextInput style={s.mInput} placeholder="Add a milestone..." placeholderTextColor={C.muted} value={milestoneInput} onChangeText={setMilestoneInput} onSubmitEditing={handleAddMilestone} />
            <TouchableOpacity style={s.addMBtn} onPress={handleAddMilestone}>
              <Text style={s.addMBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {skills && skills.length > 0 && (
          <>
            <SectionLabel text="PREREQUISITES" />
            <View style={s.chipWrap}>
              {skills.map(skill => {
                const isSelected = selectedDependencies.includes(skill.id);
                return (
                  <TouchableOpacity 
                    key={skill.id} 
                    style={[s.chip, isSelected && s.chipActive]} 
                    onPress={() => toggleDependency(skill.id)}
                  >
                    <Text style={[s.chipText, isSelected && s.chipTextActive]}>{skill.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <SectionLabel text="NOTES (OPTIONAL)" />
        <TextInput style={[s.input,s.textArea]} placeholder="Why do you want to learn this?" placeholderTextColor={C.muted} value={notes} onChangeText={setNotes} multiline numberOfLines={4} textAlignVertical="top" />

        <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={s.saveBtnText}>Add to My Roadmap</Text>
        </TouchableOpacity>
        <View style={{height:40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({text,required}){return(
  <View style={s.sectionLabelRow}>
    <Text style={s.sectionLabel}>{text}</Text>
    {required&&<Text style={s.requiredDot}> *</Text>}
    <View style={s.sectionLine} />
  </View>
);}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg},
  topBar:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:24,paddingVertical:14,borderBottomWidth:1,borderBottomColor:C.border},
  backArrow:{fontSize:14,color:C.bgDark,letterSpacing:0.3},
  brandMark:{fontSize:18,fontWeight:'700',letterSpacing:3,color:C.bgDark},
  scroll:{flex:1},
  content:{paddingHorizontal:24,paddingTop:28,paddingBottom:20},
  heroSection:{marginBottom:32},
  heroTitle:{fontSize:44,fontWeight:'300',color:C.bgDark,letterSpacing:-0.8,lineHeight:48},
  heroSub:{fontSize:14,color:C.muted,marginTop:6,letterSpacing:0.2},
  sectionLabelRow:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:12,marginTop:24},
  sectionLabel:{fontSize:9,color:C.muted,letterSpacing:2.5,fontWeight:'700'},
  requiredDot:{color:C.danger,fontSize:12,marginTop:-2},
  sectionLine:{flex:1,height:1,backgroundColor:C.border},
  input:{backgroundColor:C.cardBg,borderWidth:1,borderColor:C.border,borderRadius:12,padding:14,fontSize:15,color:C.bgDark},
  textArea:{height:110,textAlignVertical:'top'},
  chipWrap:{flexDirection:'row',flexWrap:'wrap',gap:8},
  chip:{borderWidth:1,borderColor:C.border,borderRadius:100,paddingHorizontal:14,paddingVertical:8,backgroundColor:C.cardBg},
  chipActive:{backgroundColor:C.bgDark,borderColor:C.bgDark},
  chipText:{color:C.muted,fontSize:12,letterSpacing:0.3},
  chipTextActive:{color:C.white,fontWeight:'500'},
  priorityRow:{flexDirection:'row',gap:10},
  priorityBtn:{flex:1,borderWidth:1,borderRadius:12,paddingVertical:14,alignItems:'center',flexDirection:'row',justifyContent:'center',gap:6},
  priorityDot:{width:7,height:7,borderRadius:4},
  priorityText:{fontWeight:'600',fontSize:13,letterSpacing:0.3},
  milestoneSection:{backgroundColor:C.cardBg,borderWidth:1,borderColor:C.border,borderRadius:12,padding:14},
  addMRow:{flexDirection:'row',alignItems:'center',gap:8,marginTop:6},
  mInput:{flex:1,backgroundColor:C.bg,borderWidth:1,borderColor:C.border,borderRadius:8,paddingHorizontal:12,paddingVertical:10,fontSize:14,color:C.bgDark},
  addMBtn:{backgroundColor:C.bgDark,borderRadius:8,paddingHorizontal:16,paddingVertical:10},
  addMBtnText:{color:C.white,fontSize:13,fontWeight:'600'},
  saveBtn:{backgroundColor:C.bgDark,borderRadius:100,paddingVertical:18,alignItems:'center',marginTop:32},
  saveBtnText:{color:C.white,fontSize:15,fontWeight:'500',letterSpacing:1.5},
});
