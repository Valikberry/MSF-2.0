"use client"

import { useState } from "react"
import { CreditCard, Wallet } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface PaymentMethodFormProps {
  onPaymentMethodSelected: (method: string) => void
}

export default function PaymentMethodForm({ onPaymentMethodSelected }: PaymentMethodFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value)
    onPaymentMethodSelected(value)
  }

  return (
    <div className="space-y-6">
      <RadioGroup value={paymentMethod || ""} onValueChange={handlePaymentMethodChange} className="space-y-3">
        <div className="border rounded-lg overflow-hidden">
          <div className="flex items-start p-3 space-x-3">
            <RadioGroupItem value="credit-card" id="credit-card" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="credit-card" className="font-medium cursor-pointer flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Credit / Debit Card
              </Label>
            </div>
          </div>

          {paymentMethod === "credit-card" && (
            <div className="p-3 pt-0 pl-9">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="name-on-card">Name on Card</Label>
                  <Input id="name-on-card" placeholder="John Doe" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="flex items-start p-3 space-x-3">
            <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="paypal" className="font-medium cursor-pointer flex items-center">
                <div className="h-5 w-5 mr-2 relative">
                  <Image src="/placeholder.svg?height=20&width=20" alt="PayPal" width={20} height={20} />
                </div>
                PayPal
              </Label>
            </div>
          </div>

          {paymentMethod === "paypal" && (
            <div className="p-3 pt-0 pl-9">
              <p className="text-sm text-gray-600 mb-3">You will be redirected to PayPal to complete your payment.</p>
            </div>
          )}
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="flex items-start p-3 space-x-3">
            <RadioGroupItem value="momo" id="momo" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="momo" className="font-medium cursor-pointer flex items-center">
                <Wallet className="h-5 w-5 mr-2 text-pink-500" />
                Momo E-Wallet
              </Label>
            </div>
          </div>

          {paymentMethod === "momo" && (
            <div className="p-3 pt-0 pl-9">
              <p className="text-sm text-gray-600 mb-3">You will be redirected to Momo to complete your payment.</p>
            </div>
          )}
        </div>
      </RadioGroup>
    </div>
  )
}
