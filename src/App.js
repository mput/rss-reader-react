import React, { Component } from 'react';
import { Container, Row, Col, ListGroup } from 'reactstrap';
import UrlForm from './UrlForm';

const ChannelsList = (props) => {
  return (
    <Col xs="12" md="6" className="pt-3">
      <h2 className="pl-4">Feeds:</h2>
      <div className="mt-4">
        {props.children}
      </div>
    </Col>
  );
}

const ArticlesList = (props) => {
  return (
    <Col className="pt-3">
      <h2 className="pl-4">Articles:</h2>
      <div className="mt-2">
        <ListGroup className="articles-list list-group list-group-flush">
          {props.children}
        </ListGroup>
      </div>
    </Col>
  );
}

class App extends Component {
  render() {
    return (
      <Container className="mt-3">
          <Row>
            <Col>
              <UrlForm />
            </Col>
          </Row>
          <Row>
            <ChannelsList/>
            <ArticlesList/>
          </Row>
      </Container>
    );
  }
}

export default App;
