import React from 'react';
import './App.css';
import PropTypes from 'prop-types';

const Search = ({ searchTerm, onSubmit, onSearchChange, children }) => {
  let input;
  return (
  <form onSubmit={onSubmit}> 
    {children}: <input  type="text" onChange={onSearchChange} value={searchTerm} ref={ (node) => input = node}/> 
    <button type="submit">Найти</button>
  </form>
  )
}

Search.propTypes = {
  searchTerm: PropTypes.string,
  onSubmit: PropTypes.func,
  onSearchChange: PropTypes.func,
  children: PropTypes.node
}
export default Search;
