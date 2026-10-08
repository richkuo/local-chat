import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export function MessageBubble({ message, pending }: { message: ChatMessage; pending: boolean }) {
  const theme = useTheme();
  const outgoing = message.role === 'user';
  const text = outgoing ? message.text : message.text.trimStart();

  return (
    <View
      style={[
        styles.bubble,
        outgoing ? styles.outgoing : styles.incoming,
        { backgroundColor: outgoing ? theme.bubbleOut : theme.bubbleIn },
      ]}
    >
      <Text style={[styles.text, { color: outgoing ? theme.bubbleOutText : theme.bubbleInText }]}>
        {pending && text === '' ? '...' : text}
      </Text>
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
  text: {
    fontSize: 17,
    lineHeight: 22,
  },
});
