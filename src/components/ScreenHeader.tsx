import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
};

export function ScreenHeader({ title, subtitle, align = 'center' }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const centered = align === 'center';

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: theme.background,
          borderBottomColor: theme.separator,
          alignItems: centered ? 'center' : 'flex-start',
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[centered ? styles.centeredTitle : styles.largeTitle, { color: theme.text }]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text numberOfLines={2} style={[styles.subtitle, { color: theme.secondary }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  centeredTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});
