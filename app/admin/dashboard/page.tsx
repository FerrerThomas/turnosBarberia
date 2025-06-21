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
  Bug,
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
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [debugData, setDebugData] = useState<any>(null)
  const [serverDebug, setServerDebug] = useState<any>(null)
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
      if (!refreshing) setLoading(true)

      console.log("=== CLIENT: Fetching stats ===", new Date().toISOString())

      // Crear URL única para evitar cualquier caché
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(7)}`
      const url = `/api/admin/stats?unique=${uniqueId}&t=${Date.now()}`

      console.log("Fetching URL:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      const result = await response.json()
      console.log("=== CLIENT: Stats response ===", result)

      if (result.success) {
        setStats(result.data)
        setServerDebug(result.debug)
        setLastUpdate(new Date().toLocaleString("es-ES"))

        if (refreshing) {
          toast({
            title: "✅ Datos actualizados",
            description: `Stats: ${result.data.total} reservas | Server: ${result.debug?.totalInDB} en DB`,
          })
        }
      } else {
        console.error("Error in stats response:", result)
        toast({
          title: "Error",
          description: result.error || "No se pudieron cargar las estadísticas",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
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

  const fetchDebugData = async () => {
    try {
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(7)}`
      const response = await fetch(`/api/admin/debug?unique=${uniqueId}`, {
        cache: "no-store",
      })
      const result = await response.json()
      console.log("Debug data:", result)
      setDebugData(result.data)

      toast({
        title: "Debug ejecutado",
        description: `${result.data?.reservations?.length || 0} reservas encontradas en DB`,
      })
    } catch (error) {
      console.error("Error fetching debug data:", error)
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
                onClick={fetchDebugData}
                variant="outline"
                className="bg-black/20 text-white border-red-500/30 hover:bg-red-500/10"
              >
                <Bug className="h-4 w-4 mr-2" />
                Debug DB
              </Button>
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
              <p className="text-yellow-400 font-semibold">{lastUpdate || "Cargando..."}</p>
              {serverDebug && <p className="text-xs text-gray-500">Server: {serverDebug.totalInDB} en DB</p>}
            </div>
          </div>
        </div>

        {/* Server Debug Info */}
        {serverDebug && (
          <Card className="bg-blue-900/20 border border-blue-500/30 mb-6">
            <CardHeader>
              <CardTitle className="text-blue-400">Server Debug - Conexión Directa a DB</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Datos del Servidor:</h4>
                  <p className="text-blue-400">
                    Total en DB: <span className="text-white font-bold">{serverDebug.totalInDB}</span>
                  </p>
                  <p className="text-blue-400">
                    Query Time: <span className="text-white text-xs">{serverDebug.queryTime}</span>
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Muestra de datos:</h4>
                  <div className="space-y-1">
                    {serverDebug.sampleData?.map((r: any, i: number) => (
                      <div key={i} className="text-xs text-gray-300 bg-black/20 p-1 rounded">
                        {r.date} {r.time} - {r.name} ({r.status})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Debug Info */}
        {debugData && (
          <Card className="bg-red-900/20 border border-red-500/30 mb-6">
            <CardHeader>
              <CardTitle className="text-red-400">Debug Info - Datos Reales de la Base de Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Estadísticas Calculadas:</h4>
                  <pre className="text-white text-xs overflow-auto bg-black/20 p-2 rounded">
                    {JSON.stringify(debugData.stats, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Total Reservas en DB:</h4>
                  <p className="text-yellow-400 text-2xl font-bold">{debugData.reservations?.length || 0}</p>
                  <h4 className="text-white font-semibold mb-2 mt-4">Últimas 3 reservas:</h4>
                  <div className="space-y-1">
                    {debugData.reservations?.slice(-3).map((r: any, i: number) => (
                      <div key={i} className="text-xs text-gray-300 bg-black/20 p-1 rounded">
                        {r.date} {r.time} - {r.name} ({r.status})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
            💡 Tip: El panel azul muestra datos directos del servidor. Compara con las estadísticas del dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
