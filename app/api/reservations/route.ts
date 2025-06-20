import { type NextRequest, NextResponse } from "next/server"
import { ReservationService } from "@/lib/reservations"
import { validateReservation, type CreateReservationData } from "@/models/Reservation"

// GET - Obtener reservas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const filters = {
      ...(date && { date }),
      ...(status && { status }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    }

    const reservations = await ReservationService.getReservations(filters)

    return NextResponse.json({
      success: true,
      data: reservations,
    })
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener las reservas",
      },
      { status: 500 },
    )
  }
}

// POST - Crear nueva reserva
export async function POST(request: NextRequest) {
  try {
    const body: CreateReservationData = await request.json()

    // Validar datos
    const validationErrors = validateReservation(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          details: validationErrors,
        },
        { status: 400 },
      )
    }

    // Crear reserva
    const reservation = await ReservationService.createReservation(body)

    return NextResponse.json(
      {
        success: true,
        data: reservation,
        message: "Reserva creada exitosamente",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error creating reservation:", error)

    if (error.message === "Ya existe una reserva para esta fecha y hora") {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 409 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Error al crear la reserva",
      },
      { status: 500 },
    )
  }
}
