import React from 'react';
import Container from '@material-ui/core/Container';
import {connect} from 'react-redux';
import {XYToInd} from '../util/tileMapConversions';

class Ui extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <Container id="ui">
        <h3>Testing Info</h3>
        <p>
          regular: 4, border: 6, harbor: 5, empty: -1, path: 7, opponentHarbor:
          [3, 1], opponentPath: [2, 0]
        </p>
        <p>
          click tile to set harbor, shift + click to floodfill, arrow keys to
          move ship, hit space to stop/restart moving
        </p>
        <div>{this.props.children}</div>
        <h3>Quick n Dirty view of the store tilemap</h3>
        <div>
          {this.props.rowLength ? (
            this.props.tileMap.map((tile, ind) => {
              if ((ind + 1) % this.props.rowLength === 0) {
                return (
                  <span key={ind} className={'tile' + tile}>
                    <span>
                      {this.props.shipInd === ind ? '❗️' : ' ' + tile + ' '}
                    </span>
                    <br />
                  </span>
                );
              } else {
                return (
                  <span key={ind} className={'tile' + tile}>
                    {this.props.shipInd === ind ? '❗️' : ' ' + tile + ' '}
                  </span>
                );
              }
            })
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div>currentTileIdx: {this.props.currentTileIndex}</div>
      </Container>
    );
  }
}

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
