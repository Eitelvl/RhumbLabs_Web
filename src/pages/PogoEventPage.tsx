import {FormEvent, useEffect, useMemo, useState} from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CircleStop,
  Crown,
  Edit3,
  Eye,
  EyeOff,
  KeyRound,
  ListOrdered,
  LogOut,
  Maximize2,
  Medal,
  Minimize2,
  Play,
  Plus,
  QrCode,
  ShieldCheck,
  TestTube2,
  Trash2,
  Trophy,
  Users,
  Wifi,
  X,
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
  getDoc,
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
const manualResultsStorageKey = 'pogo.event.manual-results.v1';
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

interface ManualResultEntry {
  id: string;
  displayName: string;
  points: string;
}

interface ManualResultsDraft {
  eventName: string;
  entries: ManualResultEntry[];
}

interface PresentedResults {
  eventName: string;
  ranking: EventParticipant[];
  finishedAt?: Date;
}

type SimulationSize = 0 | 50 | 70;

const simulationFirstNames = [
  'Andrés', 'Antonia', 'Benjamín', 'Camila', 'Catalina', 'Cristóbal', 'Daniela',
  'Diego', 'Emilia', 'Felipe', 'Fernanda', 'Gabriel', 'Ignacia', 'Isidora',
  'Javiera', 'Joaquín', 'Josefa', 'Lucas', 'Martina', 'Matías',
];

const simulationLastNames = [
  'Araya', 'Castillo', 'Contreras', 'Díaz', 'Flores', 'González', 'Herrera',
  'Lagos', 'Martínez', 'Muñoz', 'Navarro', 'Pérez', 'Rojas', 'Silva',
];

function normalizeEventName(value?: string) {
  const name = value?.trim();
  if (!name || /^(?:(?:pogo|power|pow) event|evento\s*pow)$/i.test(name)) {
    return defaultEventName;
  }
  return name;
}

function readTransientEventSession(): EventSession | null {
  try {
    const localValue = localStorage.getItem(transientEventSessionKey);
    const tabValue = sessionStorage.getItem(transientEventSessionKey);
    const raw = localValue ?? tabValue;
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<EventSession>;
    if (
      !sessionIdPattern.test(value.sessionId ?? '') ||
      !tokenPattern.test(value.inviteToken ?? '') ||
      !eventHostUidPattern.test(value.hostUid ?? '')
    ) {
      localStorage.removeItem(transientEventSessionKey);
      sessionStorage.removeItem(transientEventSessionKey);
      return null;
    }
    if (!localValue && tabValue) {
      localStorage.setItem(transientEventSessionKey, tabValue);
      sessionStorage.removeItem(transientEventSessionKey);
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
    try {
      localStorage.removeItem(transientEventSessionKey);
      sessionStorage.removeItem(transientEventSessionKey);
    } catch {
      // Browser storage can be blocked without preventing live event access.
    }
    return null;
  }
}

function writeTransientEventSession(session: EventSession) {
  try {
    localStorage.setItem(transientEventSessionKey, JSON.stringify(session));
  } catch {
    // The live event remains usable even when browser storage is unavailable.
  }
}

function clearTransientEventSession() {
  try {
    localStorage.removeItem(transientEventSessionKey);
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

function scoreFromProgress(levels: unknown[], fallCount: number) {
  const climbPoints = levels.reduce<number>((total, value) => {
    const level = finiteInteger(value, -1);
    if (level < 0 || level > 15) return total;
    const scaleIndex = level % 8;
    return total + (scaleIndex === 7 ? 100 : (scaleIndex + 1) * 10);
  }, 0);
  return climbPoints - Math.max(0, fallCount) * 10;
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

function createManualResultEntry(index: number): ManualResultEntry {
  return {
    id: `manual-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 9)}`,
    displayName: '',
    points: '',
  };
}

function createDefaultManualEntries() {
  return Array.from({length: 3}, (_, index) => createManualResultEntry(index));
}

function readManualResultsDraft(): ManualResultsDraft {
  const fallback = {
    eventName: defaultEventName,
    entries: createDefaultManualEntries(),
  };
  try {
    const raw = localStorage.getItem(manualResultsStorageKey);
    if (!raw) return fallback;
    const value = JSON.parse(raw) as Partial<ManualResultsDraft>;
    const entries = Array.isArray(value.entries)
      ? value.entries.flatMap((entry, index) => {
        if (!entry || typeof entry !== 'object') return [];
        const result = entry as Partial<ManualResultEntry>;
        return [{
          id: typeof result.id === 'string' && result.id
            ? result.id
            : createManualResultEntry(index).id,
          displayName: typeof result.displayName === 'string'
            ? result.displayName.slice(0, 100)
            : '',
          points: typeof result.points === 'string'
            ? result.points.slice(0, 12)
            : '',
        }];
      }).slice(0, 100)
      : [];
    while (entries.length < 3) entries.push(createManualResultEntry(entries.length));
    return {
      eventName: typeof value.eventName === 'string'
        ? value.eventName.slice(0, 120)
        : defaultEventName,
      entries,
    };
  } catch {
    return fallback;
  }
}

function writeManualResultsDraft(draft: ManualResultsDraft) {
  try {
    localStorage.setItem(manualResultsStorageKey, JSON.stringify(draft));
  } catch {
    // The editor remains usable when browser storage is unavailable.
  }
}

function isManualEntryComplete(entry: ManualResultEntry) {
  return entry.displayName.trim().length > 0 && /^-?\d+$/.test(entry.points.trim());
}

function isManualEntryEmpty(entry: ManualResultEntry) {
  return entry.displayName.trim().length === 0 && entry.points.trim().length === 0;
}

function manualEntriesToRanking(entries: ManualResultEntry[]): EventParticipant[] {
  const now = Date.now();
  return entries.flatMap((entry, index) => {
    if (!isManualEntryComplete(entry)) return [];
    return [{
      uid: entry.id,
      displayName: entry.displayName.trim(),
      totalPoints: finiteInteger(entry.points),
      fallCount: 0,
      climbCount: 0,
      joinedAtMillis: now + index,
      updatedAtMillis: now,
    }];
  });
}

function createSimulatedParticipants(size: Exclude<SimulationSize, 0>): EventParticipant[] {
  const now = Date.now();
  return Array.from({length: size}, (_, index) => {
    const climbCount = (index * 7 + 3) % 25;
    const fallCount = (index * 5 + 1) % 18;
    return {
      uid: `simulated-participant-${index + 1}`,
      displayName: `${simulationFirstNames[index % simulationFirstNames.length]} ${simulationLastNames[(index * 3) % simulationLastNames.length]}`,
      totalPoints: climbCount * 100 + ((index * 37) % 95),
      fallCount,
      climbCount,
      joinedAtMillis: now - (size - index) * 1_000,
      updatedAtMillis: now,
    };
  });
}

function updateSimulatedParticipants(participants: EventParticipant[]) {
  const updatesPerTick = Math.max(5, Math.round(participants.length / 8));
  const updateIndexes = new Set<number>();
  while (updateIndexes.size < updatesPerTick) {
    updateIndexes.add(Math.floor(Math.random() * participants.length));
  }
  const now = Date.now();
  return participants.map((participant, index) => {
    if (!updateIndexes.has(index)) return participant;
    const completedTop = Math.random() > 0.32;
    return {
      ...participant,
      totalPoints: participant.totalPoints + (completedTop ? 100 : 8),
      climbCount: participant.climbCount + (completedTop ? 1 : 0),
      fallCount: participant.fallCount + (completedTop ? 0 : 1),
      updatedAtMillis: now,
    };
  });
}

export default function PogoEventPage() {
  const [initialManualDraft] = useState(readManualResultsDraft);
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
  const [simulationSize, setSimulationSize] = useState<SimulationSize>(0);
  const [simulatedParticipants, setSimulatedParticipants] = useState<EventParticipant[]>([]);
  const [manualMode, setManualMode] = useState(false);
  const [manualEventName, setManualEventName] = useState(initialManualDraft.eventName);
  const [manualEntries, setManualEntries] = useState(initialManualDraft.entries);
  const [presentedResults, setPresentedResults] = useState<PresentedResults | null>(null);

  useEffect(() => {
    writeManualResultsDraft({eventName: manualEventName, entries: manualEntries});
  }, [manualEntries, manualEventName]);

  useEffect(() => {
    if (simulationSize === 0) {
      setSimulatedParticipants([]);
      return;
    }
    setSimulatedParticipants(createSimulatedParticipants(simulationSize));
    const interval = window.setInterval(() => {
      setSimulatedParticipants((current) => updateSimulatedParticipants(current));
    }, 800);
    return () => window.clearInterval(interval);
  }, [simulationSize]);

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
        async (snapshot) => {
          const fromCache = snapshot.metadata.fromCache;
          if (!snapshot.exists()) {
            setLiveConnected(false);
            if (fromCache) return;
            try {
              const archived = await getDoc(doc(
                firestore,
                'pogoEventResults',
                eventSession.sessionId,
              ));
              if (archived.exists()) {
                const archivedData = archived.data();
                setRoom({
                  eventName: typeof archivedData.eventName === 'string'
                    ? normalizeEventName(archivedData.eventName)
                    : eventSession.eventName,
                  status: 'FINISHED',
                  participantCount: Math.max(
                    0,
                    Number(archivedData.participantCount ?? 0) + 1,
                  ),
                  maxParticipants: Math.min(100, Math.max(
                    2,
                    Number(archivedData.maxParticipants ?? 100),
                  )),
                  startedAt: asDate(archivedData.startedAt),
                  finishedAt: asDate(archivedData.finishedAt),
                  finalRanking: asFinalRanking(archivedData.finalRanking),
                });
                setLiveConnected(navigator.onLine);
                return;
              }
            } catch (archiveError) {
              setError(friendlyFirebaseError(archiveError));
              return;
            }
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
            const fallCount = Math.max(0, finiteInteger(data.fallCount));
            return {
              uid: typeof data.uid === 'string' ? data.uid : participantDocument.id,
              displayName: typeof data.displayName === 'string' && data.displayName.trim()
                ? data.displayName.trim()
                : 'Pogo Climber',
              totalPoints: scoreFromProgress(levels, fallCount),
              fallCount,
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

  const displayedParticipants = simulationSize > 0
    ? simulatedParticipants
    : eventParticipants;

  const completeLiveRanking = useMemo(() => [...displayedParticipants]
    .sort((first, second) => {
      const byPoints = second.totalPoints - first.totalPoints;
      return byPoints !== 0 ? byPoints : first.joinedAtMillis - second.joinedAtMillis;
    }), [displayedParticipants]);

  const liveRanking = useMemo(
    () => completeLiveRanking.slice(0, 10),
    [completeLiveRanking],
  );

  const lobbyParticipants = useMemo(() => [...displayedParticipants]
    .sort((first, second) => first.joinedAtMillis - second.joinedAtMillis),
  [displayedParticipants]);

  const ranking = simulationSize === 0 && room?.status === 'FINISHED' && room.finalRanking
    ? room.finalRanking
    : liveRanking;
  const completeRanking = completeLiveRanking.length > 0 ? completeLiveRanking : ranking;

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
      const activeEvent = data.activeEvent && typeof data.activeEvent === 'object'
        ? data.activeEvent as Record<string, unknown>
        : null;
      const recoveredSessionId = typeof activeEvent?.sessionId === 'string'
        ? activeEvent.sessionId
        : '';
      const recoveredInviteToken = typeof activeEvent?.inviteToken === 'string'
        ? activeEvent.inviteToken
        : '';
      const recoveredHostUid = typeof activeEvent?.hostUid === 'string'
        ? activeEvent.hostUid
        : '';
      if (
        sessionIdPattern.test(recoveredSessionId) &&
        tokenPattern.test(recoveredInviteToken) &&
        eventHostUidPattern.test(recoveredHostUid) &&
        recoveredHostUid === credential.user.uid
      ) {
        const recoveredStatus = ['LOBBY', 'ACTIVE', 'FINISHED'].includes(
          String(activeEvent?.status ?? ''),
        )
          ? activeEvent?.status as RoomStatus
          : 'LOBBY';
        const recoveredSession: EventSession = {
          sessionId: recoveredSessionId,
          inviteToken: recoveredInviteToken,
          hostUid: recoveredHostUid,
          eventName: normalizeEventName(
            typeof activeEvent?.eventName === 'string' ? activeEvent.eventName : undefined,
          ),
          maxParticipants: Math.min(100, Math.max(
            2,
            finiteInteger(activeEvent?.maxParticipants, 100),
          )),
          lastKnownStatus: recoveredStatus,
        };
        writeTransientEventSession(recoveredSession);
        setEventSession(recoveredSession);
      } else if (eventSession?.hostUid !== credential.user.uid) {
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
    setSimulationSize(0);
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

  function updateManualEntry(id: string, field: 'displayName' | 'points', value: string) {
    setManualEntries((current) => current.map((entry) => entry.id === id
      ? {...entry, [field]: value}
      : entry));
  }

  function addManualEntry() {
    setManualEntries((current) => current.length >= 100
      ? current
      : [...current, createManualResultEntry(current.length)]);
  }

  function removeManualEntry(id: string) {
    setManualEntries((current) => current.length <= 3
      ? current
      : current.filter((entry) => entry.id !== id));
  }

  function resetManualResults() {
    const shouldReset = window.confirm(
      '¿Limpiar todo el borrador manual? Esta acción elimina nombres y puntajes ingresados.',
    );
    if (!shouldReset) return;
    setManualEventName(defaultEventName);
    setManualEntries(createDefaultManualEntries());
  }

  function openWinnersPresentation(results: PresentedResults) {
    setPresentedResults(results);
    document.documentElement.requestFullscreen?.().catch(() => {
      // The in-page presentation still fills the viewport when native fullscreen is blocked.
    });
  }

  function presentManualResults() {
    openWinnersPresentation({
      eventName: manualEventName.trim() || defaultEventName,
      ranking: manualEntriesToRanking(manualEntries),
      finishedAt: new Date(),
    });
  }

  async function closeWinnersPresentation() {
    setPresentedResults(null);
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined);
    }
  }

  function prepareAnotherEvent() {
    clearTransientEventSession();
    setEventSession(null);
    setRoom(null);
    setParticipants([]);
    setSimulationSize(0);
    setManualMode(false);
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

  if (presentedResults) {
    return (
      <WinnersPresentation
        eventName={presentedResults.eventName}
        ranking={presentedResults.ranking}
        finishedAt={presentedResults.finishedAt}
        onClose={closeWinnersPresentation}
      />
    );
  }

  if (manualMode && !eventSession) {
    return (
      <EventShell onLogout={handleLogout} compact>
        <ManualResultsEditor
          eventName={manualEventName}
          entries={manualEntries}
          onEventNameChange={setManualEventName}
          onEntryChange={updateManualEntry}
          onAddEntry={addManualEntry}
          onRemoveEntry={removeManualEntry}
          onReset={resetManualResults}
          onBack={() => setManualMode(false)}
          onPresent={presentManualResults}
        />
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
          <div className="space-y-4">
            <form onSubmit={createEvent} className="rounded-[2rem] border border-white/10 bg-white/[.055] p-7 shadow-2xl shadow-fuchsia-950/30 backdrop-blur-xl sm:p-9">
              <Plus className="mb-5 h-9 w-9 text-fuchsia-300" />
              <h2 className="text-2xl font-black text-white">Nuevo evento en vivo</h2>
              <label className="mt-7 block text-sm font-bold text-slate-200" htmlFor="event-name">Nombre del evento</label>
              <input id="event-name" maxLength={120} value={eventName} onChange={(event) => setEventName(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition focus:border-fuchsia-400/60 focus:ring-4 focus:ring-fuchsia-500/10" />
              <label className="mt-5 block text-sm font-bold text-slate-200" htmlFor="event-capacity">Capacidad máxima</label>
              <input id="event-capacity" type="number" min={2} max={100} value={capacity} onChange={(event) => setCapacity(Math.min(100, Math.max(2, Number(event.target.value) || 2)))} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition focus:border-fuchsia-400/60 focus:ring-4 focus:ring-fuchsia-500/10" />
              {!appCheckConfigured && <p className="mt-4 text-xs leading-5 text-amber-200">App Check no tiene site key configurada; las Functions de producción rechazarán la creación.</p>}
              {error && <EventError message={error} />}
              <button disabled={busy || !appCheckConfigured} className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-4 font-black text-white shadow-lg shadow-fuchsia-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
                <Plus className="h-5 w-5" /> {busy ? 'Creando…' : 'Crear evento en vivo'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setManualMode(true)}
              className="group flex w-full items-center gap-4 rounded-[1.5rem] border border-amber-300/20 bg-gradient-to-r from-amber-300/10 to-fuchsia-500/[.07] p-5 text-left transition hover:border-amber-200/35 hover:bg-amber-300/[.13]"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-amber-200/20 bg-amber-300/10 text-amber-200">
                <Edit3 className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-black text-white">Ingresar resultados manualmente</span>
                <span className="mt-1 block text-sm leading-5 text-slate-400">Anota las posiciones y proyecta los ganadores sin crear una sala.</span>
              </span>
              <ArrowLeft className="h-5 w-5 rotate-180 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
            </button>
          </div>
        </div>
      </EventShell>
    );
  }

  const displayCount = simulationSize || Math.max(
    Math.max(0, (room?.participantCount ?? 0) - 1),
    eventParticipants.length,
  );
  const displayCapacity = Math.max(
    room?.maxParticipants ?? eventSession.maxParticipants,
    simulationSize,
  );
  const displayName = room?.eventName ?? eventSession.eventName;
  const currentStatus = room?.status ?? eventSession.lastKnownStatus;

  return (
    <EventShell onLogout={handleLogout} compact>
      <main className={`mx-auto min-h-[calc(100vh-72px)] max-w-[2200px] px-4 py-5 sm:px-6 lg:px-8 2xl:px-12 ${currentStatus === 'LOBBY' ? 'xl:h-[calc(100vh-72px)] xl:overflow-hidden' : ''}`}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-[-.04em] text-white sm:text-5xl 2xl:text-6xl">{displayName}</h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <SimulationControls value={simulationSize} onChange={setSimulationSize} />
            <StatusPill status={currentStatus} connected={liveConnected} />
            {currentStatus === 'LOBBY' && <button disabled={busy || !liveConnected} onClick={() => changeStatus('startJointSession')} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-base font-black text-white transition hover:bg-emerald-400 disabled:opacity-50"><Play className="h-5 w-5 fill-current" /> Iniciar</button>}
            {currentStatus === 'ACTIVE' && <button disabled={busy || !liveConnected} onClick={() => changeStatus('finishJointSession')} className="flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-5 py-3 text-base font-black text-rose-100 transition hover:bg-rose-400/20 disabled:opacity-50"><CircleStop className="h-5 w-5" /> {busy ? 'Finalizando…' : 'Finalizar sesión'}</button>}
            {currentStatus === 'FINISHED' && ranking.length > 0 && <button onClick={() => openWinnersPresentation({eventName: displayName, ranking: completeRanking, finishedAt: room?.finishedAt})} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-fuchsia-500 px-5 py-3 text-base font-black text-[#19091c] shadow-lg shadow-fuchsia-950/30 transition hover:brightness-110"><Maximize2 className="h-5 w-5" /> Presentar ganadores</button>}
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
            completeRanking={completeRanking}
            participantCount={displayCount}
            capacity={displayCapacity}
          />
        )}

        {currentStatus === 'FINISHED' && (
          <div className="space-y-5">
            <WinnersPanel ranking={ranking} finishedAt={room?.finishedAt} />
            <RankingPanel
              ranking={ranking}
              completeRanking={completeRanking}
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

function ManualResultsEditor({
  eventName,
  entries,
  onEventNameChange,
  onEntryChange,
  onAddEntry,
  onRemoveEntry,
  onReset,
  onBack,
  onPresent,
}: {
  eventName: string;
  entries: ManualResultEntry[];
  onEventNameChange: (value: string) => void;
  onEntryChange: (id: string, field: 'displayName' | 'points', value: string) => void;
  onAddEntry: () => void;
  onRemoveEntry: (id: string) => void;
  onReset: () => void;
  onBack: () => void;
  onPresent: () => void;
}) {
  const podiumIsComplete = entries.slice(0, 3).every(isManualEntryComplete);
  const hasPartialEntry = entries.slice(3).some((entry) => (
    !isManualEntryEmpty(entry) && !isManualEntryComplete(entry)
  ));
  const completedCount = entries.filter(isManualEntryComplete).length;
  const canPresent = podiumIsComplete && !hasPartialEntry;

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] max-w-6xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <button type="button" onClick={onBack} className="mb-5 flex items-center gap-2 text-sm font-black text-slate-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Volver a tipos de evento
          </button>
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-amber-200/20 bg-amber-300/10 text-amber-200">
              <ListOrdered className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[.22em] text-amber-200/80">Carga manual</p>
              <h1 className="text-3xl font-black tracking-[-.04em] text-white sm:text-5xl">Resultados del evento</h1>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Las filas definen el orden final: anota nombre y puntaje desde el primer lugar hacia abajo. El borrador queda guardado en este navegador.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={onReset} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.05] px-5 py-4 font-black text-slate-300 transition hover:bg-rose-400/10 hover:text-rose-200">
            <Trash2 className="h-5 w-5" /> Limpiar borrador
          </button>
          <button
            type="button"
            disabled={!canPresent}
            onClick={onPresent}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-fuchsia-500 px-6 py-4 font-black text-[#19091c] shadow-xl shadow-fuchsia-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:grayscale disabled:opacity-40"
          >
            <Maximize2 className="h-5 w-5" /> Presentar ganadores
          </button>
        </div>
      </div>

      <section className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.05] shadow-2xl shadow-black/20">
        <div className="grid gap-5 border-b border-white/10 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <label className="block">
            <span className="text-sm font-black text-slate-200">Nombre del evento</span>
            <input
              type="text"
              value={eventName}
              maxLength={120}
              onChange={(event) => onEventNameChange(event.target.value)}
              placeholder={defaultEventName}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-lg font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-fuchsia-400/60 focus:ring-4 focus:ring-fuchsia-500/10"
            />
          </label>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-right">
            <p className="text-2xl font-black tabular-nums text-white">{completedCount}</p>
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-slate-500">resultados listos</p>
          </div>
        </div>

        <div className="hidden grid-cols-[64px_minmax(0,1fr)_minmax(140px,220px)_44px] gap-3 px-5 pb-2 pt-5 text-[11px] font-black uppercase tracking-[.16em] text-slate-500 sm:grid sm:px-7">
          <span className="text-center">Pos.</span>
          <span>Competidor</span>
          <span>Puntaje</span>
          <span />
        </div>

        <ol className="space-y-2 px-4 py-5 sm:px-7 sm:pb-7 sm:pt-2">
          {entries.map((entry, index) => {
            const position = index + 1;
            const isPodium = position <= 3;
            const positionStyle = position === 1
              ? 'border-amber-200/40 bg-amber-300/15 text-amber-100'
              : position === 2
                ? 'border-slate-200/30 bg-slate-200/10 text-slate-100'
                : position === 3
                  ? 'border-orange-300/30 bg-orange-300/10 text-orange-200'
                  : 'border-white/10 bg-white/[.04] text-slate-400';
            return (
              <li key={entry.id} className={`grid gap-3 rounded-2xl border p-3 sm:grid-cols-[64px_minmax(0,1fr)_minmax(140px,220px)_44px] sm:items-center ${isPodium ? 'border-white/[.12] bg-white/[.045]' : 'border-white/[.06] bg-black/10'}`}>
                <div className="flex items-center gap-3 sm:block">
                  <span className="text-[10px] font-black uppercase tracking-[.15em] text-slate-600 sm:hidden">Posición</span>
                  <span className={`grid h-11 w-11 place-items-center rounded-xl border text-lg font-black tabular-nums sm:mx-auto ${positionStyle}`}>{position}</span>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-black text-slate-400 sm:hidden">Competidor</span>
                  <input
                    type="text"
                    value={entry.displayName}
                    maxLength={100}
                    required={isPodium}
                    onChange={(event) => onEntryChange(entry.id, 'displayName', event.target.value)}
                    placeholder={isPodium ? `Nombre del ${position}.° lugar` : 'Nombre del competidor'}
                    className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-fuchsia-400/60 focus:ring-4 focus:ring-fuchsia-500/10"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-black text-slate-400 sm:hidden">Puntaje</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={entry.points}
                    required={isPodium}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (/^-?\d*$/.test(value) && value.length <= 12) {
                        onEntryChange(entry.id, 'points', value);
                      }
                    }}
                    placeholder="0"
                    className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-right text-lg font-black tabular-nums text-white outline-none transition placeholder:text-slate-600 focus:border-fuchsia-400/60 focus:ring-4 focus:ring-fuchsia-500/10"
                  />
                </label>
                <button
                  type="button"
                  disabled={isPodium}
                  onClick={() => onRemoveEntry(entry.id)}
                  aria-label={`Eliminar posición ${position}`}
                  className="grid h-11 w-11 place-items-center justify-self-end rounded-xl text-slate-600 transition hover:bg-rose-400/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-20"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 p-5 sm:px-7">
          <div>
            {!podiumIsComplete && <p className="text-sm font-bold text-amber-200">Completa nombre y puntaje de los tres primeros lugares.</p>}
            {podiumIsComplete && hasPartialEntry && <p className="text-sm font-bold text-amber-200">Completa o elimina las filas que tienen datos pendientes.</p>}
            {canPresent && <p className="text-sm font-bold text-emerald-300">Todo listo para proyectar.</p>}
          </div>
          <button
            type="button"
            disabled={entries.length >= 100}
            onClick={onAddEntry}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.06] px-5 py-3 font-black text-white transition hover:bg-white/10 disabled:opacity-40"
          >
            <Plus className="h-5 w-5" /> Agregar competidor
          </button>
        </div>
      </section>
    </main>
  );
}

function WinnersPresentation({
  eventName,
  ranking,
  finishedAt,
  onClose,
}: {
  eventName: string;
  ranking: EventParticipant[];
  finishedAt?: Date;
  onClose: () => void | Promise<void>;
}) {
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [showCompleteRanking, setShowCompleteRanking] = useState(true);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined);
      return;
    }
    await document.documentElement.requestFullscreen?.().catch(() => undefined);
  }

  return (
    <main className="relative min-h-screen overflow-y-auto bg-[#09050f] text-white selection:bg-fuchsia-400/30 lg:h-screen lg:overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(251,191,36,.18),transparent_30%),radial-gradient(circle_at_78%_82%,rgba(217,70,239,.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,.025),transparent_55%)]" />
      <div className="relative flex min-h-screen flex-col px-[clamp(1rem,2vw,2.75rem)] py-[clamp(1rem,2vh,1.75rem)] lg:h-screen">
        <header className="flex shrink-0 items-center justify-between gap-5 border-b border-white/10 pb-[clamp(.75rem,1.5vh,1.25rem)]">
          <div className="min-w-0">
            <p className="text-[clamp(.65rem,.85vw,.9rem)] font-black uppercase tracking-[.28em] text-amber-200/80">Ganadores del evento</p>
            <h1 className="mt-1 truncate text-[clamp(1.8rem,3vw,4rem)] font-black leading-[1.15] tracking-[-.045em] text-white">{eventName}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-black text-slate-300">Resultados finales</p>
              <p className="mt-0.5 text-xs font-bold text-slate-500">{finishedAt ? formatTime(finishedAt) : 'Evento finalizado'}</p>
            </div>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Volver a pantalla completa'}
              title={isFullscreen ? 'Salir de pantalla completa' : 'Volver a pantalla completa'}
              className="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[.06] px-3 text-sm font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              <span className="hidden 2xl:inline">{isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCompleteRanking((current) => !current)}
              aria-pressed={!showCompleteRanking}
              aria-label={showCompleteRanking ? 'Ocultar resto de competidores' : 'Mostrar resto de competidores'}
              title={showCompleteRanking ? 'Ocultar resto de competidores' : 'Mostrar resto de competidores'}
              className="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[.06] px-3 text-sm font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {showCompleteRanking ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              <span className="hidden 2xl:inline">{showCompleteRanking ? 'Ocultar resto' : 'Mostrar resto'}</span>
            </button>
            <button type="button" onClick={onClose} aria-label="Cerrar presentación" className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[.06] text-slate-300 transition hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className={`grid min-h-0 flex-1 gap-[clamp(1rem,1.5vw,1.75rem)] pt-[clamp(1rem,2vh,1.75rem)] ${showCompleteRanking ? 'lg:grid-cols-[minmax(0,72fr)_minmax(300px,28fr)]' : 'lg:grid-cols-1'}`}>
          <section className="relative flex min-h-[620px] flex-col overflow-hidden rounded-[clamp(1.5rem,2vw,2.5rem)] border border-amber-200/20 bg-gradient-to-br from-amber-300/[.09] via-white/[.045] to-fuchsia-500/[.09] p-[clamp(1rem,2vw,2.5rem)] lg:min-h-0">
            <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />
            <div className="relative flex shrink-0 items-center justify-center gap-3 text-center">
              <Crown className="h-[clamp(2rem,3vw,4rem)] w-[clamp(2rem,3vw,4rem)] text-amber-200" />
              <h2 className="text-[clamp(2rem,4vw,5.5rem)] font-black leading-none tracking-[-.055em] text-white">Nuestro podio</h2>
            </div>

            {ranking.length === 0 ? (
              <div className="relative grid min-h-0 flex-1 place-items-center text-center">
                <p className="text-2xl font-bold text-slate-300">No hay resultados para presentar.</p>
              </div>
            ) : (
              <div className="relative mt-[clamp(1rem,3vh,3rem)] grid min-h-0 flex-1 gap-[clamp(.75rem,1.2vw,1.5rem)] sm:grid-cols-3 sm:items-end">
                {ranking.slice(0, 3).map((participant, index) => (
                  <PresentationWinnerCard key={participant.uid} participant={participant} position={index + 1} />
                ))}
              </div>
            )}
          </section>

          {showCompleteRanking && (
            <section className="flex min-h-[520px] flex-col overflow-hidden rounded-[clamp(1.5rem,2vw,2.5rem)] border border-white/10 bg-black/25 p-[clamp(1rem,1.5vw,1.75rem)] lg:min-h-0">
              <div className="shrink-0 border-b border-white/10 pb-4">
                <p className="text-[10px] font-black uppercase tracking-[.22em] text-fuchsia-300">Clasificación final</p>
                <div className="mt-1 flex items-end justify-between gap-3">
                  <h2 className="text-[clamp(1.5rem,2vw,2.5rem)] font-black text-white">Resto del ranking</h2>
                  <p className="pb-1 text-sm font-black tabular-nums text-slate-400">
                    {Math.max(0, ranking.length - 3)} {ranking.length === 4 ? 'restante' : 'restantes'}
                  </p>
                </div>
              </div>
              <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
                {ranking.length <= 3 ? (
                  <div className="grid h-full min-h-44 place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[.025] px-5 text-center">
                    <div>
                      <Medal className="mx-auto h-10 w-10 text-slate-600" />
                      <p className="mt-3 font-bold text-slate-400">El podio está completo.</p>
                    </div>
                  </div>
                ) : (
                  <ol className="space-y-2">
                    {ranking.slice(3).map((participant, index) => (
                      <CompleteRankingRow key={participant.uid} participant={participant} position={index + 4} />
                    ))}
                  </ol>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function PresentationWinnerCard({participant, position}: {participant: EventParticipant; position: number}) {
  const style = position === 1
    ? 'border-amber-200/45 bg-gradient-to-b from-amber-300/20 to-amber-300/[.07] sm:order-2 sm:h-[min(54vh,650px)]'
    : position === 2
      ? 'border-slate-200/25 bg-gradient-to-b from-slate-200/[.13] to-slate-200/[.045] sm:order-1 sm:h-[min(46vh,560px)]'
      : 'border-orange-300/25 bg-gradient-to-b from-orange-300/[.13] to-orange-300/[.045] sm:order-3 sm:h-[min(41vh,500px)]';
  const accent = position === 1
    ? 'text-amber-200 border-amber-200/35 bg-amber-300/15'
    : position === 2
      ? 'text-slate-100 border-slate-200/25 bg-slate-200/10'
      : 'text-orange-200 border-orange-300/25 bg-orange-300/10';

  return (
    <article className={`flex min-h-[250px] flex-col items-center justify-center rounded-[clamp(1.25rem,1.7vw,2rem)] border p-[clamp(1rem,1.8vw,2.25rem)] text-center shadow-2xl shadow-black/20 ${style}`}>
      <div className={`grid h-[clamp(3.5rem,5vw,6.5rem)] w-[clamp(3.5rem,5vw,6.5rem)] place-items-center rounded-full border text-[clamp(1.5rem,2.5vw,3.5rem)] font-black tabular-nums ${accent}`}>{position}</div>
      <p className={`mt-[clamp(.75rem,2vh,1.5rem)] text-[clamp(.65rem,.85vw,1rem)] font-black uppercase tracking-[.22em] ${accent.split(' ')[0]}`}>{position}.° lugar</p>
      <h3 className="mt-[clamp(.5rem,1.2vh,1rem)] max-w-full break-words text-[clamp(1.35rem,2.5vw,3.75rem)] font-black leading-[.98] tracking-[-.04em] text-white">{participant.displayName}</h3>
      <p className="mt-[clamp(1rem,2.5vh,2rem)] text-[clamp(2rem,3.8vw,5.5rem)] font-black leading-none tabular-nums text-white">{formatPoints(participant.totalPoints)}</p>
      <p className="mt-2 text-[clamp(.6rem,.75vw,.85rem)] font-black uppercase tracking-[.24em] text-fuchsia-300">puntos</p>
    </article>
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

function SimulationControls({
  value,
  onChange,
}: {
  value: SimulationSize;
  onChange: (value: SimulationSize) => void;
}) {
  return (
    <label className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-black uppercase tracking-[.12em] transition ${value > 0 ? 'border-cyan-300/40 bg-cyan-300/15 text-cyan-100' : 'border-white/10 bg-white/[.05] text-slate-300'}`}>
      <TestTube2 className="h-4 w-4" />
      <span className="hidden 2xl:inline">Modo prueba</span>
      <select
        aria-label="Cantidad de participantes de prueba"
        value={value}
        onChange={(event) => onChange(Number(event.target.value) as SimulationSize)}
        className="cursor-pointer bg-transparent font-black text-inherit outline-none"
      >
        <option className="bg-slate-950 text-white" value={0}>Desactivado</option>
        <option className="bg-slate-950 text-white" value={50}>50 usuarios</option>
        <option className="bg-slate-950 text-white" value={70}>70 usuarios</option>
      </select>
    </label>
  );
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
    <div className="grid gap-5 xl:h-[calc(100vh-220px)] xl:grid-cols-[minmax(300px,380px)_minmax(520px,1fr)_minmax(270px,340px)]">
      <LobbyInstructions />

      <section className="relative grid min-h-[620px] place-items-start overflow-hidden rounded-[2rem] border border-fuchsia-300/15 bg-gradient-to-br from-fuchsia-500/10 via-white/[.055] to-purple-500/10 p-4 sm:p-6 xl:h-full xl:min-h-0 xl:pt-[clamp(1rem,2.5vh,2.5rem)]">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="relative mx-auto rounded-[2rem] bg-white p-3 shadow-2xl shadow-fuchsia-950/50 sm:p-4">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR para unirse al evento con Pogo"
              className="aspect-square w-[min(65vh,900px)] max-w-full"
            />
          ) : (
            <div className="grid aspect-square w-[min(65vh,900px)] max-w-full place-items-center">
              <QrCode className="h-24 w-24 animate-pulse text-slate-300" />
            </div>
          )}
        </div>
      </section>

      <section className="flex min-h-[620px] flex-col rounded-[2rem] border border-white/10 bg-white/[.05] p-5 shadow-2xl shadow-black/20 sm:p-7 xl:h-full xl:min-h-0">
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
    <section className="flex min-h-[620px] flex-col rounded-[2rem] border border-white/10 bg-white/[.05] p-5 shadow-2xl shadow-black/20 sm:p-6 xl:h-full xl:min-h-0">
      <div>
        <h2 className="text-3xl font-black tracking-[-.035em] text-white">Cómo ingresar</h2>
        <p className="mt-2 text-base font-bold leading-6 text-white/80">Sigue estos pasos en la aplicación Pogo.</p>
      </div>

      <ol className="mt-6 space-y-3 2xl:space-y-4">
        <TextInstruction
          number={1}
          title="Abre tu Perfil"
          description="En Pogo, toca Perfil abajo a la derecha."
        />
        <TextInstruction
          number={2}
          title="Entra a Pogo ID"
          description="Toca el ícono QR de la esquina superior derecha."
        />
        <TextInstruction
          number={3}
          title="Escanea el QR"
          description="Toca la cámara y apunta al código grande del centro."
        />
        <TextInstruction
          number={4}
          title="Espera el inicio"
          description="Quédate en la sala hasta que comience el evento."
        />
      </ol>
    </section>
  );
}

function TextInstruction({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <li className="grid grid-cols-[48px_minmax(0,1fr)] gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 2xl:grid-cols-[56px_minmax(0,1fr)] 2xl:p-5">
      <div className="grid h-12 w-12 place-items-center rounded-xl border border-fuchsia-300/30 bg-fuchsia-400/15 text-xl font-black tabular-nums text-white 2xl:h-14 2xl:w-14 2xl:text-2xl">
        {number}
      </div>
      <div>
        <p className="text-lg font-black leading-tight text-white 2xl:text-xl">{title}</p>
        <p className="mt-1.5 text-base font-bold leading-6 text-white/85 2xl:text-lg 2xl:leading-7">{description}</p>
      </div>
    </li>
  );
}

function RankingPanel({
  ranking,
  completeRanking,
  participantCount,
  capacity,
  finished = false,
}: {
  ranking: EventParticipant[];
  completeRanking: EventParticipant[];
  participantCount: number;
  capacity: number;
  finished?: boolean;
}) {
  return (
    <div className="grid min-h-[calc(100vh-190px)] gap-5 xl:h-[calc(100vh-190px)] xl:min-h-0 xl:grid-cols-[minmax(0,65fr)_minmax(340px,35fr)]">
      <section className="flex min-h-[620px] flex-col rounded-[2rem] border border-white/10 bg-white/[.05] p-5 shadow-2xl shadow-black/20 sm:p-7 xl:min-h-0 2xl:p-9">
        <div className="mb-5 flex shrink-0 flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-300/10 text-amber-300 2xl:h-16 2xl:w-16">
              <Trophy className="h-8 w-8 2xl:h-9 2xl:w-9" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[.24em] text-slate-400 2xl:text-sm">Clasificación</p>
              <h2 className="text-3xl font-black text-white 2xl:text-5xl">{finished ? 'Top 5 final' : 'Top 5'}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[clamp(1.75rem,2.4vw,3.5rem)] font-black leading-none tabular-nums text-white">{participantCount} <span className="text-slate-400">/ {capacity}</span></p>
            <p className="mt-1 text-sm font-black uppercase tracking-[.18em] text-slate-400">participantes</p>
          </div>
        </div>

        {ranking.length === 0 ? (
          <div className="grid min-h-0 flex-1 place-items-center rounded-2xl border border-dashed border-white/10 bg-black/10 text-center">
            <div>
              <Medal className="mx-auto h-16 w-16 text-slate-600" />
              <p className="mt-5 text-2xl font-bold text-slate-300">El ranking aparecerá con el primer progreso.</p>
            </div>
          </div>
        ) : (
          <div className="min-h-0 flex-1 space-y-2.5 2xl:space-y-3">
            {ranking.slice(0, 5).map((participant, index) => (
              <RankingRow key={participant.uid} participant={participant} position={index + 1} />
            ))}
          </div>
        )}
      </section>

      <CompleteRankingTable
        ranking={completeRanking}
        participantCount={participantCount}
      />
    </div>
  );
}

function CompleteRankingTable({
  ranking,
  participantCount,
}: {
  ranking: EventParticipant[];
  participantCount: number;
}) {
  return (
    <section className="flex min-h-[620px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 p-5 shadow-2xl shadow-black/20 sm:p-6 xl:min-h-0 2xl:p-7">
      <div className="shrink-0 border-b border-white/10 pb-5">
        <div className="flex items-end justify-between gap-3">
          <h3 className="text-2xl font-black text-white 2xl:text-3xl">Tabla completa</h3>
          <p className="pb-0.5 text-sm font-extrabold tabular-nums text-slate-300">{participantCount} en total</p>
        </div>
      </div>

      <div className="mt-4 grid shrink-0 grid-cols-[38px_minmax(0,1fr)_auto] gap-2 px-3 text-[10px] font-black uppercase tracking-[.16em] text-slate-500 2xl:text-xs">
        <span className="text-center">Pos.</span>
        <span>Nombre</span>
        <span className="text-right">Puntaje</span>
      </div>

      <div className="mt-2 min-h-0 flex-1 overflow-y-auto pr-1">
        {ranking.length === 0 ? (
          <div className="grid h-full min-h-48 place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[.025] px-5 text-center">
            <p className="font-bold text-slate-400">Esperando puntajes…</p>
          </div>
        ) : (
          <ol className="space-y-1.5">
            {ranking.map((participant, index) => (
              <CompleteRankingRow
                key={participant.uid}
                participant={participant}
                position={index + 1}
              />
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

function CompleteRankingRow({
  participant,
  position,
}: {
  participant: EventParticipant;
  position: number;
}) {
  const positionColor = position === 1
    ? 'border-amber-300/35 bg-amber-300/15 text-amber-200'
    : position === 2
      ? 'border-slate-200/30 bg-slate-200/10 text-slate-100'
      : position === 3
        ? 'border-orange-300/30 bg-orange-300/10 text-orange-200'
        : 'border-white/10 bg-white/[.04] text-slate-400';

  return (
    <li className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-white/[.06] bg-white/[.035] px-3 py-2.5 2xl:py-3">
      <span className={`grid h-8 w-8 place-items-center rounded-lg border text-sm font-black tabular-nums ${positionColor}`}>{position}</span>
      <span className="truncate text-sm font-extrabold text-white 2xl:text-base">{participant.displayName}</span>
      <span className="text-right text-sm font-black tabular-nums text-slate-100 2xl:text-base">{formatPoints(participant.totalPoints)}</span>
    </li>
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
        <p className="mt-1 text-[clamp(.95rem,1.05vw,1.35rem)] font-extrabold text-slate-200">{participant.climbCount} tops · {participant.fallCount} caídas</p>
      </div>
      <div className="min-w-[clamp(110px,13vw,260px)] text-right">
        <p className="text-[clamp(1.75rem,2.7vw,4rem)] font-black leading-none tabular-nums text-white">{formatPoints(participant.totalPoints)}</p>
        <p className="mt-1 text-[clamp(.65rem,.7vw,.9rem)] font-black uppercase tracking-[.2em] text-fuchsia-300">pts</p>
      </div>
    </div>
  );
}
