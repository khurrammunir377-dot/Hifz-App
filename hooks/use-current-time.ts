import { useEffect, useState } from "react";

export function useCurrentTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);
  return now;
}

export function formatDashboardDate(now: Date, locale = "en") {
  return {
    day: new Intl.DateTimeFormat(locale, { weekday: "long" }).format(now),
    date: new Intl.DateTimeFormat(locale, { month: "long", day: "numeric", year: "numeric" }).format(now),
    time: new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(now),
  };
}
