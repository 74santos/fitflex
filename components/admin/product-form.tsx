'use client'

import { productDefaultValues } from "@/lib/constants"
import { insertProductSchema, updateProductSchema } from "@/lib/validators"
import { Product } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import slugify from "slugify"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { createProduct, updateProduct } from "@/lib/actions/product.actions"
import { UploadButton } from "@/lib/uploadthing"
import { Card, CardContent } from "../ui/card"
import Image from "next/image"
import { Checkbox } from "../ui/checkbox"

export default function ProductForm({type, product, productId}:{
  type: "Create" | "Update",
  product?: Product,
  productId?: string
}) {

  const router = useRouter()
  
  const form = useForm<z.infer<typeof insertProductSchema> >({
    resolver: zodResolver(type === 'Update' ? updateProductSchema : insertProductSchema),
    defaultValues: type === 'Update' && product ? product : productDefaultValues,
  })

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (values) => {
    // On Create
    if(type === 'Create') {
      const res = await createProduct(values)

      if(!res.success) {
        toast.error(res.message)  
      }else {
        toast.success(res.message)       
      }
      router.push('/admin/products')
    }

    // On Update
    if(type === 'Update') {
      if (!productId) {
        router.push('/admin/products')
        return
      }

      const res = await updateProduct({...values, id:productId })

      if(!res.success) {
        toast.error(res.message)  
      }else {
        toast.success(res.message)       
      }
      router.push('/admin/products')
    }
  }

  const images = form.watch('images')
  const isFeatured = form.watch('isFeatured')
  const banner = form.watch('banner')

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Name */}
          <FormField
          control={form.control}
          name='name'
          render={({ field}: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'name'>}) => (
            <FormItem className="w-full ">
              <FormLabel className="md:pt-6">Name</FormLabel>
              <FormControl >
                <Input {...field} placeholder="Enter product name" className="md:mb-10"  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          {/* Slug */}
          <FormField
          control={form.control}
          name='slug'
          render={({ field}: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'slug'>}) => (
            <FormItem className="w-full mt-6 gap-3">
              <FormLabel>Slug</FormLabel>
              <FormControl >
                <div className="relative">
                <Input {...field} placeholder="Enter slug"/>
                <Button 
                type='button' 
                onClick= {() => {
                  form.setValue('slug', slugify(form.getValues('name'), { lower: true }))
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2 cursor-pointer" >Generate</Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          {/* Category */}
          <FormField
          control={form.control}
          name='category'
          render={({ field}: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'category'>}) => (
            <FormItem className="w-full">
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter category"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          {/* Brand */}
          <FormField
          control={form.control}
          name='brand'
          render={({ field}: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'brand'>}) => (
            <FormItem className="w-full">
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter brand name"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          {/* Price */}
          <FormField
          control={form.control}
          name='price'
          render={({ field}: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'price'>}) => (
            <FormItem className="w-full">
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter price"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          {/* Stock */}
          <FormField
          control={form.control}
          name='stock'
          render={({ field}: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'stock'>}) => (
            <FormItem className="w-full">
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter stock" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        </div>


 {/* Images */}
         {/* ---- Images Upload & Management ---- */}
  <div className="upload-field flex flex-col md:flex-row gap-5">
    <FormField
      control={form.control}
      name="images"
      render={() => (
        <FormItem className="w-full">
          <FormLabel>Images</FormLabel>
          <Card className="rounded-md">
            <CardContent className="space-y-2 mt-2 min-h-48">
              <div className="flex flex-wrap gap-4">
                {images.map((url, idx) => (
                  <div key={url} className="relative group w-24 h-24 ">
                    <Image
                      src={url}
                      alt={`Image ${idx + 1}`}
                      width={100}
                      height={100}
                      className="object-cover rounded-md"
                      unoptimized
                    />
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        form.setValue(
                          "images",
                          images.map((v, i) => (i === idx ? res[0].ufsUrl : v))
                        );
                        toast.success("Image replaced");
                      }}
                      onUploadError={(err) => void toast.error(`Upload failed: ${err.message}`)}
                      className="absolute inset-0 opacity-0 group-hover:opacity-80   bg-black/30 cursor-pointer rounded-md "
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        const key = url.split("/").pop();
                        await fetch("/api/remove-image", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ key }),
                        });
                        form.setValue(
                          "images",
                          images.filter((_, i) => i !== idx)
                        );
                        toast.success("Image deleted");
                      }}
                      className="absolute top-0 right-0 bg-red-300 text-white  rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) =>
                    form.setValue("images", [...images, res[0].ufsUrl])
                  }
                  onUploadError={(err) => {
                    toast.error(`Upload failed: ${err.message}`);
                    return;
                  }}
                  className="w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer "
                />
              </div>
            </CardContent>
          </Card>
        </FormItem>
      )}
    />
  </div>

  {/* ---- Featured Banner Section ---- */}
  <div className="upload-field ">
    <FormField
      control={form.control}
      name="isFeatured"
      render={({ field }) => (
        <FormItem className="flex space-x-2 items-center">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormLabel>Is Featured?</FormLabel>
        </FormItem>
      )}
    />

    {isFeatured && (
      <Card>
        <CardContent className="space-y-2 mt-2">
          <div className="relative w-full h-40 rounded-md overflow-hidden group">
            {banner && (
              <Image
                src={banner}
                alt="Banner image"
                fill
                className="object-cover"
                unoptimized
              />
            )}
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                form.setValue("banner", res[0].ufsUrl);
                toast.success("Banner updated");
              }}
              onUploadError={(err) => {
                toast.error(`Upload failed: ${err.message}`);
                return;
              }}
              className="absolute inset-0 opacity-0 group-hover:opacity-80 bg-black/30 cursor-pointer"
            />
            {banner && (
              <button
                type="button"
                onClick={async () => {
                  const key = banner.split("/").pop();
                  await fetch("/api/remove-image", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ key }),
                  });
                  form.setValue("banner", "");
                  toast.success("Banner deleted");
                }}
                className="absolute top-2 right-2 bg-red-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
              >
                ×
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    )}
  </div>
        <div>
          {/* Description */}
          <FormField
          control={form.control}
          name='description'
          render={({ field}: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'description'>}) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter product description" className="resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        </div>
        <div>
          {/* Submit */}
          <Button 
          type="submit"
          size='lg'
          disabled={form.formState.isSubmitting}
          className='button col-span-2 w-full cursor-pointer'        
          >
            { form.formState.isSubmitting ? 'Submitting' : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  )
}