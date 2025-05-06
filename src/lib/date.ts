import { DateTime } from "luxon";

const getDataFromUnixTimestamp = (timestamp: number, format: string) => {
  const utcDateTime = DateTime.fromMillis(timestamp, {
    zone: "Europe/Belgrade",
    locale: "en-US",
  }).toFormat(format);

  return utcDateTime;
};

const getCurrentUnix = () => DateTime.now().toMillis();

export { getCurrentUnix, getDataFromUnixTimestamp };
