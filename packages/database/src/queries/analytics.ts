import { eq } from "drizzle-orm"
import { db } from "../drizzle/db"
import type { User } from "../drizzle/schema/auth"
import { courseTable, type Course } from "../drizzle/schema/course"
import { purchaseTable, type Purchase } from "../drizzle/schema/purchase"

type AnalyticsOptions = {
  userId: User["id"]
}

type PurchaseWithCourse = {
  purchase: Purchase
  course: Course
}

const groupBy = (purchaseWithCourses: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {}

  for (const { course } of purchaseWithCourses) {
    const { title } = course
    if (!grouped[title]) {
      grouped[title] = 0
    }

    grouped[title] += course.price ?? 0
  }

  return grouped
}

export type AnalyticsChartData = {
  courseTitle: string
  earnings: number
}

export type AnalyticsData = {
  data: AnalyticsChartData[]

  totalEarnings: number
  totalSalesCount: number
}

export const getAnalyticsData = async ({ userId }: AnalyticsOptions): Promise<AnalyticsData> => {
  const purchaseWithCourse = await db
    .select()
    .from(purchaseTable)
    .innerJoin(courseTable, eq(purchaseTable.courseId, courseTable.id))
    .where(eq(courseTable.userId, userId))

  const groupedEarnings = groupBy(purchaseWithCourse)

  const data = Object.entries(groupedEarnings).map(([courseTitle, earnings]) => ({
    courseTitle,
    earnings,
  }))

  const totalEarnings = data.reduce((acc, curr) => acc + curr.earnings, 0)
  const totalSalesCount = purchaseWithCourse.length

  return { data, totalEarnings, totalSalesCount }
}
