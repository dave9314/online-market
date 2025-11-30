"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
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

type Item = {
  id: string
  name: string
  description: string
  price: number
  manufacturedDate: string
  categoryId: string
  contactEmail: string
  imageUrl: string
  ownerId: string
}

export default function EditItemPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [item, setItem] = useState<Item | null>(null)
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
    const fetchData = async () => {
      try {
        const [categoriesRes, itemRes] = await Promise.all([
          fetch("/api/categories"),
          fetch(`/api/items/${params.id}`),
        ])

        const categoriesData = await categoriesRes.json()
        const itemData = await itemRes.json()

        if (itemData.ownerId !== session?.user?.id) {
          router.push("/dashboard")
          return
        }

        setCategories(categoriesData)
        setItem(itemData)
        setFormData({
          name: itemData.name,
          description: itemData.description || "",
          price: itemData.price.toString(),
          manufacturedDate: itemData.manufacturedDate,
          categoryId: itemData.categoryId,
          contactEmail: itemData.contactEmail,
        })
        setImagePreview(itemData.imageUrl)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }

    if (status === "authenticated") {
      fetchData()
    }
  }, [status, params.id, session, router])

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
      let imageUrl = item?.imageUrl

      if (imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", imageFile)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image")
        }

        const { url } = await uploadResponse.json()
        imageUrl = url
      }

      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        imageUrl,
      }

      const response = await fetch(`/api/items/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update item")
      }

      router.push("/my-items")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          href="/my-items"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Items
        </Link>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800 p-6">
            <CardTitle className="text-2xl font-normal text-gray-900 dark:text-white">Edit Item</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="categoryId">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (Birr) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="manufacturedDate">Manufactured Date *</Label>
                  <Input
                    id="manufacturedDate"
                    type="date"
                    value={formData.manufacturedDate}
                    onChange={(e) => setFormData({ ...formData, manufacturedDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Item Image</Label>
                <div className="mt-2">
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-10 w-10 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-500">
                          Click to upload new image
                        </p>
                      </div>
                    )}
                    <input
                      id="image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Updating..." : "Update Item"}
                </Button>
                <Link href="/my-items" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
