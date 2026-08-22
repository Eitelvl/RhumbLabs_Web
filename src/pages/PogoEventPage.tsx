import {FormEvent, useEffect, useMemo, useState} from 'react';
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  CircleStop,
  Clock3,
  LogIn,
  LogOut,
  Medal,
  Play,
  Plus,
  QrCode,
  ShieldCheck,
  Trophy,
  Users,
  Wifi,
} from 'lucide-react';
import {Link} from 'react-router-dom';
import {
  GoogleAuthProvider,
  getIdTokenResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
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

const sessionStorageKey = 'pogo.event.active-session.v1';
const sessionIdPattern = /^js_[a-f0-9]{32}$/;
const tokenPattern = /^[A-Za-z0-9_-]{32,128}$/;

type RoomStatus = 'LOBBY' | 'ACTIVE' | 'FINISHED';

interface StoredEventSession {
  sessionId: string;
  inviteToken: string;
  eventName: string;
  maxParticipants: number;
}
interface EventRoom {
  eventName: string;
  status: RoomStatus;
  participantCount: number;
  maxParticipants: number;
  startedAt?: Date;
  finishedAt?: Date;
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

function readStoredSession(): StoredEventSession | null {
  try {
    const raw = localStorage.getItem(sessionStorageKey);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<StoredEventSession>;
    if (
      !sessionIdPattern.test(value.sessionId ?? '') ||
      !tokenPattern.test(value.inviteToken ?? '')
    ) {
      localStorage.removeItem(sessionStorageKey);
      return null;
    }
    return {
      sessionId: value.sessionId!,
      inviteToken: value.inviteToken!,
      eventName: value.eventName?.trim() || 'Pogo Event',
      maxParticipants: Math.min(100, Math.max(2, value.maxParticipants ?? 100)),
    };
  } catch {
    localStorage.removeItem(sessionStorageKey);
    return null;
  }
}

function asDate(value: unknown): Date | undefined {
  return value instanceof Timestamp ? value.toDate() : undefined;
}

function friendlyFirebaseError(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : '';
  if (code.includes('permission-denied')) {
    return 'Esta cuenta no tiene permiso para administrar eventos de Pogo.';
  }
  if (code.includes('failed-precondition')) {
    return 'Finaliza o abandona la sesión compartida actual antes de crear el evento.';
  }
  if (code.includes('resource-exhausted')) {
    return 'La sala alcanzó su capacidad máxima.';
  }
  if (code.includes('invalid-credential') || code.includes('wrong-password')) {
    return 'Correo o contraseña incorrectos.';
  }
  if (code.includes('popup-closed-by-user')) {
    return 'Se cerró la ventana de Google antes de completar el ingreso.';
  }
  if (code.includes('popup-blocked')) {
    return 'El navegador bloqueó la ventana de Google. Habilita las ventanas emergentes e inténtalo nuevamente.';
  }
  if (code.includes('unauthorized-domain')) {
    return 'Este dominio no está autorizado para iniciar sesión con Google.';
  }
  if (code.includes('too-many-requests')) {
    return 'Demasiados intentos. Espera un momento y vuelve a intentarlo.';
  }
  if (code.includes('network-request-failed') || code.includes('unavailable')) {
    return 'No pudimos conectar con Firebase. Revisa la conexión e inténtalo nuevamente.';
  }
  return 'No pudimos completar la acción. Inténtalo nuevamente.';
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
  const [signedIn, setSignedIn] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [eventName, setEventName] = useState('Pogo Event');
  const [capacity, setCapacity] = useState(100);
  const [eventSession, setEventSession] = useState<StoredEventSession | null>(readStoredSession);
  const [room, setRoom] = useState<EventRoom | null>(null);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveConnected, setLiveConnected] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    getPogoEventFirebase()
      .then(({auth, appCheckConfigured: configured}) => {
        setAppCheckConfigured(configured);
        setFirebaseReady(true);
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          setSignedIn(Boolean(user));
          setAuthorized(false);
          setAuthLoading(true);
          if (user) {
            try {
              const token = await getIdTokenResult(user, true);
              setAuthorized(token.claims.pogoEventAdmin === true);
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
    if (!eventSession) {
      setQrDataUrl('');
      return;
    }
    const payload = `pogo://joint/${eventSession.sessionId}?token=${eventSession.inviteToken}`;
    QRCode.toDataURL(payload, {
      width: 1000,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {dark: '#12051f', light: '#ffffff'},
    }).then(setQrDataUrl).catch(() => setError('No pudimos generar el QR del evento.'));
  }, [eventSession]);

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
        (snapshot) => {
          if (!snapshot.exists()) {
            setError('La sesión del evento expiró o ya no está disponible.');
            setRoom(null);
            setLiveConnected(false);
            return;
          }
          const data = snapshot.data();
          setRoom({
            eventName: typeof data.eventName === 'string'
              ? data.eventName
              : eventSession.eventName,
            status: ['LOBBY', 'ACTIVE', 'FINISHED'].includes(data.status)
              ? data.status as RoomStatus
              : 'LOBBY',
            participantCount: Math.max(0, Number(data.participantCount ?? 0)),
            maxParticipants: Math.min(100, Math.max(2, Number(data.maxParticipants ?? 100))),
            startedAt: asDate(data.startedAt),
            finishedAt: asDate(data.finishedAt),
          });
          setLiveConnected(true);
        },
        (snapshotError) => {
          setError(friendlyFirebaseError(snapshotError));
          setLiveConnected(false);
        },
      );
      stopParticipants = onSnapshot(
        collection(firestore, 'jointSessions', eventSession.sessionId, 'participants'),
        (snapshot) => {
          setParticipants(snapshot.docs.map((participantDocument) => {
            const data = participantDocument.data();
            const levels = Array.isArray(data.climbLevelIds) ? data.climbLevelIds : [];
            return {
              uid: typeof data.uid === 'string' ? data.uid : participantDocument.id,
              displayName: typeof data.displayName === 'string' && data.displayName.trim()
                ? data.displayName.trim()
                : 'Pogo Climber',
              totalPoints: Math.trunc(Number(data.totalPoints ?? 0)),
              fallCount: Math.max(0, Math.trunc(Number(data.fallCount ?? 0))),
              climbCount: levels.length,
              joinedAtMillis: asDate(data.joinedAt)?.getTime() ?? Number.MAX_SAFE_INTEGER,
              updatedAtMillis: asDate(data.updatedAt)?.getTime() ?? 0,
            };
          }));
          setLiveConnected(true);
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
  }, [authorized, eventSession]);

  const ranking = useMemo(() => [...participants]
    .sort((first, second) => {
      const byPoints = second.totalPoints - first.totalPoints;
      return byPoints !== 0 ? byPoints : first.joinedAtMillis - second.joinedAtMillis;
    })
    .slice(0, 10), [participants]);

  const stats = useMemo(() => ({
    totalTops: participants.reduce((total, participant) => total + participant.climbCount, 0),
    totalPoints: participants.reduce((total, participant) => total + participant.totalPoints, 0),
    lastUpdate: participants.reduce(
      (latest, participant) => Math.max(latest, participant.updatedAtMillis),
      0,
    ),
  }), [participants]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const {auth} = await getPogoEventFirebase();
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword('');
    } catch (loginError) {
      setError(friendlyFirebaseError(loginError));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleLogin() {
    setBusy(true);
    setError(null);
    try {
      const {auth} = await getPogoEventFirebase();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({prompt: 'select_account'});
      await signInWithPopup(auth, provider);
    } catch (loginError) {
      setError(friendlyFirebaseError(loginError));
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    const {auth} = await getPogoEventFirebase();
    await signOut(auth);
  }

  async function createEvent(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const {functions} = await getPogoEventFirebase();
      const result = await httpsCallable(functions, 'createJointSession')({
        eventMode: true,
        eventName: eventName.trim() || 'Pogo Event',
        maxParticipants: capacity,
      });
      const data = result.data as Record<string, unknown>;
      const sessionId = typeof data.sessionId === 'string' ? data.sessionId : '';
      const inviteToken = typeof data.inviteToken === 'string' ? data.inviteToken : '';
      if (!sessionIdPattern.test(sessionId) || !tokenPattern.test(inviteToken)) {
        throw new Error('Invalid joint session response');
      }
      const createdSession = {
        sessionId,
        inviteToken,
        eventName: eventName.trim() || 'Pogo Event',
        maxParticipants: capacity,
      };
      localStorage.setItem(sessionStorageKey, JSON.stringify(createdSession));
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
    } catch (statusError) {
      setError(friendlyFirebaseError(statusError));
    } finally {
      setBusy(false);
    }
  }

  function prepareAnotherEvent() {
    localStorage.removeItem(sessionStorageKey);
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

  if (!signedIn) {
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
          <form onSubmit={handleLogin} className="rounded-[2rem] border border-white/10 bg-white/[.055] p-7 shadow-2xl shadow-fuchsia-950/30 backdrop-blur-xl sm:p-9">
            <LogIn className="mb-5 h-9 w-9 text-fuchsia-300" />
            <h2 className="text-2xl font-black text-white">Administración del evento</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Ingresa con la cuenta Google que tiene el rol pogoEventAdmin.</p>
            <button
              type="button"
              disabled={busy}
              onClick={handleGoogleLogin}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white px-5 py-4 font-black text-slate-900 shadow-lg shadow-black/20 transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-black text-blue-600 shadow-sm" aria-hidden="true">G</span>
              {busy ? 'Conectando con Google…' : 'Ingresar con Google'}
            </button>
            <div className="my-6 flex items-center gap-4 text-xs font-bold uppercase tracking-[.18em] text-slate-500" aria-hidden="true">
              <span className="h-px flex-1 bg-white/10" />
              o usa contraseña
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <label className="block text-sm font-bold text-slate-200" htmlFor="event-email">Correo</label>
            <input id="event-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition focus:border-fuchsia-400/60 focus:ring-4 focus:ring-fuchsia-500/10" />
            <label className="mt-5 block text-sm font-bold text-slate-200" htmlFor="event-password">Contraseña</label>
            <input id="event-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition focus:border-fuchsia-400/60 focus:ring-4 focus:ring-fuchsia-500/10" />
            {error && <EventError message={error} />}
            <button disabled={busy} className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-4 font-black text-white shadow-lg shadow-fuchsia-950/40 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
              <ShieldCheck className="h-5 w-5" /> {busy ? 'Verificando…' : 'Ingresar al panel'}
            </button>
          </form>
        </div>
      </EventShell>
    );
  }

  if (!authorized) {
    return (
      <EventShell onLogout={handleLogout}>
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-6 py-16">
          <div className="w-full rounded-[2rem] border border-rose-400/20 bg-rose-400/5 p-8 text-center">
            <CircleStop className="mx-auto mb-5 h-12 w-12 text-rose-300" />
            <h1 className="text-3xl font-black text-white">Acceso no autorizado</h1>
            <p className="mt-4 text-slate-300">La cuenta inició sesión correctamente, pero no tiene el rol administrativo de eventos.</p>
          </div>
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

  const displayCount = Math.max(room?.participantCount ?? 0, participants.length);
  const displayCapacity = room?.maxParticipants ?? eventSession.maxParticipants;
  const displayName = room?.eventName ?? eventSession.eventName;

  return (
    <EventShell onLogout={handleLogout} compact>
      <main className="mx-auto min-h-[calc(100vh-72px)] max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[.26em] text-fuchsia-300"><Activity className="h-4 w-4" /> Pogo Event</div>
            <h1 className="mt-2 text-3xl font-black tracking-[-.04em] text-white sm:text-5xl">{displayName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill status={room?.status ?? 'LOBBY'} connected={liveConnected} />
            {room?.status === 'LOBBY' && <button disabled={busy} onClick={() => changeStatus('startJointSession')} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-400 disabled:opacity-50"><Play className="h-4 w-4 fill-current" /> Iniciar</button>}
            {room?.status === 'ACTIVE' && <button disabled={busy} onClick={() => changeStatus('finishJointSession')} className="flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm font-black text-rose-100 transition hover:bg-rose-400/20 disabled:opacity-50"><CircleStop className="h-4 w-4" /> Finalizar</button>}
            {room?.status === 'FINISHED' && <button onClick={prepareAnotherEvent} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.06] px-4 py-3 text-sm font-black text-white hover:bg-white/10"><Plus className="h-4 w-4" /> Nuevo</button>}
          </div>
        </div>

        {error && <EventError message={error} />}

        <div className="grid gap-5 lg:grid-cols-[minmax(340px,.78fr)_minmax(540px,1.22fr)]">
          <section className="relative overflow-hidden rounded-[2rem] border border-fuchsia-300/15 bg-gradient-to-br from-fuchsia-500/10 via-white/[.055] to-purple-500/10 p-5 sm:p-7">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl" />
            <div className="relative flex h-full flex-col items-center text-center">
              <div className="rounded-[1.75rem] bg-white p-4 shadow-2xl shadow-fuchsia-950/50 sm:p-5">
                {qrDataUrl ? <img src={qrDataUrl} alt="QR para unirse al evento con Pogo" className="aspect-square w-full max-w-[390px]" /> : <div className="grid aspect-square w-[320px] place-items-center"><QrCode className="h-16 w-16 animate-pulse text-slate-300" /></div>}
              </div>
              <h2 className="mt-5 text-2xl font-black text-white">Escanea con Pogo para participar</h2>
              <p className="mt-2 text-sm text-slate-400">Pogo Card → Escanear QR</p>
              <div className="mt-6 flex w-full items-baseline justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                <span className="text-5xl font-black tabular-nums text-white">{displayCount}</span>
                <span className="text-xl font-bold text-slate-400">/ {displayCapacity} participantes</span>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[.05] p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-300/10 text-amber-300"><Trophy className="h-6 w-6" /></div><div><p className="text-xs font-black uppercase tracking-[.24em] text-slate-500">Clasificación</p><h2 className="text-2xl font-black text-white">Top 10</h2></div></div>
              <span className="text-xs font-bold text-slate-500">Puntaje Pogo</span>
            </div>
            <div className="space-y-2.5">
              {ranking.length === 0 ? (
                <div className="grid min-h-[460px] place-items-center rounded-2xl border border-dashed border-white/10 bg-black/10 text-center"><div><Medal className="mx-auto h-12 w-12 text-slate-600" /><p className="mt-4 font-bold text-slate-300">El ranking aparecerá con el primer progreso.</p></div></div>
              ) : ranking.map((participant, index) => (
                <RankingRow key={participant.uid} participant={participant} position={index + 1} />
              ))}
            </div>
          </section>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric icon={Users} label="Participantes" value={`${displayCount}`} />
          <Metric icon={CheckCircle2} label="Tops registrados" value={formatPoints(stats.totalTops)} />
          <Metric icon={Trophy} label="Puntos acumulados" value={formatPoints(stats.totalPoints)} />
          <Metric icon={Clock3} label="Último progreso" value={stats.lastUpdate ? formatTime(new Date(stats.lastUpdate)) : 'Esperando'} />
        </div>
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
  const label = status === 'LOBBY' ? 'Esperando' : status === 'ACTIVE' ? 'En vivo' : 'Finalizado';
  const color = status === 'ACTIVE' ? 'text-emerald-200 bg-emerald-400/10 border-emerald-400/20' : status === 'FINISHED' ? 'text-slate-300 bg-white/5 border-white/10' : 'text-amber-200 bg-amber-400/10 border-amber-400/20';
  return <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-black uppercase tracking-[.16em] ${color}`}><span className={`h-2 w-2 rounded-full ${connected ? 'bg-current' : 'bg-rose-400'} ${status === 'ACTIVE' && connected ? 'animate-pulse' : ''}`} />{label}</div>;
}

function RankingRow({participant, position}: {participant: EventParticipant; position: number}) {
  const podium = position === 1 ? 'border-amber-300/25 bg-amber-300/[.08]' : position === 2 ? 'border-slate-300/20 bg-slate-300/[.06]' : position === 3 ? 'border-orange-300/20 bg-orange-300/[.06]' : 'border-white/[.07] bg-black/10';
  return (
    <div className={`grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border px-3.5 py-3 ${podium}`}>
      <div className="text-center text-xl font-black tabular-nums text-slate-400">{position}</div>
      <div className="min-w-0"><p className="truncate font-black text-white">{participant.displayName}</p><p className="mt-0.5 text-xs font-semibold text-slate-500">{participant.climbCount} tops · {participant.fallCount} caídas</p></div>
      <div className="text-right"><p className="text-xl font-black tabular-nums text-white">{formatPoints(participant.totalPoints)}</p><p className="text-[10px] font-black uppercase tracking-[.16em] text-fuchsia-300">pts</p></div>
    </div>
  );
}

function Metric({icon: Icon, label, value}: {icon: typeof Users; label: string; value: string}) {
  return <div className="flex items-center gap-4 rounded-2xl border border-white/[.07] bg-white/[.04] p-4"><div className="grid h-10 w-10 place-items-center rounded-xl bg-fuchsia-400/10 text-fuchsia-300"><Icon className="h-5 w-5" /></div><div><p className="text-xs font-bold text-slate-500">{label}</p><p className="mt-0.5 text-lg font-black tabular-nums text-white">{value}</p></div></div>;
}
