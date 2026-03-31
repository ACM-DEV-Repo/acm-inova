import * as Sentry from "@sentry/react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

Sentry.init({
  dsn: "https://48a85326330052120bebc877c4101704@o4511117135577088.ingest.us.sentry.io/4511117229162496",
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.2,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
});

createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary fallback={<p>Ocorreu um erro inesperado.</p>}>
    <App />
  </Sentry.ErrorBoundary>
);
