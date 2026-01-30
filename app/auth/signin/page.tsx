"use client"

import { useState, useEffect, useRef } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Mail, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import Image from "next/image"
import logo from "@/assets/logo.png"
import logoWhite from "@/assets/labcorp_white.png"

type AuthStep = 'email' | 'otp'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const { resolvedTheme } = useTheme()
  
  // State management
  const [step, setStep] = useState<AuthStep>('email')
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  
  // Refs for auto-focus
  const emailInputRef = useRef<HTMLInputElement>(null)
  const otpInputRef = useRef<HTMLInputElement>(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      const callbackUrl = searchParams.get("callbackUrl") || "/"
      router.push(callbackUrl)
    }
  }, [status, router, searchParams])

  // Auto-focus on step change
  useEffect(() => {
    if (step === 'email' && emailInputRef.current) {
      emailInputRef.current.focus()
    } else if (step === 'otp' && otpInputRef.current) {
      otpInputRef.current.focus()
    }
  }, [step])

  // Email validation helper
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Handle email submission (Step 1)
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    
    if (!email) {
      setError("Please enter your email address")
      return
    }
    
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call to send OTP
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setStep('otp')
  }

  // Handle OTP verification (Step 2)
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    
    if (!otp) {
      setError("Please enter the OTP")
      return
    }
    
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call to verify OTP
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock validation: accept any 6-digit code for demo
    if (otp.length === 6) {
      // Call NextAuth signIn with mock credentials
      const result = await signIn("credentials", {
        email,
        password: "demo", // Mock password for prototype
        redirect: false,
      })
      
      if (!result?.error) {
        setSuccessMessage("Success! Redirecting...")
        // Brief delay to show success message
        await new Promise(resolve => setTimeout(resolve, 500))
        const callbackUrl = searchParams.get("callbackUrl") || "/"
        router.push(callbackUrl)
      } else {
        setError("Invalid OTP. Please try again.")
        setIsLoading(false)
      }
    } else {
      setError("Please enter a valid 6-digit OTP")
      setIsLoading(false)
    }
  }

  // Handle resend OTP
  const handleResendOTP = async () => {
    setError("")
    setSuccessMessage("")
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSuccessMessage("OTP has been resent to your email")
    setIsLoading(false)
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  // Handle back to email
  const handleBackToEmail = () => {
    setStep('email')
    setOtp("")
    setError("")
    setSuccessMessage("")
  }

  // Mask email for display
  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@')
    if (!localPart || !domain) return email
    
    const visibleChars = Math.min(3, localPart.length)
    const masked = localPart.substring(0, visibleChars) + '***'
    return `${masked}@${domain}`
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4 relative">
      {/* Theme Toggle Button - Top Right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          {/* Theme-aware Logo */}
          <div className="flex justify-center mb-2">
            <Image
              src={resolvedTheme === 'dark' ? logoWhite : logo}
              alt="Labcorp Logo"
              width={180}
              height={60}
              className="h-auto"
              priority
            />
          </div>
          
          {/* Dynamic Title and Description based on step */}
          {step === 'email' ? (
            <>
              <CardTitle className="text-2xl text-center font-semibold">Welcome to Labcorp</CardTitle>
              <CardDescription className="text-center text-md">
                Enter your email address to continue
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-2xl text-center font-semibold">Verify Your Email</CardTitle>
              <CardDescription className="text-center">
                We've sent a one-time passcode to <strong>{maskEmail(email)}</strong>
              </CardDescription>
            </>
          )}
        </CardHeader>
        
        <CardContent>
          {/* Step 1: Email Entry */}
          {step === 'email' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    ref={emailInputRef}
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    autoComplete="email"
                    aria-label="Email address"
                  />
                </div>
              </div>

              {/* Continue Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={!email || isLoading}
              >
                {isLoading ? "Sending OTP..." : "Continue"}
              </Button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800 dark:text-green-200">{successMessage}</p>
                </div>
              )}

              {/* OTP Input */}
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Passcode</Label>
                <Input
                  ref={otpInputRef}
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setOtp(value)
                  }}
                  maxLength={6}
                  disabled={isLoading}
                  autoComplete="one-time-code"
                  aria-label="One-time passcode"
                  className="text-center text-lg tracking-widest"
                />
              </div>

              {/* Verify Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={otp.length !== 6 || isLoading}
              >
                {isLoading ? (successMessage ? "Success! Redirecting..." : "Verifying...") : "Verify OTP"}
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Resend OTP
                </Button>
              </div>

              {/* Back to Email */}
              <div className="text-center pt-2">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleBackToEmail}
                  disabled={isLoading}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Use a different email
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
