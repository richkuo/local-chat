const OPEN = '<think>';
const CLOSE = '</think>';

export type SplitReply = {
  thinking: string | null;
  answer: string;
  thinkingOpen: boolean;
};

function stripPartialTag(text: string): string {
  for (let length = Math.min(OPEN.length - 1, text.length); length > 0; length--) {
    if (OPEN.startsWith(text.slice(-length))) return text.slice(0, -length);
  }
  return text;
}

export function splitThinking(raw: string): SplitReply {
  let text = raw;
  const thoughts: string[] = [];
  let answer = '';
  let thinkingOpen = false;

  const firstClose = text.indexOf(CLOSE);
  const firstOpen = text.indexOf(OPEN);
  if (firstClose !== -1 && (firstOpen === -1 || firstClose < firstOpen)) {
    thoughts.push(text.slice(0, firstClose));
    text = text.slice(firstClose + CLOSE.length);
  }

  while (text.length > 0) {
    const start = text.indexOf(OPEN);
    if (start === -1) {
      answer += text;
      break;
    }
    answer += text.slice(0, start);
    const rest = text.slice(start + OPEN.length);
    const end = rest.indexOf(CLOSE);
    if (end === -1) {
      thoughts.push(rest);
      thinkingOpen = true;
      break;
    }
    thoughts.push(rest.slice(0, end));
    text = rest.slice(end + CLOSE.length);
  }

  return {
    thinking: thoughts.length > 0 ? thoughts.join('\n\n').trim() : null,
    answer: stripPartialTag(answer).trim(),
    thinkingOpen,
  };
}
