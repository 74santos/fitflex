import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import ProductPrice from "@/components/shared/product/product-price";
import ProductImages from "@/components/shared/product/product-images";
import AddToCart from "@/components/shared/product/add-to-cart";
import { getCart } from "@/lib/actions/cart.actions";
import ReviewList from "./review-list";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Rating from "@/components/shared/product/rating";


export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) {
    return notFound();
  }

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const cart = await getCart();

  return (
    <div className="wrapper my-4">
      <section>
        <div className="grid grid-col-1 md:grid-cols-5">
          {/*Images Column*/}
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
          {/* Details Column */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-5">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <Rating value={Number(product.rating)}/>
              <p>{product.numReviews} reviews</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-24 text-center rounded-sm bg-sky-50 text-slate-900 px-2 py-2"
                />
              </div>
            </div>
            <div className="mt-8">
              <p className="font-semibold">Description </p>
              <p>{product.description}</p>
            </div>
          </div>
          {/* Action Column */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <AddToCart
                    cart={cart}
                    item={{
                      productId: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: product.price,
                      qty: 1,
                      image: product.images![0],
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="font-bold text-2xl">Customer Reviews</h2>
        <ReviewList
         userId={userId || ''}
         productId={product.id}
         productSlug={product.slug}
        />
      </section>
    </div>
  );
}
