# frontend

[React](https://react.dev/) + [Vite](https://vite.dev/) forntend service to enable LN payments.

1. [dependencies](#dependencies)
2. [service configuration](#service-configuration)
3. [development](#development)
4. [to do](#to-do)

## dependencies

* [React](https://react.dev/) - Library for web and native user interfaces.
* [Vite](https://vite.dev/) - Build Tool for the Web.
* [qrcode.react](https://www.npmjs.com/package/qrcode.react) -React component to generate QR codes for rendering to the DOM.

## service configuration

Configuration can be done using [`.env.example`](.env.example). Make a copy called `.env` and modify to fit your needs:

| Name | Description | Default |
|---|---|---|
| VITE_API_URL | api service URL | http://api:3000 |
| VITE_EMITTER_SOCKET | invoice emitter URL | polar-n1-bob:10009 |
| VITE_EMITTER_CERT | invoice emitter HEX TLS cert | some hex string |
| VITE_EMITTER_MACAROON | invoice emitter HEX admin macaroon | some hex string |
| VITE_PAYER_SOCKET | invoice payer URL | polar-n1-alice:10009 |
| VITE_PAYER_CERT | invoice payer HEX TLS cert | some hex string |
| VITE_PAYER_MACAROON | invoice payer HEX admin macaroon | some hex string |

## development

>Environment variables [depicted above](#service-configuration) are considered to work within Docker compose deployment. In order to development tasks without Docker, check hostnames to `localhost`.

For development purposes, executing those commands from anywhere in the Nx workspace will be very useful:

```bash
# serve frontend
nx serve frontend
```

## to do

- [ ] error handling
- [ ] styling
