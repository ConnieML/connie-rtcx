<<<<<<< HEAD
import { validateUiVersion } from '../../utils/configuration';
import logger from '../../utils/logger';
=======
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814
import { FeatureDefinition } from '../../types/feature-loader';
import { isFeatureEnabled } from './config';
// @ts-ignore
import hooks from './flex-hooks/**/*.*';

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
<<<<<<< HEAD
  if (!validateUiVersion('>= 2.8.0')) {
    logger.error('[multi-call] This feature requires Flex UI 2.8 or later and has been disabled.');
    return {};
  }
=======
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814
  return { name: 'multi-call', hooks: typeof hooks === 'undefined' ? [] : hooks };
};
