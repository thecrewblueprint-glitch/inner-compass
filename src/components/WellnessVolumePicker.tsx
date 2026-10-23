import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { VOLUME_DIRECTORY } from '../data/wellnessVolumes';
import { useTheme } from '../theme';

interface Props {
  selectedVolume: number;
  onSelectVolume: (id: number) => void;
}

/**
 * One responsive, keyboard-accessible shelf for all six volumes.
 * Two equal-width columns on small screens prevent the long V / VI
 * titles from pushing controls off screen or covering neighboring buttons.
 */
export const WellnessVolumePicker: React.FC<Props> = ({ selectedVolume, onSelectVolume }) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const compact = width < 680;
  const numerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];

  return (
    <View style={styles.grid} accessibilityLabel="Browse wellness volumes">
      {VOLUME_DIRECTORY.map((volume) => {
        const active = selectedVolume === volume.id;
        const label = `Open Volume ${numerals[volume.id]}: ${volume.title}`;
        return (
          <Pressable
            key={volume.id}
            onPress={() => onSelectVolume(volume.id)}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [
              styles.button,
              { flexBasis: compact ? '47%' : '30%',
                backgroundColor: active ? theme.accentPrimary : theme.card,
                borderColor: active ? theme.accentPrimary : theme.cardBorder },
              pressed && { opacity: 0.84 },
            ]}
          >
            <Text style={[styles.text, { color: active ? theme.accentText : theme.textPrimary }]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 22,
  },
  button: {
    minWidth: 0,
    minHeight: 72,
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 13,
  },
  text: { fontSize: 12, fontWeight: '800', lineHeight: 18, flexShrink: 1 },
});
