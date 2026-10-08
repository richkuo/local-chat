import { useCallback, useRef, useState } from 'react';

import { ChatView } from '@/components/ChatView';
import type { ChatMessage } from '@/components/MessageBubble';

export const NO_MODEL_REPLY =
  'No model selected. Download a language model to start chatting. It runs fully on this device.';

export function NoModelChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const nextId = useRef(0);

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text) return;

    const userId = `m${nextId.current++}`;
    const replyId = `m${nextId.current++}`;
    setMessages((prev) => [
      ...prev,
      { id: userId, role: 'user', text },
      { id: replyId, role: 'assistant', text: NO_MODEL_REPLY },
    ]);
    setDraft('');
  }, [draft]);

  return (
    <ChatView
      messages={messages}
      draft={draft}
      onChangeDraft={setDraft}
      onSend={send}
      generating={false}
      ready
      emptyText={NO_MODEL_REPLY}
    />
  );
}
