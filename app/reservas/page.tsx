"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft, Clock, User, Check, Scissors, Loader2, CalendarIcon} from "lucide-react"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

interface ReservationData {
  date: string
  time: string
  name: string
  lastName: string
  phone: string
}

export default function ReservasPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    phone: "",
  })
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submittedReservation, setSubmittedReservation] = useState<ReservationData | null>(null)

  const { toast } = useToast()

  // Cargar horarios disponibles cuando se selecciona una fecha
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(format(selectedDate, "yyyy-MM-dd"))
    }
  }, [selectedDate])

  const fetchAvailableSlots = async (date: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reservations/available-slots?date=${date}`)
      const result = await response.json()

      if (result.success) {
        setAvailableSlots(result.data.availableSlots)
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los horarios disponibles",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching available slots:", error)
      toast({
        title: "Error",
        description: "Error de conexión al cargar horarios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setSelectedTime("")
      setStep(2)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(3)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime || !formData.name || !formData.lastName || !formData.phone) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const reservationData = {
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        name: formData.name.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
      }

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmittedReservation(reservationData)
        setIsSubmitted(true)
        toast({
          title: "¡Reserva confirmada!",
          description: "Tu turno ha sido reservado exitosamente",
        })
      } else {
        toast({
          title: "Error al reservar",
          description: result.error || "No se pudo completar la reserva",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating reservation:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedDate(undefined)
    setSelectedTime("")
    setFormData({ name: "", lastName: "", phone: "" })
    setIsSubmitted(false)
    setSubmittedReservation(null)
    setStep(1)
  }

  if (isSubmitted && submittedReservation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/60 backdrop-blur-md border border-yellow-500/30">
          <CardContent className="text-center p-8">
            <div className="bg-yellow-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 border border-yellow-400/30">
              <Check className="h-8 w-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">¡Reserva Confirmada!</h2>
            <div className="space-y-2 text-white mb-6">
              <p>
                <strong className="text-yellow-400">Fecha:</strong>{" "}
                {format(new Date(submittedReservation.date), "dd/MM/yyyy", { locale: es })}
              </p>
              <p>
                <strong className="text-yellow-400">Horario:</strong> {submittedReservation.time}
              </p>
              <p>
                <strong className="text-yellow-400">Cliente:</strong> {submittedReservation.name}{" "}
                {submittedReservation.lastName}
              </p>
            </div>
            <p className="text-sm text-gray-300 mb-6">
              Te esperamos en Estilo & Corte. Si necesitas cancelar o reprogramar, contáctanos al (011) 1234-5678.
            </p>
            <div className="space-y-3">
              <Button
                onClick={resetForm}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black"
              >
                Hacer otra reserva
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full bg-black text-white border-yellow-500/30 hover:bg-yellow-500/10"
                >
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-md border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:text-yellow-400">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Scissors className="h-6 w-6 text-yellow-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Reservar Turno
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= 1 ? "bg-yellow-500 border-yellow-500 text-black" : "bg-black/40 border-gray-600 text-gray-400"
                }`}
              >
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? "bg-yellow-500" : "bg-gray-600"}`}></div>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= 2 ? "bg-yellow-500 border-yellow-500 text-black" : "bg-black/40 border-gray-600 text-gray-400"
                }`}
              >
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? "bg-yellow-500" : "bg-gray-600"}`}></div>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= 3 ? "bg-yellow-500 border-yellow-500 text-black" : "bg-black/40 border-gray-600 text-gray-400"
                }`}
              >
                3
              </div>
            </div>
          </div>

          {/* Step 1: Date Selection */}
          {step === 1 && (
          <Card className="bg-black/40 backdrop-blur-md border border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-400 text-xl">
                <CalendarIcon className="h-6 w-6 mr-3" /> {/* Cambiado de Calendar a CalendarIcon */}
                Selecciona una fecha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date() || date < addDays(new Date(), -1)}
                    locale={es}
                    className="rounded-md border border-yellow-500/20 bg-black/20"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center text-white",
                      caption_label: "text-sm font-medium text-yellow-400",
                      nav: "space-x-1 flex items-center",
                      nav_button:
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-yellow-400 hover:bg-yellow-500/20 rounded-md",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-yellow-400 rounded-md w-9 font-normal text-[0.8rem]",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-yellow-500/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal text-white hover:bg-yellow-500/20 hover:text-yellow-400 rounded-md aria-selected:opacity-100",
                      day_selected:
                        "bg-yellow-500 text-black hover:bg-yellow-600 hover:text-black focus:bg-yellow-500 focus:text-black",
                      day_today: "bg-yellow-500/20 text-yellow-400",
                      day_outside: "text-gray-600 opacity-50",
                      day_disabled: "text-gray-600 opacity-50 cursor-not-allowed",
                      day_range_middle: "aria-selected:bg-yellow-500/20 aria-selected:text-yellow-400",
                      day_hidden: "invisible",
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Time Selection */}
          {step === 2 && selectedDate && (
            <Card className="bg-black/40 backdrop-blur-md border border-yellow-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-400 text-xl">
                  <Clock className="h-6 w-6 mr-3" />
                  Horarios para {format(selectedDate, "dd/MM/yyyy", { locale: es })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-yellow-400 mr-2" />
                    <span className="text-white">Cargando horarios...</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      {availableSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => handleTimeSelect(time)}
                          className={
                            selectedTime === time
                              ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                              : "bg-black/20 text-white border-yellow-500/30 hover:bg-yellow-500/10"
                          }
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    {availableSlots.length === 0 && (
                      <p className="text-center text-gray-400 py-8">No hay horarios disponibles para esta fecha.</p>
                    )}
                  </>
                )}
                <Button variant="ghost" onClick={() => setStep(1)} className="text-white hover:text-yellow-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cambiar fecha
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Personal Information */}
          {step === 3 && (
            <Card className="bg-black/40 backdrop-blur-md border border-yellow-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-400 text-xl">
                  <User className="h-6 w-6 mr-3" />
                  Completa tus datos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">
                        Nombre *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="mt-1 bg-black/20 border-yellow-500/30 text-white"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white">
                        Apellido *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                        className="mt-1 bg-black/20 border-yellow-500/30 text-white"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">
                      Teléfono *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="mt-1 bg-black/20 border-yellow-500/30 text-white"
                      placeholder="(011) 1234-5678"
                      disabled={loading}
                    />
                  </div>

                  {/* Resumen */}
                  <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/20">
                    <h3 className="font-semibold text-yellow-400 mb-2">Resumen de tu reserva:</h3>
                    <div className="space-y-1 text-sm text-white">
                      <p>
                        <strong>Fecha:</strong> {format(selectedDate!, "dd/MM/yyyy", { locale: es })}
                      </p>
                      <p>
                        <strong>Horario:</strong> {selectedTime}
                      </p>
                      <p>
                        <strong>Duración:</strong> 30 minutos
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black flex-1"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Confirmando...
                        </>
                      ) : (
                        "Confirmar Reserva"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      disabled={loading}
                      className="bg-black/20 text-white border-yellow-500/30 hover:bg-yellow-500/10"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Cambiar horario
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
