// src/lib/query/queryKeys.ts
export const queryKeys = {
  me: ["auth", "me"],
  users: ["users"],
  campaigns: ["campaigns"],
  campaign: (id: string | number) => ["campaigns", String(id)],
  aiLeads: ["aiLeads"],
  suppliers: ["suppliers"],
  buyers: ["buyers"],
  // Add factory functions for better type safety
} as const;
