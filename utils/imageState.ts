export const IMAGE_STATE_KEY = 'de_survival_simulator_image_state_v1';

export type ImageState = {
  ok: string[]; // 已成功加载过的图片（只从这里随机/入相册）
  sceneByScenario?: Record<string, string>;
  descByScenario?: Record<string, string>;
};

export const readImageState = (): ImageState => {
  try {
    const raw = localStorage.getItem(IMAGE_STATE_KEY);
    if (!raw) return { ok: [], sceneByScenario: {}, descByScenario: {} };
    const parsed = JSON.parse(raw);
    return {
      ok: Array.isArray(parsed?.ok) ? parsed.ok.filter(Boolean) : [],
      sceneByScenario: parsed?.sceneByScenario && typeof parsed.sceneByScenario === 'object' ? parsed.sceneByScenario : {},
      descByScenario: parsed?.descByScenario && typeof parsed.descByScenario === 'object' ? parsed.descByScenario : {}
    };
  } catch {
    return { ok: [], sceneByScenario: {}, descByScenario: {} };
  }
};

export const writeImageState = (next: ImageState) => {
  try {
    localStorage.setItem(IMAGE_STATE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota
  }
};

export const preloadImage = (src: string) =>
  new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });

