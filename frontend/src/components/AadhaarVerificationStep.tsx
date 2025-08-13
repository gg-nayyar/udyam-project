"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { type AadhaarFormData, VALIDATION_PATTERNS } from "./form-types"

interface AadhaarVerificationStepProps {
  data: AadhaarFormData
  onDataChange: (data: AadhaarFormData) => void
  onNext: () => void
}

export default function AadhaarVerificationStep({ data, onDataChange, onNext }: AadhaarVerificationStepProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleInputChange = (field: keyof AadhaarFormData, value: string | boolean) => {
    onDataChange({ ...data, [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const validateAndProceed = () => {
    const newErrors: { [key: string]: string } = {}

    if (!data.aadhaarNumber) {
      newErrors.aadhaarNumber = "Aadhaar number is required"
    } else if (!VALIDATION_PATTERNS.AADHAAR.test(data.aadhaarNumber)) {
      newErrors.aadhaarNumber = "Please enter a valid 12-digit Aadhaar number"
    }

    if (!data.entrepreneurName.trim()) {
      newErrors.entrepreneurName = "Name is required"
    }

    if (!data.consent) {
      newErrors.consent = "You must provide consent to proceed"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onNext()
    }
  }

  return (
    <Card>
      <CardHeader className="bg-blue-600 text-white">
        <h3 className="text-lg font-medium">Aadhaar Verification With OTP</h3>
      </CardHeader>
      <CardContent className="p-6">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">
            Your Aadhaar has been successfully verified. You can continue Udyam Registration process.
          </p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Aadhaar Number */}
          <div className="space-y-2">
            <Label htmlFor="aadhaar" className="text-sm font-medium text-gray-700">
              1. Aadhaar Number/ आधार संख्या
            </Label>
            <Input
              id="aadhaar"
              type="text"
              placeholder="Your Aadhaar No"
              value={data.aadhaarNumber}
              onChange={(e) => handleInputChange("aadhaarNumber", e.target.value.replace(/\D/g, "").slice(0, 12))}
              className={`${errors.aadhaarNumber ? "border-red-500" : ""}`}
              maxLength={12}
            />
            {errors.aadhaarNumber && <p className="text-red-500 text-sm">{errors.aadhaarNumber}</p>}
          </div>

          {/* Entrepreneur Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              2. Name of Entrepreneur / उद्यमी का नाम
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Name as per Aadhaar"
              value={data.entrepreneurName}
              onChange={(e) => handleInputChange("entrepreneurName", e.target.value)}
              className={`${errors.entrepreneurName ? "border-red-500" : ""}`}
            />
            {errors.entrepreneurName && <p className="text-red-500 text-sm">{errors.entrepreneurName}</p>}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Aadhaar number shall be required for Udyam Registration.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>
                The Aadhaar number shall be of the proprietor in the case of a proprietorship firm, of the managing
                partner in the case of a partnership firm and of a karta in the case of a Hindu Undivided Family (HUF).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                In case of a Company or a Limited Liability Partnership or a Cooperative Society or a Society or a
                Trust, the organisation or its authorised signatory shall provide its GSTIN(As per applicability of CGST
                Act 2017 and as notified by the ministry of MSME{" "}
                <a href="#" className="text-blue-600 underline hover:text-blue-800">
                  vide S.O. 1055(E) dated 05th March 2021
                </a>
                ) and PAN along with its Aadhaar number.
              </span>
            </li>
          </ul>
        </div>

        {/* Consent Checkbox */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={data.consent}
              onCheckedChange={(checked) => handleInputChange("consent", checked as boolean)}
              className={`mt-1 ${errors.consent ? "border-red-500" : ""}`}
            />
            <Label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
              I, the holder of the above Aadhaar, hereby give my consent to Ministry of MSME, Government of India, for
              using my Aadhaar number as allotted by UIDAI for Udyam Registration. NIC / Ministry of MSME, Government of
              India, have informed me that my aadhaar data will not be stored/shared. / मैं, आधार धारक, इस प्रकार उद्यम
              पंजीकरण के लिए यूआईडीएआई के साथ अपने आधार संख्या का उपयोग करने के लिए सूक्ष्म०म०उ० मंत्रालय, भारत सरकार को अपनी सहमति
              देता हूँ। एनआईसी / सूक्ष्म०म०उ० मंत्रालय, भारत सरकार ने मुझे सूचित किया है कि मेरा आधार डेटा संग्रहीत / साझा नहीं किया
              जाएगा।
            </Label>
          </div>
          {errors.consent && <p className="text-red-500 text-sm ml-8">{errors.consent}</p>}
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button onClick={validateAndProceed} className="bg-blue-600 hover:bg-blue-700 px-8">
            Verify Aadhaar & Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
