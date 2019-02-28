/* eslint-disable react/no-unused-state */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Container, Row, Col, Button, ListGroup, ListGroupItem } from 'reactstrap';
import UrlForm from './UrlForm';

const ChannelsList = (props) => {
  return (
    <Col xs="12" md="6" className="pt-3">
      <h2 className="pl-4">Feeds:</h2>
      <ListGroup className="mt-4">
        {props.children}
      </ListGroup>
    </Col>
  );
};

const ArticlesList = (props) => {
  return (
    <Col className="pt-3">
      <h2 className="pl-4">Articles:</h2>
      <ListGroup flush>
        {props.children}
      </ListGroup>
    </Col>
  );
};

const Channel = (props) => {
  return (
    <ListGroupItem tag="a" action active href="#">
      <p className="mb-1"><strong>title</strong></p>
      <p className="mb-1">description</p>
    </ListGroupItem>
  );
};

const Article= (props) => {
  return (
    <ListGroupItem className="d-flex">
      <Button type="button" color="primary" outline size="sm" className="mr-2 align-self-center">
        Preview
      </Button>
      <a href="#">Title</a>
    </ListGroupItem>
  );
};


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        value: '',
        state: 'empty',
        message: '',
      },
    };
  }

  render() {
    return (
      <Container className="mt-3">
        <Row>
          <Col>
            <UrlForm />
          </Col>
        </Row>
        <Row>
          <ChannelsList>
            <Channel />
          </ChannelsList>
          <ArticlesList>
            <Article />
            <Article />
          </ArticlesList>
        </Row>
      </Container>
    );
  }
}
