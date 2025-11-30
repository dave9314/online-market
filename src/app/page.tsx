"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [signUpData, setSignUpData] = useState({
    username: "",
    password: "",
    fullName: "",
    address: "",
    phone: "",
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        username: loginData.username,
        password: loginData.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid username or password")
        setLoading(false)
      } else if (result?.ok) {
        // Successfully signed in, redirect to dashboard
        window.location.href = "/dashboard"
      }
    } catch (err) {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to sign up")
      } else {
        setIsSignUp(false)
        setLoginData({ username: signUpData.username, password: signUpData.password })
        alert("Account created successfully! Please log in.")
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Info */}
          <div className="space-y-6 animate-slide-up">
            <div className="mb-6">
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gray-900 rounded-2xl blur-xl opacity-30"></div>
                  <div className="relative p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-gray-700">
                    <ShoppingBag className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Marketplace
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">Your Trusted Trading Platform</p>
                </div>
              </div>
              
              <h2 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome
                </span>
                <br />
                <span className="text-gray-900">to Our Marketplace</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Join thousands of users buying and selling quality used items. 
                Find great deals or turn your unused items into cash.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Free to Use</h3>
                  <p className="text-gray-600">No listing fees or hidden charges</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Platform</h3>
                  <p className="text-gray-600">Your data is protected and secure</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Easy to Use</h3>
                  <p className="text-gray-600">Simple interface for buying and selling</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-sm text-gray-500">
                Browse categories: Vehicles • Electronics • Furniture • and more
              </p>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div>
            <Card className="p-8 shadow-lg border border-gray-200">
              {/* Tabs */}
              <div className="flex border-b mb-6">
                <button
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 pb-3 text-center font-semibold transition-colors relative ${
                    !isSignUp
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Login
                  {!isSignUp && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 pb-3 text-center font-semibold transition-colors relative ${
                    isSignUp
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Sign Up
                  {isSignUp && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              </div>

              {/* Login Form */}
              {!isSignUp ? (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Username
                    </Label>
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      className="mt-1.5 h-11"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="mt-1.5 h-11"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              ) : (
                /* Sign Up Form */
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-username" className="text-sm font-medium text-gray-700">
                        Username
                      </Label>
                      <Input
                        id="signup-username"
                        placeholder="Username"
                        className="mt-1.5 h-10"
                        value={signUpData.username}
                        onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Password"
                        className="mt-1.5 h-10"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Your full name"
                      className="mt-1.5 h-10"
                      value={signUpData.fullName}
                      onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                      Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="Your address"
                      className="mt-1.5 h-10"
                      value={signUpData.address}
                      onChange={(e) => setSignUpData({ ...signUpData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      placeholder="Your phone number"
                      className="mt-1.5 h-10"
                      value={signUpData.phone}
                      onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    disabled={loading || !agreedToTerms}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              )}
            </Card>

            <p className="text-center text-sm text-gray-500 mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Marketplace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
