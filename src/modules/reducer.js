import { SET_TITLE, SET_PAGING } from './actions';

const initialState = {
    title: 'News Application'
};

const reducer = (state=initialState, action) => {
    switch(action.type) {
    case SET_TITLE:
        return Object.assign({}, state, {
            title: action.title
        });
    case SET_PAGING:
        return Object.assign({}, state, {
            paging: action.paging
        });
    default:
        return state;
    }
};

export default reducer;