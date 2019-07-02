import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {logout} from '../store';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TypoGraphy from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
  playButton: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px'
  },
  gameTitle: {
    fontSize: '50px',
    // fontFamily: '"Monoton", cursive',
    // fontFamily: '"Coiny", cursive'
    fontFamily: '"Audiowide", cursive'
  }
});

const Navbar = ({handleClick, isLoggedIn}) => {
  const classes = useStyles();
  return (
    <AppBar color="default" position="static">
      <Toolbar>
        <TypoGraphy align="center" className={classes.gameTitle}>
          Hopper.io
        </TypoGraphy>

        {isLoggedIn ? (
          <div>
            {/* The navbar will show these links after you log in */}
            <Link to="/home">Home</Link>
            <a href="#" onClick={handleClick}>
              Logout
            </a>
          </div>
        ) : (
          <div>
            {/* The navbar will show these links before you log in */}
            {/* <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link> */}
          </div>
        )}

        <hr />
      </Toolbar>
    </AppBar>
  );
};

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  };
};

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    }
  };
};

export default connect(mapState, mapDispatch)(Navbar);

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};
