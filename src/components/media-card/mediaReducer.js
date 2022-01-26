import { fromJS } from 'immutable';

const initialState = fromJS({
  source: "https://ooona-public.s3.amazonaws.com/video/Amyloidosis%20Awareness.MP4",
  currentTime: 0
});

const mediaReducer = (state = initialState, action) => {
  switch(action.type) {
    case updateCurrentTimeType:
      return state.setIn(['currentTime'], action.payload);
    default:
      return state;
  }
}

export const updateCurrentTimeType = "UPDATE_CURRENT_TIME";
export default mediaReducer;




