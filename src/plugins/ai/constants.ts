export const AI_ENABLED_POWERUP_CODE = 'aiEnabled_powerup';
export const AI_ENABLED_POWERUP_NAME = 'AI On';

export const AI_ACTION_POWERUP_CODE = 'aiAction_powerup';
export const AI_ACTION_POWERUP_NAME = 'AI Action';

export const AI_PROMPT_POWERUP_CODE = 'aiPrompt_powerup';
export const AI_PROMPT_POWERUP_NAME = 'AI Prompt';

export const aiSlots = {
  prompt: 'prompt',
  data: 'data',
  status: 'status',
};

export type AiSlots = keyof typeof aiSlots;
