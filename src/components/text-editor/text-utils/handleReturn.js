import { EditorState, Modifier, SelectionState } from 'draft-js';
import { mergeBlocksData } from './handleBackspace';
import { getSelectedBlocksList } from 'draftjs-utils';
import { getKeyAfter, getKeyBefore } from '../getKeysBinary';

function isLineStart(currentContent, currentSelection, startKey) {
  const startOffset = currentSelection.getStartOffset();
  if (startOffset !== 0) {
    return false;
  }

  const prevBlockKey = getKeyBefore(currentContent, startKey);
  if (prevBlockKey) {
    const prevBlockText = currentContent.getBlockForKey(prevBlockKey).getText();
    if ((prevBlockText === '') || (prevBlockText === '\n')) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}

function isLineEnd(currentContent, currentSelection, endKey) {
  const endOffset = currentSelection.getEndOffset();
  const endText = currentContent.getBlockForKey(endKey).getText();
  if (endOffset !== endText.length) {
    return false;
  }

  const nextBlockKey = getKeyAfter(currentContent, endKey);
  if (nextBlockKey) {
    const nextBlockText = currentContent.getBlockForKey(nextBlockKey).getText();
    if ((nextBlockText === '') || (nextBlockText === '\n')) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}

export default function handleReturn(editorState) {
  const currentContent = editorState.getCurrentContent();
  const currentSelection = editorState.getSelection();
  const startKey = currentSelection.getStartKey();
  const endKey = currentSelection.getEndKey();
  const currentText = currentContent.getBlockForKey(startKey).getText();
  const nextBlockKey = getKeyAfter(currentContent, endKey);

  if (currentText === '\n') {
    return editorState;
  }

  if (!currentSelection.isCollapsed()) {
    const selectedBlockList = getSelectedBlocksList(editorState);
    //Block backspace for cross-subtitle selection
    for (const [index, block] of selectedBlockList.entries()) {
      if ((block.getText() === '\n') && (index !== (selectedBlockList.size - 1))) {
        return editorState;
      }
    }
    

    const endText = currentContent.getBlockForKey(endKey).getText();
    const isSelectionAtTheLineStart = isLineStart(currentContent, currentSelection, startKey);
    const isSelectonAtTheLineEnd = isLineEnd(currentContent, currentSelection, endKey);

    if (isSelectionAtTheLineStart && isSelectonAtTheLineEnd) {
      const contentStateWithNewData = mergeBlocksData(currentContent, startKey, endKey);
      const newContentState = Modifier.replaceText(contentStateWithNewData, currentSelection, '\r');
      return EditorState.push(editorState, newContentState);
    } else if (isSelectionAtTheLineStart && (currentSelection.getEndOffset() !== endText.length)) {
      const contentStateWithNewData = mergeBlocksData(currentContent, startKey, endKey);
      const newContentState = Modifier.replaceText(contentStateWithNewData, currentSelection, '\n');
      return EditorState.push(editorState, newContentState);
    } else if ((currentSelection.getStartOffset() !== 0) && isSelectonAtTheLineEnd) {
      const contentStateWithNewData = mergeBlocksData(currentContent, startKey, endKey);
      const newContentState = Modifier.replaceText(contentStateWithNewData, currentSelection, '');
      return EditorState.push(editorState, newContentState);
    } else if ((currentSelection.getStartOffset() === 0) && currentSelection.getEndOffset() === endText.length) {
      if (isSelectionAtTheLineStart) {
        if (nextBlockKey) {
          const selectionToReplace = new SelectionState({
            anchorKey: nextBlockKey,
            anchorOffset: 0,
            focusKey: nextBlockKey,
            focusOffset: 1
          });
          let newContentState = mergeBlocksData(currentContent, startKey, endKey);
          newContentState = Modifier.replaceText(newContentState, selectionToReplace, '');
          newContentState = Modifier.replaceText(newContentState, currentSelection, '\r');
          return EditorState.push(editorState, newContentState);
        } else {
          const contentStateWithNewData = mergeBlocksData(currentContent, startKey, endKey);
          const newContentState = Modifier.replaceText(contentStateWithNewData, currentSelection, '');
          return EditorState.push(editorState, newContentState);
        }
      } else if (isSelectonAtTheLineEnd) {
        if (nextBlockKey) {
          const selectionToReplace = new SelectionState({
            anchorKey: currentSelection.getStartKey(),
            anchorOffset: currentSelection.getStartOffset(),
            focusKey: nextBlockKey,
            focusOffset: 1
          });
          const contentStateWithNewData = mergeBlocksData(currentContent, startKey, endKey);
          const newContentState = Modifier.replaceText(contentStateWithNewData, selectionToReplace, '');
          return EditorState.push(editorState, newContentState);
        } else {
          const contentStateWithNewData = mergeBlocksData(currentContent, startKey, endKey);
          const newContentState = Modifier.removeRange(contentStateWithNewData, currentSelection);
          return EditorState.push(editorState, newContentState);
        }
      } else {
        const contentStateWithNewData = mergeBlocksData(currentContent, startKey, endKey);
        const newContentState = Modifier.replaceText(contentStateWithNewData, currentSelection, '');
        return EditorState.push(editorState, newContentState);
      }
    } else {
      const contentStateWithNewData = mergeBlocksData(currentContent, startKey, endKey);
      const newContentState = Modifier.replaceText(contentStateWithNewData, currentSelection, '\n');
      return EditorState.push(editorState, newContentState);
    }

  }

  let lineEndKey = getKeyAfter(currentContent, startKey);
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

  let lineStartKey = getKeyBefore(currentContent, startKey);
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
  
  if (lineEndKey) {
    if (lineEndText === '') {
      if (currentText === ' ') {
        const newLineSelection = new SelectionState({
          anchorKey: startKey,
          anchorOffset: 0,
          focusKey: startKey,
          focusOffset: 1
        });
        const spaceSelection = new SelectionState({
          anchorKey: lineEndKey,
          anchorOffset: 0,
          focusKey: lineEndKey,
          focusOffset: 1
        });

        const contentStateWithNewLine = Modifier.replaceText(currentContent, newLineSelection, '');
        const newContentState = Modifier.replaceText(contentStateWithNewLine, spaceSelection, ' ');
        const newEditorState = EditorState.push(editorState, newContentState);
        const selectionAfter = new SelectionState({
          anchorKey: nextBlockKey,
          anchorOffset: 0
        });
        return EditorState.forceSelection(newEditorState, selectionAfter);
      } else if (currentSelection.getEndOffset() === currentText.length) {
        const nextBlockKey = getKeyAfter(currentContent ,startKey);
        if (currentContent.getBlockForKey(nextBlockKey).getText() === ' ') {
          const newLineSelection = new SelectionState({
            anchorKey: nextBlockKey,
            anchorOffset: 0,
            focusKey: nextBlockKey,
            focusOffset: 1
          });
          let newContentState = Modifier.replaceText(currentContent, newLineSelection, '');

          const spaceSelection = new SelectionState({
            anchorKey: lineEndKey,
            anchorOffset: 0,
            focusKey: lineEndKey,
            focusOffset: 1
          });

          newContentState = Modifier.replaceText(newContentState, spaceSelection, ' ');

          const nextWordKey = getKeyAfter(currentContent, nextBlockKey);
          const nextBlockText = currentContent.getBlockForKey(nextWordKey).getText();
          const newText = ' ' + nextBlockText;
          const nextWordSelection = new SelectionState({
            anchorKey: nextWordKey,
            anchorOffset: 0,
            focusKey: nextWordKey,
            focusOffset: nextBlockText.length
          });
          newContentState = Modifier.replaceText(newContentState, nextWordSelection, newText)
          const newEditorState = EditorState.push(editorState, newContentState);
          const selectionAfter = new SelectionState({
            anchorKey: nextWordKey,
            anchorOffset: 0
          });
          return EditorState.forceSelection(newEditorState, selectionAfter);
        } else {
          const nextLineFirstWordKey = getKeyAfter(currentContent, getKeyAfter(currentContent, startKey));
          const newSelection = new SelectionState({
            anchorKey: nextLineFirstWordKey,
            anchorOffset: 0
          });

          return EditorState.forceSelection(editorState, newSelection);
        }
      } else {
        const spaceSelection = new SelectionState({
          anchorKey: lineEndKey,
          anchorOffset: 0,
          focusKey: lineEndKey,
          focusOffset: 1
        });

        const contentStateWithNewLine = Modifier.insertText(currentContent, currentSelection, '\n');
        const newContentState = Modifier.replaceText(contentStateWithNewLine, spaceSelection, ' ');
        const newEditorState = EditorState.push(editorState, newContentState);
        const selectionAfter = new SelectionState({
          anchorKey: currentSelection.getStartKey(),
          anchorOffset: currentSelection.getStartOffset() + 1
        });
        return EditorState.forceSelection(newEditorState, selectionAfter);
      }
    } else if (lineStartKey && (lineStartText === '\n')) {
      if (currentText === ' ') {
        const newLineSelection = new SelectionState({
          anchorKey: startKey,
          anchorOffset: 0,
          focusKey: startKey,
          focusOffset: 1
        });

        const newContentState = Modifier.replaceText(currentContent, newLineSelection, '');
        const newEditorState = EditorState.push(editorState, newContentState);
        const selectionAfter = new SelectionState({
          anchorKey: nextBlockKey,
          anchorOffset: 0
        });
        return EditorState.forceSelection(newEditorState, selectionAfter);
      } else if (currentSelection.getEndOffset() === currentText.length) {
        const nextBlockKey = getKeyAfter(currentContent ,startKey);
        if (currentContent.getBlockForKey(nextBlockKey).getText() === ' ') {
          const newLineSelection = new SelectionState({
            anchorKey: nextBlockKey,
            anchorOffset: 0,
            focusKey: nextBlockKey,
            focusOffset: 1
          });
          
          let newContentState = Modifier.replaceText(currentContent, newLineSelection, '');

          const nextWordKey = getKeyAfter(currentContent, nextBlockKey);
          const nextBlockText = currentContent.getBlockForKey(nextWordKey).getText();
          const newText = ' ' + nextBlockText;
          const nextWordSelection = new SelectionState({
            anchorKey: nextWordKey,
            anchorOffset: 0,
            focusKey: nextWordKey,
            focusOffset: nextBlockText.length
          });
          newContentState = Modifier.replaceText(newContentState, nextWordSelection, newText)
          const newEditorState = EditorState.push(editorState, newContentState);
          const selectionAfter = new SelectionState({
            anchorKey: nextWordKey,
            anchorOffset: 0
          });
          return EditorState.forceSelection(newEditorState, selectionAfter);
        } else {
          const nextLineFirstWordKey = getKeyAfter(currentContent, getKeyAfter(currentContent, startKey));
          const newSelection = new SelectionState({
            anchorKey: nextLineFirstWordKey,
            anchorOffset: 0
          });

          return EditorState.forceSelection(editorState, newSelection);
        }
      } else {
        const newContentState = Modifier.insertText(currentContent, currentSelection, '\n');
        return EditorState.push(editorState, newContentState);
      }
    } else {
      const nextTitleStartKey = getKeyAfter(currentContent, lineEndKey);
      if (nextTitleStartKey) {
        const newSelection = new SelectionState({
          anchorKey: nextTitleStartKey,
          anchorOffset: 0
        });
        return EditorState.forceSelection(editorState, newSelection);
      } else {
        return editorState;
      }
    }
  } else {
    return editorState;
  }
}