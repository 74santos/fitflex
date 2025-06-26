

import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";  


export  default async function Home() {
  const latestProducts = await getLatestProducts();

  return (
    <main >
      <div className="text-center ">
      <h1 className="text-5xl font-bold  font-mono mb-4 ">FitFlex</h1>
      <p>Gear up. Power up. Feel the Flex.</p>

      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
      </div>
    </main>
  );
}   