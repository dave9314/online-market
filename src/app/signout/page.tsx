"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag, CheckCircle } from "lucide-react"

export default function SignOutPage() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // Show success checkmark after a moment
    const successTimer = setTimeout(() => {
      setShowSuccess(true)
    }, 800)

    // Redirect to home after showing success
    const redirectTimer = setTimeout(() => {
      router.push("/")
    }, 2000)

    return () => {
      clearTimeout(successTimer)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Logo with animation */}
        <div className="relative inline-block mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl shadow-2xl">
            <ShoppingBag className="h-12 w-12 text-white" />
          </div>
          
          {/* Success checkmark overlay */}
          {showSuccess && (
            <div className="absolute -top-2 -right-2 animate-bounce">
              <div className="bg-green-500 rounded-full p-2 shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          )}
        </div>
        
        {/* Message */}
        <div className="space-y-3 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {showSuccess ? "Signed Out Successfully!" : "Signing Out..."}
          </h1>
          <p className="text-lg text-gray-600">
            {showSuccess ? "See you again soon!" : "Thank you for using Marketplace"}
          </p>
        </div>
        
        {/* Loading/Success indicator */}
        <div className="flex justify-center">
          {!showSuccess ? (
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              <span className="font-semibold">Redirecting...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
