
import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductsButton from "@/components/view-all-products";
import { getLatestProducts, getFeaturedProducts } from "@/lib/actions/product.actions";  
import IconBoxes from "@/components/icon-boxes";
import DealCountdown from "@/components/deal-countdown";


export  default async function Home() {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <main >
      <div className="text-center wrapper">
   {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts}/> }
      
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
      <ViewAllProductsButton />
      <DealCountdown />
      <IconBoxes />
 
      </div>
    </main>
  );
}   