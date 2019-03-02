/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import validator from 'validator';
import { uniqueId, sample } from 'lodash';

import parseRSS from './lib/parseRSS';
import UrlForm from './UrlForm';
import ArticlesList from './ArticlesList';
import ChannelsList from './ChannelsList';
import ModalPreview from './ModalPreview';


const CORSProxies = ['https://cors-anywhere.herokuapp.com/', 'https://cors.io/?'];
const proxyUrl = url => `${sample(CORSProxies)}${url}`;
const fetchFeed = async (url) => {
  const { data } = await axios.get(proxyUrl(url));
  return parseRSS(data);
};
const isNewItem = (maybeNew, oldItems) => !oldItems.find(item => item.guid === maybeNew.guid);

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
      articleToPreview: null,
    };

    this.channelsTimeOutIds = {};
  }

  async componentDidMount() {
    const channelToStartWith = [
      'http://lorem-rss.herokuapp.com/feed?unit=second&interval=4',
      'https://habr.com/ru/rss/all/all/?fl=ru',
    ];
    Promise.all(channelToStartWith.map(channel => this.addNewFeed(channel).catch(console.log)));
  }

  onFormChange = (event) => {
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

  onFromSubmit = async (event) => {
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

  onClickMakeFeedActive = id => (event) => {
    event.preventDefault();
    this.setState({ activeFeed: id });
  }

  onClickDeleteFeed = id => (event) => {
    const { channels, articles, activeFeed } = this.state;
    clearTimeout(this.channelsTimeOutIds[id]);
    delete this.channelsTimeOutIds[id];

    this.setState({
      channels: channels.filter(channel => channel.id !== id),
      articles: articles.filter(article => article.feedId !== id),
    });
    if (id === activeFeed) {
      this.setState({ activeFeed: null });
    }
    event.preventDefault();
    event.stopPropagation();
  }

  onClickPreviewArticle = (title, description, link) => (event) => {
    this.setState({ articleToPreview: { title, description, link } });
  };

  onClickCloseModal = () => {
    this.setState({ articleToPreview: null });
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
    this.addNewItems(channel, feed.items);
    this.startUpdating(channel);
  }

  addNewItems = (feed, items) => {
    const { articles } = this.state;
    const existingItems = articles.filter(article => article.feedId === feed.id);
    const newArticles = items
      .filter(article => isNewItem(article, existingItems))
      .map(item => ({ ...item, feedId: feed.id }));
    if (newArticles.length > 0) {
      // state.message = {
      //   counter: state.message.counter + 1,
      //   text: `Fetched ${newArticles.length} new items from <b>${feed.title}</b>`,
      // };
      const updatedArticles = [...newArticles, ...articles];
      this.setState({ articles: updatedArticles });
    }
  }

  startUpdating = (feed) => {
    const timeoutId = setTimeout(async () => {
      console.log(`${timeoutId} Updating feed ${feed.title}`);
      console.log(this.channelsTimeOutIds);
      const { items } = await fetchFeed(feed.url);
      try {
        this.addNewItems(feed, items);
      } finally {
        this.startUpdating(feed);
      }
    }, 5000);
    this.channelsTimeOutIds[feed.id] = timeoutId;
  };

  render() {
    const { formValue, formState, formMessage, channels,
      activeFeed, articles, articleToPreview } = this.state;

    const isModalOpen = !!articleToPreview;

    const channelsElements = channels.map(({ title, description, id }) => (
      <ChannelsList.Channel
        title={title}
        description={description}
        key={id}
        active={(id === activeFeed)}
        onClick={this.onClickMakeFeedActive(id)}
        onDelete={this.onClickDeleteFeed(id)}
      />
    ));

    const articlesElements = articles
      .filter((({ feedId }) => {
        if (!activeFeed) return true;
        return feedId === activeFeed;
      }))
      .map(({ title, description, link, feedId, guid }) => {
        return (
          <ArticlesList.Item
            title={title}
            link={link}
            onClick={this.onClickPreviewArticle(title, description, link)}
            key={`${feedId}+${guid}`}
          />
        );
      });

    const channelRow = (
      <Row>
        <ChannelsList>
          <ChannelsList.Channel
            title="All feeds"
            active={activeFeed === null}
            onClick={this.onClickMakeFeedActive(null)}
          />
          {channelsElements}
        </ChannelsList>
        <ArticlesList>
          {articlesElements}
        </ArticlesList>
      </Row>
    );

    return (
      <>
        <Container className="mt-3">
          <Row>
            <Col>
              <UrlForm
                value={formValue}
                state={formState}
                message={formMessage}
                onSubmit={this.onFromSubmit}
                onChange={this.onFormChange}
              />
            </Col>
          </Row>
          {channels.length > 0 && channelRow}
        </Container>
        <ModalPreview
          header={isModalOpen && articleToPreview.title}
          body={isModalOpen && articleToPreview.description}
          link={isModalOpen && articleToPreview.link}
          isOpen={isModalOpen}
          toggle={this.onClickCloseModal}
        />
      </>
    );
  }
}
