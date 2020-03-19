import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowDown, faArrowUp, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { sortBy } from 'lodash';
import React, { Component } from 'react';
import './App.css';
import Button from './Button';
import Search from './Search';
import Table from './Table';
import { updateSearchTopStoriesState } from './utils';

library.add(faSpinner, faArrowDown, faArrowUp);

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '10';

const PATH_BASE = 'https://hn.algolia.com/api/v1/';
const PATH_SEARCH = 'search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse()
}

//const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      results: null, //сохраняем все данные которые были получены, делаем кэш
      searchKey: '', 
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
      
    };
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    
  }
  
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }
  setSearchTopStories(result) { //сетаем данные    
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page));
  }
  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm); 
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  fetchSearchTopStories(searchTerm, page=0) { //получить с сервера данные по запросу, вторым параметром указываем страницу       
    this.setState({ isLoading: true });
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    /**
     * если компонента размонитрована то не вызываем setState
     */
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error })); //обработка ошибок, если не верный url
  }
  onDismiss(id) { //удаляем 
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = item => item.objectID !== id;    
    const updateHits = hits.filter(isNotId);
    this.setState({ 
      results: { 
        ...results,
        [searchKey]: {hits: updateHits, page} 
      }
    });
  }
  onSearchChange(event) { //сетаем изменения инпута
    this.setState({ searchTerm: event.target.value })
  }
  onSearchSubmit(event) { //посылаем на сервер запрос
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if(this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm)
    };
    event.preventDefault();
  }
  render() {
    const { 
      searchTerm, 
      results,
      searchKey,
      error,
      isLoading } = this.state;
    const page = (
      results && 
      results[searchKey] &&
      results[searchKey].page
    ) || 0;
    const list = (
      results && 
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <div className="page">
        <div className="itaractions">
          <Search searchTerm={searchTerm}
                  onSubmit={this.onSearchSubmit}
                  onSearchChange={this.onSearchChange}>Поиск</Search> 
        </div>  
        { error 
            ? <div className="itaractions"><p>Something went wrong :(</p></div>
            : <Table  list={list} 
                      onDismiss={this.onDismiss} 
                      SORTS={SORTS}/>
        }        
        <div className="iteractions">
          { isLoading
              ? <FontAwesomeIcon icon={['fas', 'spinner']} spin />
              : <Button onClick={ () => this.fetchSearchTopStories(searchKey, page + 1)}>Больше Историй</Button>}
        </div>
      </div>
    );
  }
}

export default App; 
