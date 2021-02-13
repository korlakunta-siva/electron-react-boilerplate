iport React from 'react';
import { withRouter } from 'react-router';

export const Home = () => {
  return (
    <div>
      <Navbar />
    </div>
  );
};

export default withRouter(Home);
