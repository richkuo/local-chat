import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatBytes, type CatalogEntry } from '@/models/catalog';
import { useModels } from '@/models/ModelsProvider';
import { useTheme } from '@/theme';

export function ModelRow({ entry }: { entry: CatalogEntry }) {
  const theme = useTheme();
  const { downloaded, sizes, sizesLoaded, progress, errors, activeId, startDownload, cancelDownload, removeModel, selectModel } =
    useModels();

  const size = sizes[entry.id];
  const bytes = downloaded[entry.id];
  const isDownloaded = bytes !== undefined;
  const percent = progress[entry.id];
  const isDownloading = percent !== undefined;
  const isActive = activeId === entry.id;
  const error = errors[entry.id];

  const confirmDelete = () => {
    Alert.alert(`Delete ${entry.name}?`, 'You can download it again later.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeModel(entry.id) },
    ]);
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <View style={styles.titleRow}>
        <Text style={[styles.name, { color: theme.text }]}>{entry.name}</Text>
        {entry.vision ? (
          <Text style={[styles.badge, { color: theme.accent, borderColor: theme.accent }]}>Vision</Text>
        ) : null}
        {isActive ? (
          <Text style={[styles.badge, { color: theme.success, borderColor: theme.success }]}>In use</Text>
        ) : null}
      </View>
      <Text style={[styles.meta, { color: theme.secondary }]}>
        {[entry.maker, entry.variant]
          .filter(Boolean)
          .join(' - ')}
      </Text>
      <Text style={[styles.description, { color: theme.text }]}>{entry.description}</Text>
      <Text style={[styles.size, { color: theme.secondary }]}>
        Size: {size !== undefined ? formatBytes(size) : sizesLoaded ? 'Unavailable' : 'Checking...'}
      </Text>

      {isDownloading ? (
        <View style={styles.progressBlock}>
          <View style={[styles.track, { backgroundColor: theme.separator }]}>
            <View style={[styles.fill, { backgroundColor: theme.accent, width: `${Math.min(percent, 100)}%` }]} />
          </View>
          <View style={styles.actionRow}>
            <Text style={[styles.status, { color: theme.secondary }]}>
              Downloading {Math.round(percent)}%
            </Text>
            <Pressable accessibilityRole="button" onPress={() => cancelDownload(entry.id)}>
              <Text style={[styles.action, { color: theme.danger }]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <Text style={[styles.status, { color: error ? theme.danger : theme.secondary }]} numberOfLines={2}>
            {error ?? (isDownloaded ? `Downloaded - ${formatBytes(bytes)}` : 'Not downloaded')}
          </Text>
          <View style={styles.buttons}>
            {isDownloaded ? (
              <>
                {!isActive ? (
                  <Pressable accessibilityRole="button" onPress={() => selectModel(entry.id)}>
                    <Text style={[styles.action, { color: theme.accent }]}>Use</Text>
                  </Pressable>
                ) : null}
                <Pressable accessibilityRole="button" onPress={confirmDelete}>
                  <Text style={[styles.action, { color: theme.danger }]}>Delete</Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={() => startDownload(entry.id)}
                style={[styles.getButton, { backgroundColor: theme.accent }]}
              >
                <Text style={[styles.getText, { color: theme.onAccent }]}>{error ? 'Retry' : 'Get'}</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    flexShrink: 1,
  },
  badge: {
    fontSize: 11,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  meta: {
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  size: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  progressBlock: {
    marginTop: 10,
    gap: 8,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  status: {
    fontSize: 13,
    flexShrink: 1,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  action: {
    fontSize: 15,
    fontWeight: '600',
  },
  getButton: {
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  getText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
