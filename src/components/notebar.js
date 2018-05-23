import React from 'react';

const NoteBar = (props) => {
  return (
    <form onSubmit={(e) => { props.onNotebarSubmit(e); }} id="note-bar">
      <input type="text" value={props.notebarInput} onChange={props.onNotebarInput} placeholder="New Note" />
      <input type="submit" value="Create" />
    </form>
  );
};

export default NoteBar;
