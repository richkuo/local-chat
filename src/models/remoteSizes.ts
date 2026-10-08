import { CATALOG, type CatalogEntry } from './catalog';

const FILE_KEYS = ['modelPath', 'tokenizerPath', 'tokenizerConfigPath'] as const;
const CONCURRENCY = 6;

export function entryUrls(entry: CatalogEntry): string[] {
  return [...new Set(FILE_KEYS.map((key) => entry.config[key]))];
}

const REQUEST_TIMEOUT_MS = 20000;

function parseBytes(response: Response): number | null {
  const range = response.headers.get('content-range')?.match(/\/(\d+)\s*$/);
  const raw = range?.[1] ?? response.headers.get('x-linked-size') ?? response.headers.get('content-length');
  const bytes = Number(raw);
  return Number.isFinite(bytes) && bytes > 0 ? bytes : null;
}

async function requestBytes(
  url: string,
  init: RequestInit,
  signal: AbortSignal
): Promise<number | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal.addEventListener('abort', onAbort);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const bytes = response.ok ? parseBytes(response) : null;
    if (bytes === null) {
      console.warn(`Size lookup ${init.method} ${url}: status ${response.status}, no usable size header`);
    }
    return bytes;
  } catch (error) {
    console.warn(`Size lookup ${init.method} ${url} failed`, error);
    return null;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort', onAbort);
  }
}

async function fetchBytes(url: string, signal: AbortSignal): Promise<number | null> {
  const ranged = await requestBytes(url, { method: 'GET', headers: { Range: 'bytes=0-0' } }, signal);
  if (ranged !== null || signal.aborted) return ranged;
  return requestBytes(url, { method: 'HEAD' }, signal);
}

export async function loadCatalogSizes(
  signal: AbortSignal,
  onSize: (id: string, bytes: number) => void
): Promise<void> {
  const urls = [...new Set(CATALOG.flatMap(entryUrls))];
  const sizes = new Map<string, number | null>();
  const pending = [...urls];

  const publish = () => {
    for (const entry of CATALOG) {
      const parts = entryUrls(entry).map((url) => sizes.get(url));
      if (parts.every((part): part is number => typeof part === 'number')) {
        onSize(
          entry.id,
          parts.reduce((total, part) => total + part, 0)
        );
      }
    }
  };

  const worker = async () => {
    for (let url = pending.shift(); url; url = pending.shift()) {
      sizes.set(url, await fetchBytes(url, signal));
      if (signal.aborted) return;
      publish();
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
}
