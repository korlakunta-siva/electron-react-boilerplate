import React, { Component, createRef } from "react";

import CigaHost from './cigahost';
import RGL, { WidthProvider } from "react-grid-layout";
import { Tabs, Tab } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
const { exec } = require('child_process');
import ApexDataGrid from '../../components/datagrid/ApexDataGrid';

const ReactGridLayout = WidthProvider(RGL);

class App extends Component {
  endpoint_exams =
    'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20 ';

  endpoint_patient_exams =
    "https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select oncis = (select min('Yes') from iimdb_rch00_repl..img_study sty2, iimdb_rch00_repl..img_study_location styl2 , iimdb_rch00_repl..img_store str2 where sty2.exam_id = exm.exam_id and sty2.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 2),  * from iimdb_rch00_repl..exam exm , iimdb_rch00_repl..DEPT_PROCEDURE pp  where exm.proc_id = pp.proc_id and patient_cmrn = ";

  endpoint_series =
    'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from iimdb_rch00_repl..img_study sty, iimdb_rch00_repl..img_series ser where sty.imgsty_id = ser.imgser_imgsty_id and sty.exam_id = ';

  endpoint_series_location =
    'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from iimdb_rch00_repl..img_series_location, iimdb_rch00_repl..img_store str, iimdb_rch00_repl..img_system imgsys where imgserl_imgstr_id = imgstr_id and imgstr_imgsys_id = imgsys_id and imgserl_imgser_id = ';

  endpoint_exceptions =
    "https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select  exc_src_system, exc_exr_code	,exc_time , exam_id ,		exc_src_queue_id,		exc_iparam1	,exc_iparam2	,exc_iparam3	,exc_iparam4	,exc_cparam1     ,   exc_cparam2  from iimdb_rch02_prod..EXCEPTION exc  where  exc.exc_exr_code in ('IMGE_SERL_A', 'IMGE_SERL_D', 'IMGE_SERL_P') and exam_id = ";

  endpoint_exam_cmoves =
    'https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%200%20select rd.REQDTL_EXAM_ID as exam_id, howlong = datediff(mi, rh.REQHDR_REQUESTED_AT_TIME, isnull(isnull(rd.REQDTL_COMPLETED_AT_TIME, dcmr.DCMR_LAST_ATTEMPT_TIME), getdate())) , rh.REQHDR_REQUESTED_AT_TIME  as requested_at ,  rd.REQDTL_COMPLETED_AT_TIME done_at , dcmr.DCMR_LAST_ATTEMPT_TIME last_attempt_at, rh.REQHDR_SOURCE as source, rd.REQDTL_PRIORITY as priority, rd.REQDTL_STATUS as status ,* from iimdb_rch02_prod..REQUEST_HEADER rh, iimdb_rch02_prod..REQUEST_DETAIL rd left join iimdb_rch02_prod..DICOM_CMOVE_REQUEST dcmr on dcmr.DCMR_REQUEST_DTL_ID = rd.REQDTL_ID where  rd.REQDTL_REQHDR_ID = rh.REQHDR_ID and rd.REQDTL_EXAM_ID =  ';

  endpoint_exam_cmoves_cols =
    'https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=set%20rowcount%200%20select rd.REQDTL_EXAM_ID as exam_id, howlong = datediff(mi, rh.REQHDR_REQUESTED_AT_TIME, isnull(isnull(rd.REQDTL_COMPLETED_AT_TIME, dcmr.DCMR_LAST_ATTEMPT_TIME), getdate())) , rh.REQHDR_REQUESTED_AT_TIME  as requested_at ,  rd.REQDTL_COMPLETED_AT_TIME done_at , dcmr.DCMR_LAST_ATTEMPT_TIME last_attempt_at, rh.REQHDR_SOURCE as source, rd.REQDTL_PRIORITY as priority, rd.REQDTL_STATUS as status ,* from iimdb_rch02_prod..REQUEST_HEADER rh, iimdb_rch02_prod..REQUEST_DETAIL rd left join iimdb_rch02_prod..DICOM_CMOVE_REQUEST dcmr on dcmr.DCMR_REQUEST_DTL_ID = rd.REQDTL_ID where  rd.REQDTL_REQHDR_ID = rh.REQHDR_ID and rd.REQDTL_EXAM_ID = 31897826 ';

  // 'cigadmr01',
  // 'iasq1mr1',
  // 'iasq1mr2',

  state = {
    filepath: '',
    iframeRef: createRef(),
    tablValue: 0,
    columns_loaded: false,
    cigahosts: [
      'iasp1ei1',
      'iasp1fo1',
      'iasp2ei1',
      'iasp2ha1',
      'iasp1ma1',
      'iasp1ma2',
      'iasp1mf1',
      'iasp1mf2',
      'cigadmr01',
      'iasq1mr1',
      'iasq1mr2',
      'iasq1ma1',
      'iasq1mf1',
    ],

    customsqltext:
      "select * from iimdb_rch00_repl..exam exm , iimdb_rch00_repl..IIMTB_PREDEFINED_PROC pp  where exm.pred_proc_id = pp.pred_proc_id and exam_status = 'CM' and performed_dt between  dateadd(hh, -1, getdate()) and getdate()  ",
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    document.title = 'CIGA Ops Tools';
    setTimeout(() => {
      this.setState({ columns_loaded: true });
    }, 2000);
  }

  onLayoutChange(layout) {
    //this.props.onLayoutChange(layout);
  }

  handleTabChange = (event, newValue) => {
    this.setState({ tablValue: newValue });
  };


onRowSelectExam = (event) => {
  console.log('AG Row selected', event);

  let selectedNodes = event.api
    .getSelectedNodes()
    .filter((node) => node.selected);
  console.log(selectedNodes);

  };

  onRowSelectView = (data) => {
    console.log('Transaction View:', data);
    console.log('TO DIsplay' + data.dirpath + '/' + data.fileName);

    let var1 = data.name.replace("CHECK CLEARED #","");
    let var1_path = `\\\\pcode-nas1\\skshare\\AcctDocs\\Banks\\Apex\\BBVA\\Checking5555\\CheckImages\\${var1}.pdf`;

    console.log('Starting to get file', var1_path);

    const frame_element = `../public/pdfjs/web/viewer.html?file=${check_path} `;

    this.setState({ filepath: frame_element });


    //this.handleLinqReportPdf(check_path);
  };

   a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  render() {
    return this.state.columns_loaded ? (


      <div
      className="col-12 py-3 overflow-auto"
      style={{ height: '90vh', backgroundColor: 'lightgrey' }}
    >
      <Tabs
        value={this.state.tablValue}
        onChange={this.handleTabChange}
        aria-label="simple tabs example"
      >
        <Tab label="Files" {...this.a11yProps(0)} />
        <Tab label="Claims" {...this.a11yProps(1)} />
        <Tab label="Tab3" {...this.a11yProps(2)} />
      </Tabs>
      <TabPanel
        value={this.state.tablValue}
        index={0}
        style={{ height: '90%', width: '100%' }}
      >

      <React.Fragment>
        <div className="container-fluid  " style={{ whiteSpace: 'nowrap' }}>
          <div
            className="form-group"
            style={{
              dislplay: 'inline-block',
              margin: '10px',
              float: 'left',
            }}
            width="200px"
          >
            <div
              className="row "
              style={{ dislplay: 'inline-block', margin: '10px' }}
            >
              {this.state.cigahosts.map((row, index) => (
                <CigaHost key={row} hostname={row} />
              ))}
            </div>
          </div>
        </div>
      </React.Fragment>
      </TabPanel>
      <TabPanel value={this.state.tablValue} index={1}>
<div>
<ReactGridLayout
        className="layout"
        onLayoutChange={this.onLayoutChange}
        rowHeight={30}
      >

<div key="1" data-grid={{ x: 0, y: 0, w: 8, h: 5, minH: 3, maxH: 12, static: true, isResizable: true }}>


                <ApexDataGrid
                key="linq"
                gridname={'transactions'}
                ref={this.tranGridElement}
                gridData={this.state.transactionsData}
                onRowSelected={this.onRowSelectExam}
                button2Label="View"
                onButton2Callback={this.onRowSelectView}
              />


        </div>


        <div key="2" data-grid={{ x: 9, y: 0, w: 4, h: 2 , isResizable: true}} style={{ height: '90%', width: '100%', margin: 0 }}>
                  <button id="myButton3" onClick={this.nextPDFPage}>
                    Previous Page{' '}
                  </button>
                  <button id="myButton4" onClick={this.nextPDFPage}>
                    Next Page{' '}
                  </button>
                  <iframe
                    width="100%"
                    height="600px"
                    backgroundcolor="lightgrey"
                    ref={this.state.iframeRef}
                    src={this.state.filepath}
                  />
                </div>
        </ReactGridLayout>

      </div >
      </TabPanel>
      <TabPanel value={this.state.tablValue} index={2}>
        Item Three
      </TabPanel>
    </div>



    ) : (
      <span>Loading ...</span>
    );
  }
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};


export default App;
