import React, { Component } from 'react';
import DataMultiGrid from '../common/DataMultiGrid';

class App extends Component {
  endpoint_sql_prefix =
    'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20 ';

  state = {
    columns_loaded: false,
    multi_grid_data: [],

    customsqltext:
      "select * from iimdb_rch00_repl..exam exm , iimdb_rch00_repl..IIMTB_PREDEFINED_PROC pp  where exm.pred_proc_id = pp.pred_proc_id and exam_status = 'CM' and performed_dt between  dateadd(hh, -1, getdate()) and getdate()  ",
  };

  constructor(props) {
    super(props);
    this.customMultiGridElement = React.createRef();
  }

  componentWillMount() {
    document.title = 'CIGA Receivers';
    this.onRefreshPINEStatus();

    setTimeout(() => {
      this.setState({ columns_loaded: true });
    }, 2000);
  }

  onRefreshPINEStatus = () => {
    //console.log("rowselected exam:", data[0].row);

    let CIGA_Receivers_query = `

        select 'MIDIA_Sending_To' as dataset_type, DCMR_DEST_AETITLE , count(*) as assoc_count from iimdb_rch02_prod..DCMR_IN_PROCESS dip
    group by dip.DCMR_DEST_AETITLE
    order by 2

    select 'CIGA_Receiving_From' as dataset_type, sender_aet, inbs.RECEIVER_AET,  count(*) as assoc_count from qrddb_rch00_prod..CIGTB_INBOUND_SERIES inbs
    where inbs.ASSOCIATION_CLOSE_TIME is null
    group by sender_aet, inbs.RECEIVER_AET
    order by 2, 3

    select 'MIDIA_Sending_To' as dataset_type, dip.DCMR_DEST_AETITLE,

    count(*) as assoc_count, avg(datediff(ss, dcmr_start_time, getdate())) as 'avg_thread_active_sec',
    min(datediff(mi, dcmr_start_time, getdate())) as 'min_thread_active_min', max(datediff(mi, dcmr_start_time, getdate())) as 'max_thread_active_min',
    sum(case when datediff(mi,dip.DCMR_START_TIME, getdate()) > 5 then 1 else 0 end) as 'assoc_count_over_5min'
    from iimdb_rch02_prod..DCMR_IN_PROCESS dip
    group by dip.DCMR_DEST_AETITLE

      select 'MIDIA_Sending_To_assocerror' as dataset_type, dip.DCMR_DEST_AETITLE,

    count(*) as assoc_count, avg(datediff(ss, dcmr_start_time, getdate())) as 'avg_thread_active_sec',
    min(datediff(mi, dcmr_start_time, getdate())) as 'min_thread_active_min', max(datediff(mi, dcmr_start_time, getdate())) as 'max_thread_active_min',
    sum(case when datediff(mi,dip.DCMR_START_TIME, getdate()) > 5 then 1 else 0 end) as 'assoc_count_over_5min'
    from iimdb_rch02_prod..DCMR_IN_PROCESS dip, iimdb_rch02_prod..DICOM_CMOVE_REQUEST dcmr
    where dip.DCMR_ID = dcmr.DCMR_ID
    and dcmr.DCMR_ERROR_CODE is not null
    group by dip.DCMR_DEST_AETITLE


    select 'CIGA_Receiving_From' as dataset_type, sender_aet, count(*) as assoc_count from qrddb_rch00_prod..CIGTB_INBOUND_SERIES
    group by sender_aet

    select 'CIGA_Receiving_From' as dataset_type, campus, sender_aet, count(*) as assoc_count from qrddb_rch00_prod..CIGTB_INBOUND_SERIES
    group by campus, sender_aet

    declare @last_dcmr_id int
    select @last_dcmr_id = min(r.QUEUEEV_LAST_READ)         from iimdb_rch02_prod..QUEUEEV_REF_DCMR r

    select * from iimdb_rch02_prod..DICOM_CMOVE_REQUEST A
                  where  A.DCMR_ID > @last_dcmr_id and dcmr_vip_status not in (2,3) and dcmr_error_code = '1a0012'

    `;

    console.log(
      this.endpoint_sql_prefix.replace('iimsRepl', 'iimsProd') +
        CIGA_Receivers_query
    );
    fetch(
      this.endpoint_sql_prefix.replace('iimsRepl', 'iimsProd') +
        CIGA_Receivers_query,
      {}
    )
      .then((response) => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: 'Something went wrong in getting data',
          });
        }
        console.log('MULTI GRID DATA', response);
        return response.json();
      })
      .then((data) => {
        console.log('multi-grid-data', data.length, data);
        let received_frames = Object.keys(data);
        console.log('Frames Received', received_frames);
        let received_data_frames = [];
        for (var frame in received_frames) {
          let myObj = JSON.parse(data[received_frames[frame]]);
          let datarows = myObj['rows'];
          received_data_frames.push(datarows);
        }

        console.log(received_data_frames);

        this.setState(
          {
            multi_grid_data: received_data_frames,
            loaded: true,
          },
          () => {
            //console.log("Changed state", this.state.series.length);
            if (this.customMultiGridElement.current) {
              this.customMultiGridElement.current.changeGridData(
                this.state.multi_grid_data
              );
            }
          }
        );
      });
  };

  onRowSelectEvent = (data) => {
    console.log('rowselected SeriesCigaJob:', data);
  };

  render() {
    return this.state.columns_loaded ? (
      <React.Fragment>
        <div
          className="container-fluid "
          style={{ width: '90%', paddingTop: '65px' }}
        >
          <label>Multiple Result Sets - Receiver Status </label>
          <DataMultiGrid
            ref={this.customMultiGridElement}
            datagrids={this.state.multi_grid_data}
            gridheight={200}
            gridname={'custom sql grid'}
            onRowSelect={this.onRowSelectEvent}
          />{' '}
        </div>
      </React.Fragment>
    ) : (
      <span>Loading ...</span>
    );
  }
}

export default App;
