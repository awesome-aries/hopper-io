import React from 'react';

const Welcome = props => {
  return (
    <div className="welcome">
      {/* eventually put stuff here */}
      <div>
        <form>
          <label htmlFor="name">Player Name</label>
          <input name="name" />
        </form>
      </div>
      <div>
        <button type="submit">PLAY</button>
      </div>
    </div>
  );
};

export default Welcome;
