const initialState = {
  source: "https://ooona-public.s3.amazonaws.com/video/Amyloidosis%20Awareness.MP4",
  currentTime: 0,
  wordClickedTime: false,
  isPlaying: false,
  frameRate: 25
};

const mediaReducer = (state = initialState, action) => {
  switch(action.type) {
    case UPDATE_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload
      };
    case WORD_CLICKED:
      return {
        ...state,
        wordClickedTime: action.payload
      };
    case TOGGLE_PLAY:
      return {
        ...state,
        isPlaying: state.isPlaying ? false : true 
      }
    default:
      return state;
  }
}

export const UPDATE_CURRENT_TIME = "UPDATE_CURRENT_TIME";
export const WORD_CLICKED = "WORD_CLICKED";
export const TOGGLE_PLAY = "TOGGLE_PLAY";
export default mediaReducer;




