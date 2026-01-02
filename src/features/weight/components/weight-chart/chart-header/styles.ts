import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: Platform.select({ ios: 'Avenir Next', android: 'serif', default: 'Avenir Next' }),
    color: '#1B1B1B',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#5D4B3A',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  rangePill: {
    backgroundColor: '#101010',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  rangeText: {
    color: '#F6F0E9',
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
