import React from 'react';
const { exec } = require('child_process');

export const DATA_PATIENT_EXAM_CMRN = 'patbrowse_patient_exams';
export const DATA_CIG_RECEIVERS = 'cig_receivers';
export const DATA_CIG_PROCESSORS = 'cig_processors';
export const DATA_RECENT_IOCM_JOBS = 'cig_iocm_kos';
export const DATA_EXAM_SERIES = 'exam_series';
export const DATA_EXAM_STUDIES = 'exam_studies';

export const DATA_SERIES_LOCATIONS = 'series_locations';
export const DATA_EXAM_SERIES_KO_REFLECTED = 'exam_show_ko_effect';

export const loadGridData = (gridName, args, recvfn) => {
  console.log('Retrieve Data for :', gridName, args);
  let urlPrefix = 'https://iasq1mr2:8081/exsql?dbserver=';
  let dataURL = '';

  switch (gridName) {
    case DATA_PATIENT_EXAM_ACCN:
      dataURL = `${args.DbEnv.iimsRepl}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select
     oncis = (select min('Yes') from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_study sty2, iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_study_location styl2 , iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_store str2 where sty2.exam_id = exm.exam_id and sty2.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 2),
     onMIDIA = (select min('Yes') from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_study sty2, iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_study_location styl2 , iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_store str2 where sty2.exam_id = exm.exam_id and sty2.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 1),
     patient_cmrn, exam_id ,
     (select examid_value from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..EXAM_IDENTIFIER eid where eid.examid_type_code = 'ACCESSION_NBR' and eid.exam_id = exm.exam_id) as 'iims_accn',
     (select examid_value from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..EXAM_IDENTIFIER eid where eid.examid_type_code = 'EPIC_ACCESSION_NBR' and eid.exam_id = exm.exam_id) as 'epic_accn',
     clinical_viewer_desc, exam_status, performed_dt , report_status, modality_code, exm.dept_id,
     scheduled_for_dt, owner_system,	patient_id,	exam_availability, exam_priority_code,	left_right_flag,	emr_flag,	archive_ind,	sensitive_flag	,pred_proc_id,	exm.proc_id
     ,	proc_code,	proc_desc
     from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..exam exm , iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..DEPT_PROCEDURE pp  where exm.proc_id = pp.proc_id and
     exam_id in (select exam_id from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..EXAM_IDENTIFIER eid where eid.examid_type_code = 'ACCESSION_NBR' and eid.examid_value =
      '${args.accession}' ) order by performed_dt desc `;
      break;

    case DATA_EXAM_STUDIES:
      dataURL = `${args.DbEnv.iimsRepl}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select
      oncis = (select min('Yes') from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_study_location styl2 , iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_store str2 where  sty.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 2),
      onMIDIA = (select min('Yes') from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_study_location styl2 , iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_store str2 where  sty.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 1),
      * from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_study sty where  sty.exam_id = ${args.examid}  ; `;

      break;
    case DATA_EXAM_SERIES:
      dataURL = `${args.DbEnv.iimsRepl}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select
      oncis = (select min('Yes') from  iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_series_location serl2 , iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_store str2 where ser.imgser_id = serl2.imgserl_imgser_id and serl2.imgserl_status = 'A' and serl2.imgserl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 2),
      onMIDIA = (select min('Yes') from  iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_series_location serl2 , iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_store str2 where ser.imgser_id = serl2.imgserl_imgser_id and serl2.imgserl_status = 'A' and serl2.imgserl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 1),
        modality as 'SerModality', *   from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_study sty, iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_series ser where sty.imgsty_id = ser.imgser_imgsty_id and sty.exam_id = ${args.examid}   `;

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

    case DATA_EXAM_SERIES_KO_REFLECTED:
      cli_parse_ko_folder(gridName, args, recvfn);
      return;

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

export const cli_parse_ko_folder = (gridName, args, retfunc) => {
  let dataURL = '';
  let accession = args.accession;
  let DbEnv = args.DbEnv;
  console.log(accession, DbEnv);
  dataURL = `${DbEnv.iimsOltp}&sqltype=customSQL&sqltext=declare @accn varchar(20) select @accn = '${accession}'  select serl.imgserl_id, ser.imgser_status, ser.imgser_image_count, serl.imgserl_status, ser.modality, str.store_name, serl.series_file_name, serl.last_action_time,  exm.patient_cmrn, sty.acq_start_time, ser.sopclass_uid, ser.series_uid, sty.study_uid  FROM iimdb_rch${DbEnv.iimsReplDBNum}${DbEnv.iimsOltpExt}..EXAM exm, iimdb_rch${DbEnv.iimsReplDBNum}${DbEnv.iimsOltpExt}..EXAM_IDENTIFIER eid , iimdb_rch${args.DbEnv.iimsReplDBNum}${DbEnv.iimsOltpExt}..IMG_STUDY sty,   iimdb_rch${DbEnv.iimsReplDBNum}${DbEnv.iimsOltpExt}..IMG_SERIES ser, iimdb_rch${DbEnv.iimsReplDBNum}${DbEnv.iimsOltpExt}..IMG_SERIES_LOCATION serl, iimdb_rch${DbEnv.iimsReplDBNum}${DbEnv.iimsOltpExt}..IMG_STORE str   WHERE exm.exam_id = sty.exam_id and sty.imgsty_id = ser.imgser_imgsty_id   and ser.imgser_id = serl.imgserl_imgser_id and serl.imgserl_imgstr_id = str.imgstr_id and str.imgstr_imgsys_id = 2 and  sty.exam_id = eid.exam_id and eid.examid_type_code = 'ACCESSION_NBR' and eid.examid_value = @accn `;

  console.log('JS to run parse KO: ', dataURL);
  let mesg = '';
  console.log(
    '"api/venv/Scripts/python"  api/dicom.py -cmd cisparse -sql "' +
      dataURL +
      '"'
  );
  try {
    exec(
      '"api/venv/Scripts/python"  api/dicom.py -cmd cisparse -sql "' +
        dataURL +
        '"',
      { maxBuffer: 1024 * 50000 },
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        let modified_data = stdout.replaceAll("'", '"');
        let myObject = JSON.parse(modified_data);
        retfunc(gridName, args, myObject);
      }
    );
  } catch (error) {
    console.log(error);
  }
};
