const formatter = new Intl.NumberFormat("en-Us", {
  style: "currency",
  currency: "USD",
})

export const formatPrice = (price: number) => formatter.format(price)
