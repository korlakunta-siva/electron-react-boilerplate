import {
  AppBar,
  Container,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Toolbar,
  Fab,
} from '@material-ui/core';
import { Home, KeyboardArrowUp } from '@material-ui/icons';
import * as React from 'react';
import HideOnScroll from './HideOnScroll';
import SideDrawer from './SideDrawer';
import BackToTop from './BackToTop';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles({
  navbarDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`,
  },
  navListDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`,
  },
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `white`,
  },
});

const navLinks = [
  { title: `Documents`, path: `/` },
  { title: `receiver`, path: `/cigreceiver` },
];

const Header = (props) => {
  const classes = useStyles();

  return (
    <>
      <HideOnScroll>
        <AppBar position="fixed" style={{ height: '48px' }}>
          <Toolbar component="nav" style={{ height: '24px' }}>
            <Container
              maxWidth="md"
              className={classes.navbarDisplayFlex}
              style={{ height: '24px' }}
            >
              <IconButton
                edge="start"
                aria-label="home"
                style={{ height: '18px' }}
              >
                <a
                  style={{ color: `white` }}
                  onClick={() => {
                    props.history.push('/patientbrowser');
                  }}
                >
                  <Home fontSize="small" />
                </a>
              </IconButton>

              <Hidden smDown>
                <List
                  component="nav"
                  aria-labelledby="main navigation"
                  className={classes.navListDisplayFlex}
                  style={{ height: '24px' }}
                >
                  {navLinks.map(({ title, path }) => (
                    <a
                      key={title}
                      className={classes.linkText}
                      onClick={() => {
                        props.history.push(path);
                      }}
                    >
                      <ListItem button style={{ height: '18px' }}>
                        <ListItemText primary={title} />
                      </ListItem>
                    </a>
                  ))}
                </List>
              </Hidden>
              <Hidden mdUp>
                <SideDrawer navLinks={navLinks} />
              </Hidden>
            </Container>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar id="back-to-top-anchor" />

      <BackToTop>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </BackToTop>
    </>
  );
};

export default withRouter(Header);
