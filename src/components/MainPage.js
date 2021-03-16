import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import PatientBrowser from '../components/patientbrowse/AppPatient';
import LogBrowser from '../components/LogBrowser/App';
import CigPurge from '../components/patientbrowse/AppPatient';
import CountsMatch from '../components/countmatch/ImageCountCompareStatus';
import PatientBrowse from '../components/patientbrowse/AppPatient';
import CigaOpsTest from '../components/cigaops/AppCigaLoadTest';
import CigaOps from '../components/cigaops/AppCigaOps';
import PineStatus from '../components/statuspages/PINEStatus';
import CIGProcessor from '../components/statuspages/CIGProcessors';
import CIGReceiver from '../components/statuspages/CIGReceivers';
import IMSUDashboard from '../components/imsudashboard/App';

const { ipcRenderer } = window.require('electron')
const { exec } = require('child_process')

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'lightgrey',
    display: 'flex',
    height: '100vh',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function MainPage() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="Browse" {...a11yProps(0)} />
        <Tab label="CIGA Send" {...a11yProps(1)} />
        <Tab label="CIGA Queue" {...a11yProps(2)} />
        <Tab label="LogsView" {...a11yProps(3)} />
        <Tab label="CIGA-Prod" {...a11yProps(4)} />
        <Tab label="CIGA-Test" {...a11yProps(5)} />
        <Tab label="Processors" {...a11yProps(6)} />
        <Tab label="Receivers" {...a11yProps(7)} />
        <Tab label="PINE Queue" {...a11yProps(8)} />                        
        <Tab label="Dashboard" {...a11yProps(9)} />

      </Tabs>
      <TabPanel value={value} index={0}>
     <PatientBrowser/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
       <LogBrowser />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <CigaOps />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <CigaOpsTest />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <CIGProcessor />
      </TabPanel>
      <TabPanel value={value} index={7}>
       <CIGReceiver />
      </TabPanel>
      <TabPanel value={value} index={8}>
        <PineStatus />
      </TabPanel>    
      <TabPanel value={value} index={9}>
       <IMSUDashboard />
      </TabPanel>               
    </div>
  );
}
