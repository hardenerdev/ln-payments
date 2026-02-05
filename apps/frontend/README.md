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
