import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A1A" />
      <View style={styles.container}>

        {/* Logo area */}
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>⚡</Text>
          </View>
          <Text style={styles.appName}>SkillForge</Text>
          <Text style={styles.tagline}>Your skills. Your path.</Text>
        </View>

        {/* Feature highlights */}
        <View style={styles.featuresContainer}>
          <FeatureRow icon="📋" text="Track skills you're learning" />
          <FeatureRow icon="🗺️" text="Build your personal learning roadmap" />
          <FeatureRow icon="🏆" text="Visualise your progress & milestones" />
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Skills')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Get Started →</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>No account needed · Data stays on your device</Text>
      </View>
    </SafeAreaView>
  );
}

function FeatureRow({ icon, text }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#8B5CF620',
    borderWidth: 2,
    borderColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  iconEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 15,
    color: '#8B5CF6',
    marginTop: 8,
    letterSpacing: 1.5,
  },
  featuresContainer: {
    width: '100%',
    backgroundColor: '#13132A',
    borderRadius: 18,
    padding: 22,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#2D2D50',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  featureText: {
    color: '#D1D5DB',
    fontSize: 15,
    flex: 1,
  },
  button: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 55,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footerNote: {
    color: '#4B5563',
    fontSize: 12,
    marginTop: 20,
  },
});
