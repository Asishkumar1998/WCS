export const CART_UPDATED_EVENT = "wcs:cart-updated";

export const emitCartUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};
