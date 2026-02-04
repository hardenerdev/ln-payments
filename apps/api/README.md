# api

Service to interact with [Polar](https://lightningpolar.com/) network serving a TypeScript based [Express](https://www.npmjs.com/package/express) API.

1. [dependencies](#dependencies)
2. [endpoints](#endpoints)
3. [service configuration](#service-configuration)
4. [testing](#testing)
    1. [create invoice](#create-invoice)
    2. [get invoice by hash](#get-invoice-by-hash)
    3. [pay invoice](#pay-invoice)
    4. [get payment by hash](#get-payment-by-hash)
    5. [get transactions](#get-transactions)
5. [development](#development)
6. [to do](#to-do)

## dependencies

* [TypeScript](https://www.typescriptlang.org/) - Programming language.
* [Express](https://www.npmjs.com/package/express) - Web framework.
* [Lightning](https://www.npmjs.com/package/lightning) - LN communication.
* [pg](https://www.npmjs.com/package/pg) - PostgreSQL client.
* [cors](https://www.npmjs.com/package/cors) - CORS middleware.

## endpoints

| Path | Description |
|---|---|
| `/health` | Check service status |
| `/api/invoice` | Creates and invoice of a given amount and provided description |
| `/api/invoice/:payment_hash` | Get an invoice given an invoice hash |
| `/api/payment` | Pay an invoice regarding the payment request |
| `/api/payment/:payment_hash` | Get a payment given a payment hash |
| `/api/transactions` | Get all transactions (invoices and payments) |

## service configuration

Configuration can be done using [`apps/api/.env.example`](./apps/api/.env.example). Make a copy called `.env` and modify to fit your needs:

| Name | Description | Default |
|---|---|---|
| RECEIVER_SOCKET | Receiver URL | polar-n1-bob:10009 |
| RECEIVER_CERT | Receiver HEX encoded TLS cert | Some TLS cert |
| RECEIVER_MACAROON | Receiver HEX encoded admin macaroon | Some admin macaroon |
| RECEIVER_PUBLIC_KEY | Receiver public key | Some public key |
| SENDER_SOCKET | Sender URL | polar-n1-alice:10009 |
| SENDER_CERT | Sender HEX encoded TLS cert | Some TLS cert |
| SENDER_MACAROON | Sender HEX encoded admin macaroon | Some admin macaroon |
| SENDER_PUBLIC_KEY | Sender public key | Some public key |
| POSTGRES_HOST | Postgre host to connect with | postgres |
| UI_PORT | UI listen port to enable socket.io CORS | 4000 |

> Note: above hostnames are resolved internally to the attached Docker network. If yoy have any other Polar network running minor changes will be required to fit `RECEIVER_SOCKET`, `SENDER_SOCKET` and network at [compose.yaml](./compose.yaml) assigning the correct `id` to `polar-n<id>-bob`, `polar-n<id>-alice` and `polar-network-<id>_default` respectively. Check can be done executing `docker ps` and looking for polar sevices.

## testing

Endpoints can be tested using cURL as follows:

### create invoice

```bash
# create invoice
curl -X POST -H 'Content-Type: application/json' localhost:3000/api/invoice --data '{"amount": "30", "memo": "test"}' | jq
```

Expected result:

```json
{
  "amount": 30,
  "description": "test",
  "hash": "<hash>",
  "expiry": "<sting>",
  "paymentRequest": "lnbcrt..."
}
```

### get invoice by hash

```bash
# create invoice
curl http://localhost:3000/api/invoice/<hash> | jq
```

Expected result:

```json
{
  "invoice": {
    "cltv_delta": 80,
    "created_at": "<string>",
    "description": "test",
    "expires_at": "<string>",
    "features": [
      {
        "bit": 8,
        "is_known": true,
        "is_required": true,
        "type": "tlv_onion"
      },
      {
        "bit": 14,
        "is_known": true,
        "is_required": true,
        "type": "payment_identifier"
      },
      {
        "bit": 17,
        "is_known": true,
        "is_required": false,
        "type": "multipath_payments_v0"
      },
      {
        "bit": 25,
        "is_known": true,
        "is_required": false,
        "type": "route_blinding"
      }
    ],
    "id": "<string>",
    "index": 7,
    "is_confirmed": false,
    "is_private": false,
    "mtokens": "30000",
    "payment": "<string>",
    "payments": [],
    "received": 0,
    "received_mtokens": "0",
    "request": "lnbcrt...",
    "secret": "<string>",
    "tokens": 30
  }
}
```

### pay invoice

```bash
# create invoice
curl -X POST -H 'Content-Type: application/json' localhost:3000/api/payment --data '{"paymentRequest": "lnbcrt..."}' | jq
```

Expected result:

```json
{
  "fee": 0,
  "preimage": "<string>",
  "hash": "<string>"
}
```

### get payment by hash

```bash
# create invoice
curl http://localhost:3000/api/payment/<hash> | jq
```

Expected result:

```json
{
  "payment": {
    "is_confirmed": true,
    "is_failed": false,
    "is_pending": false,
    "payment": {
      "destination": "<string>",
      "confirmed_at": "<string>",
      "created_at": "<string>",
      "fee": 0,
      "fee_mtokens": "0",
      "hops": [
        {
          "channel": "139x1x1",
          "channel_capacity": 10000000,
          "fee": 0,
          "fee_mtokens": "0",
          "forward": 30,
          "forward_mtokens": "30000",
          "public_key": "<string>",
          "timeout": 228
        }
      ],
      "id": "<string>",
      "index": "1002",
      "mtokens": "30000",
      "paths": [
        {
          "fee": 0,
          "fee_mtokens": "0",
          "hops": [
            {
              "channel": "139x1x1",
              "channel_capacity": 10000000,
              "fee": 0,
              "fee_mtokens": "0",
              "forward": 30,
              "forward_mtokens": "30000",
              "public_key": "<string>",
              "timeout": 228
            }
          ],
          "mtokens": "30000",
          "payment": "<string>",
          "timeout": 228,
          "tokens": 30,
          "total_mtokens": "30000"
        }
      ],
      "request": "lnbcrt...",
      "safe_fee": 0,
      "safe_tokens": 30,
      "secret": "<string>",
      "timeout": 228,
      "tokens": 30
    }
  }
}
```

### get transactions

```bash
# create invoice
curl -X POST -H 'Content-Type: application/json' localhost:3000/api/payment --data '{"paymentRequest": "lnbcrt..."}' | jq
```

Expected result:

```json
{
  "invoices": [
    {
      "id": "<string>",
      "created_at": "<string>",
      "memo": "test",
      "tokens": "30",
      "payment": "<string>",
      "payment_request": "lnbcrt..."
    },
    ...
  ],
  "payments": [
    {
      "id": "<string>",
      "confirmed_at": "<string>",
      "tokens": "30",
      "fee": "0",
      "confirmed": true,
      "outgoing": true,
      "preimage": "<string>"
    },
    ...
  ]
}
```

## development

>Environment variables [depicted above](#service-configuration) are considered to work within Docker compose deployment. In order to development tasks without Docker, check hostnames to `localhost`.

For development purposes, executing those commands from anywhere in the Nx workspace will be very useful:

```bash
# serve api
nx serve api

# lint api
nx lint api

# execute unit tests
nx test api
```

## to do

- [ ] balance endpoint.
- [ ] connect to node endpoint.
- [ ] databse refactor to be a class.
- [ ] only one pg table?
- [ ] error handling
