import * as dfnsTz from "date-fns-tz";

export function getNowUTCTimestamp(): Date {
  const timeZone = "UTC";
  const localDate = new Date(); // Local time on your machine
  const utcDate = dfnsTz.formatInTimeZone(
    localDate,
    timeZone,
    "yyyy-MM-dd HH:mm:ss"
  );

  return new Date(utcDate);
}

export function getNowFromUTCTimestamp(utcTimestamp: Date): Date {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localTimeZoneDate = dfnsTz.formatInTimeZone(
    utcTimestamp,
    timeZone,
    "yyyy-MM-dd HH:mm:ss"
  );

  return new Date(localTimeZoneDate);
}
