const initialState = {
  source: "https://ooona-public.s3.amazonaws.com/video/Amyloidosis%20Awareness.MP4",
  currentTime: 0,
  wordClickedTime: 0,
};

const mediaReducer = (state = initialState, action) => {
  switch(action.type) {
    case updateCurrentTimeType:
      return {
        ...state,
        currentTime: action.payload
      };
    case wordClickedType:
      return {
        ...state,
        wordClickedTime: action.payload
      };
    default:
      return state;
  }
}

export const updateCurrentTimeType = "UPDATE_CURRENT_TIME";
export const wordClickedType = "WORD_CLICKED"
export default mediaReducer;




