# 在线音色适配的稳定格型声道变换与伴随

这里的麦克风时钟和系数是用于设备联调的合成资料。使用 Node.js 22。运行 `npm ci --offline` 核对依赖锁，`npm run inspect` 查看资料字段，`npm test` 检查资料格式及相互引用。检视脚本只读取元数据。

## 数据格式

profile 包含采样率、最大阶数、反射系数开区间和稳定余量。lattice 使用 real 值分析/合成约定 A(z)=1+Σ a_k z^-k，反射系数按 Levinson 约定定义 a_k。离散训练损失为各输出采样乘对应 upstream 后求和，梯度对应已交付路径。设备处理量上限以 maxOpsPerSample 计浮点加乘，短暂切换允许接合窗额外预算 switchOps；内存以 workBytes 计。声道帧 key=[utterance,clockEpoch,physicalIndex]，同一物理 Index 的重叠在 epochMap 中明确，原始值由音频驱动正常承载。handover 声明切换点处的新幅标 scale 与允许使用真实过去样本的范围。重叠在两个驱动包不相符时先保持原已交付声道座标，新包中有争议样本不能成为训练正例。候选系数序列和静音段均由 voice-blocks.mjs 生成。 驱动按每 128 个规范采样批准一个系数向量。稳定上界为 |k_i|≤1−margin。只采用从 0 开始的连续前缀，第一个系数超界或该阶前的有权残余能量不足即停止。静音以 energy 门限判断，初始延时状态为零。跨麦校准后的两端首选复用本来等价的物理历史，不等价时准许在 crossfade 的双可用历史内交叉淡入，之后只用新链。输出峰值超限的片段不能直接播放。训练区由调用方给其实际播放版和同长度 upstream。 voiceSamples 可选择故障修订，第三项 true 注入新麦重叠里的重复但数值不相符。故障只覆盖那一次报告的物理位置。

## 取数

`inputs/voice-blocks.json` 保存标定、规格和调用记录。记录中的范围除明确说明外从零开始，使用半开区间。批量数组按调用记录列出的顺序交付。voiceSamples(page,epoch)、voiceCoefficients(page,epoch) 和 voiceLoss(page) 返回声道输入、参数和上游伴随。
