// Authorized users for the application
// Only these users can login to the system

export interface AuthorizedUser {
  email: string;
  password: string;
  name: string;
  role: "admin" | "manager" | "staff";
}

export const authorizedUsers: AuthorizedUser[] = [
  {
    email: "admin@krixflow.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
  {
    email: "manager@krixflow.com",
    password: "manager123",
    name: "Manager User",
    role: "manager",
  },
  {
    email: "john.doe@krixflow.com",
    password: "john123",
    name: "John Doe",
    role: "staff",
  },
  {
    email: "jane.smith@krixflow.com",
    password: "jane123",
    name: "Jane Smith",
    role: "staff",
  },
  {
    email: "demo@krixflow.com",
    password: "demo123",
    name: "Demo User",
    role: "staff",
  },
];

// Helper function to validate user credentials
export function validateUser(email: string, password: string): AuthorizedUser | null {
  const user = authorizedUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  return user || null;
}

// Helper function to check if email is authorized
export function isAuthorizedEmail(email: string): boolean {
  return authorizedUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
}
