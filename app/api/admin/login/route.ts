import { type NextRequest, NextResponse } from "next/server"
import { validateAdminCredentials } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Usuario y contraseña requeridos",
        },
        { status: 400 },
      )
    }

    const isValid = validateAdminCredentials(username, password)

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Credenciales inválidas",
        },
        { status: 401 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Autenticación exitosa",
    })
  } catch (error) {
    console.error("Error in admin login:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
