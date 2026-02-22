// Normalize product shape coming from the API so UI code can safely assume arrays
// for `sizes` and `shoeSizes` even if the backend stored comma‑separated strings
// or null values.
const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [];
};

const normalizeProduct = (product) => {
  if (!product) return product;
  return {
    ...product,
    sizes: normalizeList(product.sizes),
    shoeSizes: normalizeList(product.shoeSizes),
  };
};

export { normalizeProduct, normalizeList };
export default normalizeProduct;
