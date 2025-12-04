"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { User, Save, Eye, EyeOff } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  })

  useEffect(() => {
    const init = async () => {
      if (status === "loading") return
      
      if (status === "unauthenticated") {
        router.push("/")
        return
      }

      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch(`/api/user/profile`, {
            cache: 'no-store'
          })
          if (response.ok) {
            const data = await response.json()
            setFormData({
              fullName: data.fullName || "",
              phone: data.phone || "",
              address: data.address || "",
              email: data.email || "",
              currentPassword: "",
              newPassword: "",
            })
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error)
        }
      }
    }

    init()
  }, [session, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to update profile")
      } else {
        setSuccess("Profile updated successfully!")
        // Update session with new name
        await update({ name: formData.fullName })
        // Clear password fields
        setFormData({ ...formData, currentPassword: "", newPassword: "" })
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-6 py-16 text-center flex-1">
          <div className="w-10 h-10 border-3 border-gray-300 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-6 py-8 flex-1 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Profile Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Your full name"
                className="mt-1.5"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className="mt-1.5"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="Your phone number"
                className="mt-1.5"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                Address
              </Label>
              <Input
                id="address"
                placeholder="Your address"
                className="mt-1.5"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            {/* Divider */}
            <div className="border-t pt-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Change Password (Optional)
              </h3>

              {/* Current Password */}
              <div className="mb-4">
                <Label htmlFor="currentPassword" className="text-sm font-medium">
                  Current Password
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    className="pr-10"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="mt-1.5"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave blank to keep current password
                </p>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
