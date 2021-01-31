import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Menu from '@material-ui/core/Menu';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';


const useStyles = makeStyles({
  root: {
    maxWidth: 150,
    border: '1px',
    'border-color' : 'red'
  },
});


const onShowTransactionsClick = id => {
    this.props.getTransactions(id, "view");
  };

  
const  onGetPlaidTransactionsClick = id => {
    this.props.getTransactions(id, "refresh");
  };

const  onGetAllPlaidTransactionsClick = id => {
    this.props.getTransactions(id, "gethx");
  };

const  onUpdateAccountsClick = id => {
    this.props.getTransactions(id, "ua");
  };

const  onUpdateTokenClick = id => {
    axios
    .post("get_update_link_token", {'id': id})
    .then(res => {
      let linkToken_forupdate = res.data.link_token;
      this.setState({updateAccessToken : linkToken_forupdate});
    })
    .catch(err =>
      console.log(err)
    );
};

export default function ImgMediaCard(props) {
  const classes = useStyles();
  const institutionName = props.account.institutionName;
  const account = props.account
  const account_id = props.account.itemId;

  return (
    <Card className={classes.root} style={{  borderColor: 'red', border: '5px', backgroundColor: 'lightgreen', marginTop: '5px'}}>

          <Typography  >
          {institutionName}
          </Typography>
  
      <CardActions>
    
      <Button onClick={() => props.onView(account_id)} size="small" color="primary">
          View
        </Button>

        
        <CustomizedMenus key = {account_id} account = {account}  account_id = {account_id}
      onUpdateAccounts = {props.onUpdateAccounts}
      onRetrieve100 = {props.onRetrieve100}
      onRetrieveAll = {props.onRetrieveAll}
      onUpdateToken = {props.onUpdateToken}
      />        

        {/* <MenuListComposition key = {account_id} account = {account}  account_id = {account_id}
      onUpdateAccounts = {props.onUpdateAccounts}
      onRetrieve100 = {props.onRetrieve100}
      onRetrieveAll = {props.onRetrieveAll}
      onUpdateToken = {props.onUpdateToken}
      /> */}

        {/* <Button onClick={() => props.onRetrieveAll(account_id)} size="small" color="primary">
          R-All
        </Button> 
                <Button onClick={() => props.onUpdateAccounts(account_id)} size="small" color="primary">
          uA
        </Button>
        <Button onClick={() => props.onView(account_id)} size="small" color="primary">
          V
        </Button>
        <Button onClick={() => props.onRetrieve100(account_id)} size="small" color="primary">
          R100
        </Button>  
        <Button onClick={() => props.onUpdateToken(account_id)} size="small" color="primary">
          uT
        </Button>   */}
      </CardActions>
    </Card>
  );

}


const useMenuStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

const MenuListComposition = (props) => {
  const classes = useMenuStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  //console.log("Menu Props:", props);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    console.log("Menu Props:", props);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className={classes.root}>
      <div>
        <Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          Action
        </Button>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown} style={{  'z-index' : 15, opacity: 1.0,
    'background-color': 'lightblue' }}>
                    <MenuItem onClick={() => {
                      console.log("Calling OnRetrieve100 : " + props.account_id);
                      props.onRetrieve100(props.account_id)
                    }}>R-100</MenuItem>                    
                    <MenuItem onClick={() =>props.onUpdateAccounts(props.account_id)}>Upd Acc</MenuItem>
                    <MenuItem onClick={() => props.onRetrieveAll(props.account_id)}>R-All</MenuItem>
                    <MenuItem onClick={() =>props.onUpdateToken(props.account_id)}>Upd Tkn</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}


const CustomizedMenus = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        Action
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={() => {
          console.log("Calling OnRetrieve100 : " + props.account_id);
          props.onRetrieve100(props.account_id)
        }}>
          <ListItemIcon>
            <DraftsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Get-100" />
        </StyledMenuItem>          
        <StyledMenuItem
        onClick={() =>props.onUpdateAccounts(props.account_id)}>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Update Accounts" />
        </StyledMenuItem>
        <StyledMenuItem onClick={() => props.onRetrieveAll(props.account_id)}>
          <ListItemIcon>
            <InboxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Get-Hx" />
        </StyledMenuItem>
        <StyledMenuItem onClick={() =>props.onUpdateToken(props.account_id)}>
          <ListItemIcon>
            <InboxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Update Token" />
        </StyledMenuItem>        
      </StyledMenu>
    </div>
  );
}

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

