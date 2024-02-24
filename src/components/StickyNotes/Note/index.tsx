import { useRef, RefObject } from 'react';
import './Note.scss';
import { PNote } from './types';

function Note({
    note,
    id,
    handleResizeNote,
    handleMoveNote,
    handleChangeContent,
    handleMouseDown,
}: PNote) {
    const noteRef: RefObject<HTMLDivElement> = useRef(null);

    return (
        <div
            ref={noteRef}
            onMouseDown={handleMoveNote(id, noteRef)}
            className="note"
            style={{
                width: note.width,
                height: note.height,
                left: note.position.left,
                top: note.position.top,
                backgroundColor: note.color,
                zIndex: note.zIndex,
            }}
        >
            <textarea
                value={note.content}
                onMouseDown={handleMouseDown(id, noteRef)}
                onChange={handleChangeContent(id)}
            />
            <div className="resize-button" onMouseDown={handleResizeNote(id, noteRef)} />
        </div>
    );
}

export default Note;
