import { File, Paths } from 'expo-file-system';

export type PersistedState = {
  downloaded: Record<string, number>;
  activeId: string | null;
};

const EMPTY: PersistedState = { downloaded: {}, activeId: null };

const stateFile = new File(Paths.document, 'local-chat-models.json');

export function loadState(): PersistedState {
  try {
    if (!stateFile.exists) return EMPTY;
    const parsed = JSON.parse(stateFile.textSync());
    const downloaded: Record<string, number> = {};
    for (const [id, bytes] of Object.entries(parsed?.downloaded ?? {})) {
      if (typeof bytes === 'number') downloaded[id] = bytes;
    }
    const activeId =
      typeof parsed?.activeId === 'string' && parsed.activeId in downloaded ? parsed.activeId : null;
    return { downloaded, activeId };
  } catch (error) {
    console.warn('Could not read saved model state', error);
    return EMPTY;
  }
}

export function saveState(state: PersistedState): void {
  try {
    stateFile.create({ overwrite: true });
    stateFile.write(JSON.stringify(state));
  } catch (error) {
    console.warn('Could not save model state', error);
  }
}

export function toFileUri(path: string): string {
  return path.startsWith('file://') ? path : `file://${path}`;
}

export function fileBytes(path: string): number {
  try {
    return new File(toFileUri(path)).size ?? 0;
  } catch {
    return 0;
  }
}

export function deleteFile(path: string): void {
  try {
    const file = new File(toFileUri(path));
    if (file.exists) file.delete();
  } catch (error) {
    console.warn('Could not delete file', path, error);
  }
}
