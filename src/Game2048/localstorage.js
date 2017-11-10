const version = "1.0.0";

export const loadState = () => {
  try {
    const stateVersion = localStorage.getItem('state-version');
    const serializedState = localStorage.getItem('state');

    if (serializedState === null || stateVersion !== version) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state-version', version);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    console.error(err);
  }
};
