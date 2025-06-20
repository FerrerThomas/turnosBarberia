import { type NextRequest, NextResponse } from "next/server"
import { ReservationService } from "@/lib/reservations"

// GET - Obtener horarios disponibles para una fecha
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json(
        {
          success: false,
          error: "Fecha requerida",
        },
        { status: 400 },
      )
    }

    // Validar formato de fecha
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        {
          success: false,
          error: "Formato de fecha inválido. Use YYYY-MM-DD",
        },
        { status: 400 },
      )
    }

    const availableSlots = await ReservationService.getAvailableSlots(date)

    return NextResponse.json({
      success: true,
      data: {
        date,
        availableSlots,
        totalSlots: 18,
        availableCount: availableSlots.length,
      },
    })
  } catch (error) {
    console.error("Error fetching available slots:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener horarios disponibles",
      },
      { status: 500 },
    )
  }
}
