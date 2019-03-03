/* eslint-disable react/prop-types */
import React from 'react';
import { Col, ListGroup, ListGroupItem } from 'reactstrap';

const Channel = ({ title, description, active, onClick, onDelete }) => {
  const deleteBtn = (
    <button type="button" className="close position-absolute" onClick={onDelete} style={{ top: '3px', right: '8px' }} aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  );
  return (
    <ListGroupItem onClick={onClick} action active={active}>
      <div className="mr-1">
        <p className="mb-1"><strong>{title}</strong></p>
        {description && <p className="mb-1">{description}</p>}
      </div>
      {onDelete && deleteBtn}
    </ListGroupItem>
  );
};

const ChannelsList = ({ children }) => (
  <Col xs="12" md="5" className="pt-3">
    <h2 className="pl-4">Feeds:</h2>
    <ListGroup className="mt-4">
      {children}
    </ListGroup>
  </Col>
);

ChannelsList.Channel = Channel;
export default ChannelsList;
