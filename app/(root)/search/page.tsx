import ProductCard from "@/components/shared/product/product-card"
import { Button } from "@/components/ui/button"
import { getAllCategories, getAllProducts } from "@/lib/actions/product.actions"
import Link from "next/link"


const prices = [
  {
    name: "$10 to $299",
    value: "0-299"
  },

  {
    name: "$300 to $1499",
    value: "300-1499"
  },
  {
    name: "$1500 to $1999",
    value: "1500-1999"
  },
  {
    name: "$2000+",
    value: "2000-4000"
  }
]

const ratings = [4, 3, 2, 1]

const sortOrders = ['newest', 'lowest', 'highest', 'rating']

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>
}) {

  const {
    q = '',
    category = '',
    price = '',
    rating = '',
  } = await props.searchParams

const isQuerySet = q && q !== 'all' && q.trim() !== ''
const isCategorySet = category && category !== 'all' && category.trim() !== ''
const isPriceSet = price && price !== 'all' && price.trim() !== ''
const isRatingSet = rating && rating !== 'all' && rating.trim() !== ''

 if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Search ${isQuerySet ? q : ''} 
      ${isCategorySet ? category : ''} 
      ${isPriceSet ? price : ''} 
      ${isRatingSet ? rating : ''}` ,
    }
  } else {
    return {
    title: 'Search',
  }
  } 
}

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

 const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5 mt-5 wrapper">
      <div className="filter-links">
         {/* Category links */}
        <div className="text-xl mb-2 mt-3">Department</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link className={`${(category === 'all' || category === '') && 'font-bold'}`} href={getFilterUrl({c:'all'})} >Any</Link>
            </li>           
              {categories.map((x) => (
                <li key={x.category} > 
                  <Link className={`${category === x.category && 'font-bold'}`} href=
                  {getFilterUrl({c: x.category})}>
                    {x.category}
                  </Link>
                </li>
              ))}
           
          </ul>
        </div>

         {/* Price links */}
         <div className="text-xl mb-2 mt-8">Price</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link className={`${price === 'all'  && 'font-bold'}`} href={getFilterUrl({p:'all'})} >Any</Link>
            </li>           
              {prices.map((p) => (
                <li key={p.value} > 
                  <Link className={`${price === p.value && 'font-bold'}`} href=
                  {getFilterUrl({p: p.value})}>
                    {p.name}
                  </Link>
                </li>
              ))}
           
          </ul>
        </div>

         {/* Rating links */}
         <div className="text-xl mb-2 mt-8">Customer Rating</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link className={`${rating === 'all'  && 'font-bold'}`} href={getFilterUrl({r:'all'})} >Any</Link>
            </li>           
              {ratings.map((r) => (
                <li key={r} > 
                  <Link className={`${rating === r.toString() && 'font-bold'}`} href=
                  {getFilterUrl({r: `${r}`})}>
                    {r} Stars & Up
                  </Link>
                </li>
              ))}           
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex justify-between items-center flex-col md:flex-row my-4">
        <div className="flex items-center gap-10 my-4">
          {!!(q && q !== 'all') && <p>Query: <span className="font-semibold">{q}</span></p>}
          {!!(category && category !== 'all') && <p>Category: <span className="font-semibold">{category}</span></p>}
          {!!(price && price !== 'all') && <p>Price: <span className="font-semibold">{price}</span></p>}
          {!!(rating && rating !== 'all') && <p>Rating: <span className="font-semibold">{rating} Stars & Up</span></p>}
          {!!(q || category || price || rating) && (
            <Button variant="link" asChild>
              <Link href="/search">Clear Filters</Link>
            </Button>
          )}
        </div>

       <div>
        {/* SORT */}
        Sort by{' '}
        {sortOrders.map((s) => (
          <Link key={s} className={`mx-2 ${sort == s && 'font-bold'}`} href={getFilterUrl({s})}>
            {s}
          </Link>
        ))}
       </div>

        </div>
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