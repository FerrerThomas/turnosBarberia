import { type NextRequest, NextResponse } from "next/server"
import { ReservationService } from "@/lib/reservations"
import { format, subMonths } from "date-fns"

export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    const currentMonth = format(now, "yyyy-MM")
    const lastMonth = format(subMonths(now, 1), "yyyy-MM")

    // Obtener todas las reservas
    const allReservations = await ReservationService.getReservations()

    // Estadísticas generales
    const totalReservations = allReservations.length
    const confirmedReservations = allReservations.filter((r) => r.status === "confirmed").length
    const cancelledReservations = allReservations.filter((r) => r.status === "cancelled").length
    const completedReservations = allReservations.filter((r) => r.status === "completed").length

    // Reservas del mes actual
    const currentMonthReservations = allReservations.filter((r) => r.date.startsWith(currentMonth)).length

    // Reservas del mes pasado
    const lastMonthReservations = allReservations.filter((r) => r.date.startsWith(lastMonth)).length

    // Reservas de hoy
    const today = format(now, "yyyy-MM-dd")
    const todayReservations = allReservations.filter((r) => r.date === today).length

    // Próximas reservas (próximos 7 días)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    const upcomingReservations = allReservations.filter((r) => {
      const reservationDate = new Date(r.date)
      return reservationDate >= now && reservationDate <= nextWeek && r.status === "confirmed"
    }).length

    return NextResponse.json({
      success: true,
      data: {
        total: totalReservations,
        confirmed: confirmedReservations,
        cancelled: cancelledReservations,
        completed: completedReservations,
        currentMonth: currentMonthReservations,
        lastMonth: lastMonthReservations,
        today: todayReservations,
        upcoming: upcomingReservations,
      },
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener estadísticas",
      },
      { status: 500 },
    )
  }
}
