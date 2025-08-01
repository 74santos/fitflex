const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com"

export const paypal = {
  createOrder: async function createOrder(price: number) {
    const accessToken = await generateAccessToken()
    const url =`${base}/v2/checkout/orders`
    
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: price } }],
      }),
    })
      return handleResponse(res)
  },

  capturePayment: async function capturePayment(orderId: string) {
    const accessToken = await generateAccessToken()
    const url = `${base}/v2/checkout/orders/${orderId}/capture`
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
    return handleResponse(res)
  },
   
}

// Get OAuth Token
export async function generateAccessToken() {
 
  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`
  ).toString("base64")

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

    const data = await handleResponse(res)
    return data.access_token
    
 
}



async function handleResponse(response: Response) {
  if (response.ok) {
    return response.json()
  } else {
    const errorMessage = await response.text()
    throw new Error(errorMessage)
  }
}