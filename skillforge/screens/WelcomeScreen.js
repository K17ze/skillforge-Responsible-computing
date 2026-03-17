import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#F5F0E8',
  bgDark: '#1C1917',
  accent: '#8B6F5E',
  accentLight: '#C4A882',
  muted: '#9E8E80',
  border: '#D8CEBD',
  white: '#FFFFFF',
  tag: '#EDE8DE',
};

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Top nav bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandMark}>SF</Text>
        <View style={styles.topBarRight}>
          <Text style={styles.navLink}>login</Text>
          <Text style={styles.navDivider}>/</Text>
          <Text style={styles.navLinkAccent}>sign up</Text>
        </View>
      </View>

      <View style={styles.container}>

        {/* Left-aligned hero copy */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTagline}>Where every skill</Text>
          <Text style={styles.heroTagline}>begins with clarity.</Text>
        </View>

        {/* Decorative card / arched element */}
        <View style={styles.arcCardWrapper}>
          <View style={styles.arcCard}>
            <View style={styles.arcTop}>
              <Text style={styles.arcLabel}>SKILL FORGE</Text>
              <Text style={styles.arcDate}>2025</Text>
            </View>
            <View style={styles.arcShape} />
            <View style={styles.arcBottom}>
              <Text style={styles.arcBottomTitle}>Your Path.</Text>
              <Text style={styles.arcBottomSub}>Track · Build · Master</Text>
            </View>
          </View>
        </View>

        {/* Feature bullets — editorial list style */}
        <View style={styles.featuresList}>
          <FeatureRow index="01" text="Track skills you're building" />
          <FeatureRow index="02" text="Build your personal roadmap" />
          <FeatureRow index="03" text="Visualise progress & milestones" />
        </View>

        {/* CTA row */}
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('Skills')}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaBtnText}>Get Started</Text>
          </TouchableOpacity>
          <View style={styles.ctaTagRow}>
            <Text style={styles.ctaTag}>No account needed</Text>
            <Text style={styles.ctaTagDot}>·</Text>
            <Text style={styles.ctaTag}>Data stays on device</Text>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

function FeatureRow({ index, text }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureIndex}>{index}</Text>
      <View style={styles.featureDivider} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  brandMark: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 3,
    color: C.bgDark,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navLink: {
    fontSize: 13,
    color: C.muted,
    letterSpacing: 0.5,
  },
  navDivider: {
    color: C.border,
    fontSize: 13,
  },
  navLinkAccent: {
    fontSize: 13,
    color: C.bgDark,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    justifyContent: 'space-between',
    paddingBottom: 28,
  },
  heroSection: {
    marginBottom: 28,
  },
  heroTagline: {
    fontSize: 36,
    fontWeight: '300',
    color: C.bgDark,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  arcCardWrapper: {
    marginBottom: 28,
  },
  arcCard: {
    backgroundColor: C.bgDark,
    borderRadius: 20,
    padding: 22,
    overflow: 'hidden',
    minHeight: 190,
  },
  arcTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  arcLabel: {
    color: C.accentLight,
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '500',
  },
  arcDate: {
    color: C.muted,
    fontSize: 11,
    letterSpacing: 2,
  },
  arcShape: {
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: (width * 0.45) / 2,
    backgroundColor: C.accent,
    alignSelf: 'center',
    marginVertical: 8,
    opacity: 0.85,
  },
  arcBottom: {
    marginTop: 8,
  },
  arcBottomTitle: {
    color: C.white,
    fontSize: 22,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  arcBottomSub: {
    color: C.muted,
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 4,
  },
  featuresList: {
    gap: 14,
    marginBottom: 28,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIndex: {
    fontSize: 11,
    color: C.muted,
    letterSpacing: 1,
    width: 22,
  },
  featureDivider: {
    width: 28,
    height: 1,
    backgroundColor: C.border,
  },
  featureText: {
    fontSize: 14,
    color: C.bgDark,
    flex: 1,
    letterSpacing: 0.2,
  },
  ctaRow: {
    gap: 14,
  },
  ctaBtn: {
    backgroundColor: C.bgDark,
    paddingVertical: 17,
    borderRadius: 100,
    alignItems: 'center',
  },
  ctaBtnText: {
    color: C.white,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 1.5,
  },
  ctaTagRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  ctaTag: {
    color: C.muted,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  ctaTagDot: {
    color: C.border,
  },
});
