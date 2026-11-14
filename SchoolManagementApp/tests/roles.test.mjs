import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolveUserRole, normalizeUser} from '../src/utils/roles.js';
for (const field of ['roleID','roleId','RoleID','RoleId']) {
 for (const [id,role] of [[3,'teacher'],[4,'parent']]) {
  for (const value of [id,String(id),' '+id+' ']) test(`${field} ${JSON.stringify(value)} selects ${role}`,()=>assert.equal(resolveUserRole({[field]:value}),role));
 }
}
for (const field of ['roleName','RoleName','role','Role']) {
 for (const [name,role] of [['Admin','admin'],['Super Admin','admin'],['ADMINISTRATOR','admin'],[' Teacher ','teacher'],['Parent','parent']]) test(`${field} ${name} selects ${role}`,()=>assert.equal(resolveUserRole({[field]:name}),role));
}
for (const user of [null,undefined,{}, {roleID:0},{roleID:1},{roleID:2},{roleID:999},{roleName:'Student'},{roleID:'3x'},{roleID:3,roleName:'Admin'},{roleID:4,RoleName:'Teacher'},{RoleName:'Admin',role:'Parent'}]) test(`unsupported/conflicting account ${JSON.stringify(user)} is not granted a role`,()=>assert.equal(resolveUserRole(user),null));
test('normalization preserves user fields and is idempotent',()=>{const user={UserId:5,FullName:'Example Teacher',RoleID:'3',RoleName:'Teacher',campusId:7};const normalized=normalizeUser(user);assert.equal(normalized.roleID,3);assert.equal(normalized.id,5);assert.equal(normalized.name,'Example Teacher');assert.equal(normalized.campusId,7);assert.deepEqual(normalizeUser(normalized),normalized);assert.equal(user.RoleID,'3');assert.equal(user.roleID,undefined)});
test('admin does not need an invented numerical role ID',()=>assert.equal(resolveUserRole({RoleID:88,RoleName:'Admin'}),'admin'));
test('missing role stays unassigned after normalization',()=>assert.equal(normalizeUser({id:1}).appRole,null));
const read=rel=>readFileSync(new URL('../'+rel,import.meta.url),'utf8').split('\n').filter(line=>!line.trimStart().startsWith('//')).join('\n');
test('root routes explicitly support Admin, Parent and Teacher and no default dashboard',()=>{const source=read('src/navigation/AppNavigator.js');for(const role of ['admin','parent','teacher'])assert.ok(source.includes(`case '${role}'`));assert.ok(source.includes('<RoleAccessScreen />'));assert.ok(!source.includes('DefaultNavigator'));assert.ok(!source.includes('dispatch(validateToken())'))});
for(const role of ['Admin','Teacher','Parent'])test(`${role} imported screen navigation targets are registered`,()=>{const source=read(`src/navigation/${role}Navigator.js`);const routes=new Set([...source.matchAll(/name="([^"\n]+)"/g)].map(x=>x[1]));const imports=[...source.matchAll(/import\s+\w+\s+from\s+'(\.\.\/screens\/[^']+)'/g)];for(const imp of imports){const screen=read('src/screens/'+imp[1].replace('../screens/','')+'.js');for(const call of screen.matchAll(/navigation\.(?:navigate|replace)\(['"]([^'"]+)/g))assert.ok(routes.has(call[1]),`${role}: ${imp[1]} targets missing ${call[1]}`)}});
test('shared logout does not navigate to a nonexistent Login child',()=>{const profile=read('src/screens/Profile/ProfileScreen.js');assert.ok(profile.includes('dispatch(logoutUser())'));assert.ok(!profile.includes("navigation.replace('Login')"));for(const role of ['Teacher','Parent'])assert.ok(read(`src/navigation/${role}Navigator.js`).includes('dispatch(logoutUser())'))});
