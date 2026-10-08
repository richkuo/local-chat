import { StyleSheet, View } from 'react-native';

import { ChatSession } from '@/components/ChatSession';
import { NoModelChat } from '@/components/NoModelChat';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useModels } from '@/models/ModelsProvider';
import { useTheme } from '@/theme';

export default function ChatScreen() {
  const theme = useTheme();
  const { activeEntry } = useModels();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title={activeEntry?.name ?? 'No model selected'}
        subtitle={activeEntry ? 'On-device' : undefined}
      />
      {activeEntry ? (
        <ChatSession key={activeEntry.id} entry={activeEntry} />
      ) : (
        <NoModelChat />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
