import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYENT_METHODS } from "./constants";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places"
  );
// Schema for inserting products

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  category: z.string().min(3, "Catergory must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, 'Id is required')
})


/// Scheme for signing users in

export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Cart Schemas

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Product slug is required"),
  qty: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .int("Quantity must be an integer")
    .nonnegative("Quantity must be a positive number")
    .min(1, "Must add at least 1 item"),
  image: z.string().min(1, "Product image is required"),
  price: currency,
  variant: z.string().optional(), // if you're using variants like size/color
  stock: z.number().optional(), // ✅ Make sure this exists
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required").nullable(), // ✅ allow null
  userId: z.string().optional().nullable(),
});

//Schema for the shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  streetAddress: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});


// Schema for the payment method
export const paymentMethodSchema = z.object({
  type: z
    .string()
    .min(1, "Payment method is required")
    .refine((val) => PAYENT_METHODS.includes(val), {
      message: "Invalid payment method",
    }),
})

// Schema for inserting order

export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User id is required"),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  shippingAddress: shippingAddressSchema,
  paymentMethod:z.string().refine((data) => PAYENT_METHODS.includes(data),{
    message: "Invalid payment method"
  })
})

// Schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  slug: z.string(),
  qty: z.number(),  
  image: z.string(),
  price: currency,
  // variant: z.string(), // if you're using variants like size/color
})

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  pricePaid: z.string(),
  email_address: z.string(),
})

// Schema for updating the user profile

export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  
})


// Schema to update users

export  const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "ID is required"),
  role: z.string().min(1, "Role is required"),

})

