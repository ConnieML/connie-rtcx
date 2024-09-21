import { Actions, ConferenceParticipant, ITask, Manager, TaskHelper, VERSION as FlexVersion } from '@twilio/flex-ui';
import { Call, Device } from '@twilio/voice-sdk';

import logger from '../../../utils/logger';

<<<<<<< HEAD
export const MultiCallDevices: Device[] = [];
export const MultiCallCalls: Call[] = [];

const createNewDevice = (manager: Manager): Device => {
=======
export let SecondDevice: Device | null = null;
export let SecondDeviceCall: Call | null = null;
export let FlexDeviceCall: Call | null = null;

const createNewDevice = (manager: Manager) => {
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { acceptOptions, audioConstraints, ...customDeviceOptions } = manager.configuration.sdkOptions?.voice ?? {};

  const deviceOptions = {
    allowIncomingWhileBusy: false,
    ...customDeviceOptions,
    codecPreferences: customDeviceOptions?.codecPreferences as Call.Codec[] | undefined,
    appName: 'flex-ui',
    appVersion: FlexVersion,
  };

  if (!deviceOptions.codecPreferences) {
    // The voice SDK throws an error when codecPreferences is set to undefined
    delete deviceOptions.codecPreferences;
  }

  const device = new Device(manager.voiceClient.token ?? '', deviceOptions);

  if (audioConstraints) {
    try {
      device.audio?.setAudioConstraints(audioConstraints);
    } catch (error) {
      device.audio?.unsetAudioConstraints();
    }
  }

<<<<<<< HEAD
  return device;
};

const muteCall = (callSid: string, mute: boolean) => {
  const call = getCall(callSid);
  if (call) {
    call.mute(mute);
  }
};

export const getCall = (callSid: string): Call | null => {
  const targetCall = MultiCallCalls.find((call: Call) => call.parameters.CallSid === callSid);

  if (targetCall) {
    return targetCall;
  }

  return null;
};

export const getMyCallSid = (task: ITask): string | null | undefined => {
  let callSid = null;

  if (task && task.conference && task.conference.participants) {
    callSid = task.conference.participants
      .sort((a, b) => (b.mediaProperties?.sequenceNumber || 0) - (a.mediaProperties?.sequenceNumber || 0))
      .find((p) => p.isCurrentWorker && p.status === 'joined' && p.callSid)?.callSid;
=======
  SecondDevice = device;
};

const destroySecondDevice = () => {
  if (SecondDevice?.state === 'destroyed') {
    // SecondDevice is not valid already
    return;
  }
  SecondDevice?.destroy();
  logger.debug('[multi-call] SecondDevice destroyed');
};

const muteCall = (callSid: string, mute: boolean) => {
  if (FlexDeviceCall && FlexDeviceCall.parameters.CallSid === callSid) {
    FlexDeviceCall.mute(mute);
  } else if (SecondDeviceCall && SecondDeviceCall.parameters.CallSid === callSid) {
    SecondDeviceCall.mute(mute);
  }
};

export const getMyCallSid = (task: ITask): string | null => {
  let callSid = null;

  if (task && task.conference && task.conference.participants) {
    task.conference.participants.forEach((p: ConferenceParticipant) => {
      // Find our worker in the list of participants to get the call SID.
      if (p.isCurrentWorker && p.callSid) {
        callSid = p.callSid;
      }
    });
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814
  }

  return callSid;
};

<<<<<<< HEAD
export const holdOtherCalls = (ignoreCallSid?: string) => {
  Manager.getInstance()
    .store.getState()
    .flex.worker.tasks.forEach((task) => {
      if (task.taskStatus !== 'assigned') return;

      const callSid = getMyCallSid(task);

      if (ignoreCallSid && callSid === ignoreCallSid) return;

      if (callSid) {
        // mute the call: even though we're holding it, the worker may still be recorded
=======
const holdOtherCalls = (ignoreCallSid: string) => {
  Manager.getInstance()
    .store.getState()
    .flex.worker.tasks.forEach((task) => {
      const callSid = getMyCallSid(task);

      if (callSid === ignoreCallSid) return;

      if (callSid) {
        // mute the call: even though we're holding it, the worker is still being recorded
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814
        muteCall(callSid, true);
      }

      // hold individual participants in case of a multi-party conference
<<<<<<< HEAD
      if (task?.conference?.participants) {
        task.conference.participants.forEach((p: ConferenceParticipant) => {
          if (!p.isCurrentWorker && p.status === 'joined' && !p.onHold) {
            try {
              Actions.invokeAction('HoldParticipant', {
                participantType: p.participantType,
                task,
                targetSid: p.participantType === 'worker' ? p.workerSid : p.callSid,
              });
            } catch (error: any) {
              logger.error('[multi-call] Error holding participant', error);
            }
=======
      if (task && task.conference && task.conference.participants) {
        task.conference.participants.forEach((p: ConferenceParticipant) => {
          if (!p.isCurrentWorker && p.status === 'joined') {
            Actions.invokeAction('HoldParticipant', {
              participantType: p.participantType,
              task,
              targetSid: p.participantType === 'worker' ? p.workerSid : p.callSid,
            });
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814
          }
        });
      }
    });
};

export const handleUnhold = (payload: any) => {
  let task;

  if (payload.task) {
    task = payload.task;
  } else if (payload.sid) {
    task = TaskHelper.getTaskByTaskSid(payload.sid);
  }

  const callSid = getMyCallSid(task);

  if (callSid) {
    // unmute the call, which we muted if we held it
    muteCall(callSid, false);

    // pass in the SID of the call we just unheld so that it doesn't get held again
    holdOtherCalls(callSid);
  }
};

<<<<<<< HEAD
const updateCallState = (manager: Manager, endedCall: Call, device?: Device) => {
  if (MultiCallCalls.length < 1) {
    return;
  }
  if (device && manager.store.getState().flex?.phone?.activeCall?.parameters.CallSid !== endedCall.parameters.CallSid) {
    // The call that ended wasn't the one in state, so we don't need to do anything
    // However, if device is null, this call used the Flex device. We always want to update state in that case, as Flex's built-in handlers remove it from state.
    return;
  }
  // Another call is still in flight, so put it into state
  // Otherwise Flex thinks there is no call and disables some functionality
  // Try to use the selected task if possible
  let selectedCall = MultiCallCalls[0];
  const selectedTaskSid = manager.store.getState().flex?.view?.selectedTaskSid;
  if (selectedTaskSid) {
    const selectedCallSid = getMyCallSid(TaskHelper.getTaskByTaskSid(selectedTaskSid));
    if (selectedCallSid) {
      const foundCall = getCall(selectedCallSid);
      if (foundCall) {
        selectedCall = foundCall;
      }
    }
  }
  try {
    manager.store.dispatch({ type: 'PHONE_ADD_CALL', payload: selectedCall });
  } catch (error: any) {
    logger.error('[multi-call] Unable to update phone state', error);
  }
};

const setAudioDevices = async (manager: Manager, device: Device) => {
  const speakerDevices = manager.voiceClient?.audio?.speakerDevices.get();
=======
const handleFlexCallDisconnect = (call: Call) => {
  logger.debug('[multi-call] FlexDeviceCall disconnect', call);
  FlexDeviceCall = null;

  if (SecondDeviceCall) {
    // SecondDeviceCall is still in flight, so put it into state
    // Otherwise Flex thinks there is no call and disables some functionality
    Manager.getInstance().store.dispatch({ type: 'PHONE_ADD_CALL', payload: SecondDeviceCall });
  } else {
    // No more calls; destroy the SecondDevice as it is no longer needed.
    destroySecondDevice();
  }
};

const handleFlexCallReject = () => {
  logger.debug('[multi-call] FlexDeviceCall reject');
  FlexDeviceCall = null;

  if (SecondDeviceCall) {
    // SecondDeviceCall is still in flight, so put it into state
    // Otherwise Flex thinks there is no call and disables some functionality
    Manager.getInstance().store.dispatch({ type: 'PHONE_ADD_CALL', payload: SecondDeviceCall });
  } else {
    // No more calls; destroy the SecondDevice as it is no longer needed.
    destroySecondDevice();
  }
};

const handleSecondDeviceRegistered = () => {
  logger.debug('[multi-call] SecondDevice registered');

  const speakerDevices = Manager.getInstance().voiceClient?.audio?.speakerDevices.get();
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814

  if (speakerDevices && speakerDevices.size > 0) {
    speakerDevices.forEach((speaker) => {
      if (speaker.deviceId === 'default') {
        // default is the default, no need to do anything
        return;
      }

      try {
<<<<<<< HEAD
        device?.audio?.speakerDevices.set(speaker.deviceId);
=======
        SecondDevice?.audio?.speakerDevices.set(speaker.deviceId);
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814
        logger.info(`[multi-call] Set output device to ${speaker.label}`);
      } catch (error: any) {
        logger.error('[multi-call] Unable to change output device', error);
      }
    });
  }
<<<<<<< HEAD

  if (manager.voiceClient.audio?.inputDevice?.deviceId) {
    try {
      await device?.audio?.setInputDevice(manager.voiceClient.audio.inputDevice.deviceId);
    } catch (error: any) {
      logger.error('[multi-call] Unable to change input device', error);
    }
  }
};

const destroyDevice = (device: Device) => {
  if (device?.state === 'destroyed') {
    // Device is not valid already
    return;
  }
  device?.destroy();
  logger.debug('[multi-call] Multi-call device destroyed');
};

const handleCallEnd = (manager: Manager, call: Call, device?: Device) => {
  if (device) {
    const deviceIndex = MultiCallDevices.indexOf(device);
    if (deviceIndex >= 0) {
      MultiCallDevices.splice(deviceIndex, 1);
    }
  }
  const callIndex = MultiCallCalls.indexOf(call);
  if (callIndex >= 0) {
    MultiCallCalls.splice(callIndex, 1);
  }
  updateCallState(manager, call, device);
  if (device) {
    destroyDevice(device);
  }
};

const forwardCall = async (manager: Manager, connectToken: string | undefined) => {
  if (!connectToken) {
    logger.error('[multi-call] Incoming call has no connect token and cannot be forwarded to a new device.');
    return;
  }

  let device: Device;
  try {
    device = createNewDevice(manager);
  } catch (error: any) {
    logger.error('[multi-call] Error creating new device', error);
    return;
  }

  const { acceptOptions } = manager.configuration.sdkOptions?.voice ?? {};
  const connectOptions: Device.ConnectOptions = {
    connectToken,
  };
  if (acceptOptions?.rtcConfiguration) connectOptions.rtcConfiguration = acceptOptions.rtcConfiguration;
  if (acceptOptions?.rtcConstraints) connectOptions.rtcConstraints = acceptOptions.rtcConstraints;

  let call: Call;
  try {
    call = await device.connect(connectOptions);
  } catch (error: any) {
    logger.error('[multi-call] Error connecting call', error);
    return;
  }

  logger.debug('[multi-call] Multi-call accept', call);
  MultiCallDevices.push(device);
  MultiCallCalls.push(call);

  // set devices based on preference
  await setAudioDevices(manager, device);

  // put the current call in state
  manager.store.dispatch({ type: 'PHONE_ADD_CALL', payload: call });

  call.on('disconnect', (_innerCall: Call) => {
    logger.debug('[multi-call] Multi-call disconnect', call);
    handleCallEnd(manager, call, device);
  });

  call.on('reject', () => {
    logger.debug('[multi-call] Multi-call reject', call);
    handleCallEnd(manager, call, device);
  });
};

export const handleFlexCallIncoming = async (manager: Manager, call: Call) => {
  logger.debug('[multi-call] Flex device call incoming');

  if (manager.voiceClient?.isBusy) {
    await forwardCall(manager, call.connectToken);
    return;
  }

  MultiCallCalls.push(call);

  call.on('disconnect', (_innerCall) => {
    logger.debug('[multi-call] Flex device call disconnect', call);
    handleCallEnd(manager, call);
  });
  call.on('reject', () => {
    logger.debug('[multi-call] Flex device call reject');
    handleCallEnd(manager, call);
  });
=======
};

const handleSecondCallIncoming = (call: Call) => {
  const manager = Manager.getInstance();
  logger.debug('[multi-call] SecondDeviceCall incoming', call);

  call.on('accept', (_innerCall) => {
    logger.debug('[multi-call] SecondDeviceCall accept', call);
    SecondDeviceCall = call;

    // place other calls on hold
    holdOtherCalls(SecondDeviceCall?.parameters.CallSid ?? '');

    // put the current call in state
    manager.store.dispatch({ type: 'PHONE_ADD_CALL', payload: SecondDeviceCall });
  });

  call.on('disconnect', (_innerCall: Call) => {
    logger.debug('[multi-call] SecondDeviceCall disconnect', call);
    SecondDeviceCall = null;

    if (!FlexDeviceCall) {
      // No more calls; destroy the SecondDevice as it is no longer needed.
      destroySecondDevice();
    }
  });

  // auto-accept the call (we get here when the worker _accepts_ the task)
  if (manager.configuration.initialDeviceCheck && manager.voiceClient.audio?.inputDevice?.deviceId) {
    SecondDevice?.audio?.setInputDevice(manager.voiceClient.audio.inputDevice.deviceId).then(() => {
      call.accept(manager.configuration.sdkOptions?.voice?.acceptOptions);
    });
  } else {
    call.accept(manager.configuration.sdkOptions?.voice?.acceptOptions);
  }
};

export const handleFlexCallIncoming = (manager: Manager, call: Call) => {
  logger.debug('[multi-call] FlexDeviceCall incoming');

  FlexDeviceCall = call;
  call.on('disconnect', handleFlexCallDisconnect);
  call.on('reject', handleFlexCallReject);

  let newDevice = false;

  if (!SecondDevice || SecondDevice?.state === 'destroyed') {
    // Create a new device so that an additional incoming call can be handled
    createNewDevice(manager);
    newDevice = true;
  } else if (SecondDeviceCall) {
    // place other calls on hold
    holdOtherCalls(FlexDeviceCall?.parameters.CallSid ?? '');
  }

  if (!newDevice) {
    // Do nothing else, SecondDevice is already good to go
    return;
  }

  // register listeners for the new SecondDevice
  SecondDevice?.on('incoming', handleSecondCallIncoming);
  SecondDevice?.on('registered', handleSecondDeviceRegistered);
  SecondDevice?.on('error', (error) => {
    logger.error('[multi-call] Error in SecondDevice', error);
  });

  // register the new device with Twilio
  SecondDevice?.register();
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814
};
