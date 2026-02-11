export const allowedAdminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);

export const isEmailAllowed = (email) => {
  if (!allowedAdminEmails.length) return true;
  return allowedAdminEmails.includes(email);
};
