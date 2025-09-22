/// PUBLIC_INTERFACE
export function formatDate(ts) {
  /** Format a timestamp into a human-readable local date string. */
  try {
    return new Date(ts).toLocaleDateString();
  } catch {
    return "";
  }
}
