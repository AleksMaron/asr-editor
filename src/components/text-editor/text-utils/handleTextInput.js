import { EditorState, Modifier, SelectionState } from "draft-js";
import { mergeBlocksData } from "./handleBackspace";
import { getSelectedBlocksList } from "draftjs-utils";
import { getKeyAfter } from "../getKeysBinary";

export default function handleTextInput(chars, editorState) {
  const currentContent = editorState.getCurrentContent();
  const currentSelection = editorState.getSelection();
  const currentBlockKey = currentSelection.getAnchorKey();
  const currentText = currentContent.getBlockForKey(currentBlockKey).getText();
  if (currentText === "\n") {
    return editorState;
  }
  
  if (currentText === " ") {
    const nextBlockKey = getKeyAfter(currentContent, currentBlockKey);
    if (nextBlockKey) {
      const newSelection = new SelectionState({
        anchorKey: nextBlockKey,
        anchorOffset: 0,
        focusKey: nextBlockKey,
        focusOffset: 0
      });

      const newContentState = Modifier.insertText(currentContent, newSelection, chars);
      return EditorState.push(editorState, newContentState);
    }
  }

  if (!currentSelection.isCollapsed()) {
    const selectedBlockList = getSelectedBlocksList(editorState);
    //Block backspace for cross-subtitle selection
    for (const [index, block] of selectedBlockList.entries()) {
      if ((block.getText() === "\n") && (index !== (selectedBlockList.size - 1))) {
        return editorState;
      }
    }
  
    const startKey = currentSelection.getStartKey();
    const endKey = currentSelection.getEndKey();
    const contentStateWithNewData = mergeBlocksData(currentContent, startKey, endKey);
    const newContentState = Modifier.replaceText(contentStateWithNewData, currentSelection, chars);
    return EditorState.push(editorState, newContentState);
  }

  return null;
}