export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
  avatar?: string;
  createdAt: Date;
}

export interface AuthToken {
  token: string;
  expiresAt: Date;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Mock user database
const mockUsers: Record<string, User & { password: string }> = {
  'admin@example.com': {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    isAdmin: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
  },
  'user@example.com': {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    isAdmin: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    createdAt: new Date('2024-01-15T00:00:00.000Z'),
  },
  'john.doe@example.com': {
    id: '3',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'user',
    isAdmin: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    createdAt: new Date('2024-02-01T00:00:00.000Z'),
  },
};

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  EXPIRES_AT: 'auth_expires_at',
} as const;

// Token expiration time (24 hours)
const TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

// Utility functions
function generateToken(): string {
  return btoa(Math.random().toString(36).substring(2) + Date.now().toString(36));
}

function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  return {
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date(),
    ...userData,
  };
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
  return password.length >= 6;
}

function setAuthData(token: string, user: User, expiresAt: Date): void {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toISOString());
}

function getAuthData(): AuthToken | null {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    const expiresAtStr = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);

    if (!token || !userStr || !expiresAtStr) {
      return null;
    }

    const user = JSON.parse(userStr);
    const expiresAt = new Date(expiresAtStr);

    // Convert createdAt back to Date object
    user.createdAt = new Date(user.createdAt);

    // Check if token is expired
    if (expiresAt <= new Date()) {
      clearAuthData();
      return null;
    }

    return { token, user, expiresAt };
  } catch (error) {
    clearAuthData();
    return null;
  }
}

function clearAuthData(): void {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
}

// Simulate network delay
function simulateNetworkDelay(min = 500, max = 1500): Promise<void> {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Main authentication functions
export async function login(email: string, password: string): Promise<User> {
  await simulateNetworkDelay();

  if (!email || !password) {
    throw new AuthError('Email and password are required', 'MISSING_CREDENTIALS');
  }

  if (!validateEmail(email)) {
    throw new AuthError('Please enter a valid email address', 'INVALID_EMAIL');
  }

  const mockUser = mockUsers[email.toLowerCase()];
  if (!mockUser || mockUser.password !== password) {
    throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  // Create user object without password
  const { password: _, ...user } = mockUser;
  
  // Generate token and set expiration
  const token = generateToken();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_TIME);

  // Store auth data
  setAuthData(token, user, expiresAt);

  return user;
}

export async function register(name: string, email: string, password: string): Promise<User> {
  await simulateNetworkDelay();

  if (!name || !email || !password) {
    throw new AuthError('Name, email, and password are required', 'MISSING_FIELDS');
  }

  if (!validateEmail(email)) {
    throw new AuthError('Please enter a valid email address', 'INVALID_EMAIL');
  }

  if (!validatePassword(password)) {
    throw new AuthError('Password must be at least 6 characters long', 'WEAK_PASSWORD');
  }

  if (mockUsers[email.toLowerCase()]) {
    throw new AuthError('An account with this email already exists', 'EMAIL_EXISTS');
  }

  // Create new user
  const user = createUser({
    name: name.trim(),
    email: email.toLowerCase(),
    role: 'user',
    isAdmin: false,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
  });

  // Add to mock database
  mockUsers[email.toLowerCase()] = {
    ...user,
    password,
  };

  // Generate token and set expiration
  const token = generateToken();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_TIME);

  // Store auth data
  setAuthData(token, user, expiresAt);

  return user;
}

export function logout(): void {
  clearAuthData();
}

export function getCurrentUser(): User | null {
  const authData = getAuthData();
  return authData?.user || null;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function getAuthToken(): string | null {
  const authData = getAuthData();
  return authData?.token || null;
}

export function getTokenExpiration(): Date | null {
  const authData = getAuthData();
  return authData?.expiresAt || null;
}

export function isTokenExpired(): boolean {
  const expiresAt = getTokenExpiration();
  return expiresAt ? expiresAt <= new Date() : true;
}

export function refreshToken(): boolean {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return false;
  }

  // Generate new token and extend expiration
  const token = generateToken();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_TIME);

  setAuthData(token, currentUser, expiresAt);
  return true;
}

export function updateUser(updates: Partial<Pick<User, 'name' | 'avatar'>>): User | null {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }

  const updatedUser = { ...currentUser, ...updates };
  const authData = getAuthData();
  
  if (authData) {
    setAuthData(authData.token, updatedUser, authData.expiresAt);
    
    // Also update the mock database if the user exists
    const mockUser = mockUsers[currentUser.email];
    if (mockUser) {
      Object.assign(mockUser, updates);
    }
  }

  return updatedUser;
}

// Development utilities
export function getDefaultCredentials() {
  return {
    admin: {
      email: 'admin@example.com',
      password: 'admin123',
    },
    user: {
      email: 'user@example.com',
      password: 'user123',
    },
    johnDoe: {
      email: 'john.doe@example.com',
      password: 'password123',
    },
  };
}

export function getAllMockUsers(): Omit<User, never>[] {
  return Object.values(mockUsers).map(({ password, ...user }) => user);
}

export function resetMockDatabase(): void {
  // Clear any additional users added via registration
  const originalEmails = ['admin@example.com', 'user@example.com', 'john.doe@example.com'];
  const currentEmails = Object.keys(mockUsers);
  
  currentEmails.forEach(email => {
    if (!originalEmails.includes(email)) {
      delete mockUsers[email];
    }
  });
}