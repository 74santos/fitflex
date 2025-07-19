import { generateAccessToken, paypal } from "../lib/paypal";

// Test to generate access token from paypal
test('generates token from paypal', async () => {
  const token = await generateAccessToken()
  console.log(token)
  expect(typeof token).toBe('string')
  expect(token.length).toBeGreaterThan(0)
})

// Test to create order from paypal
test('create order from paypal', async () => {
  // const token = await generateAccessToken()
  const price = 10.0

  const order = await paypal.createOrder(price)
  console.log(order) 

  expect(order).toHaveProperty('id')
  expect(order).toHaveProperty('status')
  expect(order.status).toBe('CREATED')
})

// Test to capture payment with mock order
test('capture payment with mock order', async () => {
  const orderId = '100'

  const mockCapturePayment = jest
  .spyOn(paypal, 'capturePayment')
  .mockResolvedValue({ status: 'COMPLETED' })

  const result = await paypal.capturePayment(orderId)
  expect(result).toHaveProperty('status','COMPLETED')

  mockCapturePayment.mockRestore()
})