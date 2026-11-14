// Role IDs 3 (Teacher) and 4 (Parent) are used by the supplied API/mobile contract.
// Other IDs are not guessed: administrative access requires an explicit role name.
export const APP_ROLES = Object.freeze({ ADMIN: 'admin', TEACHER: 'teacher', PARENT: 'parent' });
const aliases = { admin: 'admin', administrator: 'admin', superadmin: 'admin', teacher: 'teacher', parent: 'parent' };
export function resolveUserRole(user) {
  if (!user || typeof user !== 'object') return null;
  const rawId = user.roleID ?? user.roleId ?? user.RoleID ?? user.RoleId;
  const id = typeof rawId === 'number' || (typeof rawId === 'string' && /^\d+$/.test(rawId.trim())) ? Number(rawId) : null;
  const idRole = id === 3 ? 'teacher' : id === 4 ? 'parent' : null;
  const names = [user.roleName, user.RoleName, user.role, user.Role].filter(value => typeof value === 'string' && value.trim());
  const namedRoles = names.map(value => aliases[value.toLowerCase().replace(/[\s_-]+/g, '')] || null);
  if (namedRoles.some(role => !role) || new Set(namedRoles).size > 1) return null;
  const namedRole = namedRoles[0] || null;
  if (idRole && namedRole && idRole !== namedRole) return null;
  return namedRole || idRole;
}
export function normalizeUser(user) {
  if (!user || typeof user !== 'object') return null;
  const role = resolveUserRole(user);
  const id = user.id ?? user.userId ?? user.UserId ?? user.UserID;
  return { ...user, ...(id != null ? { id } : {}), appRole: role,
    ...(role === 'teacher' ? { roleID: 3 } : role === 'parent' ? { roleID: 4 } : {}),
    name: user.name || user.fullName || user.FullName || user.username || user.userName || user.UserName || '' };
}
