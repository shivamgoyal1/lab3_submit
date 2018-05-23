import React from 'react';
import Draggable from 'react-draggable';
import marked from 'marked';
import Textarea from 'react-textarea-autosize';
import {FaArrows, FaPencil, FaTrashO, FaCheck} from 'react-icons/lib/fa';


const Note = (props) => {
  const title = props.note.title;
  const body = props.note.body;
  let editIcon, bodyArea;

  if (props.note.isEditing) {
    editIcon = <FaCheck />;
    bodyArea = (
      <Textarea
        value={body}
        onChange={(event) => { props.onBodyChange(event, props.id); }}
      />
    );
  } else {
    editIcon = <FaPencil />;
    bodyArea = (
      <div dangerouslySetInnerHTML={{ __html: marked(body || '') }} />
    );
  }

  return (
    <Draggable
      id="draggable"
      handle="#arrows"
      axis="both"
      onStart={() => { props.onStartDrag(props.id); }}
      onDrag={(e, ui) => { props.onDrag(e, ui, props.id); }}
      onStop={props.onStopDrag}
      onMouseDown={(e) => { props.onMouseDown(e, props.id); }}
      defaultPosition={{ x: props.note.x, y: props.note.y }}
    >
      <div id="note" style={{ zIndex: props.note.zIndex }}>
        <div id="title">
          <ul>
            <li>{title}</li>
            <li onClick={() => { props.onDeleteClick(props.id); }} ><FaTrashO /></li>
            <li onClick={() => { props.onEditClick(props.id); }}>{editIcon}</li>
          </ul>
          <div id="arrows"><FaArrows /></div>
        </div>
        <div id="body">{bodyArea}</div>
      </div>
    </Draggable>
  );
};

export default Note;
