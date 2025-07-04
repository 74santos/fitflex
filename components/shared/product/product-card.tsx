import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import ProductPrice from "./product-price"
import { Product } from "@/types"

export default function ProductCard({product}: {product: Product}) {
  return (
   <Card className="w-full max-w-sm">
    <CardHeader className="p-0 items-center">
      <Link href={`/product/${product.slug}`}>
      <Image 
      src={product.images[0]} 
      alt={product.name} 
      width={300} 
      height={300} 
      priority
      unoptimized
      className="m-auto" 
/>  
      </Link>
    </CardHeader>
    <CardContent className="p-4 grid gap-3 text-left">
      <div className="text-xs"> {product.category} </div>
      <Link href={`/product/${product.slug}`}>
      <h2 className="text-md font-medium">{product.name}</h2></Link>
      <div className="flex justify-between gap-4"><p>{product.rating} Stars</p>
      {product.stock > 0 ? (
        <ProductPrice value={Number(product.price)} />
      ) : (
        <p className="text-destructive">Out of stock</p>
      )}
      </div>
      </CardContent>    
   </Card>
  )
}