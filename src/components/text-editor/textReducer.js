
const initialState = {
  rawContentData: null,
  isFileUploaded: false,
  isSaved: true
};

const textReducer = (state = initialState, action) => {
  switch(action.type) {
    case TEXT_UPDATED_ASYNC:
      return {
        ...state,
        rawContentData: action.payload
      };
    case FILE_UPLOADED:
      return {
        ...state,
        isFileUploaded: action.payload
      }
    case TOGGLE_SAVE:
      return {
        ...state,
        isSaved: state.isSaved ? false : true
      }
    default:
      return state;
  }
}



export const FILE_UPLOADED = 'FILE_UPLOADED';
export const TEXT_UPDATED = 'TEXT_UPDATED'; 
export const TEXT_UPDATED_ASYNC = 'TEXT_UPDATED_ASYNC';
export const TOGGLE_SAVE = 'TOGGLE_SAVE';
export default textReducer;


