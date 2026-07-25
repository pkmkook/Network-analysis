import type { StandardRecord } from "@/types/network";

type WeightedOption<T> = {
  value: T;
  weight: number;
};

const districts: Record<string, string[]> = {
  中西区: ["中环", "西营盘", "石塘咀", "坚尼地城", "上环"],
  湾仔区: ["湾仔", "铜锣湾", "跑马地", "大坑", "天后"],
  东区: ["北角", "鲗鱼涌", "筲箕湾", "柴湾", "小西湾"],
  南区: ["香港仔", "黄竹坑", "赤柱", "薄扶林", "鸭脷洲"],
  油尖旺区: ["尖沙咀", "旺角", "佐敦", "油麻地", "大角咀"],
  深水埗区: ["深水埗", "长沙湾", "荔枝角", "石硖尾", "又一村"],
  九龙城区: ["红磡", "何文田", "土瓜湾", "九龙城", "启德"],
  黄大仙区: ["黄大仙", "钻石山", "新蒲岗", "慈云山", "横头磡"],
  观塘区: ["观塘", "蓝田", "油塘", "九龙湾", "秀茂坪"],
  葵青区: ["葵涌", "青衣", "荔景", "葵芳", "长青"],
  荃湾区: ["荃湾", "深井", "汀九", "梨木树", "马湾"],
  屯门区: ["屯门市中心", "良景", "蝴蝶湾", "扫管笏", "龙鼓滩"],
  元朗区: ["元朗市中心", "天水围", "洪水桥", "锦田", "八乡"],
  北区: ["上水", "粉岭", "沙头角", "打鼓岭", "皇后山"],
  大埔区: ["大埔墟", "太和", "汀角", "白石角", "船湾"],
  沙田区: ["沙田", "马鞍山", "火炭", "大围", "石门"],
  西贡区: ["将军澳", "西贡市", "坑口", "清水湾", "调景岭"],
  离岛区: ["东涌", "愉景湾", "长洲", "梅窝", "坪洲"],
};

export const DISTRICT_NAMES = Object.keys(districts);
export const SCENARIOS = [
  "住宅屋苑",
  "写字楼",
  "商场",
  "港铁站",
  "港铁列车",
  "巴士/道路",
  "医院",
  "大学校园",
  "机场",
  "口岸",
  "餐厅",
  "公园/户外",
  "乡村/郊野",
];

export const NETWORK_TYPES = ["5G", "4G", "4G/5G切换"];
export const TIME_PERIODS = ["早高峰", "午间", "晚高峰", "非高峰", "深夜"];
export const ISSUE_TYPES = [
  "无明显问题",
  "信号弱",
  "网速慢",
  "有信号无法上网",
  "通话断续",
  "无法拨出电话",
  "无法接听电话",
  "网络频繁切换",
  "高延迟",
  "室内覆盖差",
];

const apps = [
  "WhatsApp Call",
  "WeChat Call",
  "YouTube",
  "Instagram",
  "Facebook",
  "TikTok",
  "Netflix",
  "Google Maps",
  "Zoom/Teams",
  "网页浏览",
  "网上游戏",
  "其他",
];

const issueWeights: WeightedOption<string>[] = [
  { value: "无明显问题", weight: 0.36 },
  { value: "信号弱", weight: 0.12 },
  { value: "网速慢", weight: 0.18 },
  { value: "有信号无法上网", weight: 0.08 },
  { value: "通话断续", weight: 0.09 },
  { value: "无法拨出电话", weight: 0.04 },
  { value: "无法接听电话", weight: 0.03 },
  { value: "网络频繁切换", weight: 0.04 },
  { value: "高延迟", weight: 0.03 },
  { value: "室内覆盖差", weight: 0.03 },
];

const reasonsMap: Record<string, string> = {
  无明显问题: "无",
  信号弱: "室内或特定地点信号偏弱",
  网速慢: "繁忙时段下载速度较慢",
  有信号无法上网: "显示有信号但应用无法连接网络",
  通话断续: "语音或OTT通话断断续续、有杂音",
  无法拨出电话: "电话无法拨出或拨号失败",
  无法接听电话: "来电无法接听或漏接",
  网络频繁切换: "4G/5G网络频繁切换导致体验不稳定",
  高延迟: "游戏、视频或网页加载延迟较高",
  室内覆盖差: "住宅、商场或办公室内覆盖不足",
};

const suggestionsMap: Record<string, string> = {
  无明显问题: "整体网络体验良好，建议持续维持服务稳定性",
  信号弱: "建议加强住宅及室内场景的网络覆盖",
  网速慢: "建议在繁忙时段扩容并优化网络资源分配",
  有信号无法上网: "建议排查数据承载及网络接入稳定性",
  通话断续: "建议优化语音网络质量及移动场景切换表现",
  无法拨出电话: "建议检查语音服务稳定性及VoLTE相关配置",
  无法接听电话: "建议改善来电接通率并加强异常监控",
  网络频繁切换: "建议优化4G/5G切换策略，减少频繁跳网",
  高延迟: "建议降低高峰时段时延并改善游戏和视频体验",
  室内覆盖差: "建议在重点楼宇、商场及屋苑补充室内覆盖",
};

function createRandom(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normal(random: () => number, mean: number, stdDev: number) {
  const u = Math.max(random(), 1e-9);
  const v = Math.max(random(), 1e-9);
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + z * stdDev;
}

function weightedPick<T>(random: () => number, options: WeightedOption<T>[]) {
  const total = options.reduce((sum, option) => sum + option.weight, 0);
  const target = random() * total;
  let current = 0;

  for (const option of options) {
    current += option.weight;
    if (target <= current) {
      return option.value;
    }
  }

  return options[options.length - 1].value;
}

function pick<T>(random: () => number, values: T[]) {
  return values[Math.floor(random() * values.length)];
}

function oneDecimal(random: () => number, min: number, max: number) {
  return Number((min + random() * (max - min)).toFixed(1));
}

function formatDate(dayOffset: number) {
  const start = new Date("2026-01-01T00:00:00");
  start.setDate(start.getDate() + dayOffset);
  return start.toISOString().slice(0, 10);
}

export function generateDemoDataset(size = 2000): StandardRecord[] {
  const random = createRandom(20260720);
  const networkWeights: WeightedOption<string>[] = [
    { value: "5G", weight: 0.53 },
    { value: "4G", weight: 0.3 },
    { value: "4G/5G切换", weight: 0.17 },
  ];
  const timeWeights: WeightedOption<string>[] = [
    { value: "早高峰", weight: 0.22 },
    { value: "午间", weight: 0.16 },
    { value: "晚高峰", weight: 0.31 },
    { value: "非高峰", weight: 0.22 },
    { value: "深夜", weight: 0.09 },
  ];
  const result: StandardRecord[] = [];

  for (let index = 1; index <= size; index += 1) {
    const district = pick(random, DISTRICT_NAMES);
    const area = pick(random, districts[district]);
    const scenario = pick(random, SCENARIOS);
    const networkType = weightedPick(random, networkWeights);
    const timePeriod = weightedPick(random, timeWeights);
    const issueType = weightedPick(random, issueWeights);
    const baseSpeed = networkType === "5G" ? 70 : networkType === "4G" ? 28 : 45;
    const peakFactor =
      timePeriod === "晚高峰" ? 0.65 : timePeriod === "早高峰" ? 0.82 : 1;
    const scenarioFactor =
      scenario === "港铁列车" || scenario === "港铁站" || scenario === "乡村/郊野"
        ? 0.7
        : 1;

    let speedFactor = 1;
    if (issueType === "网速慢") {
      speedFactor = 0.25;
    } else if (issueType === "信号弱" || issueType === "室内覆盖差") {
      speedFactor = 0.4;
    } else if (issueType === "有信号无法上网") {
      speedFactor = 0.15;
    }

    const download = Math.max(
      0.3,
      normal(random, baseSpeed * peakFactor * scenarioFactor * speedFactor, 8),
    );
    const upload = Math.max(0.1, download * (0.12 + random() * 0.16));
    let latency = Math.max(
      8,
      normal(random, networkType === "5G" ? 28 : 43, 12),
    );
    let jitter = Math.max(1, normal(random, 8, 4));
    let packetLoss = Math.max(0, normal(random, 0.7, 0.8));

    if (
      issueType === "通话断续" ||
      issueType === "高延迟" ||
      issueType === "网络频繁切换"
    ) {
      latency += 25 + random() * 55;
      jitter += 8 + random() * 17;
      packetLoss += 1 + random() * 4;
    }

    let rsrp = 0;
    let sinr = 0;
    if (issueType === "信号弱" || issueType === "室内覆盖差") {
      rsrp = oneDecimal(random, -125, -108);
      sinr = oneDecimal(random, -5, 7);
    } else if (issueType === "无明显问题") {
      rsrp = oneDecimal(random, -98, -78);
      sinr = oneDecimal(random, 12, 28);
    } else {
      rsrp = oneDecimal(random, -110, -88);
      sinr = oneDecimal(random, 2, 16);
    }

    const satisfaction =
      issueType === "无明显问题"
        ? weightedPick(random, [
            { value: "非常满意", weight: 0.36 },
            { value: "满意", weight: 0.54 },
            { value: "一般", weight: 0.1 },
          ])
        : weightedPick(random, [
            { value: "非常不满意", weight: 0.2 },
            { value: "不满意", weight: 0.48 },
            { value: "一般", weight: 0.26 },
            { value: "满意", weight: 0.06 },
          ]);

    const complaint =
      satisfaction === "非常不满意" || satisfaction === "不满意" ? "是" : "否";
    const resolutionHours =
      complaint === "是" ? Number((6 + random() * 58).toFixed(1)) : 0;
    const repeatedFeedback = weightedPick(random, [
      { value: "是", weight: 0.18 },
      { value: "否", weight: 0.82 },
    ]);

    result.push({
      sourceRow: index,
      recordId: `HK-NQ-${String(index).padStart(5, "0")}`,
      feedbackDate: formatDate(Math.floor(random() * 200)),
      district,
      area,
      scenario,
      networkType,
      timePeriod,
      app: pick(random, apps),
      deviceSystem: weightedPick(random, [
        { value: "iOS", weight: 0.54 },
        { value: "Android", weight: 0.46 },
      ]),
      downloadMbps: Number(download.toFixed(2)),
      uploadMbps: Number(upload.toFixed(2)),
      latencyMs: Number(latency.toFixed(1)),
      jitterMs: Number(jitter.toFixed(1)),
      packetLossPct: Number(packetLoss.toFixed(2)),
      rsrpDbm: rsrp,
      sinrDb: sinr,
      issueType,
      satisfaction,
      complaint,
      dissatisfactionReason: complaint === "是" ? reasonsMap[issueType] : "无",
      userSuggestion: suggestionsMap[issueType],
      resolutionHours,
      slaStatus:
        complaint === "是" ? (resolutionHours > 48 ? "超时" : "达标") : "不适用",
      repeatedFeedback,
    });
  }

  return result;
}
