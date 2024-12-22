import { db } from "./drizzle/db"

const result = db.execute("select 1")
console.log(result)
