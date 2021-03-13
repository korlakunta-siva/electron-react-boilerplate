import React from 'react';

export const DATA_CURRENT_STATUS = 'db_current_status';
export const DATA_CIG_PROCESSORS = 'cig_processors';
export const DATA_RECENT_IOCM_JOBS = 'cig_iocm_kos';
export const DATA_EXAM_SERIES = 'exam_series';
export const DATA_SERIES_LOCATIONS = 'series_locations';
export const DATA_KO_REFLECTED = 'exam_show_ko_effect';
import { apiURL } from  '../../../../api/apiConfig'; 

export const loadGridData = (gridName, args, recvfn) => {
  console.log('Retrieve Data for :', gridName);
  let urlPrefix = 'https://iasq1mr2:8081/exsql?dbserver=';
  let dataURL = '';

  switch (gridName) {
    case DATA_CURRENT_STATUS:

        fetch(apiURL + '/api/current_status/', {})
        .then((response) => {
          if (response.status !== 200) {
            recvfn(gridName, args, {
              placeholder: 'Something went wrong in getting data',
            });
          } else {
            return response.json();
          }
        })
        .then((data) => {
          console.log("Current Status", data);
        //   let dframe = data['frame0'];
        //   //console.log(dframe);
        //   let myObj = JSON.parse(dframe);
        //   console.log(myObj);
        //   let gridData = myObj['rows'];
        //   console.log(
        //     'Sending data to receving fn from URL:',
        //     urlPrefix + dataURL,
        //     gridName,
        //     args
        //   );
          recvfn(gridName, args, data);
        });

        return;

          break;
    case DATA_CIG_RECEIVERS:
      dataURL =
        'iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from cigdb_rch00_prod..CIGTB_RECEIVER ';
      break;
    case DATA_CIG_PROCESSORS:
      dataURL =
        'iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from cigdb_rch00_prod..CIGTB_PROCESSOR ';
      break;
    case DATA_RECENT_IOCM_JOBS:
      dataURL = `iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20
         SELECT
    TOP 100
    JOB_QUEUE_ID,
    CAMPUS,
    EXAM_ID,
    PATIENT_EXTERNAL_ID,
    SENDER_AET,
    ser.SERIES_UID,
    JOB_QUEUE_START_TIME,
    STUDY_UID,
    JOB_STATUS,
    JOB_STATUS_TIME,
    RECEIVER_PORT,
    RECEIVER_AET,
    SENDER_HOST,
    SENDER_IP,
    JOB_PRIORITY,
    CAMPUS_DESC,
    DEPARTMENT_ID,
    PATIENT_INTERNAL_ID,
    PATIENT_LAST_NAME,
    PATIENT_FIRST_NAME,
    EXAM_DATE,
    STUDY_UID,
    STUDY_DESC SOPCLASS_UID,
    SERIES_MODALITY,
    TRANSFER_SYNTAX,
    PROCESSOR_HOST,
    PROCESSED_SERIES_COUNT,
    PROCESSED_JOB_COUNT,
    ACTIVE_ASSOCIATION_COUNT,
    JOB_QUEUE_END_TIME,
    UPDATE_TIME   ,  str.* , serl.*
      FROM qrddb_rch03_prod..CIGTB_JOB_QUEUE_LOG jql, iimdb_rch01_prod..IMG_SERIES ser, iimdb_rch01_prod..IMG_SERIES_LOCATION serl, iimdb_rch01_prod..IMG_STORE str  WHERE campus = 2 and jql.SOPCLASS_UID = '1.2.840.10008.5.1.4.1.1.88.59' and jql.SERIES_UID = ser.series_uid and ser.series_id = 11000 and ser.imgser_id = serl.imgserl_imgser_id and serl.imgserl_imgstr_id = str.imgstr_id and str.imgstr_imgsys_id = 2  ORDER BY jql.JOB_QUEUE_END_TIME DESC `;
      break;
    case DATA_EXAM_SERIES:
      console.log('ARGS: ', args);

      if (args.accession == '') return;

      dataURL = `iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20
          SELECT    exm.exam_id,  imgser_imgsty_id,
    series_id,
    imgser_status,
    iocm_flag,
    imgser_image_count,
    modality,
    series_uid,
    sopclass_uid,
    imgser_id,
    series_desc,
    ser.acq_start_time,
    ser.acq_finish_time,
    ser.acq_station_name,
    projection FROM     iimdb_rch01_prod..IMG_SERIES ser,
    iimdb_rch01_prod..IMG_STUDY sty,
    iimdb_rch01_prod..EXAM exm,
    iimdb_rch01_prod..EXAM_IDENTIFIER eid WHERE     eid.examid_value = '${args.accession}' AND
    eid.examid_type_code = 'ACCESSION_NBR' AND
    eid.exam_id = exm.exam_id AND
    exm.exam_id = sty.exam_id AND
    sty.imgsty_id = ser.imgser_imgsty_id  `;

      break;

    case DATA_SERIES_LOCATIONS:
      console.log('ARGS: ', args);
      // if (args == undefined || args.imgser_id == '') {
      //   args = this.state.dataSeriesLocationsArgs;
      if (args.imgser_id == '') {
        return;
      }

      dataURL = `iimsProd&sqltype=customSQL&sqltext=set%20rowcount%201000%20
        SELECT
    imgsys_name,
    imgserl_status,
    imgserl_image_count,
    last_action_time,
    imgserl_id,
    imgserl_imgser_id,
    series_size,
    series_file_name,
    imgserl_imgstr_id  FROM     iimdb_rch01_prod..IMG_SERIES_LOCATION serl,
    iimdb_rch01_prod..IMG_STORE str,
    iimdb_rch01_prod..IMG_SYSTEM imgsys WHERE     imgserl_imgser_id =  ${args.imgser_id}  AND      serl.imgserl_imgstr_id = str.imgstr_id AND     str.imgstr_imgsys_id = imgsys.imgsys_id
     `;

      break;
    default:
  }

  console.log('Getting data  (Calling) from URL:', urlPrefix + dataURL);

  fetch(urlPrefix + dataURL, {})
    .then((response) => {
      if (response.status !== 200) {
        recvfn(gridName, args, {
          placeholder: 'Something went wrong in getting data',
        });
      } else {
        return response.json();
      }
    })
    .then((data) => {
      console.log(data);
      let dframe = data['frame0'];
      //console.log(dframe);
      let myObj = JSON.parse(dframe);
      console.log(myObj);
      let gridData = myObj['rows'];
      console.log(
        'Sending data to receving fn from URL:',
        urlPrefix + dataURL,
        gridName,
        args
      );
      recvfn(gridName, args, gridData);
    });
};
