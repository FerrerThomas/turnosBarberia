"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, Phone, Mail, MessageCircle, Clock, Users, Star, Scissors } from "lucide-react"

export default function ContactoPage() {
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
                Contacto
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Conecta con nosotros
              </span>
            </h2>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Estamos aquí para hacer realidad tu transformación. Contáctanos por el medio que prefieras.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <div className="space-y-6">
              {/* WhatsApp */}
              <Card className="bg-black/40 backdrop-blur-md border border-green-500/30 hover:border-green-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-400">
                    <MessageCircle className="h-6 w-6 mr-3" />
                    WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white mb-4">
                    La forma más rápida de comunicarte con nosotros. Respuesta inmediata garantizada.
                  </p>
                  <a
                    href="https://wa.me/5491123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chatear ahora
                    </Button>
                  </a>
                  <p className="text-sm text-gray-400 mt-2">+54 9 11 2345-6789</p>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card className="bg-black/40 backdrop-blur-md border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-400">
                    <Phone className="h-6 w-6 mr-3" />
                    Teléfono
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white mb-4">Llámanos directamente para consultas o reservas telefónicas.</p>
                  <a href="tel:+541123456789" className="inline-block">
                    <Button className="bg-yellow-600 hover:bg-yellow-700 text-black">
                      <Phone className="h-4 w-4 mr-2" />
                      Llamar ahora
                    </Button>
                  </a>
                  <p className="text-sm text-gray-400 mt-2">(011) 2345-6789</p>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="bg-black/40 backdrop-blur-md border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-amber-400">
                    <Mail className="h-6 w-6 mr-3" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white mb-4">Envíanos un email para consultas detalladas o sugerencias.</p>
                  <a href="mailto:info@estiloycorte.com" className="inline-block">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-black">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar email
                    </Button>
                  </a>
                  <p className="text-sm text-gray-400 mt-2">info@estiloycorte.com</p>
                </CardContent>
              </Card>
            </div>

            {/* Location and Hours */}
            <div className="space-y-6">
              {/* Location */}
              <Card className="bg-black/40 backdrop-blur-md border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-400">
                    <MapPin className="h-6 w-6 mr-3" />
                    Ubicación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Dirección</h4>
                      <p className="text-white">Av. Principal 123, Palermo</p>
                      <p className="text-white">Ciudad Autónoma de Buenos Aires</p>
                      <p className="text-white">Argentina (C1414)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Cómo llegar</h4>
                      <p className="text-sm text-gray-400">• Subte: Línea D, Estación Palermo</p>
                      <p className="text-sm text-gray-400">• Colectivos: 15, 21, 67, 93</p>
                      <p className="text-sm text-gray-400">• Estacionamiento disponible</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card className="bg-black/40 backdrop-blur-md border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-amber-400">
                    <Clock className="h-6 w-6 mr-3" />
                    Horarios de Atención
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Lunes a Viernes</span>
                      <span className="text-yellow-400 font-semibold">10:00 - 19:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Sábados</span>
                      <span className="text-yellow-400 font-semibold">10:00 - 19:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Domingos</span>
                      <span className="text-red-400 font-semibold">Cerrado</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                    <p className="text-sm text-yellow-300">
                      💡 Tip: Reserva online para garantizar tu horario preferido
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Map Section */}
          <Card className="bg-black/40 backdrop-blur-md border border-yellow-500/30 mb-12">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <MapPin className="h-6 w-6 mr-3 text-yellow-400" />
                Encuéntranos en el mapa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border border-yellow-500/30">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <p className="text-white mb-2">Mapa interactivo</p>
                  <p className="text-sm text-gray-400">Av. Principal 123, Palermo, CABA</p>
                  <Button
                    className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-black"
                    onClick={() =>
                      window.open("https://maps.google.com/?q=Av.+Principal+123,+Palermo,+Buenos+Aires", "_blank")
                    }
                  >
                    Ver en Google Maps
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-black/40 backdrop-blur-md border border-yellow-500/30 text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">500+</h3>
                <p className="text-white">Clientes satisfechos</p>
              </CardContent>
            </Card>
            <Card className="bg-black/40 backdrop-blur-md border border-amber-500/30 text-center">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">5</h3>
                <p className="text-white">Años de experiencia</p>
              </CardContent>
            </Card>
            <Card className="bg-black/40 backdrop-blur-md border border-yellow-500/30 text-center">
              <CardContent className="p-6">
                <Star className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">4.9</h3>
                <p className="text-white">Calificación promedio</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 backdrop-blur-md border border-yellow-500/30">
            <CardContent className="text-center p-8">
              <h3 className="text-2xl font-bold text-white mb-4">¿Listo para tu transformación?</h3>
              <p className="text-white mb-6">
                No esperes más. Reserva tu turno online y comienza tu viaje hacia el futuro del estilo.
              </p>
              <Link href="/reservas">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black"
                >
                  Reservar Turno Ahora
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
