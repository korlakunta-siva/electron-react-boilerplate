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
    document.title = 'CIGA Processors';
    this.onRefreshPINEStatus();

    setTimeout(() => {
      this.setState({ columns_loaded: true });
    }, 2000);
  }

  onRefreshPINEStatus = () => {
    //console.log("rowselected exam:", data[0].row);
    let PINE_status_query = `
    set nocount on

    declare @pend_pine_count  int, @last_read int, @pine_queue_id int, @pine_queue_old_time datetime

    declare @pend_pine_count1  int, @last_read1 int, @timenow datetime
     select @timenow = getdate()

        select @last_read1 = QUEUEEV_LAST_READ from iimdb_rch02_prod..QUEUEEV_REF
        where QUEUEEV_QNAME = 'IMEvents' and  QUEUEEV_EVENT = 'PINE'

        set rowcount 1
        select @pine_queue_id = oq.OB_MSG_INT1
        from    iimdb_rch02_prod..outbound_queue oq
        where oq.OB_MSG_EVENT_TYPE = 'PINE'
        and oq.OB_MSG_ID >= @last_read1
        order by ob_msg_id

        select @pine_queue_old_time = image_queue_creation_dt from
         iimdb_rch02_prod..q_image_notification notq
        where image_queue_id = @pine_queue_id


        select  @pend_pine_count1 = count(*)
          from 	iimdb_rch01_prod..OUTBOUND_EVENTS (index OUTBOUND_EVENTS_prm)
        where  OE_MSG_EVENT_TYPE = 'PINE'  and  OE_MSG_ID > @last_read1

                    select 'result_type' = 'WATING', 'pending_count' = @pend_pine_count1, 'oldest_nq_id' =  @pine_queue_id, 'oldest_oe_id' = @last_read1

                    select 'result_type' = 'OLDEST EVENT', 'oldest_oe_id'   = oe_msg_id,  'oldest_oe_time' = oe_msg_timestamp, 'oe_pend_mins' = datediff(mi, oe_msg_timestamp, @timenow)  from iimdb_rch01_prod..OUTBOUND_EVENTS (index OUTBOUND_EVENTS_prm)
         where  OE_MSG_EVENT_TYPE = 'PINE'  and  OE_MSG_ID = @last_read1

            select notq.system_name, image_action_code, total_events = count(*)  from iimdb_rch02_prod..q_image_notification notq
        where image_queue_id > @pine_queue_id
        group by notq.system_name, image_action_code


          set rowcount 0
            select notq.system_name, image_action_code, dist_exams = count(distinct notq.exam_id)  from iimdb_rch02_prod..q_image_notification notq
        where image_queue_id > @pine_queue_id
        group by notq.system_name, image_action_code

                select notq.system_name, image_action_code, dist_series = count(distinct notq.series_uid)  from iimdb_rch02_prod..q_image_notification notq
        where image_queue_id > @pine_queue_id
        group by notq.system_name, image_action_code


        set rowcount 0

        select 'OLDEST NOTIFICATION' , 'oldest_nq_id' = image_queue_id, 'oldest_nq_time' = image_queue_creation_dt , 'nq_pend_mins' = datediff(mi, image_queue_creation_dt, @timenow)  from iimdb_rch02_prod..q_image_notification notq where image_queue_id = @pine_queue_id

                select 'nq_time_min' = convert(varchar(5), image_queue_creation_dt, 108),

                notq.system_name, image_action_code , total_events = count(*)  from iimdb_rch02_prod..q_image_notification notq
        where image_queue_id > @pine_queue_id
        group by
        convert(varchar(5), image_queue_creation_dt, 108),
        notq.system_name, image_action_code
        order by 1 desc




    `;

    let CIGA_Processor_query = `

    SELECT 'Non-Prefetch' as P123_data_type, 'Waiting to Process' as processing_status,
    count(*) as jobcount ,
    jq.campus, jq.job_status,
     jq.JOB_PRIORITY,
    datediff(mi,min(jq.JOB_QUEUE_START_TIME),getdate())  as wt_minutes_min,
    datediff(mi,max(jq.JOB_QUEUE_START_TIME),getdate()) as wt_minutes_max,
    min(jq.JOB_QUEUE_START_TIME) as oldest_job,
    max(jq.JOB_QUEUE_START_TIME) as recent_job
    FROM qrddb_rch00_prod..CIGTB_JOB_QUEUE jq,  qrddb_rch00_prod..CIGTB_JOB_QUEUE_DETAIL jqd
    where jq.JOB_QUEUE_ID = jqd.JOB_QUEUE_ID
    and jq.JOB_STATUS = 0 and jq.JOB_PRIORITY != 4
    group by jq.JOB_PRIORITY, jq.campus, jq.job_status
    order by jq.JOB_PRIORITY, jq.campus, jq.job_status

    SELECT   'Non-Prefetch' as P123_data, 'Processing / Errored' as processing_status,
    count(*) as jobcount ,
     jq.campus, jq.job_status,
     jq.JOB_PRIORITY,
    datediff(mi,min(jq.JOB_STATUS_TIME),getdate())  as wt_minutes_min,
    datediff(mi,max(jq.JOB_STATUS_TIME),getdate()) as wt_minutes_max,

    min(jq.JOB_STATUS_TIME) as oldest_job,
    max(jq.JOB_STATUS_TIME) as recent_job
     FROM qrddb_rch00_prod..CIGTB_JOB_QUEUE jq,  qrddb_rch00_prod..CIGTB_JOB_QUEUE_DETAIL jqd
    where jq.JOB_QUEUE_ID = jqd.JOB_QUEUE_ID
    and jq.JOB_STATUS = 1 and jq.JOB_PRIORITY != 4
    group by jq.JOB_PRIORITY, jq.campus, jq.job_status
    order by jq.JOB_PRIORITY, jq.campus, jq.job_status

    SELECT   'Non-Prefetch' as P123_data, 'Errored' as processing_status,
    count(*) as jobcount ,
     jq.campus, jq.job_status,
     jq.JOB_PRIORITY,
    datediff(mi,min(jq.JOB_STATUS_TIME),getdate())  as wt_minutes_min,
    datediff(mi,max(jq.JOB_STATUS_TIME),getdate()) as wt_minutes_max,

    min(jq.JOB_STATUS_TIME) as oldest_job,
    max(jq.JOB_STATUS_TIME) as recent_job
     FROM qrddb_rch00_prod..CIGTB_JOB_QUEUE jq,  qrddb_rch00_prod..CIGTB_JOB_QUEUE_DETAIL jqd
    where jq.JOB_QUEUE_ID = jqd.JOB_QUEUE_ID
    and jq.JOB_STATUS > 1 and jq.JOB_PRIORITY != 4
    group by jq.JOB_PRIORITY, jq.campus, jq.job_status
    order by jq.JOB_PRIORITY, jq.campus, jq.job_status

    SELECT  'Prefetch' as P4_data,  'Waiting to Process' as processing_status,
    count(*) as jobcount ,
     jq.campus, jq.job_status,
      jq.JOB_PRIORITY,
    datediff(mi,min(jq.JOB_QUEUE_START_TIME),getdate())  as wt_minutes_min,
    datediff(mi,max(jq.JOB_QUEUE_START_TIME),getdate()) as wt_minutes_max,
    min(jq.JOB_QUEUE_START_TIME) as oldest_job,
    max(jq.JOB_QUEUE_START_TIME) as recent_job

    FROM qrddb_rch00_prod..CIGTB_JOB_QUEUE jq,  qrddb_rch00_prod..CIGTB_JOB_QUEUE_DETAIL jqd
    where jq.JOB_QUEUE_ID = jqd.JOB_QUEUE_ID
    and  jq.JOB_STATUS = 0 and jq.JOB_PRIORITY = 4
    group by jq.JOB_PRIORITY, jq.campus, jq.job_status
    order by jq.JOB_PRIORITY, jq.campus, jq.job_status

    SELECT  'Prefetch' as P4_data, 'Processing / Erroed' as processing_status,
    count(*) as jobcount ,
     jq.campus, jq.job_status,
     jq.JOB_PRIORITY,
    datediff(mi,min(jq.JOB_STATUS_TIME),getdate())  as wt_minutes_min,
    datediff(mi,max(jq.JOB_STATUS_TIME),getdate()) as wt_minutes_max,
    min(jq.JOB_STATUS_TIME) as oldest_job,
    max(jq.JOB_STATUS_TIME) as recent_job

     FROM qrddb_rch00_prod..CIGTB_JOB_QUEUE jq,  qrddb_rch00_prod..CIGTB_JOB_QUEUE_DETAIL jqd
    where jq.JOB_QUEUE_ID = jqd.JOB_QUEUE_ID
    and  jq.JOB_STATUS = 1 and jq.JOB_PRIORITY = 4
    group by jq.JOB_PRIORITY, jq.campus, jq.job_status
    order by jq.JOB_PRIORITY, jq.campus, jq.job_status

    SELECT  'Prefetch' as P4_data, 'Erroed' as processing_status,
    count(*) as jobcount ,
     jq.campus, jq.job_status,
     jq.JOB_PRIORITY,
    datediff(mi,min(jq.JOB_STATUS_TIME),getdate())  as wt_minutes_min,
    datediff(mi,max(jq.JOB_STATUS_TIME),getdate()) as wt_minutes_max,
    min(jq.JOB_STATUS_TIME) as oldest_job,
    max(jq.JOB_STATUS_TIME) as recent_job

     FROM qrddb_rch00_prod..CIGTB_JOB_QUEUE jq,  qrddb_rch00_prod..CIGTB_JOB_QUEUE_DETAIL jqd
    where jq.JOB_QUEUE_ID = jqd.JOB_QUEUE_ID
    and  jq.JOB_STATUS > 1 and jq.JOB_PRIORITY = 4
    group by jq.JOB_PRIORITY, jq.campus, jq.job_status
    order by jq.JOB_PRIORITY, jq.campus, jq.job_status

    `;

    fetch(
      this.endpoint_sql_prefix.replace('iimsRepl', 'iimsProd') +
        CIGA_Processor_query,
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
          <label>MultiResults</label>
          <DataMultiGrid
            ref={this.customMultiGridElement}
            datagrids={this.state.multi_grid_data}
            gridheight={200}
            gridname={'custom sql grid'}
            onRowSelect={this.onRowSelectEvent}
          />{' '}
          >/
        </div>
      </React.Fragment>
    ) : (
      <span>Loading ...</span>
    );
  }
}

export default App;
