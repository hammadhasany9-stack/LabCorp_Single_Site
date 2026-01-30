"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, CheckCircle, ArrowLeft } from "lucide-react"
import { useSessionContext } from "@/lib/hooks/useSessionContext"
import { getProfileByUserId } from "@/lib/data/mockProfiles"
import { ProfileFormData, profileFormSchema, UserProfile } from "@/lib/types/profile"
import { formatPhoneNumber } from "@/lib/utils/phoneFormatter"
import { Navbar } from "@/components/Navbar"
import { FormSection } from "@/components/form/FormSection"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useSessionContext()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState("")
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState("")

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
    defaultValues: {
      phoneNumber: '',
    }
  })

  // Load profile data
  useEffect(() => {
    if (!authLoading && user) {
      // Get profile based on user ID
      const userProfile = getProfileByUserId(user.id)
      
      if (userProfile) {
        setProfile(userProfile)
        setOriginalPhoneNumber(userProfile.phoneNumber)
        form.setValue('phoneNumber', userProfile.phoneNumber)
      }
      
      setIsLoading(false)
    } else if (!authLoading && !user) {
      // Redirect to signin if not authenticated
      router.push('/auth/signin')
    }
  }, [authLoading, user, router, form])

  // Check if form has changes
  const phoneNumber = form.watch('phoneNumber')
  const hasChanges = phoneNumber !== originalPhoneNumber

  const onSubmit = (data: ProfileFormData) => {
    try {
      // Simulate API call
      console.log('Saving profile:', data)
      
      // Update profile data
      if (profile) {
        const updatedProfile = {
          ...profile,
          phoneNumber: data.phoneNumber,
        }
        setProfile(updatedProfile)
        setOriginalPhoneNumber(data.phoneNumber)
      }
      
      // Show success message
      setSuccessMessage("Profile updated successfully")
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleCancel = () => {
    form.setValue('phoneNumber', originalPhoneNumber)
  }

  const handlePhoneNumberChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    form.setValue('phoneNumber', formatted, { 
      shouldValidate: true,
      shouldDirty: true 
    })
  }

  // Loading state
  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
        <Navbar title="Profile" />
        <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10">
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <Navbar title="Profile" />
      
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
            Profile
          </h1>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            View and manage your account details
          </p>
        </div>
        
        <Separator className="mb-8" />

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Account Information Section */}
            <FormSection
              title="Account Information"
              description="Your basic account details"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* First Name - Locked */}
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    First Name
                    <Lock className="h-3 w-3 text-gray-400" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      value={profile.firstName}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    This field cannot be edited
                  </FormDescription>
                </FormItem>

                {/* Last Name - Locked */}
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Last Name
                    <Lock className="h-3 w-3 text-gray-400" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      value={profile.lastName}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    This field cannot be edited
                  </FormDescription>
                </FormItem>
              </div>

              {/* Email - Locked */}
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Email Address
                  <Lock className="h-3 w-3 text-gray-400" />
                </FormLabel>
                <FormControl>
                  <Input
                    value={profile.email}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  This field cannot be edited
                </FormDescription>
              </FormItem>

              {/* Customer Name - Locked */}
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Customer Name
                  <Lock className="h-3 w-3 text-gray-400" />
                </FormLabel>
                <FormControl>
                  <Input
                    value={profile.customerName}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  This field cannot be edited
                </FormDescription>
              </FormItem>
            </FormSection>

            {/* Contact Information Section */}
            <FormSection
              title="Contact Information"
              description="Update your contact details"
            >
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => handlePhoneNumberChange(e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </FormControl>
                    <FormDescription>
                      Format: (XXX) XXX-XXXX
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            {/* Billing Address Section */}
            <FormSection
              title="Billing Address"
              description="Your billing information on file"
            >
              {/* Address Line 1 - Locked */}
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Address Line 1
                  <Lock className="h-3 w-3 text-gray-400" />
                </FormLabel>
                <FormControl>
                  <Input
                    value={profile.billingAddress.address1}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  This field cannot be edited
                </FormDescription>
              </FormItem>

              {/* Address Line 2 - Locked */}
              {profile.billingAddress.address2 && (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Address Line 2
                    <Lock className="h-3 w-3 text-gray-400" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      value={profile.billingAddress.address2}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    This field cannot be edited
                  </FormDescription>
                </FormItem>
              )}

              {/* City, State, ZIP - Locked */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    City
                    <Lock className="h-3 w-3 text-gray-400" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      value={profile.billingAddress.city}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    This field cannot be edited
                  </FormDescription>
                </FormItem>

                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    State
                    <Lock className="h-3 w-3 text-gray-400" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      value={profile.billingAddress.state}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    This field cannot be edited
                  </FormDescription>
                </FormItem>

                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    ZIP Code
                    <Lock className="h-3 w-3 text-gray-400" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      value={profile.billingAddress.zipcode}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    This field cannot be edited
                  </FormDescription>
                </FormItem>
              </div>

              {/* Country - Locked */}
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Country
                  <Lock className="h-3 w-3 text-gray-400" />
                </FormLabel>
                <FormControl>
                  <Input
                    value={profile.billingAddress.country}
                    disabled
                    className="bg-gray-100 dark:bg-gray-800"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  This field cannot be edited
                </FormDescription>
              </FormItem>
            </FormSection>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={!hasChanges}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!hasChanges || !form.formState.isValid}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
