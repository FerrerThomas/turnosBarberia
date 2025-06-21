"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Scissors,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  Plus,
  Eye,
  RefreshCw,
} from "lucide-react"
import { isAdminAuthenticated, logoutAdmin } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface AdminStats {
  total: number
  confirmed: number
  cancelled: number
  completed: number
  currentMonth: number
  lastMonth: number
  today: number
  upcoming: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Verificar autenticación
    if (!isAdminAuthenticated()) {
      router.push("/admin")
      return
    }

    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/stats", {
        cache: "no-store", // Evitar caché
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      const result = await response.json()

      if (result.success) {
        setStats(result.data)
        if (refreshing) {
          toast({
            title: "Datos actualizados",
            description: "Las estadísticas se han actualizado correctamente",
          })
        }
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar las estadísticas",
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
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchStats()
  }

  const handleLogout = () => {
    logoutAdmin()
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })
    router.push("/admin")
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-md border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-500/20 rounded-full p-2 border border-yellow-400/30">
                <Scissors className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  Panel de Administración
                </h1>
                <p className="text-sm text-gray-400">Estilo & Corte</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="bg-black/20 text-white border-yellow-500/30 hover:bg-yellow-500/10"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Actualizando..." : "Actualizar"}
              </Button>
              <Link href="/admin/reservations">
                <Button
                  variant="outline"
                  className="bg-black/20 text-white border-yellow-500/30 hover:bg-yellow-500/10"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Reservas
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-black/20 text-white border-red-500/30 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Bienvenido, Administrador</h2>
              <p className="text-gray-300">Aquí tienes un resumen de la actividad de tu peluquería</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Última actualización:</p>
              <p className="text-yellow-400 font-semibold">{new Date().toLocaleString("es-ES")}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Reservas */}
            <Card className="bg-black/40 backdrop-blur-md border border-yellow-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Reservas</CardTitle>
                <Calendar className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">{stats.total}</div>
                <p className="text-xs text-gray-400">Todas las reservas registradas</p>
              </CardContent>
            </Card>

            {/* Reservas Confirmadas */}
            <Card className="bg-black/40 backdrop-blur-md border border-green-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Confirmadas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.confirmed}</div>
                <p className="text-xs text-gray-400">Reservas activas</p>
              </CardContent>
            </Card>

            {/* Reservas de Hoy */}
            <Card className="bg-black/40 backdrop-blur-md border border-blue-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Hoy</CardTitle>
                <Clock className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{stats.today}</div>
                <p className="text-xs text-gray-400">Reservas para hoy</p>
              </CardContent>
            </Card>

            {/* Próximas Reservas */}
            <Card className="bg-black/40 backdrop-blur-md border border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Próximas</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{stats.upcoming}</div>
                <p className="text-xs text-gray-400">Próximos 7 días</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Status Overview */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Estado de Reservas */}
            <Card className="bg-black/40 backdrop-blur-md border border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-white">Estado de Reservas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-white">Confirmadas</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{stats.confirmed}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <span className="text-white">Canceladas</span>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{stats.cancelled}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-white">Completadas</span>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{stats.completed}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Comparación Mensual */}
            <Card className="bg-black/40 backdrop-blur-md border border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-white">Comparación Mensual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Mes Actual</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{stats.currentMonth}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Mes Anterior</span>
                  <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{stats.lastMonth}</Badge>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Diferencia</span>
                    <span
                      className={`text-sm font-semibold ${
                        stats.currentMonth >= stats.lastMonth ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {stats.currentMonth >= stats.lastMonth ? "+" : ""}
                      {stats.currentMonth - stats.lastMonth}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card className="bg-black/40 backdrop-blur-md border border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-white">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/reservations">
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Todas las Reservas
                </Button>
              </Link>
              <Link href="/admin/reservations?filter=today">
                <Button
                  variant="outline"
                  className="w-full bg-black/20 text-white border-blue-500/30 hover:bg-blue-500/10"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Reservas de Hoy
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full bg-black/20 text-white border-gray-500/30 hover:bg-gray-500/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ver Sitio Web
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Auto-refresh Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            💡 Tip: Usa el botón "Actualizar" para ver los cambios más recientes en las reservas
          </p>
        </div>
      </div>
    </div>
  )
}
