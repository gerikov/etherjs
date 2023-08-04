import PropTypes from 'prop-types';
import styles from './Button.module.scss';

const Button = ({ text, ...props }) => {
  return <button {...props}>{text}</button>;
};

Button.propTypes = {
  text: PropTypes.string,
  props: PropTypes.object,
};

export default Button;
