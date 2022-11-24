export function unpackByte(b: number, n: number): number[] {
  if (n < 0 || n > 8 || 8 % n !== 0) {
    throw new Error("invalid pack size");
  }
  const out = new Array(8 / n);
  for (let ii = 0; ii < out.length; ii++) {
    out[ii] = (b >> (8 - n * (ii + 1))) & ((1 << n) - 1);
  }
  return out;
}
