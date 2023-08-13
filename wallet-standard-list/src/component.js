import { getWallets } from "@wallet-standard/app";

/** @typedef {import("@wallet-standard/base").WalletWithFeatures<import("@wallet-standard/features").StandardConnectFeature>} ConnectableWallet */

/** @typedef {typeof WALLET_CONNECTED_EVENT_TYPE} WalletConnectedEventType */

/** @typedef {typeof WALLET_DISCONNECTED_EVENT_TYPE} WalletDisconnectedEventType */

/** @typedef {CustomEvent<ConnectableWallet>} WalletConnectedEvent */

/** @typedef {CustomEvent<ConnectableWallet>} WalletDisconnectedEvent */

export const WALLET_CONNECTED_EVENT_TYPE =
  "wallet-standard-list:wallet-connected";

export const WALLET_DISCONNECTED_EVENT_TYPE =
  "wallet-standard-list:wallet-disconnected";

export const REQUIRED_FEATURES_ATTR_NAME = "required-features";

export class WalletStandardList extends HTMLElement {
  /** @type {?ConnectableWallet} */
  #connectedWallet;

  /** @type {ConnectableWallet[]} */
  #wallets;

  /** @type {Array<() => void>} */
  #walletsListenersOff;

  get connectedWallet() {
    return this.#connectedWallet;
  }

  get wallets() {
    return this.#wallets;
  }

  /** @type {import("@wallet-standard/base").IdentifierArray} */
  get requiredFeatures() {
    /** @type {import("@wallet-standard/base").IdentifierArray} */
    const base = ["standard:connect"];
    const attrVal = this.getAttribute(REQUIRED_FEATURES_ATTR_NAME);
    if (!attrVal) {
      return base;
    }
    const splitted = attrVal.split(",");
    // @ts-ignore
    return [...base, ...splitted.map((s) => s.trim())];
  }

  static get observedAttributes() {
    return [REQUIRED_FEATURES_ATTR_NAME];
  }

  attributeChangedCallback(name) {
    switch (name) {
      case REQUIRED_FEATURES_ATTR_NAME:
        this.rerender();
        break;
      default:
        break;
    }
  }

  constructor() {
    super();
    this.#connectedWallet = null;
    this.#wallets = [];
    this.#walletsListenersOff = [];

    const { on } = getWallets();
    this.#walletsListenersOff.push(on("register", this.rerender.bind(this)));
    this.#walletsListenersOff.push(on("unregister", this.rerender.bind(this)));
    // sometimes the wallets register before the listeners are added
    // so just rerender once more to be safe
    this.rerender();
  }

  detachedCallback() {
    for (let i = 0; i < this.#walletsListenersOff.length; i++) {
      const off = this.#walletsListenersOff[i];
      off();
    }
  }

  disconnect() {
    if (!this.#connectedWallet) {
      return;
    }
    const wallet = this.#connectedWallet;
    this.#connectedWallet = null;
    const evt = new CustomEvent(WALLET_DISCONNECTED_EVENT_TYPE, {
      detail: wallet,
      bubbles: true,
    });
    this.dispatchEvent(evt);
    // let disconnect() run async in background if the wallet has the feature,
    // dispatch disconnected event as soon as #connectedWallet no longer referenced
    const disconnectFeature = wallet.features["standard:disconnect"];
    if (disconnectFeature) {
      disconnectFeature.disconnect();
    }
  }

  rerender() {
    const { get } = getWallets();
    const allWallets = get();
    const { requiredFeatures } = this;
    /** @type {ConnectableWallet[]} */
    // @ts-ignore
    const newWallets = allWallets.filter((w) => {
      for (const feature of requiredFeatures) {
        if (!w.features[feature]) {
          return false;
        }
      }
      return true;
    });

    const { connectedWallet } = this;
    if (connectedWallet !== null) {
      const hasConnected =
        newWallets.findIndex((w) => w.name === connectedWallet.name) >= 0;
      if (!hasConnected) {
        this.#connectedWallet = null;
      }
    }

    const btns = this.querySelectorAll("button");
    const newWalletsToAppend = newWallets.slice(btns.length);

    for (let i = 0; i < btns.length; i++) {
      const newWallet = newWallets[i];
      const btn = btns[i];
      if (!newWallet) {
        for (let del = i; del < btns.length; del++) {
          this.removeChild(btns[del]);
        }
        break;
      }

      if (btn.name !== newWallet.name) {
        this.replaceChild(this.createButton(newWallet), btn);
      }
    }

    for (let i = 0; i < newWalletsToAppend.length; i++) {
      const newWalletToAppend = newWalletsToAppend[i];
      this.appendChild(this.createButton(newWalletToAppend));
    }

    this.#wallets = newWallets;
  }

  /**
   *
   * @param {ConnectableWallet} wallet
   * @returns {HTMLButtonElement}
   */
  createButton(wallet) {
    const btn = document.createElement("button");
    btn.type = "button";

    const icon = document.createElement("img");
    icon.src = wallet.icon;
    icon.alt = `${wallet.name} wallet icon`;
    btn.appendChild(icon);

    const txt = document.createTextNode(wallet.name);
    btn.appendChild(txt);

    btn.onclick = () => {
      this.disconnect();
      wallet.features["standard:connect"].connect().then(() => {
        this.#connectedWallet = wallet;
        const evt = new CustomEvent(WALLET_CONNECTED_EVENT_TYPE, {
          detail: this.#connectedWallet,
          bubbles: true,
        });
        this.dispatchEvent(evt);
      });
    };

    return btn;
  }
}
