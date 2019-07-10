import React from 'react';
import Container from '@material-ui/core/Container';
import {connect} from 'react-redux';
import {XYToInd} from '../util/tileMapConversions';
import Score from './Score';

const Ui = props => {
  return (
    <Container id="ui">
      <Score />
      <div>{props.children}</div>
      {/* <h3>Quick n Dirty view of the store tilemap</h3>
      <div>
        {props.rowLength ? (
          props.tileMap.map((tile, ind) => {
            if ((ind + 1) % props.rowLength === 0) {
              return (
                <span key={ind} className={'tile tile' + tile}>
                  <span>
                    {props.shipInd === ind ? '❗️' : ' ' + tile + ' '}
                  </span>
                  <br />
                </span>
              );
            } else {
              return (
                <span key={ind} className={'tile tile' + tile}>
                  {props.shipInd === ind ? '❗️' : ' ' + tile + ' '}
                </span>
              );
            }
          })
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div>currentTileIdx: {props.currentTileIndex}</div> */}
    </Container>
  );
};

const mapStateToProps = state => ({
  tileMap: state.game.tileMap.present,
  rowLength: state.game.tileMapRowLength,
  shipInd: XYToInd(
    state.game.playerXY.present.x,
    state.game.playerXY.present.y,
    state.game.tileMapRowLength
  ),
  currentTileIndex: state.game.currentTileIdx.present
});

export default connect(mapStateToProps)(Ui);
