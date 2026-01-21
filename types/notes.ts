export type NoteType = 'note' | 'list';

type BasePayload<TContent, TType extends NoteType> = {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
    sort_order: number;
    type: TType;
    content: TContent;
};

export type Payload = NotePayload | ListPayload;

export type NotePayload = BasePayload<NoteContentType, 'note'>;

export type ListPayload = BasePayload<ListContentType, 'list'>;

export type UnparsedPayload = BasePayload<string, NoteType>;

export type ContentType = NoteContentType | ListContentType;

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

