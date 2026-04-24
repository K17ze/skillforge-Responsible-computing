import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Alert, StatusBar, SafeAreaView,
} from 'react-native';
import { useSkills } from '../App';
import MilestoneItem from '../components/MilestoneItem';

const C = {
  bg:'#F5F0E8', bgDark:'#1C1917', accent:'#8B6F5E',
  muted:'#9E8E80', border:'#D8CEBD', cardBg:'#EDE8DE',
  white:'#FFFFFF', danger:'#B85C50', success:'#5A8A6A', warn:'#B08040',
};
const PM = {
  High:{dot:'#B85C50',label:'#B85C50',bg:'#F5E8E6'},
  Medium:{dot:'#B08040',label:'#B08040',bg:'#F5EDDF'},
  Low:{dot:'#5A8A6A',label:'#5A8A6A',bg:'#E6F0E9'},
};
const SM = { Advanced:'#5A8A6A','In Progress':'#8B6F5E',Beginner:'#B08040','Just Started':'#9E8E80' };
const CATEGORIES = ['Mobile Dev','Frontend','Backend','Design','Data Science','DevOps','API','Other'];
const PRIORITIES = ['High','Medium','Low'];
const LEVELS = ['Complete Beginner','Some Exposure','Intermediate','Advanced'];

export default function SkillDetailScreen({ route, navigation }) {
  const { skills, updateSkill, deleteSkill, toggleMilestone } = useSkills();
  const skill = skills.find(s => s.id === route.params.skillId);
  const [newMilestone, setNewMilestone] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editLevel, setEditLevel] = useState('');
  const [editDependencies, setEditDependencies] = useState([]);

  if (!skill) {
    return (
      <SafeAreaView style={st.safe}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Text style={st.backArrow}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontSize:16,color:C.muted}}>Skill not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const pm = PM[skill.priority]||{dot:C.muted,label:C.muted,bg:C.cardBg};
  const sc = SM[skill.status]||C.muted;
  const done = skill.milestones ? skill.milestones.filter(m=>m.completed).length : 0;
  const total = skill.milestones ? skill.milestones.length : 0;
  const depSkills = (skill.dependencies||[]).map(id=>skills.find(s=>s.id===id)).filter(Boolean);

  const handleAddMilestone = () => {
    const t = newMilestone.trim();
    if (!t) return;
    updateSkill(skill.id, { milestones: [...(skill.milestones||[]), {id:'m'+Date.now(),text:t,completed:false}] });
    setNewMilestone('');
  };

  const handleDelete = () => {
    Alert.alert('Delete Skill', `Remove "${skill.name}"?`, [
      {text:'Cancel',style:'cancel'},
      {text:'Delete',style:'destructive',onPress:()=>{deleteSkill(skill.id);navigation.goBack();}},
    ]);
  };

  const startEdit = () => {
    setEditName(skill.name);
    setEditCategory(skill.category);
    setEditPriority(skill.priority);
    setEditLevel(skill.level);
    setEditDependencies(skill.dependencies || []);
    setIsEditing(true);
  };

  const toggleDependency = (id) => {
    if (editDependencies.includes(id)) {
      setEditDependencies(editDependencies.filter(dep => dep !== id));
    } else {
      setEditDependencies([...editDependencies, id]);
    }
  };

  const saveEdit = () => {
    if (!editName.trim()) { Alert.alert('Error','Name cannot be empty.'); return; }
    updateSkill(skill.id, {
      name: editName.trim(),
      category: editCategory || skill.category,
      priority: editPriority || skill.priority,
      level: editLevel || skill.level,
      dependencies: editDependencies,
    });
    setIsEditing(false);
  };

  const otherSkills = skills.filter(s => s.id !== skill.id);

  return (
    <SafeAreaView style={st.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <View style={st.topBar}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Text style={st.backArrow}>← Back</Text>
        </TouchableOpacity>
        <Text style={st.brandMark}>SF</Text>
      </View>

      <ScrollView contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        {isEditing ? (
          <View style={st.editSection}>
            <Text style={st.editLabel}>SKILL NAME</Text>
            <TextInput style={st.editInput} value={editName} onChangeText={setEditName} />
            <Text style={[st.editLabel,{marginTop:16}]}>CATEGORY</Text>
            <View style={st.chipWrap}>
              {CATEGORIES.map(c=>(
                <TouchableOpacity key={c} style={[st.chip, editCategory===c&&st.chipActive]} onPress={()=>setEditCategory(c)}>
                  <Text style={[st.chipText, editCategory===c&&st.chipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[st.editLabel,{marginTop:16}]}>PRIORITY</Text>
            <View style={st.chipWrap}>
              {PRIORITIES.map(p=>(
                <TouchableOpacity key={p} style={[st.chip, editPriority===p&&st.chipActive]} onPress={()=>setEditPriority(p)}>
                  <Text style={[st.chipText, editPriority===p&&st.chipTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[st.editLabel,{marginTop:16}]}>LEVEL</Text>
            <View style={st.chipWrap}>
              {LEVELS.map(l=>(
                <TouchableOpacity key={l} style={[st.chip, editLevel===l&&st.chipActive]} onPress={()=>setEditLevel(l)}>
                  <Text style={[st.chipText, editLevel===l&&st.chipTextActive]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {otherSkills.length > 0 && (
              <>
                <Text style={[st.editLabel,{marginTop:16}]}>PREREQUISITES</Text>
                <View style={st.chipWrap}>
                  {otherSkills.map(s => {
                    const isSelected = editDependencies.includes(s.id);
                    return (
                      <TouchableOpacity 
                        key={s.id} 
                        style={[st.chip, isSelected && st.chipActive]} 
                        onPress={() => toggleDependency(s.id)}
                      >
                        <Text style={[st.chipText, isSelected && st.chipTextActive]}>{s.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            <View style={st.editBtnRow}>
              <TouchableOpacity style={st.savEditBtn} onPress={saveEdit}><Text style={st.savEditBtnText}>Save</Text></TouchableOpacity>
              <TouchableOpacity style={st.cancelEditBtn} onPress={()=>setIsEditing(false)}><Text style={st.cancelEditBtnText}>Cancel</Text></TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={st.headerRow}>
            <View style={{flex:1}}>
              <Text style={st.skillName}>{skill.name}</Text>
            </View>
            <View style={[st.priorityPill,{backgroundColor:pm.bg}]}>
              <View style={[st.priorityDot,{backgroundColor:pm.dot}]} />
              <Text style={[st.priorityLabel,{color:pm.label}]}>{skill.priority}</Text>
            </View>
          </View>
        )}

        {/* Progress card */}
        <View style={st.progressCard}>
          <Text style={st.progressBig}>{skill.progress}%</Text>
          <View style={st.progressTrack}>
            <View style={[st.progressFill,{width:`${skill.progress}%`}]} />
          </View>
          <View style={st.statusRow}>
            <View style={[st.statusDot,{backgroundColor:sc}]} />
            <Text style={[st.statusText,{color:sc}]}>{skill.status}</Text>
          </View>
        </View>

        {/* Info row */}
        <View style={st.infoRow}>
          <View style={st.infoChip}><Text style={st.infoChipText}>{skill.category}</Text></View>
          <View style={st.infoChip}><Text style={st.infoChipText}>{skill.level}</Text></View>
          <Text style={st.dateText}>Added: {new Date(skill.createdAt).toLocaleDateString()}</Text>
        </View>

        {/* Milestones */}
        <View style={st.section}>
          <View style={st.sectionHeader}>
            <Text style={st.sectionTitle}>MILESTONES ({done}/{total})</Text>
            <View style={st.sectionLine} />
          </View>
          {skill.milestones && skill.milestones.map(m=>(
            <MilestoneItem key={m.id} milestone={m} onToggle={()=>toggleMilestone(skill.id,m.id)} />
          ))}
          <View style={st.addMRow}>
            <TextInput style={st.mInput} placeholder="Add a milestone..." placeholderTextColor={C.muted} value={newMilestone} onChangeText={setNewMilestone} onSubmitEditing={handleAddMilestone} />
            <TouchableOpacity style={st.addMBtn} onPress={handleAddMilestone}><Text style={st.addMBtnText}>Add</Text></TouchableOpacity>
          </View>
        </View>

        {/* Dependencies */}
        {depSkills.length > 0 && (
          <View style={st.section}>
            <View style={st.sectionHeader}>
              <Text style={st.sectionTitle}>PREREQUISITES</Text>
              <View style={st.sectionLine} />
            </View>
            {depSkills.map(d=>(
              <View key={d.id} style={st.depRow}>
                <Text style={st.depName}>{d.name}</Text>
                <Text style={st.depProgress}>{d.progress}%</Text>
                {d.progress < 75 && <Text style={st.depWarn}>⚠️ Complete {d.name} first</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Notes */}
        <View style={st.section}>
          <View style={st.sectionHeader}>
            <Text style={st.sectionTitle}>NOTES</Text>
            <View style={st.sectionLine} />
          </View>
          {editingNotes ? (
            <View>
              <TextInput style={st.notesInput} value={editNotes} onChangeText={setEditNotes} multiline numberOfLines={4} textAlignVertical="top" autoFocus />
              <TouchableOpacity style={st.saveNotesBtn} onPress={()=>{updateSkill(skill.id,{notes:editNotes});setEditingNotes(false);}}>
                <Text style={st.saveNotesBtnText}>Save Notes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={()=>{setEditNotes(skill.notes||'');setEditingNotes(true);}}>
              <Text style={st.notesText}>{skill.notes ? skill.notes : 'Tap to add notes...'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Actions */}
        <View style={st.actionRow}>
          {!isEditing && (
            <TouchableOpacity style={st.editBtn} onPress={startEdit}><Text style={st.editBtnText}>Edit Skill</Text></TouchableOpacity>
          )}
          <TouchableOpacity style={st.deleteBtn} onPress={handleDelete}><Text style={st.deleteBtnText}>Delete Skill</Text></TouchableOpacity>
        </View>
        <View style={{height:40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg},
  topBar:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:24,paddingVertical:14,borderBottomWidth:1,borderBottomColor:C.border},
  backArrow:{fontSize:14,color:C.bgDark,letterSpacing:0.3},
  brandMark:{fontSize:18,fontWeight:'700',letterSpacing:3,color:C.bgDark},
  content:{paddingHorizontal:24,paddingTop:24,paddingBottom:20},
  headerRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20},
  skillName:{fontSize:32,fontWeight:'300',color:C.bgDark,letterSpacing:-0.5},
  priorityPill:{flexDirection:'row',alignItems:'center',borderRadius:100,paddingHorizontal:12,paddingVertical:6,gap:5},
  priorityDot:{width:7,height:7,borderRadius:4},
  priorityLabel:{fontSize:12,fontWeight:'600',letterSpacing:0.3},
  progressCard:{backgroundColor:C.cardBg,borderRadius:16,padding:20,borderWidth:1,borderColor:C.border,marginBottom:16},
  progressBig:{fontSize:48,fontWeight:'300',color:C.bgDark,textAlign:'center',letterSpacing:-2},
  progressTrack:{height:6,backgroundColor:C.border,borderRadius:3,overflow:'hidden',marginVertical:14},
  progressFill:{height:'100%',backgroundColor:C.accent,borderRadius:3},
  statusRow:{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:6},
  statusDot:{width:8,height:8,borderRadius:4},
  statusText:{fontSize:13,fontWeight:'600',letterSpacing:0.3},
  infoRow:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:20,alignItems:'center'},
  infoChip:{borderWidth:1,borderColor:C.border,borderRadius:100,paddingHorizontal:12,paddingVertical:6,backgroundColor:C.cardBg},
  infoChipText:{fontSize:11,color:C.accent,letterSpacing:0.5,fontWeight:'500'},
  dateText:{fontSize:11,color:C.muted,letterSpacing:0.3},
  section:{marginBottom:20},
  sectionHeader:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:12},
  sectionTitle:{fontSize:10,color:C.muted,letterSpacing:2.5,fontWeight:'600'},
  sectionLine:{flex:1,height:1,backgroundColor:C.border},
  addMRow:{flexDirection:'row',alignItems:'center',gap:8,marginTop:10},
  mInput:{flex:1,backgroundColor:C.cardBg,borderWidth:1,borderColor:C.border,borderRadius:8,paddingHorizontal:12,paddingVertical:10,fontSize:14,color:C.bgDark},
  addMBtn:{backgroundColor:C.bgDark,borderRadius:8,paddingHorizontal:16,paddingVertical:10},
  addMBtnText:{color:C.white,fontSize:13,fontWeight:'600'},
  depRow:{paddingVertical:10,borderBottomWidth:1,borderBottomColor:C.border},
  depName:{fontSize:15,fontWeight:'600',color:C.bgDark},
  depProgress:{fontSize:13,color:C.accent,marginTop:2},
  depWarn:{fontSize:12,color:C.warn,marginTop:4},
  notesInput:{backgroundColor:C.cardBg,borderWidth:1,borderColor:C.border,borderRadius:12,padding:14,fontSize:14,color:C.bgDark,minHeight:100,textAlignVertical:'top'},
  saveNotesBtn:{backgroundColor:C.bgDark,borderRadius:8,paddingVertical:10,alignItems:'center',marginTop:10},
  saveNotesBtnText:{color:C.white,fontSize:13,fontWeight:'600'},
  notesText:{fontSize:14,color:C.muted,lineHeight:22,fontStyle:'italic'},
  actionRow:{flexDirection:'row',gap:10,marginTop:8},
  editBtn:{flex:1,backgroundColor:C.bgDark,borderRadius:100,paddingVertical:16,alignItems:'center'},
  editBtnText:{color:C.white,fontSize:14,fontWeight:'500',letterSpacing:0.5},
  deleteBtn:{flex:1,borderWidth:1,borderColor:C.danger,borderRadius:100,paddingVertical:16,alignItems:'center'},
  deleteBtnText:{color:C.danger,fontSize:14,fontWeight:'500',letterSpacing:0.5},
  editSection:{marginBottom:20,backgroundColor:C.cardBg,borderRadius:16,padding:20,borderWidth:1,borderColor:C.border},
  editLabel:{fontSize:9,color:C.muted,letterSpacing:2.5,fontWeight:'700',marginBottom:8},
  editInput:{backgroundColor:C.bg,borderWidth:1,borderColor:C.border,borderRadius:8,padding:12,fontSize:16,color:C.bgDark},
  chipWrap:{flexDirection:'row',flexWrap:'wrap',gap:8},
  chip:{borderWidth:1,borderColor:C.border,borderRadius:100,paddingHorizontal:12,paddingVertical:7,backgroundColor:C.bg},
  chipActive:{backgroundColor:C.bgDark,borderColor:C.bgDark},
  chipText:{color:C.muted,fontSize:12},
  chipTextActive:{color:C.white,fontWeight:'500'},
  editBtnRow:{flexDirection:'row',gap:10,marginTop:20},
  savEditBtn:{flex:1,backgroundColor:C.bgDark,borderRadius:100,paddingVertical:14,alignItems:'center'},
  savEditBtnText:{color:C.white,fontSize:14,fontWeight:'500'},
  cancelEditBtn:{flex:1,borderWidth:1,borderColor:C.border,borderRadius:100,paddingVertical:14,alignItems:'center'},
  cancelEditBtnText:{color:C.muted,fontSize:14,fontWeight:'500'},
});
