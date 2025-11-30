import { z } from 'zod'

export const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
})

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export const itemSchema = z.object({
  name: z.string().min(3, 'Item name must be at least 3 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  manufacturedDate: z.string().min(1, 'Manufactured date is required'),
  categoryId: z.string().min(1, 'Category is required'),
  contactEmail: z.string().email('Valid email is required'),
  imageUrl: z.string().min(1, 'Image is required'),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ItemInput = z.infer<typeof itemSchema>
