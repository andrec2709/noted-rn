export type NoteType = 'note' | 'list';

type BasePayload = {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
    sort_order: number;
};

export type Payload = NotePayload | ListPayload;

export type NotePayload = BasePayload & {
    type: 'note';
    content: NoteContentType;
};

export type ListPayload = BasePayload & {
    type: 'list';
    content: ListContentType;
};

export type UnparsedPayload = BasePayload & {
    type: NoteType;
    content: string;
};

export type NoteContentType = {
    html: string;
    plainText: string;
};

export type ListItemType = {
    checked: boolean;
    content: string;
    id: string;
};

export type ListContentType = {
    items: ListItemType[];
};

