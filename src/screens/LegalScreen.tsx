import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LEGAL_CONFIG, getReleaseTier, hasConfiguredLegalIdentity } from '../legal/legalConfig';
import { useTheme } from '../theme';

export type LegalDocumentKey =
  | 'terms'
  | 'privacy'
  | 'health-data'
  | 'safety'
  | 'accessibility';

interface LegalScreenProps {
  initialDocument?: LegalDocumentKey;
  onClose?: () => void;
}

const DOCS: { key: LegalDocumentKey; label: string }[] = [
  { key: 'terms', label: 'Terms of Use' },
  { key: 'privacy', label: 'Privacy Notice' },
  { key: 'health-data', label: 'Consumer Health Data Privacy Policy' },
  { key: 'safety', label: 'Safety & Crisis Notice' },
  { key: 'accessibility', label: 'Accessibility Statement' },
];

export const LegalScreen: React.FC<LegalScreenProps> = ({ initialDocument = 'privacy', onClose }) => {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<LegalDocumentKey>(initialDocument);
  const publicIdentityReady = hasConfiguredLegalIdentity;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: theme.accentPrimary }]}>LEGAL & SAFETY CENTER</Text>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Inner Compass notices</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Effective {LEGAL_CONFIG.effectiveDate} · {LEGAL_CONFIG.minimumAge}+ · {LEGAL_CONFIG.launchRegion} · {LEGAL_CONFIG.supportedLanguage} only
        </Text>
      </View>

      {getReleaseTier() !== 'PUBLIC_RELEASE' && (
        <View style={[styles.notice, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.noticeTitle, { color: theme.textPrimary }]}>Early access</Text>
          <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
            Inner Compass is currently in Beta. Features and notices may change as the product evolves.
          </Text>
        </View>
      )}

      <View
        style={styles.tabs}
        {...({ role: 'tablist', 'aria-label': 'Legal notice sections' } as any)}
      >
        {DOCS.map((doc) => (
          <Pressable
            key={doc.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: selected === doc.key }}
            onPress={() => setSelected(doc.key)}
            style={[styles.tab, {
              backgroundColor: selected === doc.key ? theme.accentPrimary : theme.card,
              borderColor: selected === doc.key ? theme.accentPrimary : theme.cardBorder,
            }]}
          >
            <Text style={{ color: selected === doc.key ? theme.accentText : theme.textPrimary, fontSize: 11, fontWeight: '800' }}>
              {doc.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.doc, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        {selected === 'terms' && <Terms />}
        {selected === 'privacy' && <Privacy />}
        {selected === 'health-data' && <HealthData />}
        {selected === 'safety' && <Safety />}
        {selected === 'accessibility' && <Accessibility />}
      </View>

      {publicIdentityReady && (
        <View style={[styles.operator, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Contact</Text>
          <Text style={[styles.p, { color: theme.textSecondary }]}>Operator: {LEGAL_CONFIG.operatorName}</Text>
          <Text style={[styles.p, { color: theme.textSecondary }]}>Legal/privacy: {LEGAL_CONFIG.contactEmail}</Text>
        </View>
      )}

      {onClose && (
        <Pressable accessibilityRole="button" accessibilityLabel="Close legal notices" onPress={onClose} style={[styles.close, { borderColor: theme.cardBorder }]}>
          <Text style={[styles.closeText, { color: theme.textPrimary }]}>Close legal notices</Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

const External = ({ label, url }: { label: string; url: string }) => {
  const { theme } = useTheme();
  return (
    <Pressable accessibilityRole="link" onPress={() => Linking.openURL(url)}>
      <Text style={[styles.link, { color: theme.accentPrimary }]}>{label} ↗</Text>
    </Pressable>
  );
};

const H = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  return <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{children}</Text>;
};

const P = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  return <Text style={[styles.p, { color: theme.textSecondary }]}>{children}</Text>;
};

const Terms = () => (
  <View style={styles.body}>
    <H>Terms of Use</H>
    <P>Inner Compass is an English-only, United States general-wellness reflection product for adults age 18 or older. It provides research-informed educational and reflective content.</P>
    <H>Not professional care</H>
    <P>Inner Compass is not therapy, psychotherapy, diagnosis, medical treatment, legal advice, financial advice, or an emergency-response service. It does not determine the correct life decision for you.</P>
    <H>Your use</H>
    <P>You remain responsible for your choices and for seeking qualified professional or emergency help when appropriate. Do not use Inner Compass to delay urgent human help.</P>
    <H>Safety limitations</H>
    <P>The app uses automated safety checks to pause ordinary reflection when safety-related language is detected. Automated checks cannot recognize every possible phrase or context.</P>
    <H>Availability and changes</H>
    <P>Features, research sources, links, and availability may change. Third-party resources are controlled by their providers and are not operated by Inner Compass.</P>
    <H>Intellectual property</H>
    <P>Original Inner Compass software, organization, and original wording are protected by applicable law. Historical/public-domain works and third-party books remain subject to their own rights and attribution.</P>
    <H>Updates</H>
    <P>These terms may be updated as features, policies, or applicable requirements change. The effective date appears at the top of this page.</P>
  </View>
);

const Privacy = () => (
  <View style={styles.body}>
    <H>Privacy Notice</H>
    <P>Your reflection text is processed in your browser on this device. Inner Compass is designed not to send that text to its servers, AI services, advertising networks, or analytics services.</P>
    <H>Local browser data</H>
    <P>The app may store saved reflection themes, affirmations, personalization counts, color settings, eligibility confirmation, and basic reliability information in your browser. Your original reflection text is not intentionally saved.</P>
    <H>On-device app information</H>
    <P>Inner Compass may keep a small amount of information on this device about whether the app is working properly. It does not include what you typed in a reflection and is not sent elsewhere automatically.</P>
    <H>Third-party links</H>
    <P>When you choose an external crisis, library, publisher, or research link, you leave Inner Compass. The destination may receive ordinary web-request information under its own privacy policy.</P>
    <H>Retention and deletion</H>
    <P>Data stored in your browser remains until you or your browser removes it. The Privacy screen provides controls to clear saved reflections, personalization history, or all Inner Compass data on this device.</P>
    <H>No sale or targeted advertising</H>
    <P>This Beta does not sell personal data, use reflection data for targeted advertising, or include third-party advertising or behavioral analytics.</P>
  </View>
);

const HealthData = () => (
  <View style={styles.body}>
    <H>Consumer Health Data Privacy Policy</H>
    <P>This policy is separate from the general Privacy Notice because some U.S. state laws regulate consumer health data collected by apps outside traditional healthcare systems.</P>
    <H>Categories and sources</H>
    <P>You may choose to type information about mood, stress, relationships, habits, health fears, substance-related concerns, or other sensitive experiences. That raw text is supplied directly by you and is processed transiently on your device to provide the reflection feature you requested.</P>
    <H>Collection by the operator</H>
    <P>Inner Compass is designed so your original reflection text is not received or retained by the operator. The local data described in the Privacy Notice remains in your browser unless you choose to export it.</P>
    <H>Sharing and sale</H>
    <P>This Beta does not sell consumer health data and does not intentionally share your original reflection text with third parties. User-initiated external links are separate interactions with those providers.</P>
    <H>Purpose</H>
    <P>On-device processing is used only to provide the reflection, safety, clarification, and related content features you request.</P>
    <H>Your controls</H>
    <P>You can stop using the input at any time and clear local Inner Compass data from the Privacy screen. If these data practices change, this policy will be updated before those changes take effect.</P>
    <External label="Washington My Health My Data information" url="https://www.atg.wa.gov/protecting-washingtonians-personal-health-data-and-privacy" />
  </View>
);

const Safety = () => (
  <View style={styles.body}>
    <H>Safety & Crisis Notice</H>
    <P>Inner Compass is not an emergency service. Automated safety checks run before ordinary reflection guidance and may pause the normal experience when safety-related language is detected.</P>
    <H>Detection limits</H>
    <P>This Beta supports English only. Automated safety checks are tested, but no text-matching system can recognize every phrase, spelling, context, or meaning.</P>
    <H>When context is unclear</H>
    <P>When safety-related language is unclear, Inner Compass may show support options instead of ordinary reflection content.</P>
    <H>Immediate human help</H>
    <P>The Lifelines section is always available without entering a reflection. If there is immediate danger, use emergency services or an appropriate crisis service directly rather than relying on this app to detect the situation.</P>
    <External label="988 Suicide & Crisis Lifeline" url="https://988lifeline.org" />
  </View>
);

const Accessibility = () => (
  <View style={styles.body}>
    <H>Accessibility Statement</H>
    <P>Inner Compass aims to provide a usable experience for people using keyboards, screen readers, zoom, high-contrast themes, and mobile devices.</P>
    <H>Accessibility goal</H>
    <P>Inner Compass aims to meet WCAG 2.2 Level AA across key screens.</P>
    <H>Current language scope</H>
    <P>The current product and its safety features are provided in English only.</P>
    <External label="WCAG 2.2" url="https://www.w3.org/TR/WCAG22/" />
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 70, maxWidth: 900, width: '100%', alignSelf: 'center' },
  header: { alignItems: 'center', marginTop: 8, marginBottom: 14 },
  eyebrow: { fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  title: { fontSize: 29, fontWeight: '800', marginTop: 5, textAlign: 'center' },
  subtitle: { fontSize: 12, marginTop: 6, textAlign: 'center' },
  notice: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 12 },
  noticeTitle: { fontSize: 13, fontWeight: '800', marginBottom: 4 },
  noticeText: { fontSize: 12, lineHeight: 18 },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, paddingVertical: 6, marginBottom: 10 },
  tab: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 11, paddingVertical: 7 },
  doc: { borderWidth: 1, borderRadius: 16, padding: 18, marginBottom: 14 },
  body: { gap: 9 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginTop: 6 },
  p: { fontSize: 13, lineHeight: 20 },
  link: { fontSize: 12, fontWeight: '800', marginTop: 2 },
  operator: { borderWidth: 1, borderRadius: 14, padding: 15, marginBottom: 14 },
  small: { fontSize: 10, lineHeight: 15, marginTop: 4 },
  close: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, alignSelf: 'center' },
  closeText: { fontSize: 12, fontWeight: '800' },
});
