---
sidebar_label: multi-call
title: multi-call
---

<<<<<<< HEAD
:::info Flex UI 2.8 or later required
This feature requires Flex UI 2.8 or later, as it depends on Twilio Voice SDK features that were unavailable prior to that version.
:::

Out of the box, Flex does not allow a single worker to have more than one call active at once. Due to this limitation, another worker cannot transfer a call to another worker if they already are on a call. This feature allows a worker to handle more than one call at once, and will automatically place other calls on hold when accepting a new call. As a result, a worker can gracefully handle a transferred call while already assigned another call, for example.
=======
Out of the box, Flex does not allow a single worker to have more than one call active at once. Due to this limitation, another worker cannot transfer a call to another worker if they already are on a call. This feature allows a worker to handle two calls at once, and will automatically place other calls on hold when accepting a new call. As a result, a worker can gracefully handle a transferred call while already assigned another call.
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814

![Multi-call demo](/img/features/multi-call/multi-call.gif)

## Setup and dependencies

This feature requires some TaskRouter configuration changes in addition to Flex configuration changes.

### TaskRouter

<<<<<<< HEAD
First, agents will need their capacity for the `voice` channel to be increased from 1 to a larger number. This can be done via the console, API, Single Sign On configuration, or via the `supervisor-capacity` plugin feature. This will enable TaskRouter to successfully transfer or assign a call to a worker that already has another call.

Now that workers can accept multiple calls, if you want to route inbound calls to only workers not already on a call, we need to update the TaskRouter workflow(s) so that agents are not routed multiple calls from the queue. For each workflow filter, set the target worker expression to `worker.channel.voice.available_capacity_percentage == 100`. If you already have a target worker expression defined, you will need to combine the logic with `AND`.
=======
First, agents will need their capacity for the `voice` channel to be increased from 1 to 2. This can be done via the console, API, Single Sign On configuration, or via the `supervisor-capacity` plugin feature. This will enable TaskRouter to successfully transfer a call to a worker that already has another call.

Now that workers can accept multiple calls, we need to update the TaskRouter workflow(s) so that agents are not routed multiple calls from the queue. For each workflow filter, set the target worker expression to `worker.channel.voice.available_capacity_percentage == 100`. If you already have a target worker expression defined, you will need to combine the logic with `AND`.
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814

> **Warning**
> Transfers to queues will not use the above configured worker expression. If workers in transfer queues do not all have their capacity set to 1, customize the queue transfer directory to instead transfer to workflows. Otherwise, transfers to queues may be assigned to workers already on calls.

### Flex configuration

<<<<<<< HEAD
In your flex-config file(s), all you need to do is enable the `multi_call` feature.

## How it works

The reason that Flex does not support multiple simultaneous calls out-of-the-box is due to a limitation in the Twilio Voice JavaScript SDK used by Flex. To work around this limitation, when another call is accepted, the `multi-call` feature instantiates a second Voice SDK `Device` and forwards the call to it. This new instance of the Voice SDK is then passed the same configuration options as the built-in Voice SDK instance.
=======
In your flex-config file(s), two changes need to be made:

1. Enable the `multi_call` feature
2. Disable the `allowIncomingWhileBusy` voice SDK option (yes, this is counter-intuitive!)

## How it works

The reason that Flex does not support multiple simultaneous calls out-of-the-box is due to a limitation in the Twilio Voice JavaScript SDK used by Flex. To work around this limitation, the `multi-call` feature instantiates a second Voice SDK `Device` to handle a second incoming call. This works because disabling `allowIncomingWhileBusy` prevents the Voice SDK instance managed by Flex from receiving a second inbound call, allowing our second instance to handle it gracefully.
>>>>>>> c559c5a243a27da5a618422e334f7a79e970f814

Due to the Voice SDK limitation, Flex's state maintains an assumption that only one call at a time may be considered active. To work around this, the `multi-call` feature changes the active call in Flex state whenever the selected task changes.

When handling more than one call at once, only one call should be heard by the agent at a time. To handle this, when accepting or un-holding a call, any other active call is immediately placed on hold and muted. Mute is toggled in addition to hold in order to prevent the agent from being recorded on the wrong call.

Finally, the teams view 'calls' column has been replaced and re-styled to prevent multiple calls from being cut off in the view.
