'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Product } from "@/types"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"
import Image from "next/image"

export default function ProductCarousel({ data }: { data: Product[] }) {
 

  return (
    <Carousel className="w-full mb-12 " opts={{
      loop: true
    }} plugins={[
      Autoplay({
        delay: 5000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    ]}>
      <CarouselContent>
        {data.map((product: Product) => (
          <CarouselItem key={product.id}>
            <Link href={`/product/${product.slug}`}>
              <div className="relative w-full max-w-screen-2xl  md:h-[350px] h-[150px] mt-4  ">
                <Image
                  src={product.banner!}
                  alt={product.name}
                 fill
                  sizes="100vw"
                  className="object-cover rounded-md"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-end justify-center z-10">
                  <h2 className="bg-gray-900 bg-opacity-50 text-2xl  px-2 py-1 text-white font-[var(--font-ubuntu)]">
                    {product.name}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="z-20" />
      <CarouselNext className="z-20" />
    </Carousel>
  )
}


