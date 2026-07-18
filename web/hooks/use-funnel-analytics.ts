"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useFunnelAnalytics() {
  const [sessionId, setSessionId] = useState<string>("");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize session ID
  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedId = sessionStorage.getItem("ayureva_session_id");
      if (!storedId) {
        storedId = "sess_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem("ayureva_session_id", storedId);
      }
      setSessionId(storedId);
    }
  }, []);

  const logEvent = async (eventType: string, customMetadata?: any) => {
    if (!sessionId) return;

    try {
      // Gather UTM params
      const utm: Record<string, string> = {};
      if (searchParams) {
        const source = searchParams.get("utm_source");
        const medium = searchParams.get("utm_medium");
        const campaign = searchParams.get("utm_campaign");
        if (source) utm.utm_source = source;
        if (medium) utm.utm_medium = medium;
        if (campaign) utm.utm_campaign = campaign;
      }

      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          event_type: eventType,
          page_path: pathname || window.location.pathname,
          metadata: {
            ...utm,
            ...customMetadata,
            referrer: typeof document !== "undefined" ? document.referrer : "",
          },
        }),
      });
    } catch (err) {
      console.error("Funnel analytics tracking error:", err);
    }
  };

  // Auto-log page view on path changes once sessionId is set
  useEffect(() => {
    if (sessionId && pathname) {
      logEvent("landing_page_view");
    }
  }, [sessionId, pathname]);

  return {
    sessionId,
    logEvent,
  };
}
