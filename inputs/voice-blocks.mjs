import {readFileSync} from 'node:fs';
const data = JSON.parse(readFileSync(new URL('./voice-blocks.json', import.meta.url), 'utf8'));
export function voiceSamples(page, epoch, corrected = false) {
  return Float64Array.from({length: data.block}, (_, i) => {
    const key = page * data.block + i;
    if (key >= data.frames || data.silence.some(([lo, hi]) => key >= lo && key < hi)) return 0;
    const amplitude = 0.45 * Math.sin(key * Math.PI / 12.5) + 0.08 * Math.cos(key * Math.PI / 7);
    const adjustment = corrected && epoch === data.fault.epoch && key === data.fault.index ? data.fault.offset : 0;
    return epoch ? amplitude * data.handover.scale + adjustment : amplitude;
  });
}
export function voiceCoefficients(page, epoch) {
  return Float64Array.from({length: data.maxOrder}, (_, i) => {
    return i < data.coefficients.length ? data.coefficients[(i + epoch + page) % data.coefficients.length]
      : Math.sin(i + .3 * page) * .01;
  });
}
export function voiceLoss(page) {
  return Float64Array.from({length: data.block}, (_, i) => Math.sin((page * data.block + i) * .011));
}
