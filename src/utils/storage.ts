import { INoteWithID } from '../components/StickyNotes/types';

const storage = {
    setStickyNotes: (notes: INoteWithID) =>
        localStorage.setItem('stickyNotes', JSON.stringify(notes)),
    getStickyNotes: () => {
        const stickyNotes = localStorage.getItem('stickyNotes');

        if (stickyNotes) {
            return JSON.parse(stickyNotes);
        }

        return {};
    },
};

export default storage;
