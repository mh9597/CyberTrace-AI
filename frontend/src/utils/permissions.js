/**
 * CyberTrace AI - Centralized Role-Based Access Control (RBAC) Definition
 * Exact alignment with CyberTrace AI Authority Matrix:
 *
 * Permission                      Investigator     Senior Officer     Admin
 * --------------------------------------------------------------------------
 * Login                           ✅               ✅                ✅
 * View dashboard                  ✅               ✅                ✅
 * Create complaint                ✅               ❌ / Review       ❌ / Archive
 * Edit assigned case              ✅               Review            ❌
 * Import transactions             ✅               ❌                ❌
 * Trace transaction network       ✅               ✅                👁️ (View-only)
 * Run prediction                  ✅               👁️ (View-only)   👁️ (View-only)
 * View intelligence map           ✅               ✅                👁️ (View-only)
 * Create investigation alert      ✅               ✅                👁️ (View-only)
 * Approve high-risk alert         ❌               ✅                ❌
 * Assign Investigator             ❌               ✅                ❌
 * Approve case closure            ❌               ✅                ❌
 * Generate dossier                ✅               ✅ / Endorse      👁️ (View-only)
 * Security Center                 ❌               👁️ Limited        ✅
 * Audit logs                      ❌               👁️ Limited        ✅
 * Verify evidence hash            ❌               👁️                ✅
 * Manage users                    ❌               ❌                ✅
 * Assign roles                    ❌               ❌                ✅
 * System configuration            ❌               ❌                ✅
 * Modify audit records            ❌               ❌                ❌ (Immutable)
 */

export const ROLES = {
  INVESTIGATOR: 'investigator',
  SENIOR_OFFICER: 'senior_officer',
  ADMIN: 'admin',
};

export const ROLE_CONFIG = {
  [ROLES.INVESTIGATOR]: {
    label: 'INVESTIGATOR',
    badgeLabel: 'IO • CYBER CRIME',
    badgeColor: 'blue',
    description: 'Field Investigating Officer (Operational Case Work & Evidence Intake)',
  },
  [ROLES.SENIOR_OFFICER]: {
    label: 'SENIOR OFFICER',
    badgeLabel: 'SUPERVISORY COMMAND',
    badgeColor: 'purple',
    description: 'Supervisory Command (Case Allocation, High-Risk Approvals & Closures)',
  },
  [ROLES.ADMIN]: {
    label: 'ADMIN',
    badgeLabel: 'PLATFORM ADMINISTRATOR',
    badgeColor: 'emerald',
    description: 'Platform CISO & Security Governance (User Roles, Integrity & Logs)',
  },
};

export const PERMISSIONS = {
  // Operational Investigation (Field IO Domain)
  CREATE_COMPLAINT: [ROLES.INVESTIGATOR],
  EDIT_ASSIGNED_CASE: [ROLES.INVESTIGATOR],
  IMPORT_TRANSACTIONS: [ROLES.INVESTIGATOR],
  RUN_PREDICTION: [ROLES.INVESTIGATOR],
  TRACE_NETWORK: [ROLES.INVESTIGATOR, ROLES.SENIOR_OFFICER, ROLES.ADMIN],
  VIEW_MAP: [ROLES.INVESTIGATOR, ROLES.SENIOR_OFFICER, ROLES.ADMIN],
  CREATE_INVESTIGATION_ALERT: [ROLES.INVESTIGATOR, ROLES.SENIOR_OFFICER],
  GENERATE_DOSSIER: [ROLES.INVESTIGATOR, ROLES.SENIOR_OFFICER],

  // Supervisory & Operational Command (Senior Officer Exclusive Domain)
  APPROVE_HIGH_RISK_ALERT: [ROLES.SENIOR_OFFICER],
  AUTHORIZE_HIGH_RISK_ACTION: [ROLES.SENIOR_OFFICER],
  ASSIGN_IO: [ROLES.SENIOR_OFFICER],
  APPROVE_CASE_CLOSURE: [ROLES.SENIOR_OFFICER],
  ENDORSE_DOSSIER: [ROLES.SENIOR_OFFICER],

  // Platform Security & Governance (Admin Domain)
  VIEW_SECURITY_CENTER: [ROLES.SENIOR_OFFICER, ROLES.ADMIN], // Senior Officer gets Limited/Read-only
  VIEW_FULL_AUDIT_LOGS: [ROLES.ADMIN],
  VERIFY_EVIDENCE_INTEGRITY: [ROLES.SENIOR_OFFICER, ROLES.ADMIN],
  MANAGE_USERS: [ROLES.ADMIN],
  ASSIGN_ROLES: [ROLES.ADMIN],
  SYSTEM_CONFIGURATION: [ROLES.ADMIN],

  // Immutable records: No role can ever modify audit records
  MODIFY_AUDIT_RECORDS: [],
};

/**
 * Check if the user has a specific role
 */
export const hasRole = (user, allowedRoles) => {
  if (!user || !user.role) return false;
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user.role);
};

/**
 * Check if the user has a specific permission
 */
export const can = (user, permissionKey) => {
  if (!user || !user.role) return false;
  const allowed = Array.isArray(permissionKey) ? permissionKey : PERMISSIONS[permissionKey];
  if (!allowed) return false;
  return allowed.includes(user.role);
};
