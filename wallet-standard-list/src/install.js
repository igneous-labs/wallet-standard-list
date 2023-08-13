import { WalletStandardList } from "./component";

export const WALLET_STANDARD_LIST_ELEM_TAG = "wallet-standard-list";

/**
 * window.customElements.define() the web component so that it can be used
 *
 * @param {string | null | undefined} [htmlTag] defaults to `wallet-standard-list` if not provided
 */
export function defineCustomElement(htmlTag) {
  const name = htmlTag ?? WALLET_STANDARD_LIST_ELEM_TAG;
  window.customElements.define(name, WalletStandardList);
}
