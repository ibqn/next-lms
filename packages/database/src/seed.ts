import { db } from "./drizzle/db"
import { categoryTable } from "./drizzle/schema/category"

async function seed() {
  const values = [
    { name: "Computer Science" },
    { name: "Mathematics" },
    { name: "Physics" },
    { name: "Chemistry" },
    { name: "Web development" },
    { name: "Algorithms" },
    { name: "Data structures" },
    { name: "Machine learning" },
    { name: "Artificial intelligence" },
  ]

  console.log("⏳ Seeding...")
  const start = Date.now()
  const items = await db
    .insert(categoryTable)
    .values(values)
    .onConflictDoNothing()
    .returning({ id: categoryTable.id })

  const end = Date.now()
  console.log(`${items.length} item(s) inserted.`)
  console.log(`Completed in ${end - start}ms.`)
}

seed()
  .then(() => {
    console.log("✅ Seeding successful")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Seeding failed")
    console.error(error)
    process.exit(1)
  })
