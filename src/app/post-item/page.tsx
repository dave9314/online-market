"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload } from "lucide-react"

type Category = {
  id: string
  name: string
  slug: string
}

export default function PostItemPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    manufacturedDate: "",
    categoryId: "",
    contactEmail: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  useEffect(() => {
    // Fetch categories immediately, don't wait for auth
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!imageFile) {
        setError("Please select an image")
        setLoading(false)
        return
      }

      console.log("Starting image upload...")
      const uploadFormData = new FormData()
      uploadFormData.append("file", imageFile)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        console.error("Upload failed:", errorData)
        throw new Error(errorData.error || "Failed to upload image")
      }

      const { url } = await uploadResponse.json()
      console.log("Image uploaded successfully:", url)

      if (!url) {
        throw new Error("No URL returned from upload")
      }

      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        imageUrl: url,
      }

      console.log("Creating item with data:", itemData)

      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      })

      if (!response.ok) {
        const data = await response.json()
        console.error("Item creation failed:", data)
        throw new Error(data.error || "Failed to create item")
      }

      const createdItem = await response.json()
      console.log("Item created successfully:", createdItem)
      
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Submit error:", err)
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-10 h-10 border-3 border-gray-300 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Link>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800 p-6">
            <CardTitle className="text-2xl font-normal text-gray-900 dark:text-white">Post a New Item</CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Item Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., iPhone 12 Pro Max"
                  className="mt-1.5"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Brief description"
                  className="mt-1.5"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="categoryId" className="text-sm font-medium text-gray-700">
                  Category *
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  required
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <div className="p-2 text-center text-sm text-gray-500">Loading...</div>
                    ) : categories.length === 0 ? (
                      <div className="p-2 text-center text-sm text-gray-500">No categories available</div>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Price (Birr) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="mt-1.5"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="manufacturedDate" className="text-sm font-medium text-gray-700">
                    Manufactured Date *
                  </Label>
                  <Input
                    id="manufacturedDate"
                    type="date"
                    className="mt-1.5"
                    value={formData.manufacturedDate}
                    onChange={(e) => setFormData({ ...formData, manufacturedDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
                  Contact Email *
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  className="mt-1.5"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                  Item Image *
                </Label>
                <div className="mt-2">
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 bg-gray-50"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-10 w-10 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 font-medium">
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG (MAX. 10MB)
                        </p>
                      </div>
                    )}
                    <input
                      id="image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
                disabled={loading}
              >
                {loading ? "Posting..." : "Post Item"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
