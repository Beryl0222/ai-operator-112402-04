import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const d = JSON.parse(readFileSync(new URL('../inputs/session.json', import.meta.url), 'utf8'));

test("格点相位落在抽取周期", () => {
  assert.ok(d.segments.every(s=>s.start<s.end && s.phase<d.stride));
});

test("所有数据包在各自录音段", () => {
  assert.ok(d.packets.every(p=>d.segments.some(s=>s.id===p.segment && s.start<=p.start && p.start+p.samples.length<=s.end)));
});

test("卷积输出与通道混合维数", () => {
  assert.ok(d.depthwise.length===d.mix[0].length && d.mix.length===d.bias.length);
});
