import { format, toZonedTime } from "date-fns-tz";

export const TIMEZONE = "America/Belem";
export type EventOverride = "CANCELLED" | "POSTPONED" | null;

export type EventTiming = { startAt: Date; endAt?: Date | null; statusOverride?: EventOverride };

export function isEventEnded(event: EventTiming, now = new Date()) {
  // Evento encerrado se startAt ja passou (independente de endAt)
  const eventDay = format(toZonedTime(event.startAt, TIMEZONE), "yyyy-MM-dd");
  const today = format(toZonedTime(now, TIMEZONE), "yyyy-MM-dd");
  return eventDay < today;
}

export function getEventStatus(event: EventTiming, now = new Date()) {
  if (event.statusOverride === "CANCELLED") return "Cancelado";
  if (event.statusOverride === "POSTPONED") return "Adiado";
  if (isEventEnded(event, now)) return "Já encerrou";
  const eventDay = format(toZonedTime(event.startAt, TIMEZONE), "yyyy-MM-dd");
  const today = format(toZonedTime(now, TIMEZONE), "yyyy-MM-dd");
  const tomorrow = format(toZonedTime(new Date(now.getTime() + 86_400_000), TIMEZONE), "yyyy-MM-dd");
  if (eventDay < today) return "É Hoje";
  if (eventDay === today) return "É Hoje";
  if (eventDay === tomorrow) return "É amanhã";
  return "Em breve";
}

export function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: TIMEZONE, day: "2-digit", month: "short" }).format(date).replace(".", "");
}

export function formatEventTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit" }).format(date);
}
