import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { validateReservation, type CreateReservationData } from "@/models/Reservation"

// GET - Obtener reservas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Conectar directamente a MongoDB
    const client = await clientPromise
    const db = client.db("peluqueria")
    const collection = db.collection("reservations")

    const query: any = {}

    if (date) {
      query.date = date
    }

    if (status) {
      query.status = status
    }

    if (startDate && endDate) {
      query.date = {
        $gte: startDate,
        $lte: endDate,
      }
    }

    const reservations = await collection.find(query).sort({ date: 1, time: 1 }).toArray()

    const response = NextResponse.json({
      success: true,
      data: reservations,
      timestamp: new Date().toISOString(),
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

    console.log("=== CREATING RESERVATION ===")
    console.log("Received data:", body)

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

    // Conectar directamente a MongoDB
    const client = await clientPromise
    const db = client.db("peluqueria")
    const collection = db.collection("reservations")

    // Verificar si ya existe una reserva para esa fecha y hora
    const existingReservation = await collection.findOne({
      date: body.date, // Usar exactamente la fecha que viene del frontend
      time: body.time,
      status: { $ne: "cancelled" },
    })

    console.log("Checking for existing reservation:")
    console.log("Date:", body.date, "Time:", body.time)
    console.log("Existing reservation found:", existingReservation)

    if (existingReservation) {
      return NextResponse.json(
        {
          success: false,
          error: "Ya existe una reserva para esta fecha y hora",
        },
        { status: 409 },
      )
    }

    // Crear la reserva con la fecha exacta que viene del frontend
    const reservation = {
      date: body.date, // NO modificar la fecha
      time: body.time,
      name: body.name.trim(),
      lastName: body.lastName.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim() || "",
      status: "confirmed" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("Creating reservation with data:", reservation)

    const result = await collection.insertOne(reservation)
    console.log("Reservation created with ID:", result.insertedId)

    const createdReservation = {
      ...reservation,
      _id: result.insertedId,
    }

    return NextResponse.json(
      {
        success: true,
        data: createdReservation,
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
