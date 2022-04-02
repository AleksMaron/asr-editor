import { EditorState, SelectionState, Modifier } from 'draft-js';
import { getSelectedBlocksList } from 'draftjs-utils';
import { getKeyAfter, getKeyBefore } from '../getKeysBinary';

export function mergeBlocksData(contentState, startKey, endKey) {
  const currentData = contentState.getBlockForKey(startKey).getData();
  const newEnd = contentState.getBlockForKey(endKey).getData().get('end');
  const newData = currentData.set('end', newEnd);
  const dataSelection = SelectionState.createEmpty(startKey);
  return Modifier.mergeBlockData(contentState, dataSelection, newData);
}

function removeSpace(editorState, currentContent, currentBlockKey, prevBlockKey) {
  if (!prevBlockKey || (currentContent.getBlockForKey(prevBlockKey).getText() === '') ||
      (currentContent.getBlockForKey(prevBlockKey).getText() === '\n')) {
      //Remove a space in the beginning of a line
      const nextBlockKey = getKeyAfter(currentContent, currentBlockKey);
      if (nextBlockKey) {
        const rangeToRemove = new SelectionState({
          anchorKey: currentBlockKey,
          anchorOffset: 0,
          focusKey: nextBlockKey,
          focusOffset: 0
        });
        const contentStateWithNewData = mergeBlocksData(currentContent, currentBlockKey, nextBlockKey);
        const newContentState = Modifier.removeRange(contentStateWithNewData, rangeToRemove, 'forward');
        return EditorState.push(editorState, newContentState);
      }
    }

  const nextBlockKey = getKeyAfter(currentContent, currentBlockKey);
  const prevBlockText = currentContent.getBlockForKey(prevBlockKey).getText();

  if (!nextBlockKey || (currentContent.getBlockForKey(nextBlockKey).getText() === '') ||
      (currentContent.getBlockForKey(nextBlockKey).getText() === '\n')) {
      //Remove a space at the end of a line
      if (nextBlockKey) {
        const rangeToRemove = new SelectionState({
          anchorKey: currentBlockKey,
          anchorOffset: 0,
          focusKey: nextBlockKey,
          focusOffset: 0
        });
        const contentStateWithNewData = mergeBlocksData(currentContent, currentBlockKey, nextBlockKey);
        const newContentState = Modifier.removeRange(contentStateWithNewData, rangeToRemove, 'forward');
        const newEditorState = EditorState.push(editorState, newContentState);
        const newSelection = new SelectionState({
          anchorKey: prevBlockKey,
          anchorOffset: prevBlockText.length
        });
        return EditorState.forceSelection(newEditorState, newSelection); 
      } else {
        const rangeToReplace = new SelectionState({
          anchorKey: prevBlockKey,
          anchorOffset: 0,
          focusKey: currentBlockKey,
          focusOffset: 1
        });
        const contentStateWithNewData = mergeBlocksData(currentContent, prevBlockKey, currentBlockKey);
        const newContentState = Modifier.replaceText(contentStateWithNewData, rangeToReplace, prevBlockText);
        const newEditorState = EditorState.push(editorState, newContentState);
        const newSelection = new SelectionState({
          anchorKey: prevBlockKey,
          anchorOffset: prevBlockText.length
        });
        return EditorState.forceSelection(newEditorState, newSelection); 
      }
      
    }
  
  //Remove space between two words
  const nextBlockText = currentContent.getBlockForKey(nextBlockKey).getText();
  const rangeToReplace = new SelectionState({
    anchorKey: prevBlockKey,
    anchorOffset: 0,
    focusKey: nextBlockKey,
    focusOffset: nextBlockText.length,
  });
  const newText = prevBlockText + nextBlockText;
  const contentStateWithNewData = mergeBlocksData(currentContent, prevBlockKey, nextBlockKey);
  const newContentState = Modifier.replaceText(contentStateWithNewData, rangeToReplace, newText);
  const newEditorState = EditorState.push(editorState, newContentState);
  if (prevBlockText === ' ') {
    const selectionAfter = new SelectionState({
      anchorKey: prevBlockKey,
      anchorOffset: 0,
    });
    return EditorState.forceSelection(newEditorState, selectionAfter);  
  } else {
    const selectionAfter = new SelectionState({
      anchorKey: prevBlockKey,
      anchorOffset: prevBlockText.length,
    });
    return EditorState.forceSelection(newEditorState, selectionAfter);  
  }
}

function removeLastWordCharacter(editorState, currentContent, currentBlockKey, prevBlockKey) {
  if (!prevBlockKey || (currentContent.getBlockForKey(prevBlockKey).getText() === '') ||
      (currentContent.getBlockForKey(prevBlockKey).getText() === '\n')) {
      //Remove last character in a word in the beginning of a line
      const rangeToReplace = new SelectionState({
        anchorKey: currentBlockKey,
        anchorOffset: 0,
        focusKey: currentBlockKey,
        focusOffset: 1
      });
      const newContentState = Modifier.replaceText(currentContent, rangeToReplace, '\r');
      const newEditorState = EditorState.push(editorState, newContentState);
      const newSelection = new SelectionState({
        anchorKey: currentBlockKey,
        anchorOffset: 1
      });
      return EditorState.forceSelection(newEditorState, newSelection);

    }

  const nextBlockKey = getKeyAfter(currentContent, currentBlockKey) 
  const prevBlockText = currentContent.getBlockForKey(prevBlockKey).getText();

  if (!nextBlockKey || (currentContent.getBlockForKey(nextBlockKey).getText() === '') ||
      (currentContent.getBlockForKey(nextBlockKey).getText() === '\n')) {
      //Remove ast character in a word at the end of a line
      if (nextBlockKey) {
        const rangeToRemove = new SelectionState({
          anchorKey: currentBlockKey,
          anchorOffset: 0,
          focusKey: nextBlockKey,
          focusOffset: 0
        });
        const contentStateWithNewData = mergeBlocksData(currentContent, currentBlockKey, nextBlockKey);
        const newContentState = Modifier.removeRange(contentStateWithNewData, rangeToRemove, 'forward');
        const newEditorState = EditorState.push(editorState, newContentState);
        const selectionAfter = new SelectionState({
          anchorKey: prevBlockKey,
          anchorOffset: prevBlockText.length,
        });
        return EditorState.forceSelection(newEditorState, selectionAfter);  
      } else {
        const rangeToReplace = new SelectionState({
          anchorKey: prevBlockKey,
          anchorOffset: 0,
          focusKey: currentBlockKey,
          focusOffset: 1
        });
        const contentStateWithNewData = mergeBlocksData(currentContent, prevBlockKey, currentBlockKey);
        const newContentState = Modifier.replaceText(contentStateWithNewData, rangeToReplace, prevBlockText);
        const newEditorState = EditorState.push(editorState, newContentState);
        const newSelection = new SelectionState({
          anchorKey: prevBlockKey,
          anchorOffset: prevBlockText.length
        });
        return EditorState.forceSelection(newEditorState, newSelection);
      }
    }

  //Remove a character between two spaces
  const nextBlockText = currentContent.getBlockForKey(nextBlockKey).getText();
  const rangeToReplace = new SelectionState({
    anchorKey: prevBlockKey,
    anchorOffset: 0,
    focusKey: nextBlockKey,
    focusOffset: nextBlockText.length,
  });
  const newText = prevBlockText + nextBlockText;
  const contentStateWithNewData = mergeBlocksData(currentContent, prevBlockKey, nextBlockKey);
  const newContentState = Modifier.replaceText(contentStateWithNewData, rangeToReplace, newText);
  const newEditorState = EditorState.push(editorState, newContentState);
  const selectionAfter = new SelectionState({
    anchorKey: prevBlockKey,
    anchorOffset: prevBlockText.length,
  });
  return EditorState.forceSelection(newEditorState, selectionAfter);  
}

function removeNewLine(editorState, currentContent, currentBlockKey, prevBlockKey, currentBlockText) {
  const prevTextBlockKey = getKeyBefore(currentContent, prevBlockKey);
  const prevTextBlockText = currentContent.getBlockForKey(prevTextBlockKey).getText();
  const rangeToReplace = new SelectionState({
    anchorKey: prevTextBlockKey,
    anchorOffset: 0,
    focusKey: currentBlockKey,
    focusOffset: currentBlockText.length
  });
  let newText;
  if (currentBlockText === '\r') {
    newText = prevTextBlockText
  } else {
    newText = prevTextBlockText + currentBlockText;
  }
  const contentStateWithNewData = mergeBlocksData(currentContent, prevTextBlockKey, currentBlockKey);
  const newContentState = Modifier.replaceText(contentStateWithNewData, rangeToReplace, newText);
  const newSelection = new SelectionState({
    anchorKey: prevTextBlockKey,
    anchorOffset: prevTextBlockText.length
  });
  const newEditorState = EditorState.push(editorState, newContentState);
  return EditorState.forceSelection(newEditorState, newSelection);
}

function removeBlocks(
  editorState, 
  currentContent, 
  currentSelection, 
  currentBlockKey, 
  endKey, 
  prevBlockKey,
  currentBlockText,
  endBlockText
) {
  const nextBlockKey = getKeyAfter(currentContent, endKey);
  if (prevBlockKey && nextBlockKey) {
    const nextBlockText = currentContent.getBlockForKey(nextBlockKey).getText();
    const prevBlockText = currentContent.getBlockForKey(prevBlockKey).getText();
    if (((prevBlockText === '') || (prevBlockText ==='\n')) &&
        ((nextBlockText === '') || (nextBlockText === '\n'))) {
      //Remove all the words from a line or both lines from a subtitle
      const newContentState = Modifier.replaceText(currentContent, currentSelection, '\r');
      return EditorState.push(editorState, newContentState);
    }
    if (endBlockText === '') {
      const rangeToReplace = new SelectionState({
        anchorKey: currentBlockKey,
        anchorOffset: 0,
        focusKey: nextBlockKey,
        focusOffset: nextBlockText.length
      });
      const newContentState = Modifier.replaceText(currentContent, rangeToReplace, nextBlockText);
      return EditorState.push(editorState, newContentState);
    }

    if ((endBlockText === '\n') && (prevBlockText === '')) {
      //The space between tne subtitles is in the end of the selection
      const blockBeforeEndKey = getKeyBefore(currentContent, endKey);
      const blockBeforeEndText = currentContent.getBlockForKey(blockBeforeEndKey).getText();
      const rangeToRemove = new SelectionState({
        anchorKey: currentBlockKey,
        anchorOffset: 0,
        focusKey: blockBeforeEndKey,
        focusOffset: blockBeforeEndText.length
      });
      const newContentState = Modifier.replaceText(currentContent, rangeToRemove, '\r');
      const newEditorState = EditorState.push(editorState, newContentState);
      const newSelection = new SelectionState({
        anchorKey: currentBlockKey,
        anchorOffset: 1
      });
      return EditorState.forceSelection(newEditorState, newSelection);
    }
    if ((currentBlockText === '') && (nextBlockText === '\n')) {
      const newContentState = Modifier.removeRange(currentContent, currentSelection, 'backward');
      return EditorState.push(editorState, newContentState);
    }

    const rangeToRemove = new SelectionState({
      anchorKey: currentBlockKey,
      anchorOffset: 0,
      focusKey: nextBlockKey,
      focusOffset: 0
    });
    const newContentState = Modifier.removeRange(currentContent, rangeToRemove, 'backward');
    const newEditorState = EditorState.push(editorState, newContentState);
    const newSelection = new SelectionState({
      anchorKey: currentBlockKey,
      anchorOffset: 0
    });
    return EditorState.forceSelection(newEditorState, newSelection);
  } else if (prevBlockKey) {
    const rangeToReplace = new SelectionState({
      anchorKey: prevBlockKey,
      anchorOffset: 0,
      focusKey: endKey,
      focusOffset: endBlockText.length
    });
    const newContentState = Modifier.replaceText(currentContent, rangeToReplace, ' ');
    return EditorState.push(editorState, newContentState);
  } else {
    const rangeToRemove = new SelectionState({
      anchorKey: currentBlockKey,
      anchorOffset: 0,
      focusKey: nextBlockKey,
      focusOffset: 0
    });
    const newContentState = Modifier.removeRange(currentContent, rangeToRemove, 'backward');
    const newEditorState = EditorState.push(editorState, newContentState);
    const newSelection = new SelectionState({
      anchorKey: currentBlockKey,
      anchorOffset: 0
    });
    return EditorState.forceSelection(newEditorState, newSelection);
  }
}

export default function handleBackspace(editorState) {
  const currentContent = editorState.getCurrentContent();
  const currentSelection = editorState.getSelection();
  const currentBlockKey = currentSelection.getStartKey();
  const currentBlockText = currentContent.getBlockForKey(currentBlockKey).getText();
  const startOffset = currentSelection.getStartOffset();
  const prevBlockKey = getKeyBefore(currentContent, currentBlockKey);

  if (currentSelection.isCollapsed()) {
    if (currentBlockText === '\n') {
      //Block changes between subtitles
      return editorState;
    }
    if ((startOffset === 0) && prevBlockKey && 
        (currentContent.getBlockForKey(prevBlockKey).getText() === '\n')) {
      //Block backspace in the beggining of the first line in a subtitle
      return editorState;
    }
    if (currentBlockText === '\r') {
      if (prevBlockKey && (currentContent.getBlockForKey(prevBlockKey).getText() !== '\n')) {
        return removeNewLine(editorState, currentContent, currentBlockKey, prevBlockKey, currentBlockText);
      } else {
        return editorState;
      }
    }
    if ((startOffset === 0) && prevBlockKey && 
        (currentContent.getBlockForKey(prevBlockKey).getText() === '')) {
      
      return removeNewLine(editorState, currentContent, currentBlockKey, prevBlockKey, currentBlockText);
    }
    if ((startOffset === 0) && prevBlockKey && 
        (currentContent.getBlockForKey(prevBlockKey).getText() === ' ')) {
      const newSelection = new SelectionState({
        anchorKey: prevBlockKey,
        anchorOffset: 1
      });

      const editorStateWithSelection = EditorState.forceSelection(editorState, newSelection);
      return removeSpace(editorStateWithSelection, currentContent, prevBlockKey, getKeyBefore(currentContent, prevBlockKey));
    }
    if (currentBlockText === ' ') {
      //Remove space between two words
      return removeSpace(editorState, currentContent, currentBlockKey, prevBlockKey);
    }
    if (currentBlockText.length === 1) {
      return removeLastWordCharacter(editorState, currentContent, currentBlockKey, prevBlockKey);
    }
  } else {
    const selectedBlockList = getSelectedBlocksList(editorState);
    //Block backspace for cross-subtitle selection
    for (const [index, block] of selectedBlockList.entries()) {
      if ((block.getText() === '\n') && (index !== (selectedBlockList.size - 1))) {
        return editorState;
      }
    }
  
    const startKey = currentSelection.getStartKey();
    const endOffset = currentSelection.getEndOffset();
    const endKey = currentSelection.getEndKey();
    const endBlockText = currentContent.getBlockForKey(endKey).getText();
    const contentStateWithNewData = mergeBlocksData(currentContent, startKey, endKey);

    if ((startOffset === 0) && (endOffset === endBlockText.length)) {
      return removeBlocks(
        editorState, 
        contentStateWithNewData, 
        currentSelection, 
        currentBlockKey, 
        endKey, 
        prevBlockKey,
        currentBlockText,
        endBlockText
      );
    } else {
      const newContentState = Modifier.removeRange(contentStateWithNewData, currentSelection);
      return EditorState.push(editorState, newContentState);
    }
  }
  return null;
}