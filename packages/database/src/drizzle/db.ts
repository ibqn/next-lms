import { drizzle } from "drizzle-orm/postgres-js"
import { z } from "zod"
import { sessionRelations, sessionTable, userTable } from "./schema/auth"
import { courseRelations, courseTable } from "./schema/course"
import { categoryRelations, categoryTable } from "./schema/category"
import { attachmentRelations, attachmentTable } from "./schema/attachment"
import { uploadRelations, uploadTable } from "./schema/upload"
import { chapterRelations, chapterTable } from "./schema/chapter"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
})

export const processEnv = envSchema.parse(process.env)

export const db = drizzle(processEnv.DATABASE_URL, {
  schema: {
    user: userTable,
    session: sessionTable,
    sessionRelations,
    chapter: chapterTable,
    chapterRelations,
    course: courseTable,
    courseRelations,
    category: categoryTable,
    categoryRelations,
    attachment: attachmentTable,
    attachmentRelations,
    upload: uploadTable,
    uploadRelations,
  },
})
