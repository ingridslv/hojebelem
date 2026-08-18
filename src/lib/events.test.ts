import { describe, expect, it } from "vitest";
import { getEventStatus, isEventEnded } from "./events";
const now = new Date("2026-08-14T12:00:00-03:00");
describe("getEventStatus em America/Belem",()=>{
  it("calcula datas e respeita overrides",()=>{
    expect(getEventStatus({startAt:new Date("2026-08-14T20:00:00-03:00")},now)).toBe("É Hoje");
    expect(getEventStatus({startAt:new Date("2026-08-15T20:00:00-03:00")},now)).toBe("É amanhã");
    expect(getEventStatus({startAt:new Date("2026-08-16T20:00:00-03:00")},now)).toBe("Em breve");
    expect(getEventStatus({startAt:new Date("2026-08-13T20:00:00-03:00")},now)).toBe("Já encerrou");
    expect(getEventStatus({startAt:now,statusOverride:"POSTPONED"},now)).toBe("Adiado");
    expect(getEventStatus({startAt:now,statusOverride:"CANCELLED"},now)).toBe("Cancelado");
  });
  it("usa o horário final quando ele foi informado",()=>{
    const ongoing={startAt:new Date("2026-08-13T20:00:00-03:00"),endAt:new Date("2026-08-14T14:00:00-03:00")};
    expect(isEventEnded(ongoing,now)).toBe(false);
    expect(getEventStatus(ongoing,now)).toBe("É Hoje");
    expect(isEventEnded({...ongoing,endAt:new Date("2026-08-14T11:00:00-03:00")},now)).toBe(true);
  });
});
