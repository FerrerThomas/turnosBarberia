"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const images = [
  {
    src: "https://media.revistagq.com/photos/65019e825524357c74065340/16:9/w_1280,c_limit/david%20beckham%20corte%20pelo.jpeg",
    alt: "Corte futurista masculino",
    title: "Corte Golden Fade",
  },
  {
    src: "https://www.capilclinic.es/blog/wp-content/uploads/2021/12/corte-pelo-hombre-segun-cara.jpg",
    alt: "Peinado elegante femenino",
    title: "Estilo Dorado",
  },
  {
    src: "https://d2y8hg1io93jyo.cloudfront.net/wp-content/uploads/Diseno-sin-titulo-2023-07-01T140616.318.jpg",
    alt: "Corte contemporáneo",
    title: "Golden Bob",
  },
  {
    src: "https://img.freepik.com/fotos-premium/corte-pelo-clasico-barberia-curva-peinado-cuidado-salud-cabello-barberia-hombres_217333-378.jpg",
    alt: "Corte undercut moderno",
    title: "Black & Gold Undercut",
  },
  {
    src: "https://www.jesusdos.com/peluqueria-y-amor-propio-como-un-buen-corte-de-pelo-puede-mejorar-su-autoestima_img212954t1.jpg",
    alt: "Peinado con ondas",
    title: "Ondas Doradas",
  },
  {
    src: "https://www.directorioglam.mx/media/cache/medium/custom/domain_1/image_files/sitemgr_photo_1735.jpg",
    alt: "Corte pixie futurista",
    title: "Pixie Luxury",
  },
]

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main carousel */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-yellow-500/20 backdrop-blur-sm">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                width={800}
                height={500}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-yellow-500/20"></div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <h3 className="text-white text-xl font-semibold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  {image.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 backdrop-blur-md hover:bg-black/60 border-yellow-400/50 text-yellow-400"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 backdrop-blur-md hover:bg-black/60 border-yellow-400/50 text-yellow-400"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-gradient-to-r from-yellow-400 to-amber-400 scale-125"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-6">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative overflow-hidden rounded-lg transition-all duration-300 border ${
              index === currentIndex
                ? "ring-2 ring-yellow-400 opacity-100 border-yellow-400/50"
                : "opacity-60 hover:opacity-80 border-gray-600/30 hover:border-yellow-400/30"
            }`}
            onClick={() => goToSlide(index)}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              width={120}
              height={80}
              className="w-full h-20 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </button>
        ))}
      </div>
    </div>
  )
}
