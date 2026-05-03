const KEY = "design_checker_guest_id";

export function getGuestId(): string {
  if (typeof window === "undefined") return "";

  const stored = localStorage.getItem(KEY);
  if (stored) return stored;

  const id = crypto.randomUUID();
  localStorage.setItem(KEY, id);
  return id;
}
