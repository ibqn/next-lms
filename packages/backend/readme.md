```
pnpm install
pnpm dev
```

```
open http://localhost:3333
```

### stripe

start stripe cli from docker

```shell
docker compose up
```

and find a message like

```text
stripe_cli  | Ready! You are using Stripe API Version [2025-12-15.clover]. Your webhook signing secret is whsec_.... (^C to quit)
```

trigger stripe payment intent succeeded

```shell
docker compose exec stripe stripe trigger payment_intent.succeeded
```
