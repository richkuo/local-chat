import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { splitThinking } from '@/components/splitThinking';
import { useTheme } from '@/theme';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export function MessageBubble({ message, pending }: { message: ChatMessage; pending: boolean }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  if (message.role === 'user') {
    return (
      <View style={[styles.bubble, styles.outgoing, { backgroundColor: theme.bubbleOut }]}>
        <Text style={[styles.text, { color: theme.bubbleOutText }]}>{message.text}</Text>
      </View>
    );
  }

  const { thinking, answer, thinkingOpen } = splitThinking(message.text);
  const hasThinking = thinkingOpen || (thinking !== null && thinking !== '');
  const showBubble = answer !== '' || (pending && !hasThinking);
  const thinkingLabel = thinkingOpen && pending ? 'Thinking...' : 'Thought process';

  return (
    <View style={styles.incomingGroup}>
      {hasThinking ? (
        <View>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            onPress={() => setExpanded((value) => !value)}
            style={styles.thinkingToggle}
          >
            <Ionicons
              name={expanded ? 'chevron-down' : 'chevron-forward'}
              size={14}
              color={theme.secondary}
            />
            <Text style={[styles.thinkingLabel, { color: theme.secondary }]}>{thinkingLabel}</Text>
          </Pressable>
          {expanded && thinking ? (
            <Text style={[styles.thinkingText, { color: theme.secondary, borderLeftColor: theme.separator }]}>
              {thinking}
            </Text>
          ) : null}
        </View>
      ) : null}
      {showBubble ? (
        <View style={[styles.bubble, styles.incoming, styles.fullWidth, { backgroundColor: theme.bubbleIn }]}>
          <Text style={[styles.text, { color: theme.bubbleInText }]}>
            {answer === '' ? '...' : answer}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    marginVertical: 2,
  },
  outgoing: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  incoming: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  fullWidth: {
    maxWidth: '100%',
  },
  incomingGroup: {
    alignSelf: 'flex-start',
    maxWidth: '78%',
    marginVertical: 2,
  },
  text: {
    fontSize: 17,
    lineHeight: 22,
  },
  thinkingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  thinkingLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  thinkingText: {
    fontSize: 14,
    lineHeight: 19,
    marginLeft: 8,
    marginBottom: 6,
    paddingLeft: 10,
    borderLeftWidth: 2,
  },
});
