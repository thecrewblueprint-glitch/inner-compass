import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { recordDebugEvent } from '../debug/debugStore';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    recordDebugEvent('runtime_error', { errorName: error.name || 'RenderError' });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Inner Compass encountered a local display error.</Text>
        <Text style={styles.body}>
          Your reflection was not transmitted. Reload the page, or open Local Diagnostics after reload to export the error record.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reload Inner Compass"
          style={styles.button}
          onPress={() => {
            if (typeof window !== 'undefined') window.location.reload();
          }}
        >
          <Text style={styles.buttonText}>Reload</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: '100%', alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#111827' },
  title: { color: '#F9FAFB', fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  body: { color: '#D1D5DB', fontSize: 14, lineHeight: 21, maxWidth: 620, textAlign: 'center', marginBottom: 18 },
  button: { backgroundColor: '#F3F4F6', borderRadius: 10, paddingHorizontal: 18, paddingVertical: 11 },
  buttonText: { color: '#111827', fontSize: 13, fontWeight: '800' },
});
