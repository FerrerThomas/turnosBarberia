"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Scissors,
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Loader2,
} from "lucide-react"
import { isAdminAuthenticated } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Reservation } from "@/models/Reservation"

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    // Verificar autenticación
    if (!isAdminAuthenticated()) {
      router.push("/admin")
      return
    }

    fetchReservations()

    // Aplicar filtros de URL si existen
    const filterParam = searchParams.get("filter")
    if (filterParam === "today") {
      const today = format(new Date(), "yyyy-MM-dd")
      setDateFilter(today)
    }
  }, [router, searchParams])

  useEffect(() => {
    // Aplicar filtros cuando cambien los criterios
    applyFilters()
  }, [reservations, searchTerm, statusFilter, dateFilter])

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/reservations")
      const result = await response.json()

      if (result.success) {
        setReservations(result.data)
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar las reservas",
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

  const applyFilters = () => {
    let filtered = [...reservations]

    // Filtro por búsqueda (nombre, apellido, teléfono)
    if (searchTerm) {
      filtered = filtered.filter(
        (reservation) =>
          reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.phone.includes(searchTerm),
      )
    }

    // Filtro por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((reservation) => reservation.status === statusFilter)
    }

    // Filtro por fecha
    if (dateFilter) {
      filtered = filtered.filter((reservation) => reservation.date === dateFilter)
    }

    setFilteredReservations(filtered)
  }

  const updateReservationStatus = async (id: string, status: "confirmed" | "cancelled" | "completed") => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Estado actualizado",
          description: `Reserva marcada como ${status === "confirmed" ? "confirmada" : status === "cancelled" ? "cancelada" : "completada"}`,
        })
        fetchReservations() // Recargar datos
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    }
  }

  const deleteReservation = async (id: string) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Reserva eliminada",
          description: "La reserva ha sido eliminada permanentemente",
        })
        fetchReservations() // Recargar datos
      } else {
        toast({
          title: "Error",
          description: "No se pudo eliminar la reserva",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmada
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelada
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Completada
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mx-auto mb-4" />
          <p className="text-white">Cargando reservas...</p>
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
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:text-yellow-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Scissors className="h-6 w-6 text-yellow-400" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  Gestión de Reservas
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="bg-black/40 backdrop-blur-md border border-yellow-500/30 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Filter className="h-5 w-5 mr-2 text-yellow-400" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, apellido o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/20 border-yellow-500/30 text-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-black/20 border-yellow-500/30 text-white">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="confirmed">Confirmadas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-black/20 border-yellow-500/30 text-white"
              />
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setDateFilter("")
                }}
                variant="outline"
                className="bg-black/20 text-white border-gray-500/30 hover:bg-gray-500/10"
              >
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-black/40 backdrop-blur-md border border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-yellow-400">{filteredReservations.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 backdrop-blur-md border border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Confirmadas</p>
                  <p className="text-2xl font-bold text-green-400">
                    {filteredReservations.filter((r) => r.status === "confirmed").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 backdrop-blur-md border border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Canceladas</p>
                  <p className="text-2xl font-bold text-red-400">
                    {filteredReservations.filter((r) => r.status === "cancelled").length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/40 backdrop-blur-md border border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Completadas</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {filteredReservations.filter((r) => r.status === "completed").length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reservations Table */}
        <Card className="bg-black/40 backdrop-blur-md border border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-white">Reservas ({filteredReservations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Fecha
                    </TableHead>
                    <TableHead className="text-gray-300">
                      <Clock className="h-4 w-4 inline mr-2" />
                      Hora
                    </TableHead>
                    <TableHead className="text-gray-300">
                      <User className="h-4 w-4 inline mr-2" />
                      Cliente
                    </TableHead>
                    <TableHead className="text-gray-300">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Teléfono
                    </TableHead>
                    <TableHead className="text-gray-300">Estado</TableHead>
                    <TableHead className="text-gray-300">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((reservation) => (
                    <TableRow key={reservation._id?.toString()} className="border-gray-700">
                      <TableCell className="text-white">
                        {format(new Date(reservation.date), "dd/MM/yyyy", { locale: es })}
                      </TableCell>
                      <TableCell className="text-white">{reservation.time}</TableCell>
                      <TableCell className="text-white">
                        {reservation.name} {reservation.lastName}
                      </TableCell>
                      <TableCell className="text-white">{reservation.phone}</TableCell>
                      <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {reservation.status === "confirmed" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateReservationStatus(reservation._id!.toString(), "completed")}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Completar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateReservationStatus(reservation._id!.toString(), "cancelled")}
                                className="bg-red-600/20 text-red-400 border-red-500/30 hover:bg-red-600/30"
                              >
                                Cancelar
                              </Button>
                            </>
                          )}
                          {reservation.status === "cancelled" && (
                            <Button
                              size="sm"
                              onClick={() => updateReservationStatus(reservation._id!.toString(), "confirmed")}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Reactivar
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-600/20 text-red-400 border-red-500/30 hover:bg-red-600/30"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-black/90 border border-red-500/30">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">¿Eliminar reserva?</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-300">
                                  Esta acción no se puede deshacer. La reserva será eliminada permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-black/20 text-white border-gray-500/30">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteReservation(reservation._id!.toString())}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredReservations.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No se encontraron reservas con los filtros aplicados</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
