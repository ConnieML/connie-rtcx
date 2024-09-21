import * as Flex from '@twilio/flex-ui';
import { SSOTokenPayload } from '@twilio/flex-ui/src/core/TokenStorage';

<<<<<<< HEAD
import { MultiCallDevices } from '../../helpers/MultiCallHelper';
=======
import { SecondDevice } from '../../helpers/MultiCallHelper';
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814
import { FlexEvent } from '../../../../types/feature-loader';
import logger from '../../../../utils/logger';

export const eventName = FlexEvent.tokenUpdated;
export const eventHook = (flex: typeof Flex, manager: Flex.Manager, tokenPayload: SSOTokenPayload) => {
<<<<<<< HEAD
  MultiCallDevices.forEach((device) => {
    device.updateToken(tokenPayload.token);
  });
=======
  if (!SecondDevice) return;

  if (SecondDevice?.state === 'destroyed') {
    return;
  }

  SecondDevice?.updateToken(tokenPayload.token);
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814

  logger.info('[multi-call] Token updated');
};
