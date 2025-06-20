// Autenticación simple para el panel de administración
export interface AdminUser {
  username: string
  password: string
}

const ADMIN_CREDENTIALS: AdminUser = {
  username: "admin",
  password: "admin",
}

export const validateAdminCredentials = (username: string, password: string): boolean => {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

// Simulamos una sesión simple usando localStorage en el cliente
export const isAdminAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("admin_authenticated") === "true"
}

export const setAdminAuthenticated = (authenticated: boolean): void => {
  if (typeof window === "undefined") return
  if (authenticated) {
    localStorage.setItem("admin_authenticated", "true")
  } else {
    localStorage.removeItem("admin_authenticated")
  }
}

export const logoutAdmin = (): void => {
  setAdminAuthenticated(false)
}
