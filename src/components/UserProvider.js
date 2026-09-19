"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "@/lib/client/api";

// ── Session context ─────────────────────────────────────────
// One session probe per browser tab, shared by the navbar, dashboard and
// test runners. Previously each component fetched /api/stats on mount,
// which caused repeat requests + a loading blink on every navigation.
// The first result is cached in module scope, so subsequent navigations
// render the signed-in state instantly.

const UserContext = createContext(null);

let cached = null; // { authenticated, user, stats, recent }
let inflight = null;

async function loadSession({ force = false } = {}) {
  if (!force && cached) return cached;
  if (!force && inflight) return inflight;
  inflight = apiGet("/api/stats")
    .then((data) => {
      cached = data;
      return data;
    })
    .catch(() => ({
      authenticated: false,
      user: null,
      stats: null,
      recent: [],
      offline: true,
    }))
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function UserProvider({ children }) {
  const [state, setState] = useState(() => cached ?? { authenticated: null });
  const [ready, setReady] = useState(Boolean(cached));

  useEffect(() => {
    let alive = true;
    loadSession().then((data) => {
      if (!alive) return;
      setState(data);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    const data = await loadSession({ force: true });
    setState(data);
    setReady(true);
    return data;
  }, []);

  /** Optimistic local update — used after a test is scored so the
   *  dashboard numbers change without a refetch or page reload. */
  const applyStats = useCallback((stats) => {
    if (!stats) return;
    setState((prev) => {
      const next = { ...prev, stats, authenticated: true };
      cached = next;
      return next;
    });
  }, []);

  const signOut = useCallback(async () => {
    try {
      await apiPost("/api/auth/logout", {});
    } catch {
      /* clear locally regardless */
    }
    cached = { authenticated: false, user: null, stats: null, recent: [] };
    setState(cached);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      authenticated: state.authenticated,
      user: state.user ?? null,
      stats: state.stats ?? null,
      recent: state.recent ?? [],
      degraded: Boolean(state.degraded),
      refresh,
      applyStats,
      signOut,
      setUser: (user) => setState((prev) => ({ ...prev, user, authenticated: Boolean(user) })),
    }),
    [ready, state, refresh, applyStats, signOut]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}

export default UserProvider;
