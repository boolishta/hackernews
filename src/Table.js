import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './App.css';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'NONE',
      isSortReverse: false
    }
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }
  render() {
    const { list, onDismiss, SORTS } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortList = isSortReverse
      ? sortedList.reverse()
      : sortedList;
    return (
      <div className="table">
        <div className="table-header">
          <span style={{ width: '45%' }}>
            <Sort sortKey={'TITLE'} onSort={this.onSort} activeSortKey={sortKey} isSortReverse={isSortReverse}>Заголовок</Sort>
          </span>
          <span style={{ width: '15%' }}>
            <Sort sortKey={'AUTHOR'} onSort={this.onSort} activeSortKey={sortKey} isSortReverse={isSortReverse}>Автор</Sort>
          </span>
          <span style={{ width: '15%' }}>
            <Sort sortKey={'COMMENTS'} onSort={this.onSort} activeSortKey={sortKey} isSortReverse={isSortReverse}>Комментарии</Sort>
          </span>
          <span style={{ width: '15%' }}>
            <Sort sortKey={'POINTS'} onSort={this.onSort} activeSortKey={sortKey} isSortReverse={isSortReverse}>Очки</Sort>
          </span>
          <span style={{ width: '10%' }}>
            
        </span>
        </div>
        {reverseSortList.map(item =>
          <div key={item.objectID} className="table-row">
            <span style={{ width: '45%' }}><a href={item.url}>{item.title}</a></span>
            <span style={{ width: '15%' }}>{item.author}</span>
            <span style={{ width: '15%' }}>comments: {item.num_comments}</span>
            <span style={{ width: '15%' }}>points: {item.points}</span>
            <span style={{ width: '10%' }}><Button onClick={() => onDismiss(item.objectID)} className="button-inline">Remove</Button></span>
          </div>)}
      </div>
    )
  }
}

Table.propTypes = { //устанавливаем типизацию
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired
}

const Sort = ({ sortKey, onSort, children, activeSortKey, isSortReverse }) => {
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );
  const arrowUp = ['fas', 'arrow-up'];
  const arrowDown = ['fas', 'arrow-down'];
  
  return <>
    <Button onClick={() => onSort(sortKey)} className={sortClass}>
      {children}
    </Button> 
    { sortKey === activeSortKey &&
        (isSortReverse
          ? <FontAwesomeIcon icon={arrowUp} />
          : <FontAwesomeIcon icon={arrowDown} />) }
  </>
}


export default Table;
