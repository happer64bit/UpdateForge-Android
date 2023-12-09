const initialState = {
    updateOnLoad: false,
};

const settingsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'UPDATE_SETTINGS':
            return {
                ...state,
                ...action.payload,
            };
        case 'RESET_SETTINGS':
            return initialState;
        default:
            return state;
    }
};

"use client"
export const updateSettings = (newSettings: any) => {
    return {
        type: 'UPDATE_SETTINGS',
        payload: newSettings,
    };
};

export const resetSettings = () => {
    return {
        type: 'RESET_SETTINGS',
    };
};

export default settingsReducer;
