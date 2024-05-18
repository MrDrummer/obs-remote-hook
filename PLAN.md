# OBS Remote Hook
## Purpose
The purpose of this software is to allow for advanced OBS Scene and Source configurations. The core concept is that when you have multiple camera feeds on a single layout, that you can easily switch which cameras/sources are active.

This software aims to make configuration simple but powerful, while also providing a powerful API for interaction via Streamdeck, Discord or other means.

## Components
- OBS Hook - likely Node.js sitting next to the OBS instance, connected directly to the OBS WebSocket.
- Small CLI application - directly executed by the user via Streamdeck. When the "Execute" command is sent, it will send a message to the above instance.


- The OBS Hook will have a configuration file that defines the layout, slots, feeds and groups. This will be a JSON file. This data will be available to the client.


## Technology
I am not 100% on the technology stack yet. I am considering:
- I wanted to keep the OBS Hook and the part that makes it externally accessible separate.
  - This is why C# is technically better suited to the task - though I am struggling with how to structure it. This is why I have picked Node.js.
- Socket hosted by the OBS Hook
- WebSocket or MQTT for communication between the OBS Hook and the client.

## Structure
- Class for the OBS Hook
  - Connect to OBS WebSocket
  - Load configuration
  - Expose configuration
  - Expose functions for changing the layout
- HTTP Socket server
  - Uses the class to connect to OBS
  - Exposes the configuration
  - Exposes command endpoints
  - Validates and passes through data to the OBS Hook.
- CLI application
  - Connects to the HTTP Socket server
  - Requests configuration data if it hasn't received it in the last 10 minutes
  - Sends to the server

## Commands
- GetConfiguration
  - Returns the configuration
- SetSlot
  - SlotName, SourceName
  - Sets the slot to the feed
- SetLayout
  - LayoutName
  - Sets the layout
- MuteAudio
  - AudioChannel, Mute [true/false] 
  - Mutes or unmutes the specified audio channel
- MuteAllAudio
  - Mute [true/false]
  - Mutes or unmutes all audio channels
- IncreaseAudio
  - AudioChannel, ChangeBy, Increase [true/false]
  - Increases the audio volume
- DecreaseAudio
  - AudioChannel, ChangeBy, Decrease [true/false]
  - Decreases the audio volume
- SetAudio
  - AudioChannel, Volume
  - Sets the audio volume
- StartStream
  - Starts the stream
- StopStream
  - Stops the stream
- Cut
  - Cuts to the configured scene
  - Intended for emergency cut-away
- Switch
  - Switches the currently active slots
