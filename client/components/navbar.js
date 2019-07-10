// import React from 'react';
// import PropTypes from 'prop-types';
// import {connect} from 'react-redux';
// import {Link} from 'react-router-dom';
// import {logout} from '../store';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import TypoGraphy from '@material-ui/core/Typography';
// import {makeStyles} from '@material-ui/styles';
// import {textAlign} from '@material-ui/system';

// const useStyles = makeStyles({
//   playButton: {
//     background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
//     border: 0,
//     borderRadius: 3,
//     boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
//     color: 'white',
//     height: 48,
//     padding: '0 30px'
//   },
//   gameTitle: {
//     fontSize: '15vh',
//     textAlign: 'center',
//     letterSpacing: '10px',
//     fontWeight: 'lighter',

//     // fontFamily: '"Monoton", cursive',
//     // fontFamily: '"Coiny", cursive'
//     fontFamily: '"Audiowide", cursive',
//     color: 'white'
//   }
// });

// #title {
//   color: white;
// font-family: "Quicksand", sans-serif;
// font-weight: lighter;
// font-size: 7vw;
// letter-spacing: 0.4em;
// position: fixed;
// top: 40%;
// left: 50%;
// transform: translate(-50%, -50%);
// }

// const Navbar = ({handleClick, isLoggedIn}) => {
//   const classes = useStyles();
//   return (
//     <h1 id="title" className={classes.gameTitle}>
//       Hopper.io
//     </h1>
//   );
// };

/**
 * CONTAINER
 */
// const mapState = state => {
//   return {
//     isLoggedIn: !!state.user.id
//   };
// };

// const mapDispatch = dispatch => {
//   return {
//     handleClick() {
//       dispatch(logout());
//     }
//   };
// };

// export default connect(mapState, mapDispatch)(Navbar);

// /**
//  * PROP TYPES
//  */
// Navbar.propTypes = {
//   handleClick: PropTypes.func.isRequired,
//   isLoggedIn: PropTypes.bool.isRequired
// };
