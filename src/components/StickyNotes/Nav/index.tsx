import { MouseEvent } from 'react';
import './Nav.scss';

interface PNav {
    handleAddNote: (event: MouseEvent) => void;
    handleRemoveAll: (event: MouseEvent) => void;
}

function Nav({ handleAddNote, handleRemoveAll }: PNav) {
    return (
        <nav className="nav">
            <div className="logo">
                Sticky<span>notes</span>
            </div>
            <button onClick={handleAddNote}>New Note</button>
            <button className="remove" onClick={handleRemoveAll}>
                Remove All
            </button>
        </nav>
    );
}

export default Nav;
