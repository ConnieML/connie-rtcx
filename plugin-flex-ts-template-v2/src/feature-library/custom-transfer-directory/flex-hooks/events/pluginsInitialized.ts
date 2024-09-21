import { Notifications } from '@twilio/flex-ui';

<<<<<<< HEAD
import { isExternalDirectoryEnabled, isVoiceXWTEnabled, getExternalDirectory } from '../../config';
=======
import { isExternalDirectoryEnabled, isFeatureEnabled, isVoiceXWTEnabled } from '../../config';
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814
import { FlexEvent } from '../../../../types/feature-loader';
import { registerStartExternalColdTransfer } from '../custom-actions/startExternalColdTransfer';
import { CustomTransferDirectoryNotification } from '../notifications/CustomTransferDirectory';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = () => {
<<<<<<< HEAD
  registerStartExternalColdTransfer();
  if (isExternalDirectoryEnabled() && !isVoiceXWTEnabled()) {
    Notifications.showNotification(CustomTransferDirectoryNotification.XWTFeatureDependencyMissing);
  }

  if (getExternalDirectory().length > 0) {
    console.warn(
      'custom-transfer-directory: external_directory.directory is deprecated. It is recommended to use the contacts feature to populate the external directory instead.',
    );
=======
  if (isFeatureEnabled()) {
    registerStartExternalColdTransfer();
    if (isExternalDirectoryEnabled() && !isVoiceXWTEnabled())
      Notifications.showNotification(CustomTransferDirectoryNotification.XWTFeatureDependencyMissing);
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814
  }
};
