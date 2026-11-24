export function sample(input, source, index, channel) {
  const offset = source === 'b' ? 313 : 811;
  const beat = (index + channel * 37 + offset) % 128;
  return ((beat < 64 ? beat : 127 - beat) - 32) / 32;
}
export function tap(input, source, channel, index) {
  const factor = source === 'b' ? 1 : -1;
  const centered = (index * (7 + channel * 2) % 31) - 15;
  return factor * centered / (128 * Math.sqrt(input.kernelSize));
}
