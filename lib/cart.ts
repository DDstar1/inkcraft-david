// Lightweight localStorage cart. Works across pages without a context provider.

export type CartItem = {
  garmentSlug: string;
  garmentName: string;
  garmentImageUrl: string;
  price: number;
  qty: number;
};

const KEY = "inkcraft_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("inkcraft_cart_change"));
}

export function addToCart(item: Omit<CartItem, "qty">) {
  const cart = getCart();
  const existing = cart.find((c) => c.garmentSlug === item.garmentSlug);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
}

export function removeFromCart(slug: string) {
  saveCart(getCart().filter((c) => c.garmentSlug !== slug));
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((s, i) => s + i.qty, 0);
}
