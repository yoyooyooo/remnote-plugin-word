import { usePlugin, Rem } from '@remnote/plugin-sdk';
import { queryAi } from '../../utils/openai';
import { generateMdToChildRems } from '../../utils/rem';
import { AI_ENABLED_POWERUP_CODE, AiSlots, tagEnableAI } from '../../plugins/ai';
import React from 'react';

export const useAiState = ({ rem }: { rem: Rem }) => {
  const plugin = usePlugin();

  const setState = React.useCallback((slotCode: AiSlots, value: string) => {
    rem?.setPowerupProperty(AI_ENABLED_POWERUP_CODE, slotCode, [JSON.stringify(value)]);
  }, []);
};
