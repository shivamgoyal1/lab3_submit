import React, { Component } from 'react';
import Immutable from 'immutable';
import Note from './note';
import NoteBar from './notebar';

class App extends Component {
  constructor(props) {
    super(props);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.onBodyChange = this.onBodyChange.bind(this);
    this.onNotebarInput = this.onNotebarInput.bind(this);
    this.onNotebarSubmit = this.onNotebarSubmit.bind(this);
    this.onStartDrag = this.onStartDrag.bind(this);
    this.onStopDrag = this.onStopDrag.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);

    this.state = {
      notes: Immutable.Map(),
      notebarInput: '',
      currentNote: undefined,
      highestIndex: 0,
      defaultX: 25,
      defaultY: 25,
    };
  }


  onMouseDown(e, id) {
    const pressedIndex = this.state.notes.get(id).zIndex;
    let newNotes = Immutable.Map();
    this.state.notes.forEach((note, curId) => {
      if ((note.zIndex >= pressedIndex) && (curId !== id)) {
        newNotes = newNotes.set(
          curId,
          Object.assign({}, note, { zIndex: note.zIndex - 1 }),
        );
      } else if (id === curId) {
        newNotes = newNotes.set(
          curId,
          Object.assign({}, note, { zIndex: this.state.highestIndex }),
        );
      } else {
        newNotes = newNotes.set(curId, note);
      }
    });
    this.setState({
      notes: newNotes,
    });
  }

  onDrag(e, ui, id) {
    this.setState({
      notes: this.state.notes.update(id, (n) => {
        return Object.assign({}, n, { x: ui.x }, { y: ui.y });
      }),
    });
  }

  onDeleteClick(id) {
    this.setState({
      notes: this.state.notes.delete(id),
    });
  }

  onEditClick(id) {
    this.setState({
      notes: this.state.notes.update(id, (n) => {
        return Object.assign({}, n, { isEditing: !n.isEditing });
      }),
    });
  }

  onBodyChange(e, id) {
    this.setState({
      notes: this.state.notes.update(id, (n) => {
        return Object.assign({}, n, { body: e.target.value });
      }),
    });
  }

  onNotebarInput(e) {
    if (this.state.currentNote === undefined) {
      this.setState({
        notebarInput: e.target.value,
        currentNote: {
          title: e.target.value,
          body: '',
          x: this.state.defaultX,
          y: this.state.defaultY,
          isEditing: false,
          zIndex: this.state.highestIndex + 1,
        },
        highestIndex: this.state.highestIndex + 1,

        defaultX: this.state.defaultX + 10,
        defaultY: this.state.defaultY + 10,
      });
    } else {
      this.setState({
        notebarInput: e.target.value,
        currentNote: Object.assign({}, this.state.currentNote, { title: e.target.value }),
      });
    }
  }

  onNotebarSubmit(e) {
    event.preventDefault();
    if (this.state.currentNote === undefined) return;
    this.setState({
      notes: this.state.notes.set(this.state.highestIndex, this.state.currentNote),
      currentNote: undefined,
      notebarInput: '',
    });
  }


  render() {
    const notes = this.state.notes.entrySeq().map(([id, note]) => {
      return (
        <Note
          id={id}
          key={id}
          note={note}
          onBodyChange={this.onBodyChange}
          onEditClick={this.onEditClick}
          onDeleteClick={this.onDeleteClick}
          onStartDrag={this.onStartDrag}
          onStopDrag={this.onStopDrag}
          onDrag={this.onDrag}
          onMouseDown={this.onMouseDown}
        />
      );
    });
    return (
      <div>
        <div id="controls">
          <NoteBar
            id="note-bar"
            onNotebarSubmit={this.onNotebarSubmit}
            onNotebarInput={this.onNotebarInput}
            notebarInput={this.state.notebarInput}
          />
        </div>
        {notes}
      </div>
    );
  }
}

export default App;
