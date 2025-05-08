/* src/mock/session.js
   ──────────────────────────────────────────────────────────────
   Jednoduché “in‑memory” mock‑API pro přihlášení / registraci
   + globální (per‑tab) stav přihlášeného uživatele
   ────────────────────────────────────────────────────────────── */
   import users from '@/mock/users.json' assert { type: 'json' };

   /* ===== internal state – ID přihlášeného uživatele ============ */
   let CURRENT_ID = null;
   
   /* ===== PUBLIC GETTERS ======================================== */
   export function getCurrentUserId()  { return CURRENT_ID; }
   export function getCurrentUser()    {
     return users.find(u => u._id === CURRENT_ID) ?? null;
   }
   export function logout()            { CURRENT_ID = null; }
   
   /* ===== AUTH API ============================================== */
   export function login(email, password) {
     const u = users.find(
       u => u.loginName === email && u.password === password
     );
     if (!u) throw new Error('Neplatný e‑mail nebo heslo');
     CURRENT_ID = u._id;
     return u;
   }
   
   export function register({ name, email, password }) {
     if (users.some(u => u.loginName === email))
       throw new Error('Účet s tímto e‑mailem už existuje');
   
     const _id = `user${String(users.length + 1).padStart(3,'0')}`;
     const now = new Date().toISOString();
     const newUser = {
       _id,
       name,
       loginName: email,
       password,
       favouriteDoors: [],
       createdAt: now,
       updatedAt: now
     };
     users.push(newUser);
     CURRENT_ID = _id;
     return newUser;
   }