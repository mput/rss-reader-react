import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const Item = ({ header, subHeader, message, toggle, ...injectedProps }) => (
  <CSSTransition
    timeout={400}
    classNames={{
      enterActive: 'show',
      enterDone: 'show',
    }}
    {...injectedProps}
  >
    <div className="toast fade">
      <div className="toast-header">
        <strong className="mr-auto">{header}</strong>
        <small className="text-muted">{subHeader}</small>
        <button type="button" className="ml-2 mb-1 close" onClick={toggle}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  </CSSTransition>
);

const Toast = ({ children }) => (
  <TransitionGroup
    style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '100',
    }}
  >
    {children}
  </TransitionGroup>
);

Toast.Item = Item;
export default Toast;
