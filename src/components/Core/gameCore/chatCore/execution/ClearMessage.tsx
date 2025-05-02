import { EventCommand } from '../EventCommand';
import { DialogEvent } from '../utils/DialogEvent';

// Interface for CLEAR_MESSAGE events
export interface ClearMessageEvent extends DialogEvent {
    eventCommand: EventCommand.CLEAR_MESSAGE;
}

export const isClearMessageEvent = (event: DialogEvent): event is ClearMessageEvent => {
    return event.eventCommand === EventCommand.CLEAR_MESSAGE;
};
