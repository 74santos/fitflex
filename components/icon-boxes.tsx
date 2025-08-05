import { BadgeDollarSign,  Headset, ShoppingBag, WalletCards } from "lucide-react"
import {Card, CardContent } from "./ui/card"

const IconBoxes = () => {
  return (<div>
    <Card > 
      <CardContent className="grid md:grid-cols-4 gap-26 p-4 text-left mx-auto">
        <div className="space-y-2 ">
          <ShoppingBag/>
          <div className="text-sm text-bold">Free Shipping</div>
          <div className="text-xs text-muted-foreground">Free shipping on orders over $100</div>
        </div>
        <div className="space-y-2">
          <BadgeDollarSign/>
          <div className="text-sm text-bold">Money Back Guarantee</div>
          <div className="text-xs text-muted-foreground">Within 30 days of purchase</div>
        </div>
        <div className="space-y-2">
          <WalletCards/>
          <div className="text-sm text-bold">Flexible Payment</div>
          <div className="text-xs text-muted-foreground">Pay with credit card, PayPal or COD</div>
        </div>
        <div className="space-y-2">
          <Headset/>
          <div className="text-sm text-bold">24/7 Support</div>
          <div className="text-xs text-muted-foreground">Get support at any time</div>
        </div>
      </CardContent>
    </Card>
    </div>)
  }

export default IconBoxes