import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme, THEME_LIST, ThemePalette, ThemeFamily } from '../theme';

interface ThemePickerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ThemePickerModal: React.FC<ThemePickerModalProps> = ({ visible, onClose }) => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const [filterVariant, setFilterVariant] = useState<'all' | 'light' | 'dark'>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');

  const families: { key: ThemeFamily; name: string; icon: string; shortName: string }[] = [
    { key: 'rose', name: 'Rose & Sunset', icon: '🌸', shortName: 'Rose' },
    { key: 'amber', name: 'Amber & Earth', icon: '🏺', shortName: 'Amber' },
    { key: 'green', name: 'Sage & Emerald', icon: '🌿', shortName: 'Sage' },
    { key: 'teal', name: 'Teal & Lagoon', icon: '🌊', shortName: 'Teal' },
    { key: 'blue', name: 'Ocean & Sky', icon: '🔷', shortName: 'Ocean' },
    { key: 'purple', name: 'Twilight & Lavender', icon: '🪻', shortName: 'Twilight' },
    { key: 'neutral', name: 'Slate & Charcoal', icon: '🪨', shortName: 'Slate' },
  ];

  const filteredThemes = THEME_LIST.filter((item) => {
    if (filterVariant === 'light' && item.variant !== 'light') return false;
    if (filterVariant === 'dark' && item.variant !== 'dark') return false;
    if (selectedFamily !== 'all' && item.family !== selectedFamily) return false;
    return true;
  });

  const lightCount = THEME_LIST.filter((t) => t.variant === 'light').length;
  const darkCount = THEME_LIST.filter((t) => t.variant === 'dark').length;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}>
        {/* Backdrop click to close */}
        <Pressable style={styles.backdropTouch} onPress={onClose} accessibilityLabel="Close backdrop" />

        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              shadowColor: theme.cardShadow,
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
            <View>
              <View style={styles.titleRow}>
                <Text style={styles.titleIcon}>🎨</Text>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Color & Atmosphere</Text>
              </View>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Off-white ivory lights & soft dusk darks complemented with sunset, aurora & gold accents
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder },
                pressed && { opacity: 0.7 },
              ]}
              onPress={onClose}
              accessibilityLabel="Close theme picker"
            >
              <Text style={[styles.closeButtonText, { color: theme.textPrimary }]}>✕</Text>
            </Pressable>
          </View>

          {/* Quick Filter Bar: Tone (All / Light / Dark) */}
          <View style={[styles.filterBar, { borderBottomColor: theme.cardBorder }]}>
            <Text style={[styles.filterLabel, { color: theme.textMuted }]}>Tone:</Text>
            <View style={styles.filterPills}>
              {(
                [
                  { id: 'all', label: `All (${THEME_LIST.length})` },
                  { id: 'light', label: `☀️ Light (${lightCount})` },
                  { id: 'dark', label: `🌙 Dark (${darkCount})` },
                ] as const
              ).map((tab) => {
                const isActive = filterVariant === tab.id;
                return (
                  <Pressable
                    key={tab.id}
                    style={[
                      styles.filterPill,
                      {
                        backgroundColor: isActive ? theme.accentPrimary : theme.badgeBg,
                        borderColor: isActive ? theme.accentPrimary : theme.badgeBorder,
                      },
                    ]}
                    onPress={() => setFilterVariant(tab.id)}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        { color: isActive ? theme.accentText : theme.textSecondary },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Color Spectrum Filter Row */}
          <View style={[styles.colorBar, { borderBottomColor: theme.cardBorder }]}>
            <Text style={[styles.filterLabel, { color: theme.textMuted }]}>Color:</Text>
            <View style={styles.colorPillsScroll}>
              <Pressable
                style={[
                  styles.colorChip,
                  {
                    backgroundColor: selectedFamily === 'all' ? theme.accentPrimary : theme.inputBg,
                    borderColor: selectedFamily === 'all' ? theme.accentPrimary : theme.cardBorder,
                  },
                ]}
                onPress={() => setSelectedFamily('all')}
              >
                <Text
                  style={[
                    styles.colorChipText,
                    { color: selectedFamily === 'all' ? theme.accentText : theme.textSecondary },
                  ]}
                >
                  🌈 All
                </Text>
              </Pressable>

              {families.map((fam) => {
                const isFamilyActive = selectedFamily === fam.key;
                return (
                  <Pressable
                    key={fam.key}
                    style={[
                      styles.colorChip,
                      {
                        backgroundColor: isFamilyActive ? theme.accentPrimary : theme.inputBg,
                        borderColor: isFamilyActive ? theme.accentPrimary : theme.cardBorder,
                      },
                    ]}
                    onPress={() => setSelectedFamily(isFamilyActive ? 'all' : fam.key)}
                  >
                    <Text
                      style={[
                        styles.colorChipText,
                        { color: isFamilyActive ? theme.accentText : theme.textSecondary },
                      ]}
                    >
                      {fam.icon} {fam.shortName}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Theme List / Grid */}
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            {families.map((fam) => {
              const familyThemes = filteredThemes.filter((t) => t.family === fam.key);
              if (familyThemes.length === 0) return null;

              return (
                <View key={fam.key} style={styles.familySection}>
                  <View style={styles.familyHeaderRow}>
                    <Text style={styles.familyIcon}>{fam.icon}</Text>
                    <Text style={[styles.familyName, { color: theme.textPrimary }]}>{fam.name}</Text>
                  </View>

                  <View style={styles.themeGrid}>
                    {familyThemes.map((item: ThemePalette) => {
                      const isSelected = themeMode === item.id;
                      return (
                        <Pressable
                          key={item.id}
                          style={({ pressed }) => [
                            styles.themeCard,
                            {
                              backgroundColor: isSelected ? theme.affirmationBg : theme.inputBg,
                              borderColor: isSelected ? theme.accentPrimary : theme.cardBorder,
                              borderWidth: isSelected ? 2 : 1,
                            },
                            pressed && { opacity: 0.8 },
                          ]}
                          onPress={() => {
                            setThemeMode(item.id);
                          }}
                        >
                          {/* Card Top: Swatches & Mode Badge */}
                          <View style={styles.cardTopRow}>
                            <View style={styles.swatchCluster}>
                              <View
                                style={[
                                  styles.swatchDot,
                                  { backgroundColor: item.swatchCanvas, borderColor: 'rgba(0,0,0,0.15)' },
                                ]}
                              />
                              <View
                                style={[
                                  styles.swatchDot,
                                  styles.swatchOverlap,
                                  { backgroundColor: item.swatchCard, borderColor: 'rgba(0,0,0,0.15)' },
                                ]}
                              />
                              <View
                                style={[
                                  styles.swatchDot,
                                  styles.swatchOverlap,
                                  { backgroundColor: item.swatchAccent, borderColor: 'rgba(0,0,0,0.15)' },
                                ]}
                              />
                            </View>

                            <View
                              style={[
                                styles.variantBadge,
                                {
                                  backgroundColor: item.variant === 'light' ? theme.badgeBg : theme.topBar,
                                  borderColor: theme.cardBorder,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.variantBadgeText,
                                  { color: theme.textSecondary },
                                ]}
                              >
                                {item.variant === 'light' ? '☀️ Light' : '🌙 Dark'}
                              </Text>
                            </View>
                          </View>

                          {/* Name & Icon */}
                          <View style={styles.cardNameRow}>
                            <Text style={styles.cardEmoji}>{item.icon}</Text>
                            <Text style={[styles.cardName, { color: theme.textPrimary }]}>{item.name}</Text>
                            {isSelected && (
                              <View
                                style={[
                                  styles.activeCheckmark,
                                  { backgroundColor: theme.accentPrimary },
                                ]}
                              >
                                <Text style={[styles.activeCheckmarkText, { color: theme.accentText }]}>✓</Text>
                              </View>
                            )}
                          </View>

                          {/* Subtitle */}
                          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                            {item.subtitle}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: theme.cardBorder }]}>
            <Text style={[styles.footerHint, { color: theme.textMuted }]}>
              {filteredThemes.length} {filteredThemes.length === 1 ? 'theme' : 'themes'} available · Applies instantly
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.doneButton,
                { backgroundColor: theme.accentPrimary },
                pressed && { opacity: 0.85 },
              ]}
              onPress={onClose}
            >
              <Text style={[styles.doneButtonText, { color: theme.accentText }]}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
  },
  backdropTouch: {
    ...StyleSheet.absoluteFill,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 720,
    maxHeight: '90%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  titleIcon: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderBottomWidth: 1,
    gap: 12,
  },
  colorBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderBottomWidth: 1,
    gap: 10,
  },
  colorPillsScroll: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  colorChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  colorChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  scrollArea: {
    maxHeight: 460,
  },
  scrollContent: {
    padding: 20,
    gap: 18,
  },
  familySection: {
    gap: 10,
  },
  familyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  familyIcon: {
    fontSize: 15,
  },
  familyName: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeCard: {
    flex: 1,
    minWidth: 260,
    padding: 14,
    borderRadius: 12,
    gap: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  swatchCluster: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swatchDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  swatchOverlap: {
    marginLeft: -6,
  },
  variantBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  variantBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardEmoji: {
    fontSize: 15,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  activeCheckmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCheckmarkText: {
    fontSize: 11,
    fontWeight: '800',
  },
  cardSubtitle: {
    fontSize: 11,
    lineHeight: 15,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderTopWidth: 1,
    flexWrap: 'wrap',
    gap: 12,
  },
  footerHint: {
    fontSize: 11,
    flex: 1,
    minWidth: 220,
  },
  doneButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  doneButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
