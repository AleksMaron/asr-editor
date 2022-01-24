
const initialState = {
  source: "https://ooona-public.s3.amazonaws.com/video/Amyloidosis%20Awareness.MP4",
  currentTime: 0
}


const mediaReducer = (state = initialState, action) => {
  switch(action.type) {
    case "UPDATE_CURRENT_TIME":
      return {
        ...state,
        currentTime: action.payload
      };
    default:
      return state;
  }
}

export default mediaReducer;




