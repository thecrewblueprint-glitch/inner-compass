import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { WELLNESS_SOURCES } from '../data/wellnessGuide';
import { VolumeChapter, VolumeId, WELLNESS_VOLUMES, VOLUME_DIRECTORY } from '../data/wellnessVolumes';

type Page = 'overview' | 'chapters' | 'exercises' | 'references';

interface Props {
  volumeId: VolumeId;
  onSelectVolume: (id: number) => void;
  onReturnToCompass: () => void;
}

export const WellnessVolumeScreen: React.FC<Props> = ({ volumeId, onSelectVolume, onReturnToCompass }) => {
  const { theme } = useTheme();
  const [page, setPage] = useState<Page>('overview');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const volume = WELLNESS_VOLUMES.find((item) => item.id === volumeId);
  if (!volume) return null;

  const card = { backgroundColor: theme.card, borderColor: theme.cardBorder };
  const primary = { color: theme.textPrimary };
  const secondary = { color: theme.textSecondary };
  const accent = { color: theme.accentPrimary };
  const chapter = volume.chapters.find((item) => item.id === selectedChapter);
  const references = WELLNESS_SOURCES.filter((source) =>
    volume.chapters.some((item) => item.sources.includes(source.id)) ||
    volume.exercises.some((item) => item.sources.includes(source.id))
  );
  const selectPage = (next: Page) => {
    setSelectedChapter(null);
    setPage(next);
  };
  const openSource = (id: string) => {
    const ref = WELLNESS_SOURCES.find((item) => item.id === id);
    if (ref?.url.startsWith('https://')) void Linking.openURL(ref.url);
  };
  const renderReferences = (sourceIds: string[]) => (
    <View style={styles.refRow}>
      {sourceIds.map((id) => (
        <Pressable key={id} onPress={() => openSource(id)} accessibilityRole="link"
          accessibilityLabel={'Open source ' + id}
          style={[styles.refChip, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.refText, accent]}>{id} ↗</Text>
        </Pressable>
      ))}
    </View>
  );
  const detail = (item: VolumeChapter) => (
    <View>
      <Pressable onPress={() => setSelectedChapter(null)} accessibilityRole="button"
        accessibilityLabel="Back to volume chapter list" style={styles.textButton}>
        <Text style={[styles.link, accent]}>← All chapters</Text>
      </Pressable>
      <Text style={[styles.label, accent]}>{item.tradition.toUpperCase()}</Text>
      <Text style={[styles.title, primary]}>{item.title}</Text>
      <Text style={[styles.intro, secondary]}>{item.principle}</Text>
      <View style={[styles.chapterBody, card]}>
        <Text style={[styles.sectionTitle, primary]}>The teaching</Text>
        <Text style={[styles.body, secondary]}>{item.discussion}</Text>
        <Text style={[styles.sectionTitle, primary]}>Going deeper</Text>
        <Text style={[styles.body, secondary]}>{item.furtherReading}</Text>
        <Text style={[styles.sectionTitle, primary]}>Practice in ordinary life</Text>
        <Text style={[styles.body, secondary]}>{item.application}</Text>
        <Text style={[styles.sectionTitle, primary]}>Reflection</Text>
        <Text style={[styles.body, secondary]}>{item.reflection}</Text>
        <View style={[styles.notice, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.sectionTitle, primary]}>Context & boundaries</Text>
          <Text style={[styles.body, secondary]}>{item.caution}</Text>
        </View>
        <Text style={[styles.label, accent]}>FURTHER READING</Text>
        {renderReferences(item.sources)}
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Next wellness chapter"
        onPress={() => {
          const index = volume.chapters.findIndex((other) => other.id === item.id);
          const next = volume.chapters[(index + 1) % volume.chapters.length];
          setSelectedChapter(next.id);
        }}
        style={[styles.cta, { backgroundColor: theme.accentPrimary }]}>
        <Text style={[styles.ctaText, { color: theme.accentText }]}>Next chapter →</Text>
      </Pressable>
    </View>
  );

  return (
    <ScrollView key={volumeId + '-' + page + '-' + (selectedChapter || 'index')}
      contentContainerStyle={styles.wrapper}>
      <View style={styles.topline}>
        <Pressable onPress={onReturnToCompass} accessibilityRole="button"
          accessibilityLabel="Back to Inner Compass home" style={[styles.linkButton, card]}>
          <Text style={[styles.link, accent]}>← Back to Inner Compass</Text>
        </Pressable>
        <Text style={[styles.label, secondary]}>WELLNESS LIBRARY / VOL. {['','I','II','III','IV','V','VI'][volumeId]}</Text>
      </View>

      <View style={[styles.hero, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
        <Text style={[styles.label, accent]}>THE WHOLE LIFE FIELD GUIDE · VOLUME {['','I','II','III','IV','V','VI'][volumeId]}</Text>
        <Text style={[styles.heroTitle, primary]}>{volume.title}</Text>
        <Text style={[styles.intro, secondary]}>{volume.subtitle}</Text>
        <Text style={[styles.body, secondary]}>{volume.thesis}</Text>
      </View>

      <Text style={[styles.label, accent]}>BROWSE THE SIX-VOLUME COLLECTION</Text>
      <View style={styles.shelf}>
        {VOLUME_DIRECTORY.map((v) => {
          const active = v.id === volumeId;
          return (
            <Pressable key={v.id} onPress={() => onSelectVolume(v.id)} accessibilityRole="button"
              accessibilityLabel={'Open Volume ' + ['','I','II','III','IV','V','VI'][v.id] + ': ' + v.title}
              accessibilityState={{ selected: active }}
              style={[styles.volumeButton, {
                backgroundColor: active ? theme.accentPrimary : theme.card,
                borderColor: active ? theme.accentPrimary : theme.cardBorder,
              }]}>
              <Text style={[styles.volumeText, { color: active ? theme.accentText : theme.textPrimary }]}>
                {['','I','II','III','IV','V','VI'][v.id]} · {v.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.nav, { borderBottomColor: theme.cardBorder }]}>
        {([
          ['overview','Overview'],['chapters','Chapters'],['exercises','Exercises'],['references','Sources']
        ] as const).map(([id, label]) => (
          <Pressable key={id} onPress={() => selectPage(id)} accessibilityRole="button"
            accessibilityLabel={label + ' page for Volume ' + volumeId}
            accessibilityState={{ selected: page === id }}
            style={[styles.navButton, {
              borderColor: page === id ? theme.accentPrimary : theme.cardBorder,
              backgroundColor: page === id ? theme.badgeBg : theme.card
            }]}>
            <Text style={[styles.navText, { color: page === id ? theme.accentPrimary : theme.textPrimary }]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {page === 'overview' && (
        <View>
          <Text style={[styles.title, primary]}>A field guide to {volume.title.toLowerCase()}</Text>
          <Text style={[styles.body, secondary]}>{volume.introduction}</Text>
          <View style={[styles.notice, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
            <Text style={[styles.sectionTitle, primary]}>Read with care</Text>
            <Text style={[styles.body, secondary]}>{volume.editorialNote}</Text>
          </View>
          <Text style={[styles.sectionTitle, primary]}>Inside this volume</Text>
          {volume.chapters.map((item, index) => (
            <Pressable key={item.id} accessibilityRole="button"
              accessibilityLabel={'Read chapter ' + (index + 1) + ': ' + item.title}
              onPress={() => {setPage('chapters');setSelectedChapter(item.id);}}
              style={[styles.chapterCard, card]}>
              <Text style={[styles.label, accent]}>CHAPTER {String(index + 1).padStart(2,'0')} · {item.tradition}</Text>
              <Text style={[styles.cardTitle, primary]}>{item.title} →</Text>
              <Text style={[styles.body, secondary]}>{item.principle}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {page === 'chapters' && (
        chapter ? detail(chapter) : (
          <View>
            <Text style={[styles.title, primary]}>{volume.title}: Chapters</Text>
            <Text style={[styles.intro, secondary]}>Select any chapter to open its teaching, context, exercise, reflection and references.</Text>
            {volume.chapters.map((item, index) => (
              <Pressable key={item.id} accessibilityRole="button"
                accessibilityLabel={'Read chapter ' + (index + 1) + ': ' + item.title}
                onPress={() => setSelectedChapter(item.id)}
                style={[styles.chapterCard, card]}>
                <Text style={[styles.label, accent]}>CHAPTER {String(index+1).padStart(2,'0')} · {item.tradition}</Text>
                <Text style={[styles.cardTitle, primary]}>{item.title} →</Text>
                <Text style={[styles.body, secondary]}>{item.principle}</Text>
              </Pressable>
            ))}
          </View>
        )
      )}

      {page === 'exercises' && (
        <View>
          <Text style={[styles.title, primary]}>Everyday exercises</Text>
          <Text style={[styles.intro, secondary]}>Optional, low-pressure reflections inspired by this volume. They are not treatment instructions or personal assessments.</Text>
          {volume.exercises.map((entry) => (
            <View key={entry.name} style={[styles.chapterCard, card]}>
              <Text style={[styles.label, accent]}>{entry.domain.toUpperCase()}</Text>
              <Text style={[styles.cardTitle, primary]}>{entry.name}</Text>
              <Text style={[styles.body, secondary]}>{entry.instructions}</Text>
              <Text style={[styles.context, secondary]}>{entry.context}</Text>
              {renderReferences(entry.sources)}
            </View>
          ))}
        </View>
      )}

      {page === 'references' && (
        <View>
          <Text style={[styles.title, primary]}>Sources for {volume.title}</Text>
          <Text style={[styles.intro, secondary]}>
            These references serve different purposes: philosophical scholarship explains historical teachings,
            while public-health research evaluates measurable outcomes. An association is not a medical recommendation.
          </Text>
          {references.map((entry) => (
            <Pressable key={entry.id} onPress={() => openSource(entry.id)}
              accessibilityRole="link" accessibilityLabel={'Open ' + entry.title}
              style={[styles.chapterCard, card]}>
              <Text style={[styles.label, accent]}>{entry.id} · {entry.kind.toUpperCase()} · {entry.publisher}</Text>
              <Text style={[styles.cardTitle, primary]}>{entry.title} ↗</Text>
            </Pressable>
          ))}
        </View>
      )}
      <View style={[styles.bottom, { borderTopColor: theme.cardBorder }]}>
        <Pressable onPress={onReturnToCompass} accessibilityRole="button"
          accessibilityLabel="Return to Inner Compass" style={[styles.linkButton, card]}>
          <Text style={[styles.link, accent]}>← Inner Compass</Text>
        </Pressable>
        <Pressable onPress={() => selectPage('overview')} accessibilityRole="button"
          accessibilityLabel="Back to volume overview" style={[styles.linkButton, card]}>
          <Text style={[styles.link, accent]}>Volume overview ↑</Text>
        </Pressable>
      </View>
      <Text style={[styles.disclaimer, secondary]}>
        Inner Compass Beta · General education only · Spiritual traditions are not clinical treatments.
        Do not use this guide to delay appropriate professional care.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper:{padding:18,paddingBottom:72,maxWidth:990,width:'100%',alignSelf:'center'},
  topline:{flexDirection:'row',flexWrap:'wrap',gap:13,justifyContent:'space-between',alignItems:'center',marginBottom:16},
  linkButton:{borderWidth:1,borderRadius:10,paddingHorizontal:14,paddingVertical:10},
  link:{fontWeight:'800',fontSize:12},
  label:{fontSize:10,fontWeight:'800',letterSpacing:0.75,lineHeight:18,marginBottom:7},
  hero:{borderWidth:1,borderRadius:18,padding:24,marginBottom:24},
  heroTitle:{fontFamily:'serif',fontSize:34,fontWeight:'600',marginBottom:9},
  title:{fontFamily:'serif',fontSize:29,fontWeight:'600',lineHeight:38,marginBottom:14},
  intro:{fontSize:14,lineHeight:23,marginBottom:14},
  body:{fontSize:14,lineHeight:23,marginBottom:10},
  shelf:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:20},
  volumeButton:{borderWidth:1,borderRadius:10,paddingHorizontal:12,paddingVertical:11,flexGrow:1},
  volumeText:{fontSize:11,fontWeight:'800'},
  nav:{flexDirection:'row',flexWrap:'wrap',gap:8,borderBottomWidth:1,paddingBottom:17,marginBottom:22},
  navButton:{borderWidth:1,borderRadius:10,paddingHorizontal:14,paddingVertical:10},
  navText:{fontSize:12,fontWeight:'800'},
  sectionTitle:{fontFamily:'serif',fontSize:22,fontWeight:'600',marginTop:17,marginBottom:10},
  chapterCard:{borderWidth:1,padding:19,borderRadius:14,marginBottom:11},
  cardTitle:{fontFamily:'serif',fontSize:21,fontWeight:'600',lineHeight:28,marginBottom:8},
  chapterBody:{borderWidth:1,borderRadius:14,padding:19,marginTop:15,marginBottom:20},
  context:{fontSize:12,lineHeight:19,marginTop:7,marginBottom:8},
  notice:{borderWidth:1,padding:17,borderRadius:12,marginVertical:17},
  refRow:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:13},
  refChip:{borderWidth:1,borderRadius:9,paddingVertical:9,paddingHorizontal:12},
  refText:{fontSize:11,fontWeight:'800'},
  textButton:{alignSelf:'flex-start',padding:8,marginBottom:10},
  cta:{borderRadius:11,paddingVertical:14,paddingHorizontal:19,alignSelf:'flex-start',marginBottom:10},
  ctaText:{fontSize:13,fontWeight:'800'},
  bottom:{flexDirection:'row',flexWrap:'wrap',gap:10,borderTopWidth:1,paddingTop:20,marginTop:36},
  disclaimer:{fontSize:11,lineHeight:18,marginTop:21}
});
