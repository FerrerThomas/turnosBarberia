import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// Forzar que esta función sea dinámica
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    console.log("=== DEBUG API CALLED ===", new Date().toISOString())

    // Conectar directamente a MongoDB
    const client = await clientPromise
    const db = client.db("peluqueria")
    const collection = db.collection("reservations")

    // Obtener todas las reservas directamente
    const allReservations = await collection.find({}).sort({ createdAt: -1 }).toArray()

    console.log("=== DEBUG DIRECT DB QUERY ===")
    console.log("Total reservations in DB:", allReservations.length)

    // Mostrar cada reserva
    allReservations.forEach((reservation, index) => {
      console.log(`Reservation ${index + 1}:`, {
        id: reservation._id?.toString(),
        date: reservation.date,
        time: reservation.time,
        name: reservation.name,
        status: reservation.status,
        createdAt: reservation.createdAt,
      })
    })

    // Estadísticas básicas
    const stats = {
      total: allReservations.length,
      confirmed: allReservations.filter((r) => r.status === "confirmed").length,
      cancelled: allReservations.filter((r) => r.status === "cancelled").length,
      completed: allReservations.filter((r) => r.status === "completed").length,
      byDate: allReservations.reduce(
        (acc, r) => {
          acc[r.date] = (acc[r.date] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    }

    console.log("=== DEBUG CALCULATED STATS ===")
    console.log(stats)

    const response = NextResponse.json({
      success: true,
      data: {
        reservations: allReservations,
        stats,
        timestamp: new Date().toISOString(),
        dbConnection: "direct",
      },
    })

    // Headers anti-caché
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  } catch (error) {
    console.error("=== DEBUG ERROR ===", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
