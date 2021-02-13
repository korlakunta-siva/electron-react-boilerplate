import React from 'react';
import { Container, Icon, Image, Menu } from 'semantic-ui-react';

const Navbar = (props) => {
  console.log('HX', props.history);

  return (
    <div>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item as="a" header href="/home"></Menu.Item>
          <span>
            <input
              id="logbrowse-button"
              type="button"
              onClick={() => {
                props.history.push('/logbrowser');
              }}
            />
            LOG BROWSER
          </span>

          <span>
            <input
              id="patientbrowse-button"
              type="button"
              onClick={() => {
                props.history.push('/patientbrowser');
              }}
            />
            PATIENT BROWSER
          </span>

          <Menu.Item id="countsmatch-button" as="a" href="/countsmatch">
            Counts Matching
          </Menu.Item>
          <Menu.Item id="cigops-button" as="a" href="/cigaops">
            CIG Ops
          </Menu.Item>
          <Menu.Item id="logbrowse-button" as="a" href="/logbrowser">
            Log Br
          </Menu.Item>
          <Menu.Item id="cigops-button" as="a" href="/cigaopstest">
            CIG Ops Test
          </Menu.Item>
          <Menu.Item id="pinestatus-button" as="a" href="/pinestatus">
            PINE Status
          </Menu.Item>
          <Menu.Item id="patientbrowse-button" as="a" href="/patientbrowser">
            Patient CIS Browser
          </Menu.Item>
          <Menu.Item id="cigprocessor-button" as="a" href="/cigprocessor">
            CIG Processors
          </Menu.Item>
          <Menu.Item id="cigprocessor-button" as="a" href="/cigreceiver">
            CIG Receivers
          </Menu.Item>

          <Menu.Item
            id="dashboard-button"
            target="_blank"
            as="a"
            href="/dashboard"
          >
            Kibana Dashboard
          </Menu.Item>
        </Container>
      </Menu>
    </div>
  );
};
export default Navbar;
