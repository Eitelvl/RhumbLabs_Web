import {getApp, getApps, initializeApp} from 'firebase/app';
import {
  ReCaptchaEnterpriseProvider,
  initializeAppCheck,
} from 'firebase/app-check';
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getFunctions} from 'firebase/functions';

// Firebase Web configuration and reCAPTCHA site keys are public identifiers.
// Keep production defaults here so the Git-connected Vercel build works without
// privileged environment variables; VITE_* values can still override them.
const productionConfig = {
  apiKey: 'AIzaSyDp8Z0P_-xteWWRz22f059iYhrfg9N3mWc',
  authDomain: 'climbscore-faf5d.firebaseapp.com',
  projectId: 'climbscore-faf5d',
  appId: '1:347116441390:web:014820a222a522c06174bf',
  recaptchaSiteKey: '6LcRUZItAAAAAJ_8b57IjqNcapuEgEu6-o2H_Jcb',
};

const requiredConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || productionConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || productionConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || productionConfig.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || productionConfig.appId,
};

const missingConfig = Object.entries(requiredConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

let servicesPromise: ReturnType<typeof createServices> | undefined;

async function createServices() {
  if (missingConfig.length > 0) {
    throw new Error(`Missing Firebase web config: ${missingConfig.join(', ')}`);
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(requiredConfig);
  const recaptchaSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY ||
    productionConfig.recaptchaSiteKey;

  if (recaptchaSiteKey) {
    if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN) {
      const configuredToken = import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;
      (globalThis as typeof globalThis & {
        FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
      }).FIREBASE_APPCHECK_DEBUG_TOKEN = configuredToken === 'true'
        ? true
        : configuredToken;
    }
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  }

  const auth = getAuth(app);
  await setPersistence(auth, browserSessionPersistence);

  return {
    auth,
    firestore: getFirestore(app),
    functions: getFunctions(
      app,
      import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1',
    ),
    appCheckConfigured: Boolean(recaptchaSiteKey),
  };
}

export function getPogoEventFirebase() {
  servicesPromise ??= createServices();
  return servicesPromise;
}
