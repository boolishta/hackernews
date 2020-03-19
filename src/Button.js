import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ onClick, className='', children }) => 
  <button className={ className } onClick={ onClick } type="button">{ children }</button>

Button.propTypes = {
  onClick: PropTypes.func.isRequired, //тип функция, обязятелен
  className: PropTypes.string,
  children: PropTypes.node
}
Button.defaultProps = { //по умалочанию
  className: '' 
}
export default Button;


