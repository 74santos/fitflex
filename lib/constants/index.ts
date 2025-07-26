

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "FitFlex"
export const APP_DESCRIPTION = "Gear up. Power up. Feel the Flex."

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"

export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: '',
  password: '',
}

export const shippingAddressDefaultValues = {
  fullName: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: '',
}

export const PAYENT_METHODS= process.env.PAYMENT_METHODS
? process.env.PAYMENT_METHODS.split(',').map((s) => s.trim())
: ['PayPal', 'Stripe', 'CashOnDelivery'];

export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;


export const productDefaultValues = {
  name: '',
  slug: '',
  category: '',
  images: [],
  brand: '',
  description: '',
  price: '0',        
  stock: 0,        
  rating: '0',       
  numReviews: '0', 
  isFeatured: false,
  banner: null,
}


export const USER_ROLES = process.env.USER_ROLES 
? process.env.USER_ROLES.split(',') 
: ['user', 'admin'];