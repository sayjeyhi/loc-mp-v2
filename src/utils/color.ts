export const shadeColor = (color: string, percent: number) => {
  const num = parseInt(color.replace("#", ""), 16);
  const r = num >> 16;
  const g = (num >> 8) & 0x00ff;
  const b = num & 0x0000ff;

  const t = percent < 0 ? 0 : 255; // target: black or white
  const p = Math.abs(percent) / 100;

  const R = Math.round((t - r) * p + r);
  const G = Math.round((t - g) * p + g);
  const B = Math.round((t - b) * p + b);

  return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
};
