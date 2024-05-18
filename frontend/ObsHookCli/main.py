import argparse
import json
import requests
import os

QUEUE_FILE = 'command_queue.txt'
AUTO_COMMIT_FILE = 'autocommit_state.txt'
CONFIG_FILE = 'config.json'


def load_config():
    if not os.path.exists(CONFIG_FILE):
        raise FileNotFoundError(f"Configuration file '{CONFIG_FILE}' not found.")

    with open(CONFIG_FILE, 'r') as f:
        config = json.load(f)

    return config


def get_api_url():
    config = load_config()
    api_hostname = config.get('api_hostname', 'localhost')
    api_port = config.get('api_port', 8000)
    return f'http://{api_hostname}:{api_port}/command'


def write_to_queue(command_dict):
    with open(QUEUE_FILE, 'a') as f:
        f.write(json.dumps(command_dict) + '\n')


def read_queue():
    if not os.path.exists(QUEUE_FILE):
        return []

    with open(QUEUE_FILE, 'r') as f:
        lines = f.readlines()

    return [json.loads(line.strip()) for line in lines]


def clear_queue():
    if os.path.exists(QUEUE_FILE):
        os.remove(QUEUE_FILE)


def send_to_api(command_list):
    api_url = get_api_url()
    headers = {'Content-Type': 'application/json'}
    response = requests.post(api_url, json=command_list, headers=headers)
    if response.status_code == 200:
        print('Commands successfully sent to the API.')
    else:
        print(f'Failed to send commands to the API. Status code: {response.status_code}')
        print(response.text)


def handle_command(command_dict, auto_commit):
    if auto_commit:
        send_to_api([command_dict])
    else:
        write_to_queue(command_dict)


def read_autocommit_state():
    if not os.path.exists(AUTO_COMMIT_FILE):
        return False
    with open(AUTO_COMMIT_FILE, 'r') as f:
        return f.read().strip().lower() == 'true'


def write_autocommit_state(state):
    with open(AUTO_COMMIT_FILE, 'w') as f:
        f.write(str(state).lower())


def main():
    parser = argparse.ArgumentParser(description='A simple CLI app')

    subparsers = parser.add_subparsers(dest='command', required=False)

    parser.add_argument('--autocommit', type=str, help='Set auto-commit mode (true/false)')
    parser.add_argument('--commit', action='store_true', help='Process all queued commands')
    parser.add_argument('--clearcache', action='store_true', help='Process all queued commands')

    parser_set_layout = subparsers.add_parser('setLayout')
    parser_set_layout.add_argument('sceneSlug', type=str, help='Name of the layout')

    parser_set_slot = subparsers.add_parser('setSlot')
    parser_set_slot.add_argument('slotSlug', type=str, help='Slot number')
    parser_set_slot.add_argument('sourceSlug', type=str, help='Name of the source')

    parser_mute_audio = subparsers.add_parser('muteAudio')
    parser_mute_audio.add_argument('sourceSlug', type=str, help='Audio channel')
    parser_mute_audio.add_argument('mute', type=bool, help='Mute (True/False)')

    parser_mute_all_audio = subparsers.add_parser('muteAllAudio')
    parser_mute_all_audio.add_argument('mute', type=bool, help='Mute all audio (True/False)')

    parser_increase_audio = subparsers.add_parser('increaseAudio')
    parser_increase_audio.add_argument('sourceSlug', type=str, help='Audio channel')
    parser_increase_audio.add_argument('percentageChange', type=int, help='Change volume by')

    parser_decrease_audio = subparsers.add_parser('decreaseAudio')
    parser_decrease_audio.add_argument('sourceSlug', type=str, help='Audio channel')
    parser_decrease_audio.add_argument('percentageChange', type=int, help='Change volume by')

    parser_set_audio = subparsers.add_parser('setAudio')
    parser_set_audio.add_argument('sourceSlug', type=str, help='Audio channel')
    parser_set_audio.add_argument('volume', type=int, help='Volume level')

    parser_start_stream = subparsers.add_parser('startStream')

    parser_stop_stream = subparsers.add_parser('stopStream')

    parser_cut = subparsers.add_parser('cut')

    parser_get_config = subparsers.add_parser('getConfig')

    args = parser.parse_args()

    auto_commit = read_autocommit_state()

    if args.autocommit is not None:
        auto_commit = args.autocommit.lower() == 'true'
        write_autocommit_state(auto_commit)
        print(f'Auto-commit mode set to {auto_commit}.')

    if args.commit:
        commands = read_queue()
        if commands:
            send_to_api(commands)
            clear_queue()
        else:
            print('No commands to commit.')
    elif args.clearcache:
        clear_queue()
    elif args.command is not None:
        command_dict = {'command': args.command}
        if args.command == 'setLayout':
            command_dict['sceneSlug'] = args.sceneSlug
        elif args.command == 'setSlot':
            command_dict['slotSlug'] = args.slotSlug
            command_dict['sourceSlug'] = args.sourceSlug
        elif args.command == 'muteAudio':
            command_dict['sourceSlug'] = args.sourceSlug
            command_dict['mute'] = args.mute
        elif args.command == 'muteAllAudio':
            command_dict['mute'] = args.mute
        elif args.command == 'increaseAudio':
            command_dict['sourceSlug'] = args.sourceSlug
            command_dict['percentageChange'] = args.percentageChange
        elif args.command == 'decreaseAudio':
            command_dict['sourceSlug'] = args.sourceSlug
            command_dict['percentageChange'] = args.percentageChange
        elif args.command == 'setAudio':
            command_dict['sourceSlug'] = args.sourceSlug
            command_dict['volume'] = args.volume
        elif args.command == 'startStream':
            pass
        elif args.command == 'stopStream':
            pass
        elif args.command == 'cut':
            pass
        elif args.command == 'getConfig':
            pass

        handle_command(command_dict, auto_commit)
    else:
        print('No command provided.')


if __name__ == '__main__':
    main()
