import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

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

    console.log("=== CHECKING AVAILABLE SLOTS ===")
    console.log("Requested date:", date)

    // Conectar directamente a MongoDB
    const client = await clientPromise
    const db = client.db("peluqueria")
    const collection = db.collection("reservations")

    // Buscar reservas confirmadas para esa fecha específica
    const existingReservations = await collection
      .find({
        date: date, // Buscar exactamente por esta fecha
        status: "confirmed", // Solo las confirmadas
      })
      .toArray()

    console.log("Existing reservations for", date, ":", existingReservations)

    // Extraer los horarios ya reservados
    const reservedTimes = existingReservations.map((r) => r.time)
    console.log("Reserved times:", reservedTimes)

    // Todos los horarios disponibles
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

    // Filtrar horarios disponibles
    const availableSlots = allSlots.filter((slot) => !reservedTimes.includes(slot))
    console.log("Available slots:", availableSlots)

    return NextResponse.json({
      success: true,
      data: {
        date,
        availableSlots,
        totalSlots: allSlots.length,
        availableCount: availableSlots.length,
        reservedTimes, // Para debug
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
