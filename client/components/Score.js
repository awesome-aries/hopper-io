import React from 'react';
import {connect} from 'react-redux';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
  score: {
    margin: '20px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    align: 'center'
  },
  scoreBar: {
    background: 'white',
    opacity: '0.5',
    border: '1 solid white',
    borderRadius: 3,
    color: 'black',
    height: '40px',
    width: '800px',
    padding: '0 30px',
    position: 'relative',
    // fontFamily: '"Monoton", cursive',
    // fontFamily: '"Coiny", cursive'
    fontFamily: '"Audiowide", cursive',
    zIndex: '-5'
  },
  scoreText: {
    height: '100%',
    fontSize: '40px',
    zIndex: '5'
  },
  percent: {
    height: '100%',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    transition: 'width .2s ease-in',
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: '-1'
  }
});

const Score = props => {
  const classes = useStyles();
  return (
    <div className={classes.score}>
      <div className={classes.scoreBar}>
        <div className={classes.scoreText}>
          {props.name} : {props.score}%
        </div>
        <div className={classes.percent} style={{width: `${props.score}%`}} />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  score: state.gameState.score,
  name: state.gameState.playerName
});

export default connect(mapStateToProps)(Score);
