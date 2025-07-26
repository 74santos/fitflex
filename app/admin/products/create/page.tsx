import { Metadata } from "next"
import ProductForm from "@/components/admin/product-form"

export const metadata: Metadata = {
  title: "Create Product",
}

export default function createProductPage() {
  return (
    <div>
      <h2 className="font-bold text-3xl">Create Product</h2>
      <div className="my-8">
        <ProductForm type="Create" />
      </div>
      </div>
  )
}