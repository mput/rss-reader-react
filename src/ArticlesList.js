import React from 'react';
import { Col, Button, ListGroup, ListGroupItem } from 'reactstrap';

const Item = ({ title, link, onClick }) => (
  <ListGroupItem className="d-flex">
    <Button
      type="button"
      color="primary"
      onClick={onClick}
      outline
      size="sm"
      className="mr-2 align-self-center"
    >
      Preview
    </Button>
    <a href={link} rel="noopener noreferrer" target="_blank">{title}</a>
  </ListGroupItem>
);

const ArticlesList = ({ children }) => (
  <Col className="pt-3">
    <h2 className="pl-4">Articles:</h2>
    <ListGroup flush>
      {children}
    </ListGroup>
  </Col>
);

ArticlesList.Item = Item;
export default ArticlesList;
