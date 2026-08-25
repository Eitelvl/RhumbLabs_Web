import {FormEvent, useEffect, useMemo, useState} from 'react';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  CircleStop,
  Clock3,
  Crown,
  KeyRound,
  LogOut,
  Medal,
  Play,
  Plus,
  QrCode,
  ScanLine,
  ShieldCheck,
  Trophy,
  UserRound,
  Users,
  Wifi,
} from 'lucide-react';
import {Link} from 'react-router-dom';
import {
  getIdTokenResult,
  onAuthStateChanged,
  signInWithCustomToken,
  signOut,
} from 'firebase/auth';
import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import {httpsCallable} from 'firebase/functions';
import QRCode from 'qrcode';

import {SafeImage} from '../components/SafeImage';
import {getPogoEventFirebase} from '../lib/pogoEventFirebase';

const operatorIdStorageKey = 'pogo.event.operator-id.v1';
const transientEventSessionKey = 'pogo.event.active-tab-session.v1';
const obsoleteSessionStorageKeys = [
  'pogo.event.active-session.v1',
  'pogo.event.active-session.v2',
];
const sessionIdPattern = /^js_[a-f0-9]{32}$/;
const tokenPattern = /^[A-Za-z0-9_-]{32,128}$/;
const eventHostUidPattern = /^pogo_event_[a-f0-9]{48}$/;
const defaultEventName = 'Evento Pogo';

type RoomStatus = 'LOBBY' | 'ACTIVE' | 'FINISHED';

interface EventSession {
  sessionId: string;
  inviteToken: string;
  hostUid: string;
  eventName: string;
  maxParticipants: number;
  lastKnownStatus: RoomStatus;
}
interface EventRoom {
  eventName: string;
  status: RoomStatus;
  participantCount: number;
  maxParticipants: number;
  startedAt?: Date;
  finishedAt?: Date;
  finalRanking?: EventParticipant[];
}

interface EventParticipant {
  uid: string;
  displayName: string;
  totalPoints: number;
  fallCount: number;
  climbCount: number;
  joinedAtMillis: number;
  updatedAtMillis: number;
}

function normalizeEventName(value?: string) {
  const name = value?.trim();
  if (!name || /^(?:(?:pogo|power|pow) event|evento\s*pow)$/i.test(name)) {
    return defaultEventName;
  }
  return name;
}

function readTransientEventSession(): EventSession | null {
  try {
    const raw = sessionStorage.getItem(transientEventSessionKey);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<EventSession>;
    if (
      !sessionIdPattern.test(value.sessionId ?? '') ||
      !tokenPattern.test(value.inviteToken ?? '') ||
      !eventHostUidPattern.test(value.hostUid ?? '')
    ) {
      sessionStorage.removeItem(transientEventSessionKey);
      return null;
    }
    return {
      sessionId: value.sessionId!,
      inviteToken: value.inviteToken!,
      hostUid: value.hostUid!,
      eventName: normalizeEventName(value.eventName),
      maxParticipants: Math.min(100, Math.max(2, finiteInteger(value.maxParticipants, 100))),
      lastKnownStatus: ['LOBBY', 'ACTIVE', 'FINISHED'].includes(value.lastKnownStatus ?? '')
        ? value.lastKnownStatus as RoomStatus
        : 'LOBBY',
    };
  } catch {
    sessionStorage.removeItem(transientEventSessionKey);
    return null;
  }
}

function writeTransientEventSession(session: EventSession) {
  try {
    sessionStorage.setItem(transientEventSessionKey, JSON.stringify(session));
  } catch {
    // The live event remains usable even when browser storage is unavailable.
  }
}

function clearTransientEventSession() {
  try {
    sessionStorage.removeItem(transientEventSessionKey);
  } catch {
    // Nothing else is required when browser storage is unavailable.
  }
}

function readOrCreateOperatorId() {
  const stored = localStorage.getItem(operatorIdStorageKey)?.trim() ?? '';
  if (/^[A-Za-z0-9_-]{20,64}$/.test(stored)) return stored;

  const bytes = crypto.getRandomValues(new Uint8Array(24));
  const operatorId = Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
  localStorage.setItem(operatorIdStorageKey, operatorId);
  return operatorId;
}

function asDate(value: unknown): Date | undefined {
  return value instanceof Timestamp ? value.toDate() : undefined;
}

function finiteInteger(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.trunc(number) : fallback;
}

function asFinalRanking(value: unknown): EventParticipant[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== 'object') return [];
    const data = entry as Record<string, unknown>;
    const uid = typeof data.uid === 'string' ? data.uid : '';
    if (!uid) return [];
    return [{
      uid,
      displayName: typeof data.displayName === 'string' && data.displayName.trim()
        ? data.displayName.trim()
        : 'Pogo Climber',
      totalPoints: finiteInteger(data.totalPoints),
      fallCount: Math.max(0, finiteInteger(data.fallCount)),
      climbCount: Math.max(0, finiteInteger(data.climbCount)),
      joinedAtMillis: finiteInteger(data.joinedAtMillis, Number.MAX_SAFE_INTEGER),
      updatedAtMillis: Math.max(0, finiteInteger(data.updatedAtMillis)),
    }];
  }).slice(0, 10);
}

function friendlyFirebaseError(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : '';
  if (code.includes('permission-denied')) {
    return 'No tienes permiso para administrar esta sesión del evento.';
  }
  if (code.includes('failed-precondition')) {
    return 'Finaliza o abandona la sesión compartida actual antes de crear el evento.';
  }
  if (code.includes('resource-exhausted')) {
    return 'La sala alcanzó su capacidad máxima.';
  }
  if (code.includes('invalid-argument')) {
    return 'Ingresa una clave de evento válida.';
  }
  if (code.includes('invalid-credential')) {
    return 'No pudimos validar el acceso al evento. Inténtalo nuevamente.';
  }
  if (code.includes('not-found')) {
    return 'El acceso por clave todavía no está habilitado en el servidor.';
  }
  if (code.includes('too-many-requests')) {
    return 'Demasiados intentos. Espera un momento y vuelve a intentarlo.';
  }
  if (code.includes('network-request-failed') || code.includes('unavailable')) {
    return 'No pudimos conectar con Firebase. Revisa la conexión e inténtalo nuevamente.';
  }
  return 'No pudimos completar la acción. Inténtalo nuevamente.';
}

function friendlyAccessError(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : '';
  if (code.includes('permission-denied')) {
    return 'La clave del evento no es válida.';
  }
  return friendlyFirebaseError(error);
}

function formatPoints(value: number) {
  return new Intl.NumberFormat('es-CL').format(value);
}

function formatTime(value?: Date) {
  return value?.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  }) ?? '—';
}

export default function PogoEventPage() {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [appCheckConfigured, setAppCheckConfigured] = useState(false);
  const [configurationError, setConfigurationError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [accessKey, setAccessKey] = useState('');
  const [eventName, setEventName] = useState(defaultEventName);
  const [capacity, setCapacity] = useState(100);
  const [eventSession, setEventSession] = useState<EventSession | null>(readTransientEventSession);
  const [room, setRoom] = useState<EventRoom | null>(null);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveConnected, setLiveConnected] = useState(false);

  useEffect(() => {
    const handleOffline = () => setLiveConnected(false);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    obsoleteSessionStorageKeys.forEach((key) => localStorage.removeItem(key));
    let unsubscribe = () => {};
    getPogoEventFirebase()
      .then(({auth, appCheckConfigured: configured}) => {
        setAppCheckConfigured(configured);
        setFirebaseReady(true);
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          setAuthorized(false);
          setAuthLoading(true);
          if (user) {
            try {
              const token = await getIdTokenResult(user, true);
              const isAuthorized =
                user.uid.startsWith('pogo_event_') &&
                token.claims.pogoEventAdmin === true;
              setAuthorized(isAuthorized);
              setEventSession((current) => {
                if (!current || (isAuthorized && current.hostUid === user.uid)) return current;
                clearTransientEventSession();
                return null;
              });
            } catch (authError) {
              setError(friendlyFirebaseError(authError));
            }
          }
          setAuthLoading(false);
        });
      })
      .catch((firebaseError) => {
        setConfigurationError(
          firebaseError instanceof Error ? firebaseError.message : String(firebaseError),
        );
        setAuthLoading(false);
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!eventSession || eventSession.lastKnownStatus !== 'LOBBY') {
      setQrDataUrl('');
      return;
    }
    let cancelled = false;
    const payload = `pogo://joint/${eventSession.sessionId}?token=${eventSession.inviteToken}`;
    QRCode.toDataURL(payload, {
      width: 1000,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {dark: '#12051f', light: '#ffffff'},
    }).then((dataUrl) => {
      if (!cancelled) setQrDataUrl(dataUrl);
    }).catch(() => setError('No pudimos generar el QR del evento.'));
    return () => {
      cancelled = true;
    };
  }, [eventSession?.inviteToken, eventSession?.lastKnownStatus, eventSession?.sessionId]);

  useEffect(() => {
    if (!authorized || !eventSession) {
      setRoom(null);
      setParticipants([]);
      setLiveConnected(false);
      return;
    }
    let stopRoom = () => {};
    let stopParticipants = () => {};
    let cancelled = false;

    getPogoEventFirebase().then(({firestore}) => {
      if (cancelled) return;
      stopRoom = onSnapshot(
        doc(firestore, 'jointSessions', eventSession.sessionId),
        {includeMetadataChanges: true},
        (snapshot) => {
          const fromCache = snapshot.metadata.fromCache;
          if (!snapshot.exists()) {
            setLiveConnected(false);
            if (fromCache) return;
            setError('La sesión del evento expiró o ya no está disponible.');
            setRoom(null);
            clearTransientEventSession();
            setEventSession(null);
            return;
          }
          const data = snapshot.data();
          const status = ['LOBBY', 'ACTIVE', 'FINISHED'].includes(data.status)
            ? data.status as RoomStatus
            : 'LOBBY';
          setRoom({
            eventName: typeof data.eventName === 'string'
              ? normalizeEventName(data.eventName)
              : eventSession.eventName,
            status,
            participantCount: Math.max(0, Number(data.participantCount ?? 0)),
            maxParticipants: Math.min(100, Math.max(2, Number(data.maxParticipants ?? 100))),
            startedAt: asDate(data.startedAt),
            finishedAt: asDate(data.finishedAt),
            finalRanking: asFinalRanking(data.finalRanking),
          });
          setEventSession((current) => {
            if (!current || current.lastKnownStatus === status) return current;
            const updated = {...current, lastKnownStatus: status};
            writeTransientEventSession(updated);
            return updated;
          });
          setLiveConnected(!fromCache && navigator.onLine);
        },
        (snapshotError) => {
          setError(friendlyFirebaseError(snapshotError));
          setLiveConnected(false);
        },
      );
      stopParticipants = onSnapshot(
        collection(firestore, 'jointSessions', eventSession.sessionId, 'participants'),
        {includeMetadataChanges: true},
        (snapshot) => {
          setParticipants(snapshot.docs.map((participantDocument) => {
            const data = participantDocument.data();
            const levels = Array.isArray(data.climbLevelIds) ? data.climbLevelIds : [];
            return {
              uid: typeof data.uid === 'string' ? data.uid : participantDocument.id,
              displayName: typeof data.displayName === 'string' && data.displayName.trim()
                ? data.displayName.trim()
                : 'Pogo Climber',
              totalPoints: finiteInteger(data.totalPoints),
              fallCount: Math.max(0, finiteInteger(data.fallCount)),
              climbCount: levels.length,
              joinedAtMillis: asDate(data.joinedAt)?.getTime() ?? Number.MAX_SAFE_INTEGER,
              updatedAtMillis: asDate(data.updatedAt)?.getTime() ?? 0,
            };
          }));
        },
        (snapshotError) => {
          setError(friendlyFirebaseError(snapshotError));
          setLiveConnected(false);
        },
      );
    }).catch((firebaseError) => setError(friendlyFirebaseError(firebaseError)));

    return () => {
      cancelled = true;
      stopRoom();
      stopParticipants();
    };
  }, [authorized, eventSession?.sessionId]);

  const eventParticipants = useMemo(
    () => participants.filter((participant) => participant.uid !== eventSession?.hostUid),
    [eventSession?.hostUid, participants],
  );

  const liveRanking = useMemo(() => [...eventParticipants]
    .sort((first, second) => {
      const byPoints = second.totalPoints - first.totalPoints;
      return byPoints !== 0 ? byPoints : first.joinedAtMillis - second.joinedAtMillis;
    })
    .slice(0, 10), [eventParticipants]);

  const lobbyParticipants = useMemo(() => [...eventParticipants]
    .sort((first, second) => first.joinedAtMillis - second.joinedAtMillis),
  [eventParticipants]);

  const ranking = room?.status === 'FINISHED' && room.finalRanking
    ? room.finalRanking
    : liveRanking;

  async function handleAccessKey(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const {auth, functions} = await getPogoEventFirebase();
      const result = await httpsCallable(functions, 'authorizePogoEvent')({
        accessKey: accessKey.trim(),
        operatorId: readOrCreateOperatorId(),
      });
      const data = result.data as Record<string, unknown>;
      const customToken = typeof data.customToken === 'string' ? data.customToken : '';
      if (!customToken) throw new Error('Invalid event authorization response');
      const credential = await signInWithCustomToken(auth, customToken);
      if (eventSession?.hostUid !== credential.user.uid) {
        setEventSession(null);
      }
      setAccessKey('');
    } catch (accessError) {
      setError(friendlyAccessError(accessError));
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    const {auth} = await getPogoEventFirebase();
    clearTransientEventSession();
    setEventSession(null);
    await signOut(auth);
  }

  async function createEvent(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const {auth, functions} = await getPogoEventFirebase();
      const result = await httpsCallable(functions, 'createJointSession')({
        eventMode: true,
        eventName: eventName.trim() || defaultEventName,
        maxParticipants: capacity,
      });
      const data = result.data as Record<string, unknown>;
      const sessionId = typeof data.sessionId === 'string' ? data.sessionId : '';
      const inviteToken = typeof data.inviteToken === 'string' ? data.inviteToken : '';
      const hostUid = typeof data.hostUid === 'string' ? data.hostUid : '';
      if (
        !sessionIdPattern.test(sessionId) ||
        !tokenPattern.test(inviteToken) ||
        !eventHostUidPattern.test(hostUid) ||
        hostUid !== auth.currentUser?.uid
      ) {
        throw new Error('Invalid joint session response');
      }
      const createdSession = {
        sessionId,
        inviteToken,
        hostUid,
        eventName: eventName.trim() || defaultEventName,
        maxParticipants: capacity,
        lastKnownStatus: 'LOBBY' as RoomStatus,
      };
      writeTransientEventSession(createdSession);
      setEventSession(createdSession);
    } catch (creationError) {
      setError(friendlyFirebaseError(creationError));
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(functionName: 'startJointSession' | 'finishJointSession') {
    if (!eventSession) return;
    setBusy(true);
    setError(null);
    try {
      const {functions} = await getPogoEventFirebase();
      await httpsCallable(functions, functionName)({sessionId: eventSession.sessionId});
      const nextStatus: RoomStatus = functionName === 'startJointSession' ? 'ACTIVE' : 'FINISHED';
      setEventSession((current) => {
        if (!current) return current;
        const updated = {...current, lastKnownStatus: nextStatus};
        writeTransientEventSession(updated);
        return updated;
      });
    } catch (statusError) {
      setError(friendlyFirebaseError(statusError));
    } finally {
      setBusy(false);
    }
  }

  function prepareAnotherEvent() {
    clearTransientEventSession();
    setEventSession(null);
    setRoom(null);
    setParticipants([]);
    setError(null);
  }

  if (configurationError) {
    return (
      <EventShell>
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-6 py-16">
          <div className="w-full rounded-[2rem] border border-amber-400/20 bg-amber-400/5 p-8 text-center">
            <ShieldCheck className="mx-auto mb-5 h-12 w-12 text-amber-300" />
            <h1 className="text-3xl font-black text-white">Configuración pendiente</h1>
            <p className="mt-4 text-slate-300">
              Registra la aplicación web de Firebase y configura las variables VITE_FIREBASE_* para habilitar el panel.
            </p>
            <p className="mt-3 font-mono text-xs text-amber-200/70">{configurationError}</p>
          </div>
        </div>
      </EventShell>
    );
  }

  if (authLoading || !firebaseReady) {
    return <EventShell><EventLoading /></EventShell>;
  }

  if (!authorized) {
    return (
      <EventShell>
        <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-6xl items-center gap-12 px-6 py-14 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.24em] text-fuchsia-200">
              <ShieldCheck className="h-4 w-4" /> Acceso privado
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[.98] tracking-[-.055em] text-white sm:text-7xl">
              La escalada sucede aquí. El ranking, en vivo.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Crea una sesión compatible con Pogo, proyecta el QR y sigue el Top 10 sin interrumpir a quienes están escalando.
            </p>
          </div>
          <form onSubmit={handleAccessKey} className="rounded-[2rem] border border-white/10 bg-white/[.055] p-7 shadow-2xl shadow-fuchsia-950/30 backdrop-blur-xl sm:p-9">
            <KeyRound className="mb-5 h-9 w-9 text-fuchsia-300" />
            <h2 className="text-2xl font-black text-white">Iniciar sesión compartida</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Ingresa la clave entregada para administrar el evento. No necesitas una cuenta.</p>
            <label className="mt-7 block text-sm font-bold text-slate-200" htmlFor="event-access-key">Clave del evento</label>
            <input
              id="event-access-key"
              type="password"
              autoComplete="current-password"
              minLength={7}
              maxLength={128}
              required
              autoFocus
              value={accessKey}
              onChange={(event) => setAccessKey(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition focus:border-fuchsia-400/60 focus:ring-4 focus:ring-fuchsia-500/10"
            />
            {error && <EventError message={error} />}
            <button disabled={busy} className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-4 font-black text-white shadow-lg shadow-fuchsia-950/40 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
              <KeyRound className="h-5 w-5" /> {busy ? 'Verificando…' : 'Continuar con la clave'}
            </button>
          </form>
        </div>
      </EventShell>
    );
  }

  if (!eventSession) {
    return (
      <EventShell onLogout={handleLogout}>
        <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-6xl items-center gap-12 px-6 py-14 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.24em] text-emerald-200">
              <CheckCircle2 className="h-4 w-4" /> Sistema listo
            </div>
            <h1 className="text-5xl font-black leading-none tracking-[-.055em] text-white sm:text-7xl">Crea la sala. Pogo hace el resto.</h1>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {[
                [QrCode, 'Mismo QR'],
                [Wifi, 'Tiempo real'],
                [Users, 'Hasta 100'],
              ].map(([Icon, label]) => (
                <div key={String(label)} className="rounded-2xl border border-white/8 bg-white/[.04] p-4 text-sm font-bold text-slate-200">
                  <Icon className="mb-3 h-5 w-5 text-fuchsia-300" />{String(label)}
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={createEvent} className="rounded-[2rem] border border-white/10 bg-white/[.055] p-7 shadow-2xl shadow-fuchsia-950/30 backdrop-blur-xl sm:p-9">
            <Plus className="mb-5 h-9 w-9 text-fuchsia-300" />
            <h2 className="text-2xl font-black text-white">Nuevo evento</h2>
            <label className="mt-7 block text-sm font-bold text-slate-200" htmlFor="event-name">Nombre del evento</label>
            <input id="event-name" maxLength={120} value={eventName} onChange={(event) => setEventName(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition focus:border-fuchsia-400/60 focus:ring-4 focus:ring-fuchsia-500/10" />
            <label className="mt-5 block text-sm font-bold text-slate-200" htmlFor="event-capacity">Capacidad máxima</label>
            <input id="event-capacity" type="number" min={2} max={100} value={capacity} onChange={(event) => setCapacity(Math.min(100, Math.max(2, Number(event.target.value) || 2)))} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition focus:border-fuchsia-400/60 focus:ring-4 focus:ring-fuchsia-500/10" />
            {!appCheckConfigured && <p className="mt-4 text-xs leading-5 text-amber-200">App Check no tiene site key configurada; las Functions de producción rechazarán la creación.</p>}
            {error && <EventError message={error} />}
            <button disabled={busy || !appCheckConfigured} className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-4 font-black text-white shadow-lg shadow-fuchsia-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
              <Plus className="h-5 w-5" /> {busy ? 'Creando…' : 'Crear evento'}
            </button>
          </form>
        </div>
      </EventShell>
    );
  }

  const displayCount = Math.max(
    Math.max(0, (room?.participantCount ?? 0) - 1),
    eventParticipants.length,
  );
  const displayCapacity = room?.maxParticipants ?? eventSession.maxParticipants;
  const displayName = room?.eventName ?? eventSession.eventName;
  const currentStatus = room?.status ?? eventSession.lastKnownStatus;

  return (
    <EventShell onLogout={handleLogout} compact>
      <main className="mx-auto min-h-[calc(100vh-72px)] max-w-[2200px] px-4 py-5 sm:px-6 lg:px-8 2xl:px-12">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-[-.04em] text-white sm:text-5xl 2xl:text-6xl">{displayName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill status={currentStatus} connected={liveConnected} />
            {currentStatus === 'LOBBY' && <button disabled={busy || !liveConnected} onClick={() => changeStatus('startJointSession')} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-base font-black text-white transition hover:bg-emerald-400 disabled:opacity-50"><Play className="h-5 w-5 fill-current" /> Iniciar</button>}
            {currentStatus === 'ACTIVE' && <button disabled={busy || !liveConnected} onClick={() => changeStatus('finishJointSession')} className="flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-5 py-3 text-base font-black text-rose-100 transition hover:bg-rose-400/20 disabled:opacity-50"><CircleStop className="h-5 w-5" /> {busy ? 'Finalizando…' : 'Finalizar sesión'}</button>}
            {currentStatus === 'FINISHED' && <button onClick={prepareAnotherEvent} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.06] px-5 py-3 text-base font-black text-white hover:bg-white/10"><Plus className="h-5 w-5" /> Nuevo</button>}
          </div>
        </div>

        {error && <EventError message={error} />}

        {currentStatus === 'LOBBY' && (
          <LobbyLayout
            qrDataUrl={qrDataUrl}
            participants={lobbyParticipants}
            participantCount={displayCount}
            capacity={displayCapacity}
          />
        )}

        {currentStatus === 'ACTIVE' && (
          <RankingPanel
            ranking={ranking}
            participantCount={displayCount}
            capacity={displayCapacity}
          />
        )}

        {currentStatus === 'FINISHED' && (
          <div className="space-y-5">
            <WinnersPanel ranking={ranking} finishedAt={room?.finishedAt} />
            <RankingPanel
              ranking={ranking}
              participantCount={displayCount}
              capacity={displayCapacity}
              finished
            />
          </div>
        )}
      </main>
    </EventShell>
  );
}

function EventShell({children, onLogout, compact = false}: {children: React.ReactNode; onLogout?: () => void; compact?: boolean}) {
  return (
    <div className="min-h-screen bg-[#09050f] text-white selection:bg-fuchsia-400/30">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(217,70,239,.14),transparent_32%),radial-gradient(circle_at_85%_90%,rgba(124,58,237,.12),transparent_34%)]" />
      <header className={`relative z-10 border-b border-white/8 bg-black/20 backdrop-blur-xl ${compact ? 'py-3' : 'py-4'}`}>
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 sm:px-7">
          <Link to="/" aria-label="Ir al inicio de RhumbLabs" className="flex h-12 w-36 items-center sm:w-52">
            <SafeImage
              src="/images/rhumb-labs-logo.png"
              alt="RhumbLabs"
              className="h-auto w-[145px] origin-left object-contain sm:w-[185px]"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/pogo" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-400 transition hover:bg-white/5 hover:text-white"><ArrowLeft className="h-4 w-4" /> Pogo</Link>
            {onLogout && <button onClick={onLogout} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-400 transition hover:bg-white/5 hover:text-white"><LogOut className="h-4 w-4" /> Salir</button>}
          </div>
        </div>
      </header>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function EventLoading() {
  return <div className="grid min-h-[80vh] place-items-center"><div className="text-center"><SafeImage src="/images/rhumb-labs-logo.png" alt="RhumbLabs" className="mx-auto h-auto w-56 object-contain" /><p className="mt-5 animate-pulse text-sm font-bold text-slate-400">Preparando el evento…</p></div></div>;
}

function EventError({message}: {message: string}) {
  return <div role="alert" className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100">{message}</div>;
}

function StatusPill({status, connected}: {status: RoomStatus; connected: boolean}) {
  const statusLabel = status === 'LOBBY' ? 'Esperando' : status === 'ACTIVE' ? 'En vivo' : 'Finalizado';
  const label = connected ? statusLabel : `Reconectando · ${statusLabel}`;
  const color = status === 'ACTIVE' ? 'text-emerald-200 bg-emerald-400/10 border-emerald-400/20' : status === 'FINISHED' ? 'text-slate-300 bg-white/5 border-white/10' : 'text-amber-200 bg-amber-400/10 border-amber-400/20';
  return <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-black uppercase tracking-[.16em] ${color}`}><span className={`h-2 w-2 rounded-full ${connected ? 'bg-current' : 'bg-rose-400'} ${status === 'ACTIVE' && connected ? 'animate-pulse' : ''}`} />{label}</div>;
}

function LobbyLayout({
  qrDataUrl,
  participants,
  participantCount,
  capacity,
}: {
  qrDataUrl: string;
  participants: EventParticipant[];
  participantCount: number;
  capacity: number;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(300px,380px)_minmax(520px,1fr)_minmax(270px,340px)]">
      <LobbyInstructions />

      <section className="relative grid min-h-[calc(100vh-190px)] place-items-center overflow-hidden rounded-[2rem] border border-fuchsia-300/15 bg-gradient-to-br from-fuchsia-500/10 via-white/[.055] to-purple-500/10 p-4 sm:p-6">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="relative rounded-[2rem] bg-white p-3 shadow-2xl shadow-fuchsia-950/50 sm:p-4">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR para unirse al evento con Pogo"
              className="aspect-square w-[min(68vh,880px)] max-w-full"
            />
          ) : (
            <div className="grid aspect-square w-[min(68vh,880px)] max-w-full place-items-center">
              <QrCode className="h-24 w-24 animate-pulse text-slate-300" />
            </div>
          )}
        </div>
      </section>

      <section className="flex min-h-[calc(100vh-190px)] flex-col rounded-[2rem] border border-white/10 bg-white/[.05] p-5 shadow-2xl shadow-black/20 sm:p-7">
        <div className="border-b border-white/10 pb-5">
          <p className="text-xs font-black uppercase tracking-[.24em] text-fuchsia-300">Participantes</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-5xl font-black tabular-nums text-white 2xl:text-6xl">{participantCount}</span>
            <span className="text-xl font-bold text-slate-400">/ {capacity}</span>
          </div>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          {participants.length === 0 ? (
            <div className="grid h-full min-h-48 place-items-center rounded-2xl border border-dashed border-white/10 bg-black/10 px-5 text-center">
              <div>
                <Users className="mx-auto h-10 w-10 text-slate-600" />
                <p className="mt-3 text-sm font-bold text-slate-400">Esperando participantes…</p>
              </div>
            </div>
          ) : (
            <ol className="space-y-2">
              {participants.map((participant, index) => (
                <li key={participant.uid} className="grid grid-cols-[32px_minmax(0,1fr)] items-center gap-2 rounded-xl border border-white/[.07] bg-black/10 px-3 py-2.5">
                  <span className="text-center text-sm font-black tabular-nums text-slate-500">{index + 1}</span>
                  <span className="truncate text-base font-bold text-slate-100">{participant.displayName}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}

function LobbyInstructions() {
  return (
    <section className="flex min-h-[calc(100vh-190px)] flex-col rounded-[2rem] border border-white/10 bg-white/[.05] p-5 shadow-2xl shadow-black/20 sm:p-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[.24em] text-fuchsia-300">Antes de comenzar</p>
        <h2 className="mt-2 text-3xl font-black tracking-[-.035em] text-white">Cómo ingresar</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">Sigue estos pasos en la aplicación Pogo.</p>
      </div>

      <div className="mt-5 space-y-4">
        <InstructionStep
          number={1}
          icon={UserRound}
          title="Abre tu Perfil"
          description="Toca Perfil abajo a la derecha y luego el ícono QR de la esquina superior."
          imageSrc="/images/pogo-event-profile-guide.jpg"
          imageAlt="Pantalla Perfil de Pogo con el botón QR destacado"
        />
        <InstructionStep
          number={2}
          icon={Camera}
          title="Abre la cámara"
          description="En Pogo ID, toca la cámara que aparece arriba a la derecha."
          imageSrc="/images/pogo-event-id-guide.jpg"
          imageAlt="Pantalla Pogo ID con el botón de cámara destacado"
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <CompactInstruction
            number={3}
            icon={ScanLine}
            title="Escanea"
            description="Apunta la cámara al QR grande del centro."
          />
          <CompactInstruction
            number={4}
            icon={Clock3}
            title="Espera"
            description="Quédate en la sala hasta que se inicie el evento."
          />
        </div>
      </div>
    </section>
  );
}

function InstructionStep({
  number,
  icon: Icon,
  title,
  description,
  imageSrc,
  imageAlt,
}: {
  number: number;
  icon: typeof UserRound;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[.08] bg-black/15">
      <div className="grid grid-cols-[38px_minmax(0,1fr)] gap-3 p-3.5">
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-fuchsia-300/20 bg-fuchsia-400/10 text-fuchsia-200">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[.16em] text-fuchsia-300">Paso {number}</p>
          <h3 className="mt-0.5 text-base font-black text-white">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
        </div>
      </div>
      <img src={imageSrc} alt={imageAlt} className="h-36 w-full border-t border-white/[.08] object-cover object-top 2xl:h-44" />
    </div>
  );
}

function CompactInstruction({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: number;
  icon: typeof ScanLine;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[.08] bg-black/15 p-3.5">
      <div className="flex items-center gap-2 text-fuchsia-200">
        <Icon className="h-5 w-5" />
        <span className="text-xs font-black uppercase tracking-[.14em]">Paso {number}</span>
      </div>
      <h3 className="mt-2 text-sm font-black text-white">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
    </div>
  );
}

function RankingPanel({
  ranking,
  participantCount,
  capacity,
  finished = false,
}: {
  ranking: EventParticipant[];
  participantCount: number;
  capacity: number;
  finished?: boolean;
}) {
  return (
    <section className="min-h-[calc(100vh-190px)] rounded-[2rem] border border-white/10 bg-white/[.05] p-5 shadow-2xl shadow-black/20 sm:p-7 2xl:p-9">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-300/10 text-amber-300 2xl:h-16 2xl:w-16">
            <Trophy className="h-8 w-8 2xl:h-9 2xl:w-9" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[.24em] text-slate-500 2xl:text-sm">Clasificación</p>
            <h2 className="text-3xl font-black text-white 2xl:text-5xl">{finished ? 'Resultados finales' : 'Top 10'}</h2>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[clamp(1.75rem,2.4vw,3.5rem)] font-black leading-none tabular-nums text-white">{participantCount} <span className="text-slate-500">/ {capacity}</span></p>
          <p className="mt-1 text-sm font-black uppercase tracking-[.18em] text-slate-500">participantes</p>
        </div>
      </div>

      <div className="space-y-2.5 2xl:space-y-3">
        {ranking.length === 0 ? (
          <div className="grid min-h-[calc(100vh-370px)] place-items-center rounded-2xl border border-dashed border-white/10 bg-black/10 text-center">
            <div>
              <Medal className="mx-auto h-16 w-16 text-slate-600" />
              <p className="mt-5 text-2xl font-bold text-slate-300">El ranking aparecerá con el primer progreso.</p>
            </div>
          </div>
        ) : ranking.map((participant, index) => (
          <RankingRow key={participant.uid} participant={participant} position={index + 1} />
        ))}
      </div>
    </section>
  );
}

function WinnersPanel({ranking, finishedAt}: {ranking: EventParticipant[]; finishedAt?: Date}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-amber-300/20 bg-gradient-to-br from-amber-300/10 via-fuchsia-500/[.08] to-purple-500/10 p-5 shadow-2xl shadow-amber-950/20 sm:p-7">
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="relative text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-amber-200/20 bg-amber-300/10 text-amber-200">
          <Crown className="h-8 w-8" />
        </div>
        <p className="mt-5 text-xs font-black uppercase tracking-[.28em] text-amber-200/80">Evento finalizado</p>
        <h2 className="mt-2 text-3xl font-black tracking-[-.04em] text-white">Ganadores del Evento Pogo</h2>
        <p className="mt-2 text-sm text-slate-400">{finishedAt ? `Resultados cerrados a las ${formatTime(finishedAt)}` : 'Resultados finales'}</p>

        {ranking.length === 0 ? (
          <div className="mt-8 grid min-h-[270px] place-items-center rounded-2xl border border-dashed border-white/10 bg-black/10 px-6">
            <div><Medal className="mx-auto h-12 w-12 text-slate-600" /><p className="mt-4 font-bold text-slate-300">La sesión terminó sin puntajes registrados.</p></div>
          </div>
        ) : (
          <div className="mt-8 grid gap-3 sm:grid-cols-3 sm:items-end">
            {ranking.slice(0, 3).map((participant, index) => (
              <WinnerCard key={participant.uid} participant={participant} position={index + 1} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function WinnerCard({participant, position}: {participant: EventParticipant; position: number}) {
  const style = position === 1
    ? 'border-amber-200/35 bg-amber-300/[.12] sm:order-2 sm:min-h-[250px]'
    : position === 2
      ? 'border-slate-200/20 bg-slate-200/[.07] sm:order-1 sm:min-h-[215px]'
      : 'border-orange-300/20 bg-orange-300/[.07] sm:order-3 sm:min-h-[195px]';
  const medalColor = position === 1 ? 'text-amber-200' : position === 2 ? 'text-slate-200' : 'text-orange-300';

  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border p-4 ${style}`}>
      {position === 1 ? <Crown className={`h-8 w-8 ${medalColor}`} /> : <Medal className={`h-7 w-7 ${medalColor}`} />}
      <p className={`mt-3 text-xs font-black uppercase tracking-[.18em] ${medalColor}`}>{position}.° lugar</p>
      <p className="mt-2 max-w-full truncate text-lg font-black text-white">{participant.displayName}</p>
      <p className="mt-3 text-2xl font-black tabular-nums text-white">{formatPoints(participant.totalPoints)}</p>
      <p className="text-[10px] font-black uppercase tracking-[.16em] text-fuchsia-300">pts</p>
    </div>
  );
}

function RankingRow({participant, position}: {participant: EventParticipant; position: number}) {
  const podium = position === 1
    ? 'border-amber-300/60 bg-gradient-to-r from-amber-300/25 via-amber-300/10 to-transparent shadow-lg shadow-amber-950/20'
    : position === 2
      ? 'border-slate-200/45 bg-gradient-to-r from-slate-200/20 via-slate-200/[.07] to-transparent'
      : position === 3
        ? 'border-orange-400/45 bg-gradient-to-r from-orange-400/20 via-orange-400/[.07] to-transparent'
        : 'border-white/[.08] bg-black/15';
  const positionStyle = position === 1
    ? 'border-amber-200/50 bg-amber-300/20 text-amber-100'
    : position === 2
      ? 'border-slate-200/40 bg-slate-200/15 text-slate-100'
      : position === 3
        ? 'border-orange-300/40 bg-orange-400/15 text-orange-200'
        : 'border-white/10 bg-white/[.04] text-slate-400';
  const nameStyle = position === 1
    ? 'text-amber-100'
    : position === 2
      ? 'text-slate-100'
      : position === 3
        ? 'text-orange-100'
        : 'text-white';
  return (
    <div className={`grid grid-cols-[clamp(54px,5vw,88px)_minmax(0,1fr)_auto] items-center gap-[clamp(.75rem,1.5vw,2rem)] rounded-2xl border px-[clamp(.8rem,1.5vw,1.75rem)] py-[clamp(.65rem,1vh,1.15rem)] ${podium}`}>
      <div className={`grid aspect-square w-[clamp(46px,4vw,72px)] place-items-center rounded-full border text-[clamp(1.35rem,2vw,2.5rem)] font-black tabular-nums ${positionStyle}`}>{position}</div>
      <div className="min-w-0">
        <p className={`truncate text-[clamp(1.45rem,2.1vw,3.25rem)] font-black leading-tight tracking-[-.025em] ${nameStyle}`}>{participant.displayName}</p>
        <p className="mt-0.5 text-[clamp(.75rem,.85vw,1.15rem)] font-semibold text-slate-500">{participant.climbCount} tops · {participant.fallCount} caídas</p>
      </div>
      <div className="min-w-[clamp(110px,13vw,260px)] text-right">
        <p className="text-[clamp(1.75rem,2.7vw,4rem)] font-black leading-none tabular-nums text-white">{formatPoints(participant.totalPoints)}</p>
        <p className="mt-1 text-[clamp(.65rem,.7vw,.9rem)] font-black uppercase tracking-[.2em] text-fuchsia-300">pts</p>
      </div>
    </div>
  );
}
