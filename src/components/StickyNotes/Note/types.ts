import { INote } from '../types';
import { ChangeEvent, MouseEvent, RefObject } from 'react';

export interface PNote {
    note: INote;
    id: string;
    handleResizeNote: (
        index: string,
        ref: RefObject<HTMLDivElement>,
    ) => (event: MouseEvent) => void;
    handleMoveNote: (index: string, ref: RefObject<HTMLDivElement>) => (event: MouseEvent) => void;
    handleMouseDown: (index: string, ref: RefObject<HTMLDivElement>) => (event: MouseEvent) => void;
    handleChangeContent: (index: string) => (event: ChangeEvent) => void;
}
