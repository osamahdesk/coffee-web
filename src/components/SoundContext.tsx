"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type SoundContextValue = {
  muted: boolean;
  toggle: () => void;
  registerSource: (el: HTMLMediaElement | null) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(true);
  const sourceRef = useRef<HTMLMediaElement | null>(null);

  const applyToSource = useCallback((el: HTMLMediaElement | null, m: boolean) => {
    if (!el) return;
    el.muted = m;
    if (!m) {
      const p = el.play();
      if (p && typeof (p as Promise<void>).catch === "function") {
        (p as Promise<void>).catch(() => {});
      }
    }
  }, []);

  const registerSource = useCallback(
    (el: HTMLMediaElement | null) => {
      sourceRef.current = el;
      applyToSource(el, muted);
    },
    [muted, applyToSource]
  );

  useEffect(() => {
    applyToSource(sourceRef.current, muted);
  }, [muted, applyToSource]);

  const toggle = useCallback(() => setMuted((m) => !m), []);

  return (
    <SoundContext.Provider value={{ muted, toggle, registerSource }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
