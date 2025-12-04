"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingBag, Eye, EyeOff } from "lucide-react"

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
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)

  // Prevent browser form restoration
  useEffect(() => {
    // Clear all form data on mount
    setLoginData({ username: "", password: "" })
    setSignUpData({
      username: "",
      password: "",
      fullName: "",
      address: "",
      phone: "",
    })
    setAgreedToTerms(false)
    setError("")
    setSuccess("")
    setShowLoginPassword(false)
    setShowSignupPassword(false)
    
    // Disable browser form restoration
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual'
      
      // Force clear any browser-cached form data
      const forms = document.querySelectorAll('form')
      forms.forEach(form => {
        if (form instanceof HTMLFormElement) {
          form.reset()
        }
      })
    }
  }, [])

  const switchTab = (isSignup: boolean) => {
    setIsSignUp(isSignup)
    setError("") // Clear errors when switching tabs
    setSuccess("") // Clear success messages when switching tabs
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      console.log("Attempting login for:", loginData.username)
      
      const result = await signIn("credentials", {
        username: loginData.username,
        password: loginData.password,
        redirect: false,
      })

      console.log("Login result:", result)

      if (result?.error) {
        console.error("Login error:", result.error)
        setError("Invalid username or password")
        setLoading(false)
      } else if (result?.ok) {
        console.log("Login successful, redirecting to welcome page...")
        // Successfully signed in, show welcome page first
        router.push(`/welcome?name=${encodeURIComponent(loginData.username)}`)
      } else {
        console.error("Unexpected login result:", result)
        setError("Login failed. Please try again.")
        setLoading(false)
      }
    } catch (err) {
      console.error("Login exception:", err)
      setError("Something went wrong. Please try again.")
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
        setLoading(false)
      } else {
        // Save username before clearing form
        const createdUsername = signUpData.username
        
        // Clear signup form
        setSignUpData({
          username: "",
          password: "",
          fullName: "",
          address: "",
          phone: "",
        })
        setAgreedToTerms(false)
        setLoading(false)
        
        // Switch to login tab and pre-fill username
        setIsSignUp(false)
        setLoginData({ username: createdUsername, password: "" })
        setError("") // Clear any errors
        setSuccess("Account created successfully! Please log in.")
      }
    } catch (err) {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4 shadow-lg">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-sm text-gray-600 mt-2">
            Buy and sell quality used items with confidence
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => switchTab(false)}
              className={`flex-1 py-4 text-sm font-semibold transition-all relative ${
                !isSignUp
                  ? "text-gray-900 bg-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
              {!isSignUp && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
              )}
            </button>
            <button
              onClick={() => switchTab(true)}
              className={`flex-1 py-4 text-sm font-semibold transition-all relative ${
                isSignUp
                  ? "text-gray-900 bg-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
              {isSignUp && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
              )}
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Login Form */}
            {!isSignUp ? (
              <form onSubmit={handleLogin} className="space-y-4" autoComplete="off" key="login-form">
                <input type="text" name="prevent_autofill" style={{ display: 'none' }} />
                <input type="password" name="prevent_autofill" style={{ display: 'none' }} />
                <div>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Username"
                    className="h-12 bg-gray-50 border-gray-200"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    autoComplete="off"
                    data-form-type="other"
                    required
                  />
                </div>
                <div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Password"
                      className="h-12 bg-gray-50 border-gray-200 pr-10"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      autoComplete="new-password"
                      data-form-type="other"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                {success && (
                  <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                )}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Continue"}
                </Button>
              </form>
            ) : (
              /* Sign Up Form */
              <form onSubmit={handleSignUp} className="space-y-3" autoComplete="off" key="signup-form">
                <input type="text" name="prevent_autofill" style={{ display: 'none' }} />
                <input type="password" name="prevent_autofill" style={{ display: 'none' }} />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    name="new-username"
                    placeholder="Username"
                    className="h-11 bg-gray-50 border-gray-200"
                    value={signUpData.username}
                    onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                    autoComplete="off"
                    data-form-type="other"
                    required
                  />
                  <div className="relative">
                    <Input
                      name="new-password"
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="Password"
                      className="h-11 bg-gray-50 border-gray-200 pr-10"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      autoComplete="new-password"
                      data-form-type="other"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Input
                  name="fullname"
                  placeholder="Full Name"
                  className="h-11 bg-gray-50 border-gray-200"
                  value={signUpData.fullName}
                  onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                  autoComplete="off"
                  data-form-type="other"
                  required
                />
                <Input
                  name="address"
                  placeholder="Address"
                  className="h-11 bg-gray-50 border-gray-200"
                  value={signUpData.address}
                  onChange={(e) => setSignUpData({ ...signUpData, address: e.target.value })}
                  autoComplete="off"
                  data-form-type="other"
                  required
                />
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  className="h-11 bg-gray-50 border-gray-200"
                  value={signUpData.phone}
                  onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                  autoComplete="off"
                  data-form-type="other"
                  required
                />
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                    required
                  />
                  <label htmlFor="terms" className="text-xs text-gray-600">
                    I agree to the Terms & Privacy Policy
                  </label>
                </div>
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg"
                  disabled={loading || !agreedToTerms}
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
