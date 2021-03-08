import React from 'react';
const { exec } = require('child_process');

export const DATA_CIG_RECEIVERS = 'cig_receivers';
export const DATA_CIG_PROCESSORS = 'cig_processors';

export const DATA_RECENT_IOCM_JOBS = 'cig_iocm_kos';

export const DATA_PATIENT_EXAMS = 'patbrowse_patient_exams';
export const DATA_PATIENT_EXAM_EXAMID = 'patbrowse_patient_exam_examid';
export const DATA_PATIENT_EXAM_ACCN = 'patbrowse_patient_exam_accn';
export const DATA_EXAM_STUDIES = 'exam_studies';
export const DATA_STUDY_LOCATION = 'study_locations';

export const DATA_EXAM_SERIES_KO_REFLECTED = 'exam_show_ko_effect';
export const DATA_EXAM_SERIES = 'exam_series';
export const DATA_SERIES_LOCATIONS = 'series_locations';

export const DATA_EXAM_CMOVES = 'exam_cmoves';
export const DATA_EXAM_EXCEPTIONS = 'exam_exceptions';
export const DATA_CIGA_SERIES = 'ciga_series';
export const DATA_CIGA_JOBS = 'ciga_jobs';

export const DATA_CIGA_EXCEPTIONS = 'ciga_exceptions';
export const DATA_CIGA_PROCESSOR_LOG = 'ciga_processor_log';
export const DATA_CIGA_IIMS_NOTIF = 'ciga_iims_notifications';

export const loadGridData = (gridName, args, recvfn) => {
  console.log('Retrieve Data for :', gridName, args);
  let urlPrefix = 'https://iasq1mr2:8081/exsql?dbserver=';
  let dataURL = '';

  switch (gridName) {
    case DATA_PATIENT_EXAMS:
      let examkeytype = args.examkeytype;
      console.log('Received Args:', examkeytype, args);
      switch (examkeytype) {
        case 'accn':
          console.log('Received Args:', examkeytype, args);
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
     exam_id in (select exam_id from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..EXAM_IDENTIFIER eid where eid.examid_type_code = 'EPIC_ACCESSION_NBR' and eid.examid_value =
      '${args.accession}' ) order by performed_dt desc `;

          break;

        case 'examid':
          console.log('Received Args:', examkeytype, args);
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
     exam_id in (select exam_id from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..EXAM_IDENTIFIER eid where eid.examid_type_code = 'EPIC_ACCESSION_NBR' and eid.exam_id =
      ${args.examid} ) order by performed_dt desc `;

          break;

        case 'cmrn':
          console.log('Received Args:', examkeytype, args);
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
     patient_cmrn = '${args.patient_cmrn}' order by performed_dt desc `;

          break;

        case 'jobqueueid':
          console.log('Received Args:', examkeytype, args);
          dataURL = `${args.DbEnv.iimsOltp}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select
       oncis = (select min('Yes') from iimdb_rch${args.DbEnv.iimsOltpDBNum}${args.DbEnv.iimsOltpExt}..img_study sty2, iimdb_rch${args.DbEnv.iimsOltpDBNum}${args.DbEnv.iimsOltpExt}..img_study_location styl2 , iimdb_rch${args.DbEnv.iimsOltpDBNum}${args.DbEnv.iimsOltpExt}..img_store str2 where sty2.exam_id = exm.exam_id and sty2.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 2),
       onMIDIA = (select min('Yes') from iimdb_rch${args.DbEnv.iimsOltpDBNum}${args.DbEnv.iimsOltpExt}..img_study sty2, iimdb_rch${args.DbEnv.iimsOltpDBNum}${args.DbEnv.iimsOltpExt}..img_study_location styl2 , iimdb_rch${args.DbEnv.iimsOltpDBNum}${args.DbEnv.iimsOltpExt}..img_store str2 where sty2.exam_id = exm.exam_id and sty2.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 1),
       patient_cmrn, exam_id ,
       (select examid_value from iimdb_rch${args.DbEnv.iimsOltpDBNum}${args.DbEnv.iimsOltpExt}..EXAM_IDENTIFIER eid where eid.examid_type_code = 'ACCESSION_NBR' and eid.exam_id = exm.exam_id) as 'iims_accn',
       (select examid_value from iimdb_rch${args.DbEnv.iimsOltpDBNum}${args.DbEnv.iimsOltpExt}..EXAM_IDENTIFIER eid where eid.examid_type_code = 'EPIC_ACCESSION_NBR' and eid.exam_id = exm.exam_id) as 'epic_accn',
       clinical_viewer_desc, exam_status, performed_dt , report_status, modality_code, exm.dept_id,
       scheduled_for_dt, owner_system,	patient_id,	exam_availability, exam_priority_code,	left_right_flag,	emr_flag,	archive_ind,	sensitive_flag	,pred_proc_id,	exm.proc_id
       ,	proc_code,	proc_desc
       from iimdb_rch${args.DbEnv.iimsOltpDBNum}${args.DbEnv.iimsOltpExt}..exam exm , iimdb_rch${args.DbEnv.iimsOltpDBNum}${args.DbEnv.iimsOltpExt}..DEPT_PROCEDURE pp  where exm.proc_id = pp.proc_id and
       exam_id in (select eid.exam_id from iimdb_rch${args.DbEnv.iimsOltpDBNum}${args.DbEnv.iimsOltpExt}..EXAM_IDENTIFIER eid , qrddb_rch03${args.DbEnv.iimsOltpExt}..CIGTB_JOB_QUEUE_LOG jobq where jobq.job_queue_id = ${args.jobqueueid} and jobq.EXAM_ID = eid.examid_value and eid.examid_type_code = 'EPIC_ACCESSION_NBR' ) order by performed_dt desc `;

          break;

        default:
      }
      break;

    case DATA_EXAM_STUDIES:
      console.log('STUDY:', args.examid, args.DbEnv);
      dataURL = `${args.DbEnv.iimsRepl}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select
      oncis = (select min('Yes') from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_study_location styl2 , iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_store str2 where  sty.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 2),
      onMIDIA = (select min('Yes') from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_study_location styl2 , iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_store str2 where  sty.imgsty_id = styl2.imgstyl_imgsty_id and styl2.imgstyl_status = 'A' and styl2.imgstyl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 1),
      imgsty_id, imgsty_status from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_study sty where  sty.exam_id = ${args.examid} `;

      break;

    case DATA_STUDY_LOCATION:
      console.log('STUDY LOCATION:', args.imgsty_id, args.DbEnv);

      dataURL = `${args.DbEnv.iimsRepl}&sqltype=customSQL&sqltext=set%20rowcount%201000%20
          SELECT
      imgsys_name,
      imgstyl_status,
      last_action_time,
      imgstyl_id,
      imgstyl_imgsty_id,
      imgstyl_imgstr_id  FROM     iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..IMG_STUDY_LOCATION styl,
      iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..IMG_STORE str,
      iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..IMG_SYSTEM imgsys WHERE     imgstyl_imgsty_id =  ${args.imgsty_id}  AND      styl.imgstyl_imgstr_id = str.imgstr_id AND     str.imgstr_imgsys_id = imgsys.imgsys_id
       `;

      break;

    case DATA_EXAM_SERIES:
      console.log('ARGS: ', args);

      if (args.accession == '') return;

      dataURL = `${args.DbEnv.iimsRepl}&sqltype=customSQL&sqltext=set%20rowcount%201000%20
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
      projection FROM     iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..IMG_SERIES ser,
      iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..IMG_STUDY sty,
      iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..EXAM exm,
      iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..EXAM_IDENTIFIER eid WHERE     eid.examid_value = '${args.accession}' AND
      eid.examid_type_code = 'EPIC_ACCESSION_NBR' AND
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

      dataURL = `${args.DbEnv.iimsRepl}&sqltype=customSQL&sqltext=set%20rowcount%201000%20
          SELECT
      imgsys_name,
      imgserl_status,
      imgserl_image_count,
      last_action_time,
      imgserl_id,
      imgserl_imgser_id,
      series_size,
      series_file_name,
      imgserl_imgstr_id  FROM     iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..IMG_SERIES_LOCATION serl,
      iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..IMG_STORE str,
      iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..IMG_SYSTEM imgsys WHERE     imgserl_imgser_id =  ${args.imgser_id}  AND      serl.imgserl_imgstr_id = str.imgstr_id AND     str.imgstr_imgsys_id = imgsys.imgsys_id
       `;

      break;

    //     ${args.DbEnv.iimsRepl}&sqltype=customSQL&sqltext=set%20rowcount%201000%20
    //  select
    //  onMIDIA = (select min('Yes') from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_series ser2, iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_series_location serl2 , iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_store str2 where ser2.imgser_id = serl.imgserl_imgser_id and ser2.imgser_id = serl2.imgserl_imgser_id and serl2.imgserl_status = 'A' and serl2.imgserl_imgstr_id = str2.imgstr_id and str2.imgstr_imgsys_id = 1),
    //  store_path as store_p, series_file_name as file_path, * from iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_series_location serl, iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_store str, iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..img_system imgsys where imgserl_imgstr_id = imgstr_id and imgstr_imgsys_id = imgsys_id and imgserl_imgser_id =

    case DATA_EXAM_CMOVES:
      dataURL = `${args.DbEnv.iimsOltp}&sqltype=customSQL&sqltext=set%20rowcount%200%20select rd.REQDTL_EXAM_ID as exam_id, howlong = datediff(mi, rh.REQHDR_REQUESTED_AT_TIME, isnull(isnull(rd.REQDTL_COMPLETED_AT_TIME, dcmr.DCMR_LAST_ATTEMPT_TIME), getdate())) , rh.REQHDR_REQUESTED_AT_TIME  as requested_at ,  rd.REQDTL_COMPLETED_AT_TIME done_at , dcmr.DCMR_LAST_ATTEMPT_TIME last_attempt_at, rh.REQHDR_SOURCE as source, rd.REQDTL_PRIORITY as priority, rd.REQDTL_STATUS as status ,* from iimdb_rch02${args.DbEnv.iimsOltpExt}..REQUEST_HEADER rh, iimdb_rch02${args.DbEnv.iimsOltpExt}..REQUEST_DETAIL rd left join iimdb_rch02${args.DbEnv.iimsOltpExt}..DICOM_CMOVE_REQUEST dcmr on dcmr.DCMR_REQUEST_DTL_ID = rd.REQDTL_ID where  rd.REQDTL_REQHDR_ID = rh.REQHDR_ID and rd.REQDTL_EXAM_ID = ${args.examid} `;
      break;

    case DATA_EXAM_EXCEPTIONS:
      dataURL = `${args.DbEnv.iimsOltp}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select  exc_src_system, exc_exr_code	,exc_time , exam_id ,		exc_src_queue_id,		exc_iparam1	,exc_iparam2	,exc_iparam3	,exc_iparam4	,exc_cparam1     ,   exc_cparam2  from iimdb_rch02${args.DbEnv.iimsOltpExt}..EXCEPTION exc  where  exc.exc_exr_code in ('IMGE_SERL_A', 'IMGE_SERL_D', 'IMGE_SERL_P') and exam_id = ${args.examid} order by exc_time desc `;
      break;

    case DATA_CIGA_SERIES:
      dataURL = `${args.DbEnv.iimsOltp}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select * from qrddb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsOltpExt}..CIGTB_INBOUND_SERIES inbs where inbs.exam_id = ${args.accession} `;
      break;

    case DATA_CIGA_EXCEPTIONS:
      dataURL = `${args.DbEnv.iimsOltp}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select TBL = 'DONE_QUEUE',  ql.job_queue_id, el.exception_id, el.exception_code, el.exception_desc, el.exception_time from iimdb_rch01${args.DbEnv.iimsOltpExt}..EXAM_IDENTIFIER ei, qrddb_rch03${args.DbEnv.iimsOltpExt}..CIGTB_JOB_QUEUE_LOG ql , qrddb_rch03${args.DbEnv.iimsOltpExt}..CIGTB_EXCEPTION_LOG el where
  ei.exam_id = ${args.examid} and ei.examid_type_code = 'EPIC_ACCESSION_NBR' and ei.examid_value = ql.EXAM_ID and  el.SOURCE_QUEUE_ID = ql.job_queue_id
  union
  select TBL = 'IN_QUEUE', ql.job_queue_id, el.exception_id, el.exception_code, el.exception_desc, el.exception_time from iimdb_rch01${args.DbEnv.iimsOltpExt}..EXAM_IDENTIFIER ei, qrddb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsOltpExt}..CIGTB_JOB_QUEUE ql , qrddb_rch03${args.DbEnv.iimsOltpExt}..CIGTB_EXCEPTION_LOG el where
  ei.exam_id = ${args.examid} and ei.examid_type_code = 'EPIC_ACCESSION_NBR' and ei.examid_value = ql.EXAM_ID and  el.SOURCE_QUEUE_ID = ql.job_queue_id
  order by exception_id desc`;
      break;

    case DATA_CIGA_PROCESSOR_LOG:
      dataURL = `${args.DbEnv.iimsOltp}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select *  from qrddb_rch03${args.DbEnv.iimsOltpExt}..CIGTB_PROCESSOR_LOG where JOB_QUEUE_ID =  ${args.job_queue_id} `;
      break;

    case DATA_CIGA_IIMS_NOTIF:
      dataURL = `${args.DbEnv.iimsOltp}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select *  from iimdb_rch02${args.DbEnv.iimsOltpExt}..Q_IMAGE_NOTIFICATION where image_queue_id =  ${args.iims_queue_id} `;
      break;

    case DATA_CIGA_JOBS:
      dataURL = `${args.DbEnv.iimsOltp}&sqltype=customSQL&sqltext=set%20rowcount%201000%20select TBL = 'DONE_QUEUE', JOB_QUEUE_ID,	JOB_QUEUE_START_TIME,    	JOB_STATUS,	JOB_STATUS_TIME,         	RECEIVER_PORT,	RECEIVER_AET,   	SENDER_HOST ,    	SENDER_IP,    	SENDER_AET,    	JOB_PRIORITY,	CAMPUS,	CAMPUS_DESC,	DEPARTMENT_ID,	DEPARTMENT_CODE,	PATIENT_EXTERNAL_ID,	PATIENT_INTERNAL_ID,	PATIENT_LAST_NAME,	PATIENT_FIRST_NAME,	EXAM_ID ,	EXAM_DATE  ,             	STUDY_UID     ,                                 	STUDY_DESC  ,                                      	SERIES_UID ,                                            	SOPCLASS_UID,             	SERIES_MODALITY,	TRANSFER_SYNTAX,    	PROCESSOR_HOST,	PROCESSED_SERIES_COUNT,	PROCESSED_JOB_COUNT,	ACTIVE_ASSOCIATION_COUNT,	JOB_QUEUE_END_TIME ,     	UPDATE_TIME
      from qrddb_rch03${args.DbEnv.iimsOltpExt}..CIGTB_JOB_QUEUE_LOG where EXAM_ID =  '${args.accession}'
      union
      select TBL = 'IN_QUEUE',  JOB_QUEUE_ID,	JOB_QUEUE_START_TIME,    	JOB_STATUS,	JOB_STATUS_TIME,         	RECEIVER_PORT,	RECEIVER_AET,   	SENDER_HOST ,    	SENDER_IP,    	SENDER_AET,    	JOB_PRIORITY,	CAMPUS,	CAMPUS_DESC,	DEPARTMENT_ID,	DEPARTMENT_CODE,	PATIENT_EXTERNAL_ID,	PATIENT_INTERNAL_ID,	PATIENT_LAST_NAME,	PATIENT_FIRST_NAME,	EXAM_ID ,	EXAM_DATE  ,             	STUDY_UID     ,                                 	STUDY_DESC  ,                                      	SERIES_UID ,                                            	SOPCLASS_UID,             	SERIES_MODALITY,	TRANSFER_SYNTAX,    	PROCESSOR_HOST,	PROCESSED_SERIES_COUNT,	PROCESSED_JOB_COUNT,	ACTIVE_ASSOCIATION_COUNT,	JOB_QUEUE_END_TIME = convert(datetime,null),     	UPDATE_TIME = convert(datetime,null)
      from qrddb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsOltpExt}..CIGTB_JOB_QUEUE where EXAM_ID =  '${args.accession}' order by job_queue_id desc`;
      break;

    case DATA_EXAM_SERIES_KO_REFLECTED:
      cli_parse_ko_folder(gridName, args, recvfn);
      return;

      break;

    case DATA_RECENT_IOCM_JOBS:
      dataURL = `${args.DbEnv.iimsRepl}&sqltype=customSQL&sqltext=set%20rowcount%201000%20
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
      FROM qrddb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..CIGTB_JOB_QUEUE_LOG jql, iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..IMG_SERIES ser, iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..IMG_SERIES_LOCATION serl, iimdb_rch${args.DbEnv.iimsReplDBNum}${args.DbEnv.iimsReplExt}..IMG_STORE str  WHERE campus = 2 and jql.SOPCLASS_UID = '1.2.840.10008.5.1.4.1.1.88.59' and jql.SERIES_UID = ser.series_uid and ser.series_id = 11000 and ser.imgser_id = serl.imgserl_imgser_id and serl.imgserl_imgstr_id = str.imgstr_id and str.imgstr_imgsys_id = 2  ORDER BY jql.JOB_QUEUE_END_TIME DESC `;
      break;

    default:
  }

  console.log('Getting data  (Calling) from URL:', urlPrefix + dataURL);
  if (dataURL == '') {
    recvfn(gridName, args, []);
    return;
  }

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
      // if (dframe) {
      //   dframe = dframe.replaceAll('null', '""');
      // }
      //console.log(dframe);
      try {
        let myObj = JSON.parse(dframe);
        //console.log(myObj);
        let gridData = myObj['rows'];
        console.log(
          'Sending data to receving fn from URL:',
          urlPrefix + dataURL,
          gridName,
          args
        );
        recvfn(gridName, args, gridData);
      } catch (error) {
        console.log('Error:' + error);
      }
    });
};

export const cli_getdicom_meta = (filename, retfunc) => {
  console.log(
    'JS: ',
    filename,
    '"api/venv/Scripts/python" api/dicom.py -cmd parse -a ' + filename
  );

  //let logStream = fs.createWriteStream('./logFile.log', {flags: 'a'});
  let mesg = '';
  try {
    exec(
      '"api/venv/Scripts/python" api/dicom.py -cmd parse -a ' + filename,
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
        //console.log(`stdout: ${stdout}`);
        console.log(stdout);
        //retfunc('NOGRID', {}, stdout);
        retfunc(stdout);
        //retfunc ((JSON.stringify(stdout)));
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const cli_parse_ko_folder = (gridName, args, retfunc) => {
  let dataURL = '';
  let accession = args.accession;
  let DbEnv = args.DbEnv;
  console.log(accession, DbEnv);
  dataURL = `${DbEnv.iimsOltp}&sqltype=customSQL&sqltext=declare @accn varchar(20) select @accn = '${accession}'  select serl.imgserl_id, ser.imgser_status, ser.imgser_image_count, serl.imgserl_status, ser.modality, str.store_name, serl.series_file_name, serl.last_action_time,  exm.patient_cmrn, sty.acq_start_time, ser.sopclass_uid, ser.series_uid, sty.study_uid  FROM iimdb_rch${DbEnv.iimsReplDBNum}${DbEnv.iimsOltpExt}..EXAM exm, iimdb_rch${DbEnv.iimsReplDBNum}${DbEnv.iimsOltpExt}..EXAM_IDENTIFIER eid , iimdb_rch${args.DbEnv.iimsReplDBNum}${DbEnv.iimsOltpExt}..IMG_STUDY sty,   iimdb_rch${DbEnv.iimsReplDBNum}${DbEnv.iimsOltpExt}..IMG_SERIES ser, iimdb_rch${DbEnv.iimsReplDBNum}${DbEnv.iimsOltpExt}..IMG_SERIES_LOCATION serl, iimdb_rch${DbEnv.iimsReplDBNum}${DbEnv.iimsOltpExt}..IMG_STORE str   WHERE exm.exam_id = sty.exam_id and sty.imgsty_id = ser.imgser_imgsty_id   and ser.imgser_id = serl.imgserl_imgser_id and serl.imgserl_imgstr_id = str.imgstr_id and str.imgstr_imgsys_id = 2 and  sty.exam_id = eid.exam_id and eid.examid_type_code = 'EPIC_ACCESSION_NBR' and eid.examid_value = @accn `;

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

export const runCIGCommand = (hostname, cmdtorun, recvLogFn) => {
  console.log(
    '"api/venv/Scripts/python" api/cigaops.py -cmd cigcmd -host ' +
      hostname +
      ' -a "' +
      cmdtorun +
      '"'
  );
  try {
    exec(
      '"api/venv/Scripts/python" api/cigaops.py -cmd cigcmd -host ' +
        hostname +
        ' -a "' +
        cmdtorun +
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
        //let textHtml = '';
        //console.log('CMD Returned', hostname, cmdtorun, stdout);
        let textHtml = stdout.replace('[').replace(']').split("b'");

        // .forEach((element) => {
        //   return element + '<br/>';
        // });

        let newarr = textHtml.map((row) => {
          return row + '<br/>';
        });

        let htmlText = textHtml.reduce((accumulator, currentValue) => {
          let index = currentValue.indexOf(' - ');
          let markedup =
            currentValue.substr(0, index + 3) +
            '<span style="background-color:salmon;">' +
            currentValue.substr(index + 3);
          index = markedup.indexOf('queueID');
          markedup =
            markedup.substr(0, index) + '</span>' + markedup.substr(index);
          return accumulator.concat(markedup + '<hr/>');
        });

        console.log(htmlText);
        recvLogFn(htmlText);
        //refreshHostData();
      }
    );
  } catch (error) {
    console.log(error);
  }
};
