import type { ObjectId } from "mongodb"

export interface Reservation {
  _id?: ObjectId
  date: string // formato: YYYY-MM-DD
  time: string // formato: HH:MM
  name: string
  lastName: string
  phone: string
  email?: string
  status: "confirmed" | "cancelled" | "completed"
  createdAt: Date
  updatedAt: Date
}

export interface CreateReservationData {
  date: string
  time: string
  name: string
  lastName: string
  phone: string
  email?: string
}

export interface ReservationFilters {
  date?: string
  status?: string
  startDate?: string
  endDate?: string
}

// Validaciones
export const validateReservation = (data: CreateReservationData): string[] => {
  const errors: string[] = []

  if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.push("Fecha inválida. Formato requerido: YYYY-MM-DD")
  }

  if (!data.time || !/^\d{2}:\d{2}$/.test(data.time)) {
    errors.push("Hora inválida. Formato requerido: HH:MM")
  }

  if (!data.name || data.name.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres")
  }

  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.push("El apellido debe tener al menos 2 caracteres")
  }

  if (!data.phone || !/^[\d\s\-+$$$$]{8,}$/.test(data.phone)) {
    errors.push("Teléfono inválido")
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Email inválido")
  }

  return errors
}

// Horarios disponibles
export const generateTimeSlots = (): string[] => {
  const slots: string[] = []
  for (let hour = 10; hour < 19; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`)
    slots.push(`${hour.toString().padStart(2, "0")}:30`)
  }
  return slots
}

export const isValidTimeSlot = (time: string): boolean => {
  const validSlots = generateTimeSlots()
  return validSlots.includes(time)
}
