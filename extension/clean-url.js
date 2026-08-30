const TRACKING_PARAMETERS = new Set([
  "_ga",
  "_gl",
  "_hsenc",
  "_hsmi",
  "dclid",
  "epik",
  "fbclid",
  "gad_campaignid",
  "gad_source",
  "gbraid",
  "gclid",
  "hsctatracking",
  "igshid",
  "irclickid",
  "li_fat_id",
  "mc_cid",
  "mc_eid",
  "mkt_tok",
  "msclkid",
  "oly_anon_id",
  "oly_enc_id",
  "rb_clickid",
  "srsltid",
  "ttclid",
  "twclid",
  "vero_conv",
  "vero_id",
  "wbraid",
  "yclid"
]);

const TRACKING_PREFIXES = ["utm_", "hsa_", "mtm_", "pk_"];

function isHost(hostname, domain) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function isTrackingParameter(key, hostname) {
  const name = key.toLowerCase();

  if (TRACKING_PARAMETERS.has(name) || TRACKING_PREFIXES.some((prefix) => name.startsWith(prefix))) {
    return true;
  }

  if ((isHost(hostname, "youtube.com") || hostname === "youtu.be") && ["feature", "si"].includes(name)) {
    return true;
  }

  if (isHost(hostname, "spotify.com") && name === "si") {
    return true;
  }

  if (isHost(hostname, "amazon.com") && ["ascsubtag", "creative", "creativeasin", "linkcode", "tag"].includes(name)) {
    return true;
  }

  if ((isHost(hostname, "x.com") || isHost(hostname, "twitter.com")) && ["s", "t"].includes(name)) {
    return true;
  }

  if (hostname === "google.com" || hostname.startsWith("www.google.")) {
    return ["client", "ei", "oq", "sourceid", "ved"].includes(name);
  }

  return false;
}

export function cleanURL(input) {
  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    return { url: input, removed: 0 };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { url: input, removed: 0 };
  }

  const kept = new URLSearchParams();
  let removed = 0;

  for (const [key, value] of parsed.searchParams) {
    if (isTrackingParameter(key, parsed.hostname.toLowerCase())) {
      removed += 1;
    } else {
      kept.append(key, value);
    }
  }

  parsed.search = kept.toString();
  return { url: parsed.href, removed };
}
