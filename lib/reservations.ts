import clientPromise from "./mongodb"
import type { Reservation, CreateReservationData, ReservationFilters } from "../models/Reservation"
import { ObjectId } from "mongodb"

const COLLECTION_NAME = "reservations"

export class ReservationService {
  static async getDatabase() {
    const client = await clientPromise
    return client.db("peluqueria")
  }

  static async createReservation(data: CreateReservationData): Promise<Reservation> {
    const db = await this.getDatabase()
    const collection = db.collection<Reservation>(COLLECTION_NAME)

    // Verificar si ya existe una reserva para esa fecha y hora
    const existingReservation = await collection.findOne({
      date: data.date,
      time: data.time,
      status: { $ne: "cancelled" },
    })

    if (existingReservation) {
      throw new Error("Ya existe una reserva para esta fecha y hora")
    }

    const reservation: Omit<Reservation, "_id"> = {
      ...data,
      status: "confirmed",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(reservation)

    return {
      ...reservation,
      _id: result.insertedId,
    }
  }

  static async getReservations(filters: ReservationFilters = {}): Promise<Reservation[]> {
    const db = await this.getDatabase()
    const collection = db.collection<Reservation>(COLLECTION_NAME)

    const query: any = {}

    if (filters.date) {
      query.date = filters.date
    }

    if (filters.status) {
      query.status = filters.status
    }

    if (filters.startDate && filters.endDate) {
      query.date = {
        $gte: filters.startDate,
        $lte: filters.endDate,
      }
    }

    return await collection.find(query).sort({ date: 1, time: 1 }).toArray()
  }

  static async getReservationsByDate(date: string): Promise<Reservation[]> {
    return this.getReservations({ date, status: "confirmed" })
  }

  static async getAvailableSlots(date: string): Promise<string[]> {
    const reservations = await this.getReservationsByDate(date)
    const reservedTimes = reservations.map((r) => r.time)

    const allSlots = [
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
    ]

    return allSlots.filter((slot) => !reservedTimes.includes(slot))
  }

  static async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation | null> {
    const db = await this.getDatabase()
    const collection = db.collection<Reservation>(COLLECTION_NAME)

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result
  }

  static async cancelReservation(id: string): Promise<boolean> {
    const db = await this.getDatabase()
    const collection = db.collection<Reservation>(COLLECTION_NAME)

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "cancelled",
          updatedAt: new Date(),
        },
      },
    )

    return result.modifiedCount > 0
  }

  static async getReservationById(id: string): Promise<Reservation | null> {
    const db = await this.getDatabase()
    const collection = db.collection<Reservation>(COLLECTION_NAME)

    return await collection.findOne({ _id: new ObjectId(id) })
  }
}
