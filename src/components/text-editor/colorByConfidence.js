export default function colorByConfidence(contentBlock, callback, contentState) {
  const text = contentBlock.getText();
  callback(0, text.length);
}