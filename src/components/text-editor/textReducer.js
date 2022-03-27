import prepareTextFromJSON from './prepareTextFromJSON';

// const rawContentData = prepareTextFromJSON();

const initialState = {
  rawContentData: null,
};

const textReducer = (state = initialState, action) => {
  switch(action.type) {
    case TEXT_UPDATED_ASYNC:
      return {
        ...state,
        rawContentData: action.payload
      };
    default:
      return state;
  }
}




export const TEXT_UPDATED = "TEXT_UPDATED"; 
export const TEXT_UPDATED_ASYNC = "TEXT_UPDATED_ASYNC";
export default textReducer;


