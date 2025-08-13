"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, MapPin, CheckCircle } from "lucide-react"
import { type AddressData, VALIDATION_PATTERNS } from "@/components/form-types"
import { on } from "events"

interface AddressVerificationStepProps {
  data: AddressData
  onDataChange: (data: AddressData) => void
  onPrevious: () => void
  onNext: () => void
}

interface PinCodeResponse {
  Status: string
  PostOffice?: Array<{
    Name: string
    District: string
    State: string
    Country: string
  }>
  Message?: string
}

export default function AddressVerificationStep({ data, onDataChange, onPrevious, onNext }: AddressVerificationStepProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [autoFilled, setAutoFilled] = useState(false)

  const handleInputChange = (field: keyof AddressData, value: string) => {
    onDataChange({ ...data, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }

    // Reset auto-fill status when PIN code changes
    if (field === "pinCode") {
      setAutoFilled(false)
    }
  }

  // Auto-fill city and state based on PIN code
  const fetchLocationFromPinCode = async (pinCode: string) => {
    if (!VALIDATION_PATTERNS.PINCODE.test(pinCode)) return

    setIsLoading(true)
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`)
      const result: PinCodeResponse[] = await response.json()

      if (
        result[0] &&
        result[0].Status === "Success" &&
        Array.isArray(result[0].PostOffice) &&
        result[0].PostOffice.length > 0
      ) {
        const location = result[0].PostOffice[0]
        onDataChange({
          ...data,
          pinCode,
          city: location.District,
          state: location.State,
        })
        setAutoFilled(true)
      } else {
        setErrors({ ...errors, pinCode: "Invalid PIN code or location not found" })
      }
    } catch (error) {
      console.error("Error fetching location:", error)
      setErrors({ ...errors, pinCode: "Failed to fetch location details" })
    } finally {
      setIsLoading(false)
    }
  }

  // Debounced PIN code lookup
  useEffect(() => {
    if (data.pinCode.length === 6) {
      const timer = setTimeout(() => {
        fetchLocationFromPinCode(data.pinCode)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [data.pinCode])

  const validateAndSubmit = () => {
    const newErrors: { [key: string]: string } = {}

    if (!data.pinCode) {
      newErrors.pinCode = "PIN code is required"
    } else if (!VALIDATION_PATTERNS.PINCODE.test(data.pinCode)) {
      newErrors.pinCode = "Please enter a valid 6-digit PIN code"
    }

    if (!data.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!data.state.trim()) {
      newErrors.state = "State is required"
    }

    if (!data.address.trim()) {
      newErrors.address = "Address is required"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      alert("Udyam Registration completed successfully!")
    }
  }

  return (
    <Card>
      <CardHeader className="bg-purple-600 text-white">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Address Verification
        </h3>
      </CardHeader>
      <CardContent className="p-6">
        {/* PIN Code Auto-fill Feature Info */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-purple-800 mb-1">Smart Address Auto-fill</h4>
              <p className="text-sm text-purple-700">
                Enter your 6-digit PIN code and we'll automatically fill in your city and state details.
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 mb-6">
          {/* PIN Code with Auto-fill */}
          <div className="space-y-2">
            <Label htmlFor="pinCode" className="text-sm font-medium text-gray-700">
              5. PIN Code / पिन कोड
            </Label>
            <div className="relative">
              <Input
                id="pinCode"
                type="text"
                placeholder="Enter 6-digit PIN code"
                value={data.pinCode}
                onChange={(e) => handleInputChange("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                className={`${errors.pinCode ? "border-red-500" : ""} ${autoFilled ? "border-green-500" : ""} max-w-xs`}
                maxLength={6}
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-purple-600" />
              )}
              {autoFilled && !isLoading && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
              )}
            </div>
            {errors.pinCode && <p className="text-red-500 text-sm">{errors.pinCode}</p>}
            {autoFilled && (
              <p className="text-green-600 text-sm flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Location details auto-filled successfully
              </p>
            )}
          </div>

          {/* City and State (Auto-filled) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                6. City / District / शहर
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="City will be auto-filled"
                value={data.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={`${errors.city ? "border-red-500" : ""} ${autoFilled ? "bg-green-50 border-green-300" : ""}`}
                readOnly={autoFilled}
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                7. State / राज्य
              </Label>
              <Input
                id="state"
                type="text"
                placeholder="State will be auto-filled"
                value={data.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className={`${errors.state ? "border-red-500" : ""} ${autoFilled ? "bg-green-50 border-green-300" : ""}`}
                readOnly={autoFilled}
              />
              {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
            </div>
          </div>

          {/* Full Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              8. Complete Address / पूरा पता
            </Label>
            <textarea
              id="address"
              placeholder="Enter your complete address including house/building number, street, area, etc."
              value={data.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={`w-full min-h-[100px] px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              rows={4}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button onClick={onPrevious} variant="outline" className="bg-transparent">
            ← Back to PAN Verification
          </Button>
          <Button onClick={() => { validateAndSubmit(); onNext(); }} className="bg-purple-600 hover:bg-purple-700 px-8">
            Complete Registration
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
