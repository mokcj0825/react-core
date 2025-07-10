interface ShowMessageEvent {
  eventCommand: 'SHOW_MESSAGE';
  characterName: string;
  message: string;
}

interface WriteConsoleEvent {
  eventCommand: 'WRITE_CONSOLE';
  message: string;
  type: 'info' | 'warning' | 'error';
}

export interface RequestInputEvent {
  eventCommand: 'REQUEST_INPUT';
  inputType: 'string' | 'number';
  targetField: string;
  confirmMessage: string;
}

interface WriteValueEvent {
  eventCommand: 'WRITE_VALUE';
  target: string;
  operation: string;
  value: any;
}

interface ShowOptionEvent {
  eventCommand: 'SHOW_OPTION';
  options: Array<{
    text: string;
    command: 'INJECT_SCRIPT';
    fallback: {
      optionCommand: 'INJECT_SCRIPT' | 'CONTINUE';
      script?: string;
    };
  }>;
}

export type ChatEvent = ShowMessageEvent | WriteConsoleEvent | RequestInputEvent | WriteValueEvent | ShowOptionEvent;