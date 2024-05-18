# OBS Remote Hook
## Purpose
The purpose of this software is to allow for advanced OBS Scene and Source configurations. The core concept is that when you have multiple camera feeds on a single layout, that you can easily switch which cameras/sources are active.

This software aims to make configuration simple but powerful, while also providing a powerful API for interaction via Streamdeck, Discord or other means.

## Terminology
- scenes - same as OBS - a template that includes many sources
- source - same as OBS - this could be a camera feed, text, audio etc. A scene references many sources.
- group - a configuration term. Used to group up specific sources that a slot can use. Idea is that it allows you to have multiple slots with their own camera feeds.
- slot - The name for a camera feed in a layout with multiple camera feeds. See the OBS configuration section for more.
- layout - the type of template - e.g. one with 2 camera feeds. See the OBS configuration section for more.
- feed - like source, but strictly references the raw camera feed, in a fullscreen or slot scenario.

## Example
Let's take a basic scenario:
- SimpleScene - displays a single camera feed (a single slot)
- PictureInPicture - displays a primary camera with a smaller one in the bottom right corner (2 slots)

- FeedA - A view of a rocket pad.
- FeedB - Streamer's face cam.

The use of this tool would allow you to easily use the PictureInPicture layout, and switch which feed is in which slot.

The way this works, is that OBS allows a Source to be a Scene. Using this feature, it allows us to simply update the slot used, rather than having all feeds on all scenes in all possible positions.

To illustrate:
Scenes:
- FeedA - FeedA fullscreen. The only source is the camera.
- FeedB - FeedB fullscreen. The only source is the camera.
- Slot1 - Has FeedA and FeedB scenes as fullscreen sources. Only one source will be visible at any time.
- Slot2 - Has FeedA and FeedB scenes as fullscreen sources. Only one source will be visible at any time.
- SimpleScene - Uses Slot1 as a Scene source. This is the layout, so can have many other sources.
- PictureInPicture - Includes Slot1 and Slot2 as Scene sources. Slot1 would be the primary, with Slot2 being the secondary in the bottom right.

Switching:
- PictureInPicture is the active scene
- Slot1 is showing FeedA
- Slot2 is showing FeedB
- To flip which slot uses which Feed:
- Slot1 is set to FeedB. This hides FeedA and shows FeedB.
- Slot2 is set to FeedA. This hides FeedB and shows FeedA.

[//]: # (## This Software)

[//]: # (### Core)

[//]: # (- Hosted with access to OBS's WebSocket)

[//]: # (- Exposes an API for getting the OBS configuration. [Not authentication yet, using a VPN])

[//]: # ()
[//]: # ()
[//]: # (- Provides the underlying functions needed to interact with OBS, based on)

[//]: # ()
[//]: # ()
[//]: # ()
[//]: # (The core part of this software is hosted as a server, which contains a config file. You connect to this software via MQTT which, based on the config, translates into multiple commands to OBS's WebSocket.)

[//]: # ()
[//]: # (The language used is yet to be determined. I had wanted to use C#, but there doesn't appear to be an up-to-date C# Client library.)

[//]: # ()

## Config

The above example would look like this in the config:

```yaml
sources:
  - slug: FeedA
    scene: RAW_FEED_A
    source: RAW_FEED_A
    desc: Feed A dynamic source
  - slug: FeedB
    scene: RAW_FEED_B
    source: RAW_FEED_B
    desc: Feed B dynamic source
layouts:
  - slug: simple
    scene: LAYOUT_simple
    desc: Simple layout with using Slot1 only.
    slots:
      - Slot1
  - slug: PIP
    scene: LAYOUT_PIP
    desc: Picture-in-picture layout using Slot1 and Slot2.
    slots:
      - Slot1
      - Slot2
slots:
  - slug: Slot1
    scene: SLOT_PRIMARY
    source: SLOT_PRIMARY
    desc: Primary slot
  - slug: Slot2
    scene: SLOT_SECONDARY
    source: SLOT_SECONDARY
    desc: Secondary slot
groups:
  Slot1:
    - FeedA
    - FeedB
  Slot2:
    - FeedA
    - FeedB
```


### Sources

```yaml
sources:
  - slug: FeedA
    scene: RAW_FEED_A
    source: RAW_FEED_A
    desc: Feed A dynamic source
```


Breakdown:
- slug: The unique identifier for the source. This is used to reference the source in other parts of the config.
- scene: The OBS scene contains the raw feed.
- source: The name of the source that references the above scene in OBS. This source will be used by multiple slots.



## API Design
**Idea:** Have the class library accept complete actions (i.e. changing multiple slots in one go.). Idea being that the client would have the ability to set up a switch and then execute it, or better yet, have pre-configured actions.

- Set Scene
- Set a Slot's Source
- Get config


## Dev Notes
- Uses Node 20
- Yarn Berry for workspace management
- ESLint for linting
- Typescript for type safety





# TODO
- Update this readme
- CLI to prevent overlapping commands (e.g. only 1 layout, only 1 update per slot)
  - Probably easier to do this on commit - Use the most recently added version (assume further assignments are overwrites)
- Handle audio and other commands on the backend
