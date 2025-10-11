// src/modules/stream/views/AdminLiveStreamPanel/AdminLiveStreamPanel.tsx
import { getService } from "@webstack/common";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNotification } from "@webstack/components/Notification/Notification";

import type IDataBaseService from "~/src/core/services/DataBaseService/IDataBaseService";
import type {
  LiveStreamRow,
  StreamPlatform,
} from "~/src/core/services/DataBaseService/IDataBaseService";

import UiButton from "@webstack/components/UiForm/views/UiButton/UiButton";
import type { IFormField } from "@webstack/components/UiForm/models/IFormModel";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";

import styles from "./AdminLiveStreamPanel.scss";
import { useModal } from "@webstack/components/Containers/modal/contexts/modalContext";
import UiForm from "@webstack/components/UiForm/controller/UiForm";
import { useUser } from "~/src/core/authentication/hooks/useUser";

// OPTIONAL: only if you registered SocialService in DI container
import type ISocialService from "~/src/core/services/SocialService/ISocialService";

const PLATFORMS: StreamPlatform[] = [
  "instagram","tiktok","youtube","twitch","facebook","vimeo","kick","rtmp","custom",
];

export function AdminLiveStreamPanel({ eventId }: { eventId?: number }) {
  const db = useMemo(() => getService<IDataBaseService>("IDataBaseService")!, []);
  const social = useMemo(() => getService<ISocialService>("ISocialService"), []);
  const user = useUser(); // -> provides stripe customer id

  const stripeId =
    (user as any)?.id ||
    (user as any)?.user?.id ||
    (user as any)?.metadata?.user?.stripeId ||
    "";

  const { openModal, closeModal } = useModal();
  const [, setNotification] = useNotification();

  const [streams, setStreams] = useState<LiveStreamRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const notify = useCallback(
    (label: string, message: string, variant?: "danger" | "info" | "success") =>
      setNotification?.({
        active: true,
        persistence: 2000,
        dismissable: true,
        list: [{ label, message }],
        ...(variant === "danger" ? { transparent: false } : {}),
      }),
    [setNotification]
  );

  const refresh = useCallback(async () => {
    if (!db) { setErr("Database service unavailable"); return; }
    if (!eventId) { setStreams([]); return; }
    setLoading(true); setErr(null);
    try {
      const res = await db.streamList({ event_id: eventId });
      setStreams(res?.data ?? []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load streams");
    } finally {
      setLoading(false);
    }
  }, [db, eventId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const toggleLive = useCallback(async (s: LiveStreamRow) => {
    if (!db) return;
    setLoading(true); setErr(null);
    try {
      if (s.status === "live") {
        await db.streamEnd?.(s.id);
        notify("Stream ended", `"${s.title}" is now ended.`, "success");
      } else {
        await db.streamStart?.(s.id);
        notify("Stream live", `"${s.title}" is now live.`, "success");
      }
      await refresh();
    } catch (e: any) {
      const m = e?.message || "Failed to toggle stream";
      setErr(m); notify("Error", m, "danger");
    } finally {
      setLoading(false);
    }
  }, [db, refresh, notify]);

  /* ========== CREATE STREAM MODAL ========== */
  const CreateStreamModal: React.FC<{ eid: number }> = ({ eid }) => {
    const [fields, setFields] = useState<IFormField[]>([
      { name: "event_id", label: "Event", value: String(eid), readonly: true, type: "text" },
      { name: "title",    label: "Title", type: "text", value: "New Stream", required: true },
      {
        name: "platform", label: "Platform", type: "select", value: "instagram", required: true,
        options: PLATFORMS.map(p => ({ label: p, value: p })),
      },
    ]);

    const onChange = (e: any) => {
      const name =
        e?.target?.name ??
        e?.name ?? e?.detail?.name ?? e?.currentTarget?.name ?? "";
      const raw =
        e?.target?.value ??
        e?.value ?? e?.detail?.value ?? e?.currentTarget?.value;

      if (!name) return;
      const value =
        typeof raw === "object" && raw
          ? String((raw as any).value ?? (raw as any).label ?? "")
          : String(raw ?? "");

      setFields(prev => prev.map(f => (f.name === name ? { ...f, value } : f)));
    };

    return (
      <UiForm
        variant="popup"
        fields={fields}
        submitText="Create"
        onChange={onChange}
        onSubmit={async (submitted: IFormField[]) => {
          const get = (k: string) => submitted.find(f => f.name === k)?.value;
          const evId = Number(get("event_id") ?? eid);
          const title = String(get("title") ?? "").trim();
          const platform = String(get("platform") ?? "").toLowerCase() as StreamPlatform;

          if (!title) { notify("Validation", "Title is required.", "danger"); return; }

          try {
            await db.streamCreate?.({ event_id: evId, platform, title, status: "idle", stripe_id: String(stripeId || "") });
            closeModal();
            notify("Stream created", `"${title}" added.`, "success");
            await refresh();
          } catch (e: any) {
            notify("Create failed", e?.message || "Failed to create stream", "danger");
          }
        }}
      />
    );
  };

  /* ========== CONNECT INSTAGRAM MODAL (adds stripe_id to auth call) ========== */
  const ConnectInstagramModal: React.FC = () => {
    const [fields, setFields] = useState<IFormField[]>([
      { name: "email",    label: "Account Email",       type: "text", value: String((user as any)?.email ?? ""), required: true },
      { name: "username", label: "Instagram Username",  type: "text", value: "", required: true },
      { name: "password", label: "Instagram Password",  type: "text", value: "", required: true, traits: { type: "password" } as any },
    ]);

    const onChange = (e: any) => {
      const name =
        e?.target?.name ??
        e?.name ?? e?.detail?.name ?? e?.currentTarget?.name ?? "";
      const value =
        e?.target?.value ??
        e?.value ?? e?.detail?.value ?? e?.currentTarget?.value ?? "";

      if (!name) return;
      setFields(prev => prev.map(f => (f.name === name ? { ...f, value: String(value) } : f)));
    };

    return (
      <UiForm
        variant="popup"
        fields={fields}
        submitText="Authenticate"
        onChange={onChange}
        onSubmit={async (submitted: IFormField[]) => {
          const get = (k: string) => String(submitted.find(f => f.name === k)?.value ?? "");
          const email    = get("email");
          const username = get("username");
          const password = get("password");

          if (!stripeId) {
            notify("Missing account", "No Stripe customer id on user.", "danger");
            return;
          }

          try {
            let sessionSettings: unknown | undefined;

            if (social?.instagramAuthenticate) {
              // ✅ include stripe_id to satisfy type + backend contract
              const resp = await social.instagramAuthenticate({
                email,
                username,
                ig_password:password,
                stripe_id: String(stripeId),
              });

              sessionSettings =
                (resp && (resp as any).data && (resp as any).data.settings) ??
                (resp && (resp as any).settings) ??
                resp;
            }

            // Persist to livestream_auth (idempotent)
            await db.streamConfigSet?.({
              stripe_id: String(stripeId),
              platform: "instagram",
              username,
              metadata: {
                instagram: {
                  settings: sessionSettings ?? null,
                  saved_at: new Date().toISOString(),
                },
              },
            });

            closeModal();
            notify("Instagram connected", `@${username} linked for streaming.`, "success");
          } catch (e: any) {
            notify("Instagram auth failed", e?.message || "Could not authenticate.", "danger");
          }
        }}
      />
    );
  };

  const openCreateStream = useCallback(() => {
    if (!eventId) { notify("Select an event", "Choose an event first.", "info"); return; }
    openModal({ title: "Create Stream", dismissable: true, variant: "popup", children: <CreateStreamModal eid={eventId} /> });
  }, [eventId, notify, openModal]);

  const openConnectInstagram = useCallback(() => {
    openModal({ title: "Connect Instagram", dismissable: true, variant: "popup", children: <ConnectInstagramModal /> });
  }, [openModal]);

  if (!db) {
    return (
      <>
        <style jsx>{styles}</style>
        <div className="admin-live-stream-panel">
          <div className="panel-toolbar"><div className="title">Live Streams</div></div>
          <div className="panel-card panel-card--error">
            <div className="panel-card__title">Database unavailable</div>
            <div className="panel-card__body">Please check your connection or reload.</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx>{styles}</style>
      <div className="admin-live-stream-panel">
        {/* Toolbar */}
        <div className="panel-toolbar">
          <div className="title">Live Streams</div>
          <div className="actions">
            <UiButton onClick={openConnectInstagram} disabled={loading}>
              <UiIcon icon="fa-instagram" size="sm" />
              <span className="ml-2">Connect Instagram</span>
            </UiButton>
            <UiButton onClick={openCreateStream} disabled={!eventId || loading}>
              <UiIcon icon="fa-plus" size="sm" />
              <span className="ml-2">New stream</span>
            </UiButton>
          </div>
        </div>

        {err && <div className="panel-alert panel-alert--error">{err}</div>}
        {!eventId && <div className="panel-hint">Select an event to view its streams.</div>}

        {streams?.length ? (
          streams.map((s) => (
            <div key={s.id} className="stream-row">
              <div className="meta">
                <div className="name">{s.platform} — {s.title}</div>
                <div className="hint">status: {s.status}</div>
              </div>
              <div className="row-actions">
                <UiButton onClick={() => toggleLive(s)} disabled={loading}>
                  {s.status === "live" ? "End" : "Go Live"}
                </UiButton>
                <UiIcon icon="fa-gear" size="sm" onClick={() => {/* open edit modal here */}} />
              </div>
            </div>
          ))
        ) : (
          <div className="panel-hint">No streams yet.</div>
        )}

        <div className="mt-2">
          <UiButton onClick={() => void refresh()} disabled={loading || !eventId}>
            {loading ? "Refreshing..." : "Refresh"}
          </UiButton>
        </div>
      </div>
    </>
  );
}
