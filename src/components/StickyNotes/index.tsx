import {useRef, useState, ChangeEvent, useCallback, RefObject, useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';
import {randomColorGenerator} from '../../utils/colorGenerator';
import storage from '../../utils/storage';
import Nav from './Nav';
import Note from './Note';
import {INote, INoteWithID} from './types';
import removeIcon from '../../assets/remove.png';
import './StickyNotes.scss';

function StickyNotes() {
    const [notes, setNotes] = useState<INoteWithID>(storage.getStickyNotes());

    const [isShowArea, setIsShowArea] = useState<boolean>(false);
    const [highLightRemoveArea, setHighLightRemoveArea] = useState<boolean>(false);

    const removeNoteAreaRef = useRef<HTMLDivElement>(null);
    const notesContainerRef = useRef<HTMLDivElement>(null);

    const handleAddNote = () => {

        const notesCopy = {...notes};
        let maxIndex = 0;
        for (let item in notesCopy) {
            if (notesCopy[item].zIndex > maxIndex) {
                maxIndex = notesCopy[item].zIndex;
            }
        }

        const newNote: INote = {
            color: randomColorGenerator(),
            position: {
                left: Math.floor((window.innerWidth - 400) * Math.random()),
                top: Math.floor((window.innerHeight - 480) * Math.random()),
            },
            width: 400,
            height: 400,
            content: '',
            zIndex: maxIndex + 1,
        };


        const noteID = uuidv4();

        setNotes({...notes, [noteID]: newNote});
    };

    const handleRemoveAll = () => {
        setNotes({});
        storage.setStickyNotes({});
    };

    const handleResizeNote = useCallback(
        (id: string, ref: RefObject<HTMLDivElement>) =>
            (event: { pageX: number; pageY: number; stopPropagation: () => void }) => {
                event.stopPropagation();
                const currentNote = notes[id];
                const maxIndex = handleMoveNoteToTop(id, ref);
                const startWidth = currentNote.width;
                const startHeight = currentNote.height;

                const startPositionX = event.pageX;
                const startPositionY = event.pageY;

                let finalWidth: number = startWidth,
                    finalHeight: number = startHeight;

                function onMouseMove(event: { pageX: number; pageY: number }) {
                    finalWidth = startWidth - startPositionX + event.pageX;
                    finalHeight = startHeight - startPositionY + event.pageY;
                    if (ref.current) {
                        ref.current.style.width = finalWidth > 400 ? finalWidth + 'px' : 400 + 'px';
                        ref.current.style.height =
                            finalHeight > 400 ? finalHeight + 'px' : 400 + 'px';
                    }
                }

                function onMouseUp() {
                    const newNotes = {
                        ...notes,
                        [id]: {
                            ...notes[id],
                            width: finalWidth > 400 ? finalWidth : 400,
                            height: finalHeight > 400 ? finalHeight : 400,
                            zIndex: maxIndex + 1
                        },
                    };
                    setNotes(newNotes);
                    document.body.removeEventListener('mousemove', onMouseMove);
                }

                document.body.addEventListener('mousemove', onMouseMove);
                document.body.addEventListener('mouseup', onMouseUp, {once: true});
            },
        [notes],
    );

    const handleMoveNote = useCallback(
        (id: string, ref: RefObject<HTMLDivElement>) =>
            (event: { pageX: number; pageY: number }) => {
                const currentNote = notes[id];
                const maxIndex = handleMoveNoteToTop(id, ref);
                const startCoordinateX = currentNote.position.left;
                const startCoordinateY = currentNote.position.top;

                const startPositionX = event.pageX;
                const startPositionY = event.pageY;

                let removeFlag = false;

                setIsShowArea(true);

                let finalPositionX: number = startCoordinateX,
                    finalPositionY: number = startCoordinateY;

                function onMouseMove(event: { pageX: number; pageY: number }) {
                    if (removeNoteAreaRef.current) {
                        if (
                            event.pageX > removeNoteAreaRef.current.offsetLeft &&
                            event.pageY > removeNoteAreaRef.current.offsetTop
                        ) {
                            setHighLightRemoveArea(true);
                            removeFlag = true;
                        } else {
                            setHighLightRemoveArea(false);
                            removeFlag = false;
                        }
                    }

                    if (
                        startCoordinateX - startPositionX + event.pageX >= 0 &&
                        startCoordinateY - startPositionY + event.pageY >= 0
                    ) {
                        finalPositionX = startCoordinateX - startPositionX + event.pageX;
                        finalPositionY = startCoordinateY - startPositionY + event.pageY;
                        if (ref.current) {
                            ref.current.style.left = finalPositionX + 'px';
                            ref.current.style.top = finalPositionY + 'px';
                        }
                    }
                }

                function onMouseUp() {
                    document.body.removeEventListener('mousemove', onMouseMove);
                    setIsShowArea(false);
                    setHighLightRemoveArea(false);

                    const newNotes = {
                        ...notes,
                        [id]: {
                            ...notes[id],
                            position: {
                                ...notes[id].position,
                                left: finalPositionX,
                                top: finalPositionY,
                            },
                            zIndex: maxIndex + 1
                        },
                    };

                    setNotes(newNotes);

                    if (removeFlag) {
                        const {[id]: _, ...newNotes} = notes;
                        setNotes(newNotes);
                    }
                }

                document.body.addEventListener('mousemove', onMouseMove);
                document.body.addEventListener('mouseup', onMouseUp, {once: true});
            },
        [notes],
    );

    const handleChangeContent = (id: string) => (event: ChangeEvent) => {
        const newNotes = {
            ...notes,
            [id]: {
                ...notes[id],
                content: (event.target as HTMLInputElement).value,
            },
        };
        setNotes(newNotes);
    };

    const handleMouseDown =
        (id: string, ref: RefObject<HTMLDivElement>) =>
            (event: { stopPropagation: () => void }) => {
                handleMoveNoteToTop(id, ref);
                event.stopPropagation();
            };

    const handleMoveNoteToTop = (id: string, ref: RefObject<HTMLDivElement>) => {

        const notesCopy = {...notes};

        let maxIndex = 0;

        for (let item in notesCopy) {
            if (notesCopy[item].zIndex > maxIndex) {
                maxIndex = notesCopy[item].zIndex;
            }
        }

        if (ref.current) {
            ref.current.style.zIndex = String(maxIndex + 1);
        }
        const newNotes = {
            ...notesCopy,
            [id]: {
                ...notes[id],
                zIndex: maxIndex + 1,
            },
        };

        setNotes(newNotes);
        return maxIndex
    };

    useEffect(() => {
        storage.setStickyNotes(notes);
    }, [notes]);


    return (
        <div className="sticky-notes">
            <Nav handleAddNote={handleAddNote} handleRemoveAll={handleRemoveAll}/>
            <div className="notes-container" ref={notesContainerRef}>
                <div
                    className={`remove-area ${isShowArea ? 'show' : ''} ${
                        highLightRemoveArea ? 'highlight' : ''
                    }`}
                    ref={removeNoteAreaRef}
                >
                    <img src={removeIcon} alt="remove"/>
                </div>

                {Object.entries(notes).map(([key, value]) => {
                    return (
                        <Note
                            key={key}
                            note={value}
                            id={key}
                            handleResizeNote={handleResizeNote}
                            handleMoveNote={handleMoveNote}
                            handleChangeContent={handleChangeContent}
                            handleMouseDown={handleMouseDown}
                        />
                    );
                })}

                {!Object.keys(notes).length ? <h1>Add note!!</h1> : ''}
            </div>
        </div>
    );
}

export default StickyNotes;
