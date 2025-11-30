const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create categories
  const categories = [
    { name: 'Used Vehicles', slug: 'used-vehicles' },
    { name: 'Used Electronics', slug: 'used-electronics' },
    { name: 'Used Furniture', slug: 'used-furniture' },
    { name: 'Other Used Items', slug: 'other-used-items' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('Categories created!')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      fullName: 'Admin User',
      address: '123 Admin Street',
      phone: '1234567890',
      email: 'admin@marketplace.com',
      role: 'ADMIN',
    },
  })

  console.log('Admin user created!')
  console.log('Username: admin')
  console.log('Password: admin123')
  console.log('')
  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
