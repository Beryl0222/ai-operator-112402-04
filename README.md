# 字幕端侧前端的断段分组时域卷积

项目资料使用可独立读写的 JSON。Node.js 22.23.4 下运行 `npm ci --offline` 准备环境，然后运行 `npm run inspect` 检查合成数据字段，运行 `npm test` 校验样本引用及格式。

## 输入契约

样本按 [帧][通道]，深度核每通道一组，tap 下标 0 对应当前样本，其余向过去按 dilation 取样，同段开始之前用 0。混合权重按 [输出][通道]，再加 bias，并施加 ReLU。卷积浮点参考绝对误差不超过 2e-5。时间用整数微秒，某段采样 i 的时间为 originUs+(i-start)*sampleUs。stride 格点满足 (i-start) mod stride=phase，结束索引是开区间。不可补采样以零代入同时传播缺失为元数据，正常输入采样为零不计缺失。设备预算包括尚未领取的输出及可丢弃的历史。 readDeadlineUs 到达时仍可重试读状态，但未曾声明不可补的采样不得默默按零合成。

## 资料读取

样本位于 `inputs/session.json`，其中 `events` 是按到达顺序记下的操作，编号从零开始。packet 以零基下标引用音频包。unrecoverable 的参数为段 ID、采样索引；close 用段 ID 指示段结束。
