import { EditorState, Modifier, SelectionState } from "draft-js";
import { getKeyAfter, getKeyBefore } from "../getKeysBinary";

function getLineStartKey(currentContent, currentBlockKey) {
  let lineStartKey = getKeyBefore(currentContent, currentBlockKey);
  let lineStartText;
  if (lineStartKey) {
    lineStartText = currentContent.getBlockForKey(lineStartKey).getText();
    while (lineStartKey && ((lineStartText !== '') && (lineStartText !== '\n'))) {
      lineStartKey = getKeyBefore(currentContent, lineStartKey);
      if (lineStartKey) {
        lineStartText = currentContent.getBlockForKey(lineStartKey).getText();
      }
    }
  }

  return lineStartKey;
}

function getLineEndKey(currentContent, currentBlockKey) {
  let lineEndKey = getKeyAfter(currentContent, currentBlockKey);
  let lineEndText;
  if (lineEndKey) {
    lineEndText = currentContent.getBlockForKey(lineEndKey).getText();
    while (lineEndKey && ((lineEndText !== '') && (lineEndText !== '\n'))) {
      lineEndKey = getKeyAfter(currentContent, lineEndKey);
      if (lineEndKey) {
        lineEndText = currentContent.getBlockForKey(lineEndKey).getText();
      }
    }
  }

  return lineEndKey;
}

function moveWordUp(editorState, currentContent, currentSelection, currentBlockKey, currentBlockText) {
  const lineStartKey = getLineStartKey(currentContent, currentBlockKey);
  const lineEndKey = getLineEndKey(currentContent, currentBlockKey);
  const lineEnd = currentContent.getBlockForKey(lineEndKey).getText()
  if (lineStartKey) {
    const lineStart = currentContent.getBlockForKey(lineStartKey).getText();
    if (lineStart === '') {
      const nextSpaceKey = getKeyAfter(currentContent, getKeyAfter(currentContent, lineStartKey));
      const newLineSelection = new SelectionState({
        anchorKey: nextSpaceKey,
        anchorOffset: 0,
        focusKey: nextSpaceKey,
        focusOffset: 1
      });
      let newContent = Modifier.replaceText(currentContent, newLineSelection, '');
    
      const spaceSelection = new SelectionState({
        anchorKey: lineStartKey,
        anchorOffset: 0,
        focusKey: lineStartKey,
        focusOffset: 1
      });
      newContent = Modifier.replaceText(newContent, spaceSelection, ' ');
      return EditorState.push(editorState, newContent);
    } else {
      return editorState;
    }
  } else {
    return editorState;
  }
  
}

function moveWordDown(editorState, currentContent, currentSelection, currentBlockKey, currentBlockText) {

}

export default function moveWord(editorState, direction) {
  const currentContent = editorState.getCurrentContent();
  const currentSelection = editorState.getSelection();
  const currentBlockKey = currentSelection.getStartKey();
  const currentBlockText = currentContent.getBlockForKey(currentBlockKey).getText();
  
  if (!currentSelection.isCollapsed() || (currentBlockText === '\n')) {
    return editorState;
  }

  if (direction === 'up') {
    return moveWordUp(editorState, currentContent, currentSelection, currentBlockKey, currentBlockText);
  } else {
    return moveWordDown(editorState, currentContent, currentSelection, currentBlockKey, currentBlockText);
  }
}

