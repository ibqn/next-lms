import { Hono } from "hono"
import type { ExtEnv } from "../utils/extended-env"
import { signedIn } from "../middleware/signed-in"
import { zValidator } from "@hono/zod-validator"
import { getCourseItem } from "database/src/queries/course"
import type { User } from "database/src/drizzle/schema/auth"
import { paramIdSchema } from "database/src/validators/param"
import { HTTPException } from "hono/http-exception"
import { createPurchaseItem, getPurchaseItem } from "database/src/queries/purchase"
import Stripe from "stripe"
import assert from "assert"
import { createStripeCustomerItem, getStripeCustomerItem } from "database/src/queries/stripe-customer"
import { stripe } from "../stripe"
import { env } from "../env"
import { getUser } from "database/src/queries/user"
import { response, type SuccessResponse } from "database/src/types"

export const stripeRoute = new Hono<ExtEnv>()
  .post(
    "/checkout/:id",
    signedIn,
    zValidator("param", paramIdSchema),

    async (c) => {
      const { id: courseId } = c.req.valid("param")
      const user = c.get("user") as User

      const purchase = await getPurchaseItem({ courseId, userId: user.id })
      if (purchase) {
        throw new HTTPException(400, { message: "Course already purchased" })
      }

      const course = await getCourseItem({ courseId, userId: user.id })
      if (!course) {
        throw new HTTPException(404, { message: "Course not found" })
      }

      assert(typeof course.price === "number", "Course price is required for checkout")
      assert(course.price >= 0, "Course price must be greater than zero for checkout")
      assert(typeof course.description === "string", "Course description is required for checkout")

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(course.price) * 100,
            product_data: {
              name: course.title,
              description: course.description,
            },
          },
        },
      ]

      let stripeCustomer = await getStripeCustomerItem({ userId: user.id })

      if (!stripeCustomer) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        })

        stripeCustomer = await createStripeCustomerItem({
          userId: user.id,
          stripeCustomerId: customer.id,
        })
      }

      const successUrl = env.FRONTEND_URL + `/course/${course.id}?state=success&session_id={CHECKOUT_SESSION_ID}`
      const cancelUrl = env.FRONTEND_URL + `/course/${course.id}?state=cancel`

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomer.stripeCustomerId,
        line_items: lineItems,
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: user.id,
          courseId: course.id,
        },
      })

      const redirectUrl = session.url
      assert(redirectUrl, "Stripe session URL is required")

      return c.json<SuccessResponse<{ url: string }>>(response("stripe checkout session created", { url: redirectUrl }))
    }
  )
  .post("/webhook", async (c) => {
    const signature = c.req.header("stripe-signature")!
    const body = await c.req.text()
    const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const userId = session.metadata?.userId
      const courseId = session.metadata?.courseId

      const userIdParseResult = paramIdSchema.safeParse({ id: userId })
      const courseIdParseResult = paramIdSchema.safeParse({ id: courseId })

      if (!userIdParseResult.success || !courseIdParseResult.success) {
        throw new HTTPException(400, { message: "Invalid metadata in Stripe session" })
      }

      const user = await getUser({ id: userIdParseResult.data.id })
      if (!user) {
        throw new HTTPException(404, { message: "User not found" })
      }

      const course = await getCourseItem({ courseId: courseIdParseResult.data.id, userId: user.id })
      if (!course) {
        throw new HTTPException(404, { message: "Course not found" })
      }

      const purchase = await createPurchaseItem({
        userId: user.id,
        courseId: course.id,
      })
    }

    return c.json({ received: true }, 200)
  })
