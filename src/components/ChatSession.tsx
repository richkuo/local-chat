import { useCallback, useRef, useState } from 'react';
import { useLLMChatSession } from 'react-native-executorch';

import { ChatView } from '@/components/ChatView';
import type { ChatMessage } from '@/components/MessageBubble';
import type { CatalogEntry } from '@/models/catalog';

export function ChatSession({ entry }: { entry: CatalogEntry }) {
  const session = useLLMChatSession(entry.config);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const nextId = useRef(0);

  const send = useCallback(async (text: string) => {
    const sendMessage = session.sendMessage;
    if (!text || !sendMessage || generating) return;

    const userId = `m${nextId.current++}`;
    const replyId = `m${nextId.current++}`;
    setMessages((prev) => [
      ...prev,
      { id: userId, role: 'user', text },
      { id: replyId, role: 'assistant', text: '' },
    ]);
    setSendError(null);
    setGenerating(true);

    try {
      await sendMessage(text, (token) => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === replyId ? { ...message, text: message.text + token } : message
          )
        );
      });
    } catch (error) {
      setSendError(error instanceof Error ? error.message : String(error));
      setMessages((prev) => prev.filter((message) => message.id !== replyId || message.text !== ''));
    } finally {
      setGenerating(false);
    }
  }, [generating, session.sendMessage]);

  return (
    <ChatView
      messages={messages}
      onSend={send}
      onStop={() => session.stop?.()}
      generating={generating}
      ready={session.isReady}
      loadingLabel={`Loading ${entry.name}...`}
      error={session.error?.message ?? sendError}
      emptyText={`Send a message to start chatting with ${entry.name}. Everything runs on this device.`}
    />
  );
}
