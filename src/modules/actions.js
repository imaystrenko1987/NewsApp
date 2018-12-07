export const SET_TITLE = 'SET_TITLE';
export const SET_PAGING = 'SET_PAGING';

export const setTitle = (newTitle) => {
    return {
        type: SET_TITLE,
        title: newTitle
    };
};

export const setPaging = (paging) => {
    return {
        type: SET_PAGING,
        paging: paging
    };
};