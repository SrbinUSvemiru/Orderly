import { DateTime } from "luxon";

const getDataFromUnixTimestamp = (timestamp: number, format: string) => {
  const utcDateTime = DateTime.fromMillis(timestamp, { zone: "utc" });
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userDateTime = utcDateTime.setZone(userTimeZone);

  return userDateTime.toFormat(format);
};

export default getDataFromUnixTimestamp;
