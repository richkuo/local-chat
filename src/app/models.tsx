import { FlatList, StyleSheet, View } from 'react-native';

import { ModelRow } from '@/components/ModelRow';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CATALOG } from '@/models/catalog';
import { useTheme } from '@/theme';

export default function ModelsScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        align="left"
        title="Models"
        subtitle="Download a language model to run on this device."
      />
      <FlatList
        data={CATALOG}
        keyExtractor={(entry) => entry.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => <ModelRow entry={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  separator: {
    height: 12,
  },
});
