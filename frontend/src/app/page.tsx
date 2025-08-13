"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Menu, X } from "lucide-react"
import {
  type AadhaarFormData,
  type PANFormData,
  type AddressData,
  VALIDATION_PATTERNS,
  ORGANIZATION_TYPES,
} from "@/components/form-types"
import AadhaarVerificationStep from "@/components/AadhaarVerificationStep"
import AddressVerificationStep from "@/components/AddressVerificationStep"

export default function UdyamRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const totalSteps = 3
  const [aadhaarData, setAadhaarData] = useState<AadhaarFormData>({
    aadhaarNumber: "",
    entrepreneurName: "",
    consent: false,
  })
  const [panData, setPanData] = useState<PANFormData>({
    organizationType: "",
    panNumber: "",
    panHolderName: "",
    dateOfBirth: "",
    consent: false,
  })
  const [addressData, setAddressData] = useState<AddressData>({
    pinCode: "",
    city: "",
    state: "",
    address: "",
  })

  const handleFinalSubmit = async () => {
  const payload = {
    aadhaar: aadhaarData,
    pan: panData,
    address: addressData,
  };

  try {
    console.log(payload);
    const res = await fetch("https://udyam-project-backend.onrender.com/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log("Submission result:", result);

    if (result.ok) {
      alert(`Form submitted successfully! ID: ${result.id}`);
      setCurrentStep(1);
      setAadhaarData({ aadhaarNumber: "", entrepreneurName: "", consent: false });
      setPanData({ organizationType: "", panNumber: "", panHolderName: "", dateOfBirth: "", consent: false });
      setAddressData({ pinCode: "", address: "", state: "", city: "" });
      console.log("AADHAR DATA: ",aadhaarData);
      console.log("PAN DATA: ",panData);
      console.log("ADDRESS DATA: ",addressData);
    } else {
      alert("Submission failed. Please try again.");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while submitting.");
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <img
                src="/indian-government-emblem.png"
                alt="Government of India Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 flex-shrink-0"
              />
              <div className="text-xs sm:text-sm md:text-base min-w-0">
                <div className="font-medium truncate">सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय</div>
                <div className="text-blue-100 text-xs sm:text-sm truncate">
                  Ministry of Micro, Small & Medium Enterprises
                </div>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm">
              <a href="#" className="hover:text-blue-200 border-b-2 border-white pb-1 transition-colors">
                Home
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors">
                NIC Code
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors">
                Useful Documents ▼
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors">
                Print / Verify ▼
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors">
                Update Details ▼
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors">
                Login ▼
              </a>
            </nav>
          </div>

          {/* Mobile navigation menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-2 border-t border-blue-500 pt-4">
              <div className="flex flex-col space-y-3 text-sm">
                <a href="#" className="hover:text-blue-200 transition-colors">
                  Home
                </a>
                <a href="#" className="hover:text-blue-200 transition-colors">
                  NIC Code
                </a>
                <a href="#" className="hover:text-blue-200 transition-colors">
                  Useful Documents
                </a>
                <a href="#" className="hover:text-blue-200 transition-colors">
                  Print / Verify
                </a>
                <a href="#" className="hover:text-blue-200 transition-colors">
                  Update Details
                </a>
                <a href="#" className="hover:text-blue-200 transition-colors">
                  Login
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-6xl">
        {/* Improved mobile-responsive page title */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
          <h1 className="text-base sm:text-lg md:text-xl font-medium text-gray-800 leading-tight">
            UDYAM REGISTRATION FORM - For New Enterprise who are not Registered yet as MSME
          </h1>
        </div>

        {/* Enhanced mobile-responsive progress tracker */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-medium">Registration Progress</h2>
            <Badge variant="outline" className="text-xs sm:text-sm px-2 py-1">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${
                  currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <span
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  currentStep >= 1 ? "text-blue-600" : "text-gray-600"
                }`}
              >
                Aadhaar
              </span>
            </div>
            <div
              className={`flex-1 h-1 rounded mx-1 sm:mx-2 transition-colors ${currentStep > 1 ? "bg-blue-600" : "bg-gray-200"}`}
            />
            <div className="flex items-center gap-1 sm:gap-2">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${
                  currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  currentStep >= 2 ? "text-blue-600" : "text-gray-600"
                }`}
              >
                PAN
              </span>
            </div>
            <div
              className={`flex-1 h-1 rounded mx-1 sm:mx-2 transition-colors ${currentStep > 2 ? "bg-blue-600" : "bg-gray-200"}`}
            />
            <div className="flex items-center gap-1 sm:gap-2">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${
                  currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
              <span
                className={`text-xs sm:text-sm font-medium transition-colors ${
                  currentStep >= 3 ? "text-blue-600" : "text-gray-600"
                }`}
              >
                Address
              </span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-4 sm:space-y-6">
          {currentStep === 1 && (
            <AadhaarVerificationStep
              data={aadhaarData}
              onDataChange={setAadhaarData}
              onNext={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 2 && (
            <PANVerificationStep
              data={panData}
              onDataChange={setPanData}
              onNext={() => setCurrentStep(3)}
              onPrevious={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <AddressVerificationStep
              data={addressData}
              onDataChange={setAddressData}
              onPrevious={() => setCurrentStep(2)}
              onNext={handleFinalSubmit}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Enhanced mobile-responsive PAN verification step
function PANVerificationStep({
  data,
  onDataChange,
  onNext,
  onPrevious,
}: {
  data: PANFormData
  onDataChange: (data: PANFormData) => void
  onNext: () => void
  onPrevious: () => void
}) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleInputChange = (field: keyof PANFormData, value: string | boolean) => {
    onDataChange({ ...data, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const validateAndProceed = () => {
    const newErrors: { [key: string]: string } = {}

    if (!data.organizationType) {
      newErrors.organizationType = "Please select organization type"
    }

    if (!data.panNumber) {
      newErrors.panNumber = "PAN number is required"
    } else if (!VALIDATION_PATTERNS.PAN.test(data.panNumber)) {
      newErrors.panNumber = "Please enter a valid PAN number (e.g., ABCDE1234F)"
    }

    if (!data.panHolderName.trim()) {
      newErrors.panHolderName = "PAN holder name is required"
    }

    if (!data.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth/incorporation is required"
    } else if (!VALIDATION_PATTERNS.DATE.test(data.dateOfBirth)) {
      newErrors.dateOfBirth = "Please enter date in DD/MM/YYYY format"
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
    <Card className="shadow-md">
      <CardHeader className="bg-green-600 text-white">
        <h3 className="text-base sm:text-lg font-medium">PAN Verification</h3>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {/* Form Fields */}
        <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
          {/* Organization Type */}
          <div className="space-y-2">
            <Label htmlFor="orgType" className="text-sm font-medium text-gray-700">
              3. Type of Organisation / संगठन के प्रकार
            </Label>
            <Select
              value={data.organizationType}
              onValueChange={(value) => handleInputChange("organizationType", value)}
            >
              <SelectTrigger className={`${errors.organizationType ? "border-red-500" : ""} h-10 sm:h-11`}>
                <SelectValue placeholder="Type of Organisation / संगठन के प्रकार" />
              </SelectTrigger>
              <SelectContent>
                {ORGANIZATION_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="text-sm">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.organizationType && <p className="text-red-500 text-sm">{errors.organizationType}</p>}
          </div>

          {/* PAN Number and PAN Holder Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="pan" className="text-sm font-medium text-gray-700">
                4.1 PAN / पैन
              </Label>
              <Input
                id="pan"
                type="text"
                placeholder="ENTER PAN NUMBER"
                value={data.panNumber}
                onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase().slice(0, 10))}
                className={`${errors.panNumber ? "border-red-500" : ""} h-10 sm:h-11 text-sm sm:text-base`}
                maxLength={10}
              />
              {errors.panNumber && <p className="text-red-500 text-sm">{errors.panNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="panHolder" className="text-sm font-medium text-gray-700">
                4.1.1 Name of PAN Holder / पैन धारक का नाम
              </Label>
              <Input
                id="panHolder"
                type="text"
                placeholder="Name as per PAN"
                value={data.panHolderName}
                onChange={(e) => handleInputChange("panHolderName", e.target.value)}
                className={`${errors.panHolderName ? "border-red-500" : ""} h-10 sm:h-11 text-sm sm:text-base`}
              />
              {errors.panHolderName && <p className="text-red-500 text-sm">{errors.panHolderName}</p>}
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
              4.1.2 DOB or DOI as per PAN / पैन के अनुसार जन्म तिथि या निगमन तिथि
            </Label>
            <Input
              id="dob"
              type="text"
              placeholder="DD/MM/YYYY"
              value={data.dateOfBirth}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "")
                if (value.length >= 2) value = value.slice(0, 2) + "/" + value.slice(2)
                if (value.length >= 5) value = value.slice(0, 5) + "/" + value.slice(5, 9)
                handleInputChange("dateOfBirth", value)
              }}
              className={`${errors.dateOfBirth ? "border-red-500" : ""} max-w-xs h-10 sm:h-11 text-sm sm:text-base`}
              maxLength={10}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="panConsent"
              checked={data.consent}
              onCheckedChange={(checked) => handleInputChange("consent", checked as boolean)}
              className={`mt-1 ${errors.consent ? "border-red-500" : ""}`}
            />
            <Label htmlFor="panConsent" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
              I, the holder of the above PAN, hereby give my consent to Ministry of MSME, Government of India, for using
              my data/ information available in the Income Tax Returns filed by me, and also the same available in the
              GST Returns and also from other Government organizations, for MSME classification and other official
              purposes, in pursuance of the MSMED Act, 2006.
            </Label>
          </div>
          {errors.consent && <p className="text-red-500 text-sm ml-8">{errors.consent}</p>}
        </div>

        {/* Enhanced mobile-responsive action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
          <Button onClick={onPrevious} variant="outline" className="bg-transparent order-2 sm:order-1 w-full sm:w-auto">
            ← Back to Aadhaar Verification
          </Button>
          <Button
            onClick={validateAndProceed}
            className="bg-green-600 hover:bg-green-700 px-6 sm:px-8 order-1 sm:order-2 w-full sm:w-auto"
          >
            Continue to Address →
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
