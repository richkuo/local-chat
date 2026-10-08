import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { MessageBubble, type ChatMessage } from '@/components/MessageBubble';
import { useTheme } from '@/theme';

type Props = {
  messages: ChatMessage[];
  draft: string;
  onChangeDraft: (text: string) => void;
  onSend: () => void;
  onStop?: () => void;
  generating: boolean;
  ready: boolean;
  loadingLabel?: string;
  error?: string | null;
  emptyText: string;
};

export function ChatView({
  messages,
  draft,
  onChangeDraft,
  onSend,
  onStop,
  generating,
  ready,
  loadingLabel,
  error,
  emptyText,
}: Props) {
  const theme = useTheme();
  const inverted = useMemo(() => [...messages].reverse(), [messages]);
  const canSend = ready && !generating && draft.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {!ready && !error && loadingLabel ? (
        <View style={[styles.banner, { backgroundColor: theme.surface }]}>
          <ActivityIndicator color={theme.secondary} />
          <Text style={[styles.bannerText, { color: theme.secondary }]}>{loadingLabel}</Text>
        </View>
      ) : null}
      {error ? (
        <View style={[styles.banner, { backgroundColor: theme.surface }]}>
          <Text style={[styles.bannerText, { color: theme.danger }]}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        style={styles.flex}
        data={inverted}
        inverted
        keyExtractor={(message) => message.id}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <MessageBubble message={item} pending={generating && index === 0} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: theme.secondary }]}>{emptyText}</Text>
          </View>
        }
      />

      <View
        style={[
          styles.composer,
          { backgroundColor: theme.background, borderTopColor: theme.separator },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.separator, backgroundColor: theme.background },
          ]}
          value={draft}
          onChangeText={onChangeDraft}
          placeholder="Message"
          placeholderTextColor={theme.secondary}
          multiline
          editable={ready}
        />
        {generating ? (
          <Pressable
            accessibilityLabel="Stop generating"
            onPress={onStop}
            style={[styles.sendButton, { backgroundColor: theme.secondary }]}
          >
            <Ionicons name="stop" size={16} color={theme.onAccent} />
          </Pressable>
        ) : (
          <Pressable
            accessibilityLabel="Send message"
            onPress={onSend}
            disabled={!canSend}
            style={[
              styles.sendButton,
              { backgroundColor: canSend ? theme.accent : theme.separator },
            ]}
          >
            <Ionicons name="arrow-up" size={20} color={theme.onAccent} />
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    transform: [{ scaleY: -1 }],
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bannerText: {
    fontSize: 13,
    flexShrink: 1,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 120,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 17,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
});
