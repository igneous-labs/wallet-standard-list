/**
 * window.customElements.define() the web component so that it can be used
 *
 * @param {string | null | undefined} [htmlTag] defaults to `wallet-standard-list` if not provided
 */
export function defineCustomElement(htmlTag?: string | null | undefined): void;
/** @typedef {import("@wallet-standard/base").WalletWithFeatures<import("@wallet-standard/features").StandardConnectFeature>} ConnectableWallet */
/** @typedef {typeof WALLET_CONNECTED_EVENT_TYPE} WalletConnectedEventType */
/** @typedef {typeof WALLET_DISCONNECTED_EVENT_TYPE} WalletDisconnectedEventType */
/** @typedef {CustomEvent<ConnectableWallet>} WalletConnectedEvent */
/** @typedef {CustomEvent<ConnectableWallet>} WalletDisconnectedEvent */
export const WALLET_CONNECTED_EVENT_TYPE: "wallet-standard-list:wallet-connected";
export const WALLET_DISCONNECTED_EVENT_TYPE: "wallet-standard-list:wallet-disconnected";
export const REQUIRED_FEATURES_ATTR_NAME: "required-features";
export const WALLET_STANDARD_LIST_ELEM_TAG: "wallet-standard-list";
export class WalletStandardList extends HTMLElement {
    /** @returns {string[]} */
    static get observedAttributes(): string[];
    /** @returns {?ConnectableWallet} */
    get connectedWallet(): ConnectableWallet | null;
    /** @returns {ConnectableWallet[]} */
    get wallets(): ConnectableWallet[];
    /** @type {import("@wallet-standard/base").IdentifierArray} */
    get requiredFeatures(): import("@wallet-standard/base").IdentifierArray;
    /**
     * override
     * @param {string} name
     */
    attributeChangedCallback(name: string): void;
    /** override */
    detachedCallback(): void;
    disconnect(): void;
    #private;
}
export type ConnectableWallet = import("@wallet-standard/base").WalletWithFeatures<import("@wallet-standard/features").StandardConnectFeature>;
export type WalletConnectedEventType = typeof WALLET_CONNECTED_EVENT_TYPE;
export type WalletDisconnectedEventType = typeof WALLET_DISCONNECTED_EVENT_TYPE;
export type WalletConnectedEvent = CustomEvent<ConnectableWallet>;
export type WalletDisconnectedEvent = CustomEvent<ConnectableWallet>;
