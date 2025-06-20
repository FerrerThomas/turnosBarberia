import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Scissors, Clock, Users, Star } from "lucide-react"
import ImageCarousel from "@/components/image-carousel"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/60 backdrop-blur-md border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Scissors className="h-8 w-8 text-yellow-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
                Estilo & Corte
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a
                href="#inicio"
                className="text-white hover:text-yellow-400 transition-colors duration-300 relative group"
              >
                Inicio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#nosotros"
                className="text-white hover:text-yellow-400 transition-colors duration-300 relative group"
              >
                Nosotros
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <Link
                href="/contacto"
                className="text-white hover:text-yellow-400 transition-colors duration-300 relative group"
              >
                Contacto
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Scissors className="h-16 w-16 text-yellow-400 animate-spin-slow" />
              <div className="absolute inset-0 h-16 w-16 text-amber-400 animate-ping opacity-20">
                <Scissors className="h-16 w-16" />
              </div>
            </div>
          </div>

          <h2 className="text-4xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Bienvenido
            </span>
            <br />
            <span className="text-white">tu reserva te esta esperando</span>
          </h2>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            no lo dudes mas, te esperamos
          </p>

          <Link href="/reservas">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 border border-yellow-400/50"
            >
              Reservar Turno
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/60 backdrop-blur-sm border-y border-yellow-500/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg border border-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent mb-2">
                500+
              </h3>
              <p className="text-white">Clientes transformados</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg border border-amber-400/30 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-white bg-clip-text text-transparent mb-2">
                5
              </h3>
              <p className="text-white">Años innovando</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg border border-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent mb-2">
                4.9
              </h3>
              <p className="text-white">Calificación estelar</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-l from-amber-900/20 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  Quiénes Somos
                </span>
              </h2>
              <div className="space-y-4 text-white leading-relaxed">
                <p className="text-lg">
                  En <strong className="text-yellow-400">Estilo & Corte</strong>, somos pioneros en la fusión entre
                  tradición y tecnología. Con más de 5 años redefiniendo los estándares de la industria capilar, nos
                  hemos establecido como la referencia futurista en estilo y tendencias.
                </p>
                <p className="text-lg">
                  Nuestra misión trasciende el corte tradicional: creamos experiencias transformadoras que elevan tu
                  esencia personal. Cada sesión es un viaje hacia tu mejor versión, donde la precisión técnica se
                  encuentra con la visión artística.
                </p>
                <p className="text-lg">
                  Nuestro equipo de artistas capilares domina las técnicas más avanzadas del sector, integrando
                  herramientas de última generación con productos premium. Operamos en un ambiente vanguardista que
                  redefine el concepto de peluquería moderna.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/reservas">
                  <Button className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black border border-yellow-400/50">
                    Inicia tu transformación
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-2xl p-8 border border-yellow-400/20 backdrop-blur-sm">
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src="https://marketplace.canva.com/EAFNuXkF0II/4/0/1600w/canva-logo-barberia-minimalista-moderno-negro-amarillo-XW3Cd5MMHC8.jpg"
                    alt="Interior futurista de la peluquería"
                    width={400}
                    height={400}
                    className="rounded-xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Nuestras Creaciones
              </span>
            </h2>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Cada obra es única, cada cliente una nueva historia. Descubre las transformaciones que han marcado
              tendencia en el futuro del estilo.
            </p>
          </div>
          <ImageCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float-delayed"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black">
            ¿Listo para el <span className="text-gray-900">futuro</span>?
          </h2>
          <p className="text-xl mb-8 text-gray-900 max-w-2xl mx-auto">
            No esperes más para experimentar la revolución capilar. Tu transformación futurista te está esperando.
          </p>
          <Link href="/reservas">
            <Button
              size="lg"
              className="bg-black/20 backdrop-blur-md hover:bg-black/30 text-white px-8 py-4 text-lg font-semibold rounded-full border border-black/30 shadow-2xl hover:shadow-black/25 transition-all duration-300 transform hover:scale-105"
            >
              Reservar Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-md text-white py-12 border-t border-yellow-500/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Scissors className="h-6 w-6 text-yellow-400" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  Estilo & Corte
                </h3>
              </div>
              <p className="text-white">El futuro de tu estilo comienza aquí.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-yellow-400">Horarios</h4>
              <p className="text-white">Lunes a Sábado</p>
              <p className="text-white">10:00 AM - 7:00 PM</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-yellow-400">Contacto</h4>
              <p className="text-white">📍 Av. Principal 123</p>
              <p className="text-white">📞 (011) 1234-5678</p>
              <p className="text-white">✉️ info@estiloycorte.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Estilo & Corte. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
