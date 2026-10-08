import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { download, isRnExecuTorchError } from 'react-native-executorch';

import { CATALOG, findEntry, type CatalogEntry } from './catalog';
import { loadCatalogSizes } from './remoteSizes';
import { deleteFile, fileBytes, loadState, saveState } from './storage';

type ModelsContextValue = {
  downloaded: Record<string, number>;
  sizes: Record<string, number>;
  sizesLoaded: boolean;
  progress: Record<string, number>;
  errors: Record<string, string>;
  activeId: string | null;
  activeEntry: CatalogEntry | undefined;
  startDownload: (id: string) => void;
  cancelDownload: (id: string) => void;
  removeModel: (id: string) => Promise<void>;
  selectModel: (id: string) => void;
};

const ModelsContext = createContext<ModelsContextValue | null>(null);

const FILE_KEYS = ['modelPath', 'tokenizerPath', 'tokenizerConfigPath'] as const;

function omit<T>(record: Record<string, T>, id: string): Record<string, T> {
  const { [id]: _removed, ...rest } = record;
  return rest;
}

export function ModelsProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(loadState);
  const [downloaded, setDownloaded] = useState(initial.downloaded);
  const [activeId, setActiveId] = useState(initial.activeId);
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [sizesLoaded, setSizesLoaded] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const controllers = useRef(new Map<string, AbortController>());

  useEffect(() => {
    saveState({ downloaded, activeId });
  }, [downloaded, activeId]);

  useEffect(() => {
    const controller = new AbortController();
    loadCatalogSizes(controller.signal, (id, bytes) =>
      setSizes((prev) => (prev[id] === bytes ? prev : { ...prev, [id]: bytes }))
    ).then(() => {
      if (!controller.signal.aborted) setSizesLoaded(true);
    });
    return () => controller.abort();
  }, []);

  const startDownload = useCallback(async (id: string) => {
    const entry = findEntry(id);
    if (!entry || controllers.current.has(id)) return;

    const controller = new AbortController();
    controllers.current.set(id, controller);
    setErrors((prev) => omit(prev, id));
    setProgress((prev) => ({ ...prev, [id]: 0 }));

    try {
      const local = await download(entry.config, {
        signal: controller.signal,
        onProgress: (value) => setProgress((prev) => ({ ...prev, [id]: value * 100 })),
      });
      const paths = new Set(FILE_KEYS.map((key) => local[key]));
      let bytes = 0;
      for (const path of paths) bytes += fileBytes(path);
      setDownloaded((prev) => ({ ...prev, [id]: bytes }));
      setActiveId((current) => current ?? id);
    } catch (error) {
      if (!isRnExecuTorchError(error, 'DOWNLOAD_ABORTED')) {
        const message = error instanceof Error ? error.message : String(error);
        setErrors((prev) => ({ ...prev, [id]: message }));
      }
    } finally {
      controllers.current.delete(id);
      setProgress((prev) => omit(prev, id));
    }
  }, []);

  const cancelDownload = useCallback((id: string) => {
    controllers.current.get(id)?.abort();
  }, []);

  const removeModel = useCallback(
    async (id: string) => {
      const entry = findEntry(id);
      if (!entry || !(id in downloaded)) return;

      if (activeId === id) setActiveId(null);

      const local = await download(entry.config);
      const sharedUrls = new Set<string>();
      for (const other of CATALOG) {
        if (other.id === id || !(other.id in downloaded)) continue;
        for (const key of FILE_KEYS) sharedUrls.add(other.config[key]);
      }
      for (const key of FILE_KEYS) {
        if (!sharedUrls.has(entry.config[key])) deleteFile(local[key]);
      }

      setDownloaded((prev) => omit(prev, id));
    },
    [downloaded, activeId]
  );

  const selectModel = useCallback(
    (id: string) => {
      if (id in downloaded) setActiveId(id);
    },
    [downloaded]
  );

  const value = useMemo<ModelsContextValue>(
    () => ({
      downloaded,
      sizes,
      sizesLoaded,
      progress,
      errors,
      activeId,
      activeEntry: findEntry(activeId),
      startDownload,
      cancelDownload,
      removeModel,
      selectModel,
    }),
    [downloaded, sizes, sizesLoaded, progress, errors, activeId, startDownload, cancelDownload, removeModel, selectModel]
  );

  return <ModelsContext.Provider value={value}>{children}</ModelsContext.Provider>;
}

export function useModels(): ModelsContextValue {
  const value = useContext(ModelsContext);
  if (!value) throw new Error('useModels must be used inside ModelsProvider');
  return value;
}
