"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShoppingBag, CheckCircle, Sparkles } from "lucide-react"

function WelcomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userName = searchParams.get("name") || "User"
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // Show success checkmark after a moment
    const successTimer = setTimeout(() => {
      setShowSuccess(true)
    }, 600)

    // Redirect to dashboard after showing success
    const redirectTimer = setTimeout(() => {
      router.push("/dashboard")
    }, 2000)

    return () => {
      clearTimeout(successTimer)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Logo with animation */}
        <div className="relative inline-block mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-600 to-blue-600 rounded-3xl shadow-2xl">
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
          
          {/* Sparkles decoration */}
          {showSuccess && (
            <>
              <div className="absolute -top-4 -left-4 animate-ping">
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="absolute -bottom-4 -right-4 animate-ping delay-75">
                <Sparkles className="h-6 w-6 text-blue-400" />
              </div>
            </>
          )}
        </div>
        
        {/* Message */}
        <div className="space-y-3 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {showSuccess ? `Welcome, ${userName}!` : "Signing In..."}
          </h1>
          <p className="text-lg text-gray-600">
            {showSuccess 
              ? "You've successfully signed in!" 
              : "Just a moment..."}
          </p>
        </div>
        
        {/* Loading/Success indicator */}
        <div className="flex justify-center">
          {!showSuccess ? (
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              <span className="font-semibold">Taking you to marketplace...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WelcomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-600 to-blue-600 rounded-3xl shadow-2xl mb-8">
            <ShoppingBag className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Signing In...</h1>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <WelcomeContent />
    </Suspense>
  )
}
