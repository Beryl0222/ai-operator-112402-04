import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import { voiceSamples, voiceCoefficients, voiceLoss } from '../inputs/voice-blocks.mjs';

const data=JSON.parse(readFileSync(new URL('../inputs/voice-blocks.json',import.meta.url),'utf8'));
test('麦克风时钟和系数的格式与关联', () => {
  const a=voiceSamples(63,0), b=voiceSamples(63,1);
  assert.equal(a.length,data.block);
  assert.equal(b.length,data.block);
  assert.ok(a.slice(0,32).some(v=>v===0));
  assert.ok(a.slice(64).every((v,i)=>v===2*b[i+64]));
  assert.ok(data.coefficients.some(v=>Math.abs(v)>1-data.margin));
  assert.ok(data.workBytes<data.frames*data.maxOrder*8);
  assert.notEqual(voiceSamples(63,1,true)[8173-8064],b[8173-8064]);
  assert.equal(voiceLoss(64).length,data.block);
});
