# Evento Pogo: configuración operativa

La ruta `/pogo/event` usa el mismo proyecto Firebase y las mismas sesiones
compartidas que Pogo. No usa Firebase Admin SDK ni secretos en el navegador.

## 1. Configurar la Web App de Firebase

La Web App `Rhumb Labs Pogo Event` ya está registrada en el proyecto
`climbscore-faf5d` con App ID
`1:347116441390:web:014820a222a522c06174bf`.

1. La configuración pública de producción está incluida como fallback en el
   módulo Firebase. Las variables `VITE_FIREBASE_*` descritas en `.env.example`
   permiten reemplazarla en otros entornos.
2. Autorizar los dominios de producción y preview en Firebase Authentication.

## 2. Activar App Check

1. La Web App ya está registrada en Firebase App Check con una clave
   reCAPTCHA Enterprise restringida a `rhumblabs.com` y `www.rhumblabs.com`.
2. La site key pública está configurada como fallback; la variable
   `VITE_FIREBASE_APPCHECK_SITE_KEY` permite reemplazarla.
3. Verificar métricas en modo monitor antes de activar enforcement para la Web
   App. Las callables de sesiones ya exigen App Check en producción.
4. En desarrollo, usar `VITE_FIREBASE_APPCHECK_DEBUG_TOKEN=true`, copiar el
   token mostrado por Firebase y registrarlo como debug token. No llevar esa
   variable a producción.

## 3. Autorizar a la persona operadora

La cuenta debe existir en Firebase Authentication. Desde un entorno privilegiado
con Application Default Credentials:

```bash
cd functions
GOOGLE_CLOUD_PROJECT=climbscore-faf5d \
  npm run admin:event -- operador@rhumblabs.com true
```

El script conserva los demás custom claims. Para revocar el acceso, repetir con
`false`. La persona debe volver a iniciar sesión para recibir un ID token nuevo.

## 4. Desplegar en orden

1. Desplegar `firestore.rules` y `createJointSession` desde el proyecto Android
   canónico.
2. Desplegar la web de Rhumb Labs con sus variables `VITE_FIREBASE_*`.
3. Abrir `/pogo/event`, crear una sala, iniciar el evento y verificar el QR con
   el lector interno de Pogo.

## Operación y retención

- El evento puede recibir entre 2 y 100 participantes.
- Solo se puede entrar mientras la sala está en `LOBBY`.
- `Finalizar` conserva el ranking en Firestore hasta que la limpieza programada
  elimine la sala por su expiración de 12 horas.
- El navegador conserva localmente el ID y token de la sala para recuperar el
  panel después de recargar. El token deja de servir para unirse al finalizar.
