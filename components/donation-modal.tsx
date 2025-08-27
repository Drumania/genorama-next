"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Coffee, Gift, Sparkles } from "lucide-react"
import { createDonation } from "@/lib/supabase/actions"
import { useRouter } from "next/navigation"
import type { Profile } from "@/lib/types"

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
  recipient: Profile
}

const PRESET_AMOUNTS = [
  { amount: 5, label: "Café", icon: Coffee, description: "Un café para el artista" },
  { amount: 10, label: "Apoyo", icon: Heart, description: "Muestra tu apoyo" },
  { amount: 25, label: "Fan", icon: Gift, description: "Eres un gran fan" },
  { amount: 50, label: "Súper Fan", icon: Sparkles, description: "Apoyo increíble" },
]

export function DonationModal({ isOpen, onClose, recipient }: DonationModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const finalAmount = selectedAmount || Number.parseFloat(customAmount) || 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (finalAmount <= 0) {
      setError("Por favor selecciona un monto válido")
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append("recipientId", recipient.id)
      formData.append("amount", finalAmount.toString())
      formData.append("message", message)
      formData.append("isAnonymous", isAnonymous.toString())

      const result = await createDonation(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          setSuccess(false)
          setSelectedAmount(null)
          setCustomAmount("")
          setMessage("")
          setIsAnonymous(false)
        }, 2000)
      }
    })
  }

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">¡Donación exitosa!</h3>
            <p className="text-muted-foreground">
              Tu donación de ${finalAmount} ha sido enviada a {recipient.display_name}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Apoyar a {recipient.display_name}
          </DialogTitle>
          <DialogDescription>
            Tu donación ayuda a {recipient.display_name} a seguir creando música increíble
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preset Amounts */}
          <div>
            <Label className="text-base font-medium mb-3 block">Selecciona un monto</Label>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_AMOUNTS.map((preset) => {
                const Icon = preset.icon
                return (
                  <Card
                    key={preset.amount}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedAmount === preset.amount ? "ring-2 ring-primary bg-primary/5" : ""
                    }`}
                    onClick={() => {
                      setSelectedAmount(preset.amount)
                      setCustomAmount("")
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">${preset.amount}</div>
                      <div className="text-xs text-muted-foreground">{preset.label}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <Label htmlFor="customAmount">O ingresa un monto personalizado</Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="customAmount"
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                className="pl-8"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setSelectedAmount(null)
                }}
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Mensaje (opcional)</Label>
            <Textarea
              id="message"
              placeholder={`Escribe un mensaje para ${recipient.display_name}...`}
              className="mt-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
            />
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <Label htmlFor="anonymous" className="text-sm">
              Donar de forma anónima
            </Label>
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          {/* Summary */}
          {finalAmount > 0 && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Total a donar:</span>
                <span className="text-lg font-semibold text-primary">${finalAmount}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || finalAmount <= 0} className="flex-1">
              {isPending ? "Procesando..." : `Donar $${finalAmount}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
