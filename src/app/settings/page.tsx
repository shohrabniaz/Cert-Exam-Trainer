"use client";

import { useRef, useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import { Header } from "@/components/Header";

export default function SettingsPage() {
  const { progress, ready, clearAll, exportJson, importJson, patchSettings } =
    useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!ready || !progress) {
    return (
      <p className="text-sm text-[var(--text-muted)]">Loading…</p>
    );
  }

  function downloadBackup() {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cert-trainer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Backup downloaded.");
  }

  async function onImportFile(file: File) {
    try {
      const text = await file.text();
      importJson(text);
      setMessage("Progress imported.");
    } catch {
      setMessage("Import failed — file was not valid progress JSON.");
    }
  }

  return (
    <>
      <Header subtitle="Manage local progress, backups, and onboarding tips." />

      <section className="mb-6 space-y-3 rounded-2xl border border-white/10 bg-[var(--bg-panel)] p-5">
        <h2 className="text-sm font-semibold">Backup</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Progress is stored in this browser. Export a JSON backup before clearing data or
          switching devices.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={downloadBackup}
            className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm text-[var(--text-muted)] hover:border-white/30"
          >
            Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onImportFile(file);
              e.target.value = "";
            }}
          />
        </div>
      </section>

      <section className="mb-6 space-y-3 rounded-2xl border border-white/10 bg-[var(--bg-panel)] p-5">
        <h2 className="text-sm font-semibold">Onboarding</h2>
        <button
          type="button"
          onClick={() => {
            patchSettings({ onboardingDismissed: false });
            setMessage("Welcome tip will show on the dashboard again.");
          }}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-[var(--text-muted)] hover:border-white/30"
        >
          Show welcome tip again
        </button>
      </section>

      <section className="space-y-3 rounded-2xl border border-rose-400/20 bg-[var(--bg-panel)] p-5">
        <h2 className="text-sm font-semibold text-rose-200">Danger zone</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Reset streaks, history, cert progress, and Pro preview on this device.
        </p>
        <button
          type="button"
          onClick={() => {
            if (
              typeof window !== "undefined" &&
              window.confirm("Reset all progress on this device?")
            ) {
              clearAll();
              setMessage("All local progress cleared.");
            }
          }}
          className="rounded-xl border border-rose-400/30 px-4 py-2 text-sm text-rose-300 hover:bg-rose-500/10"
        >
          Reset progress
        </button>
      </section>

      {message ? (
        <p className="mt-4 text-sm text-emerald-300" role="status">
          {message}
        </p>
      ) : null}

      <footer className="mt-10 text-center text-xs text-[var(--text-muted)]">
        © 2026 Shohrab Hossen Niaz · All rights reserved
      </footer>
    </>
  );
}
