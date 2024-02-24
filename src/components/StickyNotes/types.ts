export interface INote {
    color: string;
    width: number;
    height: number;
    position: {
        left: number;
        top: number;
    };
    content: string;
    zIndex: number;
}

export interface INoteWithID {
    [key: string]: INote;
}

