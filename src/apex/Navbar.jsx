import { useOktaAuth } from '@okta/okta-react';
import React from 'react';
import { Container, Icon, Image, Menu } from 'semantic-ui-react';

const Navbar = () => {
  const { authState, authService } = useOktaAuth();

  const login = async () => authService.login('/');
  const logout = async () => authService.logout('/');

  return (
    <div>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item as="a" header href="/">
            <Image size="mini" src="/apex-logo_png.png" />
          </Menu.Item>
          {authState.isAuthenticated && (
          <Menu.Item id="messages-button" as="a" href="/messages">
            <Icon name="mail outline" />
            Messages
          </Menu.Item>
          )}
          {authState.isAuthenticated && <Menu.Item id="profile-button" as="a" href="/profile">Profile</Menu.Item>}
          { <Menu.Item id="docu-button" as="a" href="/docubrowser">Documents</Menu.Item>}
          {authState.isAuthenticated && <Menu.Item id="monitor-button" as="a" href="/monitoring">Monitoring</Menu.Item>}
          {authState.isAuthenticated && <Menu.Item id="prognotes-button" as="a" href="/prognotes">ProgNotes</Menu.Item>}
          {authState.isAuthenticated && <Menu.Item id="claims-button" as="a" href="/claims">Claims</Menu.Item>}
          {authState.isAuthenticated && <Menu.Item id="logout-button" as="a" onClick={logout}>Logout</Menu.Item>}
          {!authState.isPending && !authState.isAuthenticated && <Menu.Item as="a" onClick={login}>Login</Menu.Item>}
        </Container>
      </Menu>
    </div>
  );
};
export default Navbar;
