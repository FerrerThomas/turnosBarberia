import { type NextRequest, NextResponse } from "next/server"
import { ReservationService } from "@/lib/reservations"

// GET - Obtener reserva por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reservation = await ReservationService.getReservationById(params.id)

    if (!reservation) {
      return NextResponse.json(
        {
          success: false,
          error: "Reserva no encontrada",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: reservation,
    })
  } catch (error) {
    console.error("Error fetching reservation:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener la reserva",
      },
      { status: 500 },
    )
  }
}

// PUT - Actualizar reserva
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    const reservation = await ReservationService.updateReservation(params.id, updates)

    if (!reservation) {
      return NextResponse.json(
        {
          success: false,
          error: "Reserva no encontrada",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: reservation,
      message: "Reserva actualizada exitosamente",
    })
  } catch (error) {
    console.error("Error updating reservation:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al actualizar la reserva",
      },
      { status: 500 },
    )
  }
}

// DELETE - Cancelar reserva
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await ReservationService.cancelReservation(params.id)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Reserva no encontrada",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Reserva cancelada exitosamente",
    })
  } catch (error) {
    console.error("Error cancelling reservation:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al cancelar la reserva",
      },
      { status: 500 },
    )
  }
}
