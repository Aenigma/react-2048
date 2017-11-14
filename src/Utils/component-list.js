import { cloneElement, Children } from 'react';

export const createComponentList = (components, prefix = '') => components.map(
  (component, index) => cloneElement(Children.only(component), {key: prefix+index})
);
