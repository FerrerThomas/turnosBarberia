"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Scissors, Lock, User, Eye, EyeOff } from "lucide-react"
import { isAdminAuthenticated, setAdminAuthenticated } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAdminAuthenticated()) {
      router.push("/admin/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const result = await response.json()

      if (result.success) {
        setAdminAuthenticated(true)
        toast({
          title: "Acceso concedido",
          description: "Bienvenido al panel de administración",
        })
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Error de autenticación",
          description: result.error || "Credenciales inválidas",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/60 backdrop-blur-md border border-yellow-500/30">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-500/20 rounded-full p-4 border border-yellow-400/30">
              <Lock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
            Panel de Administración
          </CardTitle>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Scissors className="h-5 w-5 text-yellow-400" />
            <span className="text-white">Estilo & Corte</span>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-white">
                Usuario
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                  className="pl-10 bg-black/20 border-yellow-500/30 text-white"
                  placeholder="Ingresa tu usuario"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-white">
                Contraseña
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                  className="pl-10 pr-10 bg-black/20 border-yellow-500/30 text-white"
                  placeholder="Ingresa tu contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-semibold"
            >
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
            <p className="text-sm text-yellow-300 text-center">🔒 Acceso restringido solo para administradores</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
