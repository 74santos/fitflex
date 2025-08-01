import ProductCard from "@/components/shared/product/product-card"
import { getAllProducts } from "@/lib/actions/product.actions"

export default async function SearchPage(props: {
  searchParams: Promise<{
    category: string,
    q?: string,
    price?: string,
    rating?: string,
    sort?: string,
    page?: string
  }>
}) {

   const { 
    category = '',
    q = '',
    price = '',
    rating = '',
    sort = 'newest',
    page = '1',
    } = await props.searchParams


    //Construct filter url
    const getFilterUrl = ({
      c,
      s,
      p,
      r,
      pg
    }: {
      c?: string
      s?: string
      p?: string
      r?: string
      pg?: string
    }) => {
      const params = { q, category, price, rating, sort, page}

      if (c) params.category = c;
      if (s) params.sort = s;
      if (p) params.price = p;
      if (r) params.rating = r;
      if (pg) params.page = pg;
      return `/search?${new URLSearchParams(params).toString()}`
    }
    

 const products = await getAllProducts({
   query: q ,
    category: category ,
    price: price ,
    rating: rating ,
    sort,
    page: Number(page),
 })

  return (
    <div className="grid md:grid-cols-5 md:gap-5 mt-5 wrapper">
      <div className="filter-links">
         {/* FILTERS */}
         URL: {getFilterUrl({c: 'Cardio Equipment'})}
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          { products.data.length === 0 && <div>No Product Found</div> }
          { products.data.map((product) => (
           <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}