// Simple auth store for email/password login (stored in sessionStorage)
export interface AuthUser {
  email: string;
  name: string;
  role: 'owner' | 'customer';
}

const OWNER_EMAIL = 'enrichbeautyparlour29@gmail.com';
const OWNER_PASSWORD = 'Shreyash_29';

export function loginWithEmailPassword(email: string, password: string): AuthUser | null {
  const trimmedEmail = email.trim().toLowerCase();
  
  if (trimmedEmail === OWNER_EMAIL.toLowerCase() && password === OWNER_PASSWORD) {
    const user: AuthUser = { email: OWNER_EMAIL, name: 'Savita M C', role: 'owner' };
    sessionStorage.setItem('enrich_auth_user', JSON.stringify(user));
    return user;
  }

  // Check registered customers
  const customers = getRegisteredCustomers();
  const customer = customers.find(c => c.email.toLowerCase() === trimmedEmail);
  if (customer && customer.password === password) {
    const user: AuthUser = { email: customer.email, name: customer.name, role: 'customer' };
    sessionStorage.setItem('enrich_auth_user', JSON.stringify(user));
    return user;
  }

  return null;
}

export function signUpCustomer(email: string, password: string, name: string): AuthUser | null {
  const trimmedEmail = email.trim().toLowerCase();
  if (trimmedEmail === OWNER_EMAIL.toLowerCase()) return null;

  const customers = getRegisteredCustomers();
  if (customers.find(c => c.email.toLowerCase() === trimmedEmail)) return null;

  customers.push({ email: trimmedEmail, password, name });
  localStorage.setItem('enrich_customers', JSON.stringify(customers));

  const user: AuthUser = { email: trimmedEmail, name, role: 'customer' };
  sessionStorage.setItem('enrich_auth_user', JSON.stringify(user));
  return user;
}

export function getRegisteredCustomers(): Array<{ email: string; password: string; name: string }> {
  try {
    const stored = localStorage.getItem('enrich_customers');
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function getCurrentUser(): AuthUser | null {
  try {
    const stored = sessionStorage.getItem('enrich_auth_user');
    if (stored) return JSON.parse(stored) as AuthUser;
  } catch {}
  return null;
}

export function logout(): void {
  sessionStorage.removeItem('enrich_auth_user');
}
