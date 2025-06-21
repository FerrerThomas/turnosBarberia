import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { format, subMonths, addDays } from "date-fns"

// Forzar que esta función sea dinámica (no se cachee)
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    const today = format(now, "yyyy-MM-dd")
    const currentMonth = format(now, "yyyy-MM")
    const lastMonth = format(subMonths(now, 1), "yyyy-MM")

    // Conectar directamente a MongoDB
    const client = await clientPromise
    const db = client.db("peluqueria")
    const collection = db.collection("reservations")

    // Obtener todas las reservas directamente
    const allReservations = await collection.find({}).sort({ date: 1, time: 1 }).toArray()

    // Estadísticas generales
    const totalReservations = allReservations.length
    const confirmedReservations = allReservations.filter((r) => r.status === "confirmed").length
    const cancelledReservations = allReservations.filter((r) => r.status === "cancelled").length
    const completedReservations = allReservations.filter((r) => r.status === "completed").length

    // Reservas del mes actual
    const currentMonthReservations = allReservations.filter((r) => {
      const reservationMonth = r.date.substring(0, 7)
      return reservationMonth === currentMonth
    }).length

    // Reservas del mes pasado
    const lastMonthReservations = allReservations.filter((r) => {
      const reservationMonth = r.date.substring(0, 7)
      return reservationMonth === lastMonth
    }).length

    // Reservas de hoy
    const todayReservations = allReservations.filter((r) => r.date === today).length

    // Próximas reservas
    const nextWeekDate = format(addDays(now, 7), "yyyy-MM-dd")
    const upcomingReservations = allReservations.filter((r) => {
      return r.date >= today && r.date <= nextWeekDate && r.status === "confirmed"
    }).length

    const stats = {
      total: totalReservations,
      confirmed: confirmedReservations,
      cancelled: cancelledReservations,
      completed: completedReservations,
      currentMonth: currentMonthReservations,
      lastMonth: lastMonthReservations,
      today: todayReservations,
      upcoming: upcomingReservations,
    }

    const response = NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    })

    // Headers anti-caché
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
    )
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    response.headers.set("Surrogate-Control", "no-store")
    response.headers.set("CDN-Cache-Control", "no-store")
    response.headers.set("Vercel-CDN-Cache-Control", "no-store")

    return response
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener estadísticas",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
