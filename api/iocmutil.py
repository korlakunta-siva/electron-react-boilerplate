def getIOCMReprocessSQL():

    sqlText = '''
SELECT
    serl_midia.imgserl_imgstr_id,
    dest_desc = (select dest.DEST_DESCRIPTION
            from        iimdb_rch01_prod..imgsend_destgateway id,
                        iimdb_rch01_prod..dicom_gateway dg, iimdb_rch01_prod..DESTINATION dest
            where       id.imgsdg_imgstr_id = serl_midia.imgserl_imgstr_id and
                        id.imgsdg_recv_dg_id = dg.dg_id and
                        dg.dg_imgsys_id = 2
                        and dg.dg_port in ( 6109, 7109)
and dest.DEST_ID = dg.DG_DEST_ID                        ),

ciga_dest_aet = (select RECEIVER_AET from qrddb_rch03_prod..CIGTB_JOB_QUEUE_LOG jql where jql.JOB_QUEUE_END_TIME between dateadd(hh, -4, serl_qreads.last_action_time) and   dateadd(mi, +120, serl_qreads.last_action_time)
   and jql.SERIES_UID = ser.series_uid),

       ser.series_uid,
           serl_qreads.series_file_name as qreads_series_file_name ,
    qreads_store_path = (select str.store_path from iimdb_rch01_prod..IMG_STORE str where imgstr_id = serl_qreads.imgserl_imgstr_id),

       patient_cmrn,

    examid_value,
    exm.exam_id,

   imgsty_status,
    imgser_status,
        modality,
    iocm_flag,
    serl_midia.imgserl_status as midia_imgserl_status,
    serl_qreads.imgserl_status as qreads_imgserl_status,
    imgser_image_count,
    serl_midia.imgserl_image_count as midia_imgserl_image_count,
    serl_qreads.imgserl_image_count as qreads_imgserl_image_count,
    serl_midia.last_action_time as midia_last_action_time,
    serl_qreads.last_action_time as qreads_last_action_time,




    exm.dept_id,
    patient_id,
    examid_type_code,
    exam_availability,
    exam_status,
    scheduled_for_dt,
    performed_dt,
    exam_priority_code,
    left_right_flag,	emr_flag,
    archive_ind,
    sensitive_flag,

    report_status,
    pred_proc_id,

    imgsty_id,
    sty.study_uid,
    sty.study_desc,
    sty.study_id,
    primary_imgsys_id,
    dicom_accession_nbr,

    imgsty_image_count,
    sty.acq_start_time as sty_acq_start_time,
    sty.acq_finish_time as sty_acq_finish_time,
    sty.acq_station_name as sty_acq_station_name,
    imgser_id,

    series_desc,

    ser.acq_start_time  as ser_acq_start_time ,
    ser.acq_finish_time as ser_acq_finish_time,
    ser.acq_station_name as ser_acq_station_name,
    series_id,
    projection,
    ser.sopclass_uid,

    serl_midia.imgserl_id as midia_imgserl_id,
    serl_midia.imgserl_imgstr_id as midia_imgserl_imgstr_id,

    serl_qreads.imgserl_id as qreads_imgserl_id,
    serl_qreads.imgserl_imgstr_id as qreads_imgserl_imgstr_id


    FROM
        iimdb_rch01_prod..EXAM exm,
        iimdb_rch01_prod..EXAM_IDENTIFIER eid,
        iimdb_rch01_prod..IMG_STUDY sty,
        iimdb_rch01_prod..IMG_SERIES ser
       left JOIN  iimdb_rch01_prod..IMG_SERIES_LOCATION serl_midia ON serl_midia.imgserl_imgser_id = ser.imgser_id and serl_midia.imgserl_imgstr_id in (select imgstr_id from iimdb_rch01_prod..IMG_STORE where imgstr_imgsys_id =1)
       left JOIN  iimdb_rch01_prod..IMG_SERIES_LOCATION serl_qreads ON serl_qreads.imgserl_imgser_id = ser.imgser_id and serl_qreads.imgserl_imgstr_id in (select imgstr_id from iimdb_rch01_prod..IMG_STORE where imgstr_imgsys_id =2)
 WHERE
        eid.examid_type_code = 'EPIC_ACCESSION_NBR' AND
        eid.exam_id = exm.exam_id AND
        exm.exam_id = sty.exam_id AND
        sty.imgsty_id = ser.imgser_imgsty_id

        AND exm.performed_dt between dateadd(hh,-24, getdate()) and getdate()

        AND imgsty_status = 'A'
        AND  (case
    when ser.imgser_status = 'A' and serl_midia.imgserl_image_count != serl_qreads.imgserl_image_count then 'N'
    when ser.imgser_status = 'A' and serl_midia.imgserl_image_count = serl_qreads.imgserl_image_count then 'Y'
    when ser.imgser_status = 'P' and ser.iocm_flag= 'Y' and ( serl_midia.imgserl_status is null  or serl_midia.imgserl_status = serl_qreads.imgserl_status)  then 'Y'
    when ser.iocm_flag is null  and ser.imgser_status in ( 'P' , 'D' )  and serl_qreads.imgserl_status in ('P', 'D') then 'Y'
    when ser.modality in ('SR', 'RTSTRUCT')  then 'Y'
    else 'U' end) != 'H'
    and ser.sopclass_uid = '1.2.840.10008.5.1.4.1.1.88.59'
    and ser.series_id = 11000

    and serl_qreads.imgserl_status in ('A', 'P'    )
    and ser.imgser_status in ('A', 'P')
    and isnull(ser.iocm_flag, 'N') != 'Y'
    and not exists (select 'x' from qrddb_rch01_prod..CIGTB_INBOUND_SERIES inbs where ser.series_uid = inbs.SERIES_UID)
    and not exists (select 'x' from qrddb_rch01_prod..CIGTB_JOB_QUEUE jq where ser.series_uid = jq.SERIES_UID and jq.JOB_STATUS in (0,1)) '''
    #and not exists (select 'x' from qrddb_rch01_prod..CIGTB_JOB_QUEUE_LOG jql where jql.JOB_QUEUE_END_TIME > dateadd(hh,-3,getdate()) and ser.series_uid = jql.SERIES_UID )   '''

    return sqlText


# // 129.176.169.21   cigaprod
# // 172.29.5.31   cigamcf
# // 172.16.196.14 cigamca
# // 10.128.162.177 cigaint


def getCigConfig():
    Config = {
        "Receivers": [
            {
                "queue": 'preprod',
                "aettype": 'receiver',
                "hostname": 'cigaprod',
                "ipaddr": '129.176.169.21',
                "recvaet": 'CIGA_MCR_ORDSTG',
                "port": '6109',
                "campus": 'MCR',
                "sendaet2": 'PRODDECO_SCP',
                "sendaet1": 'TEAM_SCU',
            },
            {
                "queue": 'preprod',
                "aettype": 'receiver',
                "hostname": 'cigamcf',
                "ipaddr": '172.29.5.31',
                "recvaet": 'CIGA_MCF_ORDSTG',
                "port": '6109',
                "campus": 'MCF',
                "sendaet1": 'MCFMIDPROD1',
                "sendaet2": 'MCFMIDPROD1',
            },
            {
                "queue": 'preprod',
                "aettype": 'receiver',
                "hostname": 'cigamca',
                "ipaddr": '172.16.196.14',
                "recvaet": 'CIGA_MCA_ORDSTG',
                "port": '6109',
                "campus": 'MCA',
                "sendaet1": 'ARZMIDIAPROD',
                "sendaet2": 'ARZMIDIAPROD',
            },
            {
                "queue": 'preprod',
                "aettype": 'receiver',
                "hostname": 'cigaprod',
                "ipaddr": '129.176.169.21',
                "recvaet": 'CIGA_MCR_NONSTG',
                "port": '7109',
                "campus": 'MCR',
                "sendaet2": 'PRODDECO_SCP',
                "sendaet1": 'TEAM_SCU',
            },
            {
                "queue": 'preprod',
                "aettype": 'receiver',
                "hostname": 'cigamcf',
                "ipaddr": '172.29.5.31',
                "recvaet": 'CIGA_MCF_NONSTG',
                "port": '7109',
                "campus": 'MCF',
                "sendaet1": 'MCFMIDPROD1',
                "sendaet2": 'MCFMIDPROD1',
            },
            {
                "queue": 'preprod',
                "aettype": 'receiver',
                "hostname": 'cigamca',
                "ipaddr": '172.16.196.14',
                "recvaet": 'CIGA_MCA_NONSTG',
                "port": '7109',
                "campus": 'MCA',
                "sendaet1": 'ARZMIDIAPROD',
                "sendaet2": 'ARZMIDIAPROD',
            },
        ]
    }

    return Config


# // 129.176.169.21   cigaprod
# // 172.29.5.31   cigamcf
# // 172.16.196.14 cigamca
# // 10.128.162.177 cigaint


def main():

    #print(getIOCM_ReprocessSQL())
    print(getCigConfig())


if __name__ == "__main__":
    main()
