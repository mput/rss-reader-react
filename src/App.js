/* eslint-disable react/no-unused-state */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Container, Row, Col, Button, ListGroup, ListGroupItem } from 'reactstrap';
import axios from 'axios';
import validator from 'validator';
import { uniqueId, sample } from 'lodash';
import parseRSS from './lib/parseRSS';
import UrlForm from './UrlForm';

// const addNewItems = (feed, items) => {
//   const existingItems = state.items.filter(article => article.feedId === feed.id);
//   const newArticles = items
//     .filter(article => isNewItem(article, existingItems))
//     .map(item => ({ ...item, feedId: feed.id }));
//   if (newArticles.length > 0) {
//     state.message = {
//       counter: state.message.counter + 1,
//       text: `Fetched ${newArticles.length} new items from <b>${feed.title}</b>`,
//     };
//     state.items = [...newArticles, ...state.items];
//   }
// };
// const startUpdating = (feed) => {
//   setTimeout(() => {
//     fetchFeed(feed.url)
//       .then(({ items }) => addNewItems(feed, items))
//       .finally(() => {
//         startUpdating(feed);
//       });
//   }, updateInterval);
// };

const CORSProxies = ['https://cors-anywhere.herokuapp.com/', 'https://cors.io/?'];
const proxyUrl = url => `${sample(CORSProxies)}${url}`;
const fetchFeed = async (url) => {
  console.log(proxyUrl(url));
  const { data } = await axios.get(proxyUrl(url));
  return parseRSS(data);
};

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
      formValue: '',
      formState: 'empty', // empty, valid, invalid, waiting
      formMessage: '',
      channels: [],
      articles: [],
      activeFeed: null,
    };
  }

  onChange = (event) => {
    const { value } = event.target;
    this.setState({ formValue: value });
    if (!value) {
      this.setState({ formMessage: '', formState: 'empty' });
      return;
    }
    const error = this.checkInput(value);
    if (error) {
      this.setState({ formMessage: error, formState: 'invalid' });
    }
    if (!error) {
      this.setState({ formMessage: 'Looks good!', formState: 'valid' });
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const { formValue } = this.state;
    this.setState({ formState: 'waiting' });
    try {
      await this.addNewFeed(formValue);
      this.setState({ formValue: '', formMessage: '', formState: 'empty' });
    } catch (e) {
      this.setState({ formMessage: e.message, formState: 'invalid' });
    }
  }

  checkInput(url) {
    const { channels } = this.state;
    if (!validator.isURL(url)) {
      return 'Not valid URL';
    }
    if (channels.find(channel => channel.url === url)) {
      return 'URL already exist';
    }
    return false;
  }

  async addNewFeed(url) {
    const feed = await fetchFeed(url);
    const channel = { ...feed.channel, url, id: uniqueId('feed_') };
    const { channels } = this.state;
    this.setState({ channels: [channel, ...channels] });
    // addNewItems(channel, feed.items);
    // startUpdating(channel);
  }

  render() {
    const { formValue, formState, formMessage } = this.state;

    return (
      <Container className="mt-3">
        <Row>
          <Col>
            <UrlForm
              value={formValue}
              state={formState}
              message={formMessage}
              onSubmit={this.onSubmit}
              onChange={this.onChange}
            />
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
