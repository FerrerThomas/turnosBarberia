import { type NextRequest, NextResponse } from "next/server"
import { ReservationService } from "@/lib/reservations"
import { format, subMonths, addDays } from "date-fns"

export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    const today = format(now, "yyyy-MM-dd")
    const currentMonth = format(now, "yyyy-MM")
    const lastMonth = format(subMonths(now, 1), "yyyy-MM")

    // Obtener todas las reservas sin filtros
    const allReservations = await ReservationService.getReservations({})

    console.log("Total reservations found:", allReservations.length)

    // Estadísticas generales
    const totalReservations = allReservations.length
    const confirmedReservations = allReservations.filter((r) => r.status === "confirmed").length
    const cancelledReservations = allReservations.filter((r) => r.status === "cancelled").length
    const completedReservations = allReservations.filter((r) => r.status === "completed").length

    // Reservas del mes actual (formato YYYY-MM)
    const currentMonthReservations = allReservations.filter((r) => {
      const reservationMonth = r.date.substring(0, 7) // Obtener YYYY-MM
      return reservationMonth === currentMonth
    }).length

    // Reservas del mes pasado (formato YYYY-MM)
    const lastMonthReservations = allReservations.filter((r) => {
      const reservationMonth = r.date.substring(0, 7) // Obtener YYYY-MM
      return reservationMonth === lastMonth
    }).length

    // Reservas de hoy (formato exacto YYYY-MM-DD)
    const todayReservations = allReservations.filter((r) => r.date === today).length

    // Próximas reservas (próximos 7 días, solo confirmadas)
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

    console.log("Calculated stats:", stats)

    // Crear respuesta con headers anti-caché más agresivos
    const response = NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      serverTime: Date.now(),
    })

    // Headers anti-caché para Vercel
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0")
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
