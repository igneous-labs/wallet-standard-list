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
