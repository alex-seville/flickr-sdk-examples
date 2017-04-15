# flickr-sdk-examples
Implementation examples for the Flickr SDK

## setup

Run `npm install` to install all dependencies.

Run `npm test` to verify the dependencies were installed correct, and that all examples are working as expected.

Run `node <example folder>` to start the server for the examples,

i.e. `node hello-world/` will run the `hello-world` example.

## getting an API key

These examples require an API key and secret.

1. Apply for an API key here: https://www.flickr.com/services/apps/create/
  - If you already have a registered application, you can find your API key and secret here: https://www.flickr.com/services/apps/by/me
2. In this repository, copy `.env.example` to `.env`.
3. Replace the placeholder values in `.env` with your API key and secret.
