import ProductCard from "./product-card";
import { Product } from "@/types";

export default function ProductList({
   data, 
   title , 
   limit
  }: {
   data: Product[], 
   title?: string; 
   limit?: number
  }) {

  const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <div className="max-w-screen-xl my-10 px-7 mx-auto">
      <h2 className="font-bold text-3xl mb-8">{title}</h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {limitedData.map((product: Product) => (
          <ProductCard key={product.slug} product={product} />
        ))}

        </div>
      ) : (
        <div><p>No products found</p></div>
      )}
    </div>
  )

}