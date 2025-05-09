export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(new Date(date));
  } catch (_err) {
    console.error(_err);
    return "";
  }
}

export interface Address {
  country: string;
  city: string;
  street: string;
  streetNumber: string;
  apartment?: string; // new optional field
  postalCode: string;
}

export function formatAddress(addr: Address): string {
  const parts: string[] = [];

  // 1) Street line: street + number + optional apt
  if (addr.street || addr.streetNumber) {
    let line = `${addr.street}${addr.street && addr.streetNumber ? " " : ""}${
      addr.streetNumber
    }`;
    if (addr.apartment) {
      line += `, Apt ${addr.apartment}`;
    }
    parts.push(line);
  }

  // 2) Postal code + city
  if (addr.postalCode || addr.city) {
    const pcCity = `${addr.postalCode}${
      addr.postalCode && addr.city ? " " : ""
    }${addr.city}`;
    parts.push(pcCity);
  }

  // 3) Country
  if (addr.country) {
    parts.push(addr.country);
  }

  // Join all parts with commas
  return parts.join(", ");
}
