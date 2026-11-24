import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const qualification = JSON.parse(readFileSync(new URL('../inputs/qualification.json', import.meta.url), 'utf8'));

const { sample, tap } = await import('../inputs/qualification.mjs');
test('跨源重叠同时存在未到的旧源采样和可用的新源帧', () => {
  const missing = qualification.events.find(([kind]) => kind === 'missing');
  const timing = qualification.sources[missing[1]];
  const gapTime = timing.originUs + timing.sampleUs * missing[2];
  assert.ok(gapTime > qualification.ramp[0] && gapTime < qualification.ramp[1]);
  assert.ok(qualification.sources.p.originUs < gapTime);
  assert.notEqual(sample(qualification, 'b', 49, 1), sample(qualification, 'p', 49, 1));
  assert.notEqual(tap(qualification, 'b', 1, 49), tap(qualification, 'p', 1, 49));
  assert.ok(qualification.kernelSize > qualification.packetFrames);
  assert.ok(2 * qualification.sampleCount * qualification.channels * 8 > qualification.maxWorkBytes);
});
