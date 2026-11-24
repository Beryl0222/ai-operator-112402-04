import {readFileSync} from 'node:fs';
import * as input from './inputs/voice-blocks.mjs';

const source=JSON.parse(readFileSync(new URL('./inputs/voice-blocks.json',import.meta.url),'utf8'));
console.log(JSON.stringify({名称:'麦克风时钟和系数',首项:source['sampleRate'],字段:Object.keys(source),取数函数:Object.keys(input)},null,2));
