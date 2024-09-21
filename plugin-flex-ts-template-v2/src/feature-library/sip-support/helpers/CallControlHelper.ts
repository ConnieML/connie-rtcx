import { ITask, Manager } from '@twilio/flex-ui';

import { CustomWorkerAttributes } from '../../../types/task-router/Worker';

const manager = Manager.getInstance();

export const isWorkerUsingWebRTC = (): boolean => {
  return (manager.workerClient?.attributes as CustomWorkerAttributes)?.contact_uri.startsWith('client:');
};

// Attempt to get the call SID for the participant from the task (default),
// or from task attributes (for example if the UI was reloaded and note in state)
export const getLocalParticipantForTask = (task: ITask) => {
  return (
<<<<<<< HEAD
    task.conference?.participants.find((p) => p.isCurrentWorker && p.status === 'joined')?.callSid ||
=======
    task.conference?.participants.find((p) => p.isCurrentWorker)?.callSid ||
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814
    task.attributes?.conference?.participants?.worker ||
    task.attributes?.worker_call_sid
  );
};

// Attempt to get the conference SID from the task (default),
// or from task attributes (for example if the UI was reloaded and note in state)
export const getConferenceSidFromTask = (task: ITask) => {
  return task.conference?.conferenceSid || task?.attributes?.conference?.sid;
};
