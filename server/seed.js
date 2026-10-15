
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/product.model.js'

dotenv.config()

// Fixed online image URLs. No image API or downloads required.
// Each entry: [name, price, stock, image URL]

const catalog = {
  Electronics: [
    ['Bluetooth Speaker', 1499, 25, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80'],
    ['Smart Watch', 2999, 20, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
    ['Wireless Headphones', 4999, 18, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
    ['Mechanical Keyboard', 4999, 15, 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'],
    ['Wireless Gaming Mouse', 1999, 30, 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80'],
    ['Tablet 10.4-inch 64GB', 17999, 12, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'],
    ['Portable SSD 1TB', 8499, 14, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80'],
    ['1080p Webcam', 2799, 20, 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=800&q=80'],
    ['USB-C Fast Charger 65W', 1499, 35, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'],
    ['True Wireless Earbuds', 2499, 25, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=800&q=80'],
  ],

  Fashion: [
    ['Running Shoes', 2499, 20, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
    ['Classic Cotton T-Shirt', 599, 40, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'],
    ['Slim-Fit Denim Jeans', 1799, 25, 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80'],
    ['Casual White Sneakers', 2199, 18, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'],
    ['Leather Belt', 799, 30, 'https://images.unsplash.com/photo-1624222247344-550fb8d5c6e8?auto=format&fit=crop&w=800&q=80'],
    ['Leather Wallet', 999, 25, 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'],
    ['Polarised Sunglasses', 1299, 22, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'],
    ['Classic Wristwatch', 1999, 16, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'],
    ['Hooded Sweatshirt', 1499, 28, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80'],
    ['Travel Jacket', 2799, 15, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'],
  ],

  Books: [
    ['Atomic Habits', 499, 30, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80'],
    ['The Psychology of Money', 399, 25, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80'],
    ['The Pragmatic Programmer', 699, 15, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80'],
    ['Deep Work', 449, 20, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'],
    ['Think and Grow Rich', 299, 22, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80'],
    ['Rich Dad Poor Dad', 349, 26, 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80'],
    ['Clean Code', 599, 14, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'],
    ['Ikigai', 399, 24, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80'],
    ['The Alchemist', 299, 20, 'https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=800&q=80'],
    ['Introduction to Algorithms', 899, 12, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80'],
  ],

  Home: [
    ['Coffee Mug', 299, 40, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80'],
    ['Stainless Steel Water Bottle', 799, 35, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'],
    ['Ceramic Flower Vase', 699, 18, 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80'],
    ['Table Lamp', 1299, 16, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'],
    ['Decorative Cushion', 499, 30, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'],
    ['Bamboo Cutting Board', 599, 20, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'],
    ['Storage Basket Set', 899, 22, 'https://images.unsplash.com/photo-1593085260707-5377ba37f868?auto=format&fit=crop&w=800&q=80'],
    ['Indoor Plant Pot', 399, 28, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80'],
    ['Soft Throw Blanket', 1199, 14, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'],
    ['Wall Clock', 899, 16, 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80'],
  ],

  Accessories: [
    ['Travel Backpack', 1299, 20, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'],
    ['Laptop Sleeve', 899, 25, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'],
    ['Classic Baseball Cap', 499, 30, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80'],
    ['Travel Duffel Bag', 1799, 15, 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80'],
    ['Leather Card Holder', 599, 28, 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'],
    ['Compact Umbrella', 699, 20, 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80'],
    ['Travel Organizer Pouch', 499, 24, 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=800&q=80'],
    ['Classic Leather Handbag', 2499, 12, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'],
    ['Sports Water Bottle', 599, 30, 'https://images.unsplash.com/photo-1523362628745-0c100150b1f1?auto=format&fit=crop&w=800&q=80'],
    ['Minimalist Keychain', 199, 50, 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=800&q=80'],
  ],
}

async function seedProducts() {
  if (!process.env.dbUrl) {
    throw new Error('Missing dbUrl in server/.env')
  }

  await mongoose.connect(process.env.dbUrl)
  console.log('Connected to MongoDB')

  let added = 0
  let updatedImages = 0
  let unchanged = 0

  for (const [category, items] of Object.entries(catalog)) {
    console.log(`\n--- ${category}: ${items.length} products ---`)

    for (const [name, price, stock, image] of items) {
      const productData = {
        name,
        description: `${name} for everyday use.`,
        price,
        category,
        stock,
        image,
      }

      const existing = await Product.findOne({ name })
        .select('_id image')
        .lean()

      if (!existing) {
        await Product.create(productData)
        console.log(`ADDED: ${name}`)
        added++
      } else if (existing.image !== image) {
        await Product.updateOne(
          { _id: existing._id },
          { $set: { image } }
        )
        console.log(`IMAGE UPDATED: ${name}`)
        updatedImages++
      } else {
        console.log(`UNCHANGED: ${name}`)
        unchanged++
      }
    }
  }

  console.log('\n===== SEED SUMMARY =====')
  console.log('Products in seed list: 50')
  console.log(`New products added: ${added}`)
  console.log(`Images updated: ${updatedImages}`)
  console.log(`Already correct: ${unchanged}`)
  console.log('No products were deleted.')
}

seedProducts()
  .catch((error) => {
    console.error('Seed failed:', error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
