export const AI_ENABLED_POWERUP_CODE = 'aiEnabled_powerup';
export const AI_ENABLED_POWERUP_NAME = 'AI On';

export const AI_ACTION_POWERUP_CODE = 'aiAction_powerup';
export const AI_ACTION_POWERUP_NAME = 'AI Action';

export const AI_PROMPT_POWERUP_CODE = 'aiPrompt_powerup';
export const AI_PROMPT_POWERUP_NAME = 'AI Prompt';

export const AI_PARAMAS_POWERUP_CODE = 'aiParmas_powerup';
export const AI_PARAMAS_POWERUP_NAME = 'AI Params';

export const aiSlots = {
  prompt: 'prompt',
  data: 'data',
  status: 'status',
  tone: 'tone',
  params: 'params',
};

export const aiPromptSlots = {
  zhName: 'zhName',
  prompt: 'prompt',
  enabled: 'enabled',
  scene: 'scene',
  order: 'order',
};

export type AiSlots = keyof typeof aiSlots;
