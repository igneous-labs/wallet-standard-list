# wallet-standard-list

Custom element for displaying a "connect wallet" button for every wallet-standard wallet registered.

All HTML elements within are NOT encapsulated in the shadow DOM and completely unstyled to allow for complete styling customization.

## Example

First, add the element to the custom element registry:

```js
import { defineCustomElement } from "wallet-standard-list";

defineCustomElement(); // accepts an optional string arg for the custom element tag name, otherwise defaults to "wallet-standard-list"
```

You can now use it in your html:

```html
<wallet-standard-list
  required-features="solana:signAndSendTransaction, solana:signTransaction"
></wallet-standard-list>
```

## Basic Styling Example

```css
wallet-standard-list {
  display: inline-flex; /* custom element default to display: inline */
  flex-direction: column;
  gap: 0.25rem;
}

wallet-standard-list > button {
  display: flex;
  align-items: center;
  height: 3rem;
  font-size: 1rem;
}

wallet-standard-list > button > img {
  height: 75%;
  margin-right: 1rem;
}
```

You can see the result of these basic styles in the example web-app in `example/`

## Usage

### Filtering Wallets by Features

The `required-features` attribute allows users to filter standard wallets by [wallet-standard features](https://wallet-standard.github.io/wallet-standard/interfaces/_wallet_standard_base.Wallet.html#features) using a comma-separated list of feature names, displaying buttons only for wallets that have all required features.

### Connecting a Wallet

On click, each button initiates the connect wallet flow with the respective wallet.

On connect success, a `CustomEvent` is emitted with the following type:

```js
{
  type: "wallet-standard-list:wallet-connected",
  bubbles: true,
  detail: Wallet, // standard wallet that connected
}
```

### Using the Connected Wallet

On successful connection, the connected wallet is made available through the element's `connectedWallet` property.

```js
const transaction = ...;
const wallet = document.querySelector(
  "wallet-standard-list"
).connectedWallet;
const account = wallet.accounts[0];
const [{ signature }] = await wallet.features[
  "solana:signAndSendTransaction"
].signAndSendTransaction({
  chain: "solana:mainnet",
  account,
  transaction,
});
```

See `example/index.html` for a full example

### Disconnecting the Connected Wallet

Disconnecting the connected wallet must be handled by the app by calling the element's `disconnect()` method.

```js
document.querySelector("wallet-standard-list").disconnect();
```

On `disconnect()` call, a `CustomEvent` is immediately emitted with the following type:

```js
{
  type: "wallet-standard-list:wallet-disconnected",
  bubbles: true,
  detail: Wallet, // standard wallet to disconnect
}
```

The wallet might run some additional cleanup in the background at the same time.

### Others

The list of all filtered standard wallets is available through the element's `wallets` property.

```js
const allWallets = document.querySelector("wallet-standard-list").wallets;
```
