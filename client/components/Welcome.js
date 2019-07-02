import React from 'react';

const Welcome = props => {
  return (
    <div className="welcome">
      {/* eventually put stuff here */}
      <form>
        <label htmlFor="name">Player Name</label>
        <input name="name" />
      </form>
    </div>
  );
};

export default Welcome;
