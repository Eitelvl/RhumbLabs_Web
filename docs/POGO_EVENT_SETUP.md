# Evento Pogo: configuración operativa

La ruta `/pogo/event` usa el mismo proyecto Firebase y las mismas sesiones
compartidas que Pogo. La persona operadora ingresa con una clave de evento, sin
crear ni usar una cuenta. La clave se valida en Cloud Functions y nunca se
incluye en el navegador ni en el build de Vite.

## 1. Configurar la Web App de Firebase

La Web App `Rhumb Labs Pogo Event` ya está registrada en el proyecto
`climbscore-faf5d` con App ID
`1:347116441390:web:014820a222a522c06174bf`.

1. La configuración pública de producción está incluida como fallback en el
   módulo Firebase. Las variables `VITE_FIREBASE_*` descritas en `.env.example`
   permiten reemplazarla en otros entornos.
2. Autorizar los dominios de producción y preview en Firebase Authentication.
   La autenticación técnica posterior a la clave usa un custom token y no
   muestra ningún formulario de cuenta.

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

## 3. Configurar la clave del evento

Configurar una clave fuerte en Secret Manager desde el proyecto Android
canónico. El CLI la solicitará sin guardarla en el historial del shell:

```bash
cd functions
firebase functions:secrets:set POGO_EVENT_ACCESS_KEY \
  --project climbscore-faf5d
```

Usar al menos 12 caracteres aleatorios. Para rotar la clave, repetir el comando
y volver a desplegar `authorizePogoEvent`. Los navegadores que ya estaban
autorizados conservan su sesión técnica; cerrar el panel con `Salir` obliga a
ingresar la clave nuevamente.

## 4. Desplegar en orden

1. Desplegar `authorizePogoEvent`, las Functions de sesiones compartidas y
   `firestore.rules` desde el proyecto Android canónico.
2. Desplegar la web de Rhumb Labs con sus variables `VITE_FIREBASE_*`.
3. Abrir `/pogo/event`, crear una sala, iniciar el evento y verificar el QR con
   el lector interno de Pogo.

## Operación y retención

- El evento puede recibir entre 2 y 100 participantes.
- Solo se puede entrar mientras la sala está en `LOBBY`.
- `Finalizar` conserva el ranking en Firestore hasta que la limpieza programada
  elimine la sala por su expiración de 12 horas.
- El navegador conserva localmente el ID y token de la sala para recuperar el
  panel después de recargar. También conserva una identidad técnica aleatoria;
  no contiene la clave. El token de invitación deja de servir al finalizar.
