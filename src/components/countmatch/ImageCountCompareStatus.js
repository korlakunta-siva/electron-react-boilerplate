import React, { Component } from 'react';
import Navbar from '../Navbar';
import DataMultiGrid from '../common/DataMultiGrid';

class App extends Component {
  endpoint_sql_prefix =
    'https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set rowcount 1000 ';

  //"https://iasq1mr2:8081/exsql?dbserver=iimsRepl&sqltype=customSQL&sqltext=set%20rowcount%201000%20 ";

  state = {
    columns_loaded: false,
    exam_id: '',
    accn: '',
    multi_grid_data: [],

    customsqltext:
      "select * from iimdb_rch00_repl..exam exm , iimdb_rch00_repl..IIMTB_PREDEFINED_PROC pp  where exm.pred_proc_id = pp.pred_proc_id and exam_status = 'CM' and performed_dt between  dateadd(hh, -1, getdate()) and getdate()  ",
  };

  constructor(props) {
    super(props);
    this.customMultiGridElement = React.createRef();
  }

  componentWillMount() {
    document.title = 'IIMS PINE Queue status';
    //this.onRefreshPINEStatus();

    setTimeout(() => {
      this.setState({ columns_loaded: true });
    }, 2000);
  }

  onRefreshPINEStatus = (examid_sub) => {
    //console.log("rowselected exam:", data[0].row);

    if (this.state.exam_id == '') return;

    //     and ((select sum(imgserl_image_count) from iimdb_rch00_repl..img_series, iimdb_rch00_repl..img_series_location
    //     where sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
    //       and imgser_status = 'A' and imgserl_status = 'A'
    //       and modality not in ('KO', 'SR', 'RTSTRUCT') and sopclass_uid != '1.2.840.10008.5.1.4.1.1.88.33'
    //       and (series_desc is null or series_desc not like '%:-q%')
    //       and imgserl_imgstr_id in
    //     (select imgstr_id from iimdb_rch00_repl.dbo.IMG_STORE where imgstr_imgsys_id = 1))
    // -
    // (select sum(imgserl_image_count) from iimdb_rch00_repl..img_series, iimdb_rch00_repl..img_series_location imgserl, iimdb_rch00_repl.dbo.IMG_STORE imgstr
    //     where sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
    //       and imgser_status = 'A' and imgserl_status = 'A'
    //       and modality not in ('KO', 'SR') and sopclass_uid != '1.2.840.10008.5.1.4.1.1.88.33'
    //       and (series_desc is null or series_desc not like '%:-q%')
    //     and imgserl_imgstr_id = imgstr.imgstr_id and imgstr_imgsys_id = 2
    //           and imgserl.last_action_time = (select max(sl2.last_action_time)
    //                                                                           from img_series_location sl2
    //                                                                           join img_store st2 on sl2.imgserl_imgstr_id = st2.imgstr_id
    //                                                                         where imgserl.imgserl_imgser_id = sl2.imgserl_imgser_id
    //                                                                           and imgstr.imgstr_imgsys_id = st2.imgstr_imgsys_id
    //                                                                           and sl2.imgserl_status = 'A') )
    // != 0	)

    // exam_id in (select exam_id from iimdb_rch00_repl..EXAM_IDENTIFIER eid where eid.examid_type_code = 'ACCESSION_NBR' and eid.examid_value = '" +
    //     this.state.accn +
    //     "') " +

    let Counts_status_query =
      `
        SET NOCOUNT ON

        DECLARE @exam_id NUMERIC (10, 0)

        DECLARE @accn varchar(30)

            SELECT @exam_id = ` +
      this.state.exam_id +
      `

            select ex.exam_id,


             ((select sum(imgserl_image_count) from iimdb_rch00_repl..img_series, iimdb_rch00_repl..img_series_location
            where sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
              and imgser_status = 'A' and imgserl_status = 'A'
              and modality not in ('KO', 'SR', 'RTSTRUCT') and sopclass_uid != '1.2.840.10008.5.1.4.1.1.88.33'
              and (series_desc is null or series_desc not like '%:-q%')
              and imgserl_imgstr_id in
            (select imgstr_id from iimdb_rch00_repl.dbo.IMG_STORE where imgstr_imgsys_id = 1))
        -
        (select sum(imgserl_image_count) from iimdb_rch00_repl..img_series, iimdb_rch00_repl..img_series_location imgserl, iimdb_rch00_repl.dbo.IMG_STORE imgstr
            where sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
              and imgser_status = 'A' and imgserl_status = 'A'
              and modality not in ('KO', 'SR') and sopclass_uid != '1.2.840.10008.5.1.4.1.1.88.33'
              and (series_desc is null or series_desc not like '%:-q%')
            and imgserl_imgstr_id = imgstr.imgstr_id and imgstr_imgsys_id = 2
                  and imgserl.last_action_time = (select max(sl2.last_action_time)
                                                                                  from img_series_location sl2
                                                                                  join img_store st2 on sl2.imgserl_imgstr_id = st2.imgstr_id
                                                                                where imgserl.imgserl_imgser_id = sl2.imgserl_imgser_id
                                                                                  and imgstr.imgstr_imgsys_id = st2.imgstr_imgsys_id
                                                                                  and sl2.imgserl_status = 'A') )
                                                                                  ) as CountDifference,


            examid_value as 'ACCESSION',
            patient_cmrn as 'PATIENT ID', dept_code,
            (select proc_desc from iimdb_rch00_repl..IIMTB_PREDEFINED_PROC where pred_proc_id= ex.pred_proc_id) as 'Procedure',
            performed_dt,
            study_uid as 'STUDY_UID',
            imgsty_image_count as 'IMAGE COUNT',
            (select sum(imgserl_image_count) from iimdb_rch00_repl..img_series, iimdb_rch00_repl..img_series_location
                    where sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
                      and imgser_status = 'A' and imgserl_status = 'A'
                      and imgserl_imgstr_id in
                    (select imgstr_id from iimdb_rch00_repl.dbo.IMG_STORE where imgstr_imgsys_id = 1)) as MIDIA_COUNT,
            (select sum(imgserl_image_count) from iimdb_rch00_repl..img_series, iimdb_rch00_repl..img_series_location imgserl, iimdb_rch00_repl.dbo.IMG_STORE imgstr
                    where sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
                      and imgser_status = 'A' and imgserl_status = 'A'
                      and imgserl_imgstr_id = imgstr.imgstr_id and imgstr_imgsys_id = 2
                    and imgserl.last_action_time = (select max(sl2.last_action_time)
                                                                                    from img_series_location sl2
                                                                                    join img_store st2 on sl2.imgserl_imgstr_id = st2.imgstr_id
                                                                                  where imgserl.imgserl_imgser_id = sl2.imgserl_imgser_id
                                                                                    and imgstr.imgstr_imgsys_id = st2.imgstr_imgsys_id
                                                                                    and sl2.imgserl_status = 'A') ) as QREADS_COUNT,
              (select sum(imgserl_image_count) from iimdb_rch00_repl..img_series, iimdb_rch00_repl..img_series_location
                    where sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
                      and imgser_status = 'A' and imgserl_status = 'A'
                      and modality not in ('KO', 'SR') and sopclass_uid != '1.2.840.10008.5.1.4.1.1.88.33'
                      and (series_desc is null or series_desc not like '%:-q%')
                      and imgserl_imgstr_id in
                    (select imgstr_id from iimdb_rch00_repl.dbo.IMG_STORE where imgstr_imgsys_id = 1)) as MIDIA_COUNT_IMAGES,
            (select sum(imgserl_image_count) from iimdb_rch00_repl..img_series, iimdb_rch00_repl..img_series_location imgserl, iimdb_rch00_repl.dbo.IMG_STORE imgstr
                    where sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
                      and imgser_status = 'A' and imgserl_status = 'A'
                      and modality not in ('KO', 'SR') and sopclass_uid != '1.2.840.10008.5.1.4.1.1.88.33'
                      and (series_desc is null or series_desc not like '%:-q%')
                      and imgserl_imgstr_id = imgstr.imgstr_id and imgstr_imgsys_id = 2
                    and imgserl.last_action_time = (select max(sl2.last_action_time)
                                                                                    from img_series_location sl2
                                                                                    join img_store st2 on sl2.imgserl_imgstr_id = st2.imgstr_id
                                                                                  where imgserl.imgserl_imgser_id = sl2.imgserl_imgser_id
                                                                                    and imgstr.imgstr_imgsys_id = st2.imgstr_imgsys_id
                                                                                    and sl2.imgserl_status = 'A') ) as QREADS_COUNT_IMAGES

      from iimdb_rch00_repl.dbo.EXAM ex, iimdb_rch00_repl.dbo.EXAM_IDENTIFIER exid, iimdb_rch00_repl.dbo.IMG_STUDY sty,
            iimdb_rch00_repl..department d
        where 1 = 1
        and ex.exam_id = @exam_id
        and ex.exam_status != 'CA'
        and ex.exam_id = exid.exam_id
        and ex.exam_id = sty.exam_id
        and examid_type_code = 'EPIC_ACCESSION_NBR'
        and sty.imgsty_status = 'A'
      and ex.dept_id = d.dept_id
      and d.dept_specialty in ( 'RAD', 'RAD_ORD' )


        select ' Active - MORE in QREADS'   as 'dataset_name',
        imgserl.imgserl_image_count as  serl_img_count, imgserl_status, imgserl_id, *
        from iimdb_rch00_repl.dbo.EXAM ex, iimdb_rch00_repl.dbo.EXAM_IDENTIFIER exid, iimdb_rch00_repl.dbo.IMG_STUDY sty,
          iimdb_rch00_repl..department d, iimdb_rch00_repl..img_series imgser, iimdb_rch00_repl..img_series_location imgserl, iimdb_rch00_repl.dbo.IMG_STORE imgstr
        where
        ex.exam_id=@exam_id
        and ex.exam_id = exid.exam_id
          and examid_type_code = 'EPIC_ACCESSION_NBR'
          and ex.exam_id = sty.exam_id
          and ex.dept_id = d.dept_id
          and ex.exam_status != 'CA'
          and sty.imgsty_status = 'A'
          and sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
          and imgser_status = 'A' and imgserl_status = 'A'
          and modality not in ('KO', 'SR') and sopclass_uid != '1.2.840.10008.5.1.4.1.1.88.33'
          and (series_desc is null or series_desc not like '%:-q%')
          and imgserl_imgstr_id = imgstr.imgstr_id and imgstr_imgsys_id = 2
          and imgserl_status = 'A'
          and ( not exists (select 1
        from iimdb_rch00_repl.dbo.EXAM ex2, iimdb_rch00_repl.dbo.EXAM_IDENTIFIER exid2, iimdb_rch00_repl.dbo.IMG_STUDY sty2,
          iimdb_rch00_repl..department d2, iimdb_rch00_repl..img_series imgser2, iimdb_rch00_repl..img_series_location imgserl2, iimdb_rch00_repl.dbo.IMG_STORE imgstr2
        where
        ex2.exam_id=ex.exam_id
        and ex2.exam_id = exid2.exam_id
          and examid_type_code = 'EPIC_ACCESSION_NBR'
          and ex2.exam_id = sty2.exam_id
          and ex2.dept_id = d2.dept_id
          and ex2.exam_status != 'CA'
          and sty2.imgsty_status = 'A'
          and sty2.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
          and imgser_status = 'A' and imgserl_status = 'A'
          and imgser2.series_uid = imgser.series_uid
          and imgserl_imgstr_id = imgstr2.imgstr_id and imgstr_imgsys_id = 1 )
          or exists (select 1
        from iimdb_rch00_repl.dbo.EXAM ex2, iimdb_rch00_repl.dbo.EXAM_IDENTIFIER exid2, iimdb_rch00_repl.dbo.IMG_STUDY sty2,
          iimdb_rch00_repl..department d2, iimdb_rch00_repl..img_series imgser2, iimdb_rch00_repl..img_series_location imgserl2, iimdb_rch00_repl.dbo.IMG_STORE imgstr2
        where
        ex2.exam_id=ex.exam_id
        and ex2.exam_id = exid2.exam_id
          and examid_type_code = 'EPIC_ACCESSION_NBR'
          and ex2.exam_id = sty2.exam_id
          and ex2.dept_id = d2.dept_id
          and ex2.exam_status != 'CA'
          and sty2.imgsty_status = 'A'
          and sty2.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
          and imgser_status = 'A' and imgserl_status = 'A'
          and imgser2.series_uid = imgser.series_uid
          and imgserl2.imgserl_image_count != imgserl.imgserl_image_count
          and imgserl_imgstr_id = imgstr2.imgstr_id and imgstr_imgsys_id = 1
        )
          )


        select ' MORE in MIDIA'   as 'dataset_name',
        imgserl.imgserl_image_count as  serl_img_count, *
        from iimdb_rch00_repl.dbo.EXAM ex, iimdb_rch00_repl.dbo.EXAM_IDENTIFIER exid, iimdb_rch00_repl.dbo.IMG_STUDY sty,
          iimdb_rch00_repl..department d, iimdb_rch00_repl..img_series imgser, iimdb_rch00_repl..img_series_location imgserl, iimdb_rch00_repl.dbo.IMG_STORE imgstr
        where
        ex.exam_id=@exam_id
        and ex.exam_id = exid.exam_id
          and examid_type_code = 'EPIC_ACCESSION_NBR'
          and ex.exam_id = sty.exam_id
          and ex.dept_id = d.dept_id
          and ex.exam_status != 'CA'
          and sty.imgsty_status = 'A'
          and sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
          and imgser_status = 'A' and imgserl_status = 'A'
          and modality not in ('KO', 'SR') and sopclass_uid != '1.2.840.10008.5.1.4.1.1.88.33'
          and (series_desc is null or series_desc not like '%:-q%')
          and imgserl_imgstr_id = imgstr.imgstr_id and imgstr_imgsys_id = 1
          and ( not exists (select 1
        from iimdb_rch00_repl.dbo.EXAM ex2, iimdb_rch00_repl.dbo.EXAM_IDENTIFIER exid2, iimdb_rch00_repl.dbo.IMG_STUDY sty2,
          iimdb_rch00_repl..department d2, iimdb_rch00_repl..img_series imgser2, iimdb_rch00_repl..img_series_location imgserl2, iimdb_rch00_repl.dbo.IMG_STORE imgstr2
        where
        ex2.exam_id=ex.exam_id
        and ex2.exam_id = exid2.exam_id
          and examid_type_code = 'EPIC_ACCESSION_NBR'
          and ex2.exam_id = sty2.exam_id
          and ex2.dept_id = d2.dept_id
          and ex2.exam_status != 'CA'
          and sty2.imgsty_status = 'A'
          and sty2.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
          and imgser_status = 'A' and imgserl_status = 'A'
          and imgser2.series_uid = imgser.series_uid
          and imgserl_imgstr_id = imgstr2.imgstr_id and imgstr_imgsys_id = 2 )
          or exists (select 1
        from iimdb_rch00_repl.dbo.EXAM ex2, iimdb_rch00_repl.dbo.EXAM_IDENTIFIER exid2, iimdb_rch00_repl.dbo.IMG_STUDY sty2,
          iimdb_rch00_repl..department d2, iimdb_rch00_repl..img_series imgser2, iimdb_rch00_repl..img_series_location imgserl2, iimdb_rch00_repl.dbo.IMG_STORE imgstr2
        where
        ex2.exam_id=ex.exam_id
        and ex2.exam_id = exid2.exam_id
          and examid_type_code = 'EPIC_ACCESSION_NBR'
          and ex2.exam_id = sty2.exam_id
          and ex2.dept_id = d2.dept_id
          and ex2.exam_status != 'CA'
          and sty2.imgsty_status = 'A'
          and sty2.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
          and imgser_status = 'A' and imgserl_status = 'A'
          and imgser2.series_uid = imgser.series_uid
          and imgserl2.imgserl_image_count != imgserl.imgserl_image_count
          and imgserl_imgstr_id = imgstr2.imgstr_id and imgstr_imgsys_id = 2 )
          )


        select 'MIDIA'    as 'dataset_name', *
        from iimdb_rch00_repl.dbo.EXAM ex, iimdb_rch00_repl.dbo.EXAM_IDENTIFIER exid, iimdb_rch00_repl.dbo.IMG_STUDY sty,
          iimdb_rch00_repl..department d, iimdb_rch00_repl..img_series imgser, iimdb_rch00_repl..img_series_location imgserl, iimdb_rch00_repl.dbo.IMG_STORE imgstr
        where
        ex.exam_id=@exam_id
        and ex.exam_id = exid.exam_id
          and examid_type_code = 'EPIC_ACCESSION_NBR'
          and ex.exam_id = sty.exam_id
          and ex.dept_id = d.dept_id
          and ex.exam_status != 'CA'
          and sty.imgsty_status = 'A'
          and sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
          and imgser_status = 'A' and imgserl_status = 'A'
          and modality not in ('KO', 'SR') and sopclass_uid != '1.2.840.10008.5.1.4.1.1.88.33'
          and (series_desc is null or series_desc not like '%:-q%')
          and imgserl_imgstr_id = imgstr.imgstr_id and imgstr_imgsys_id = 1


        select 'QREADS'    as 'dataset_name', *
        from iimdb_rch00_repl.dbo.EXAM ex, iimdb_rch00_repl.dbo.EXAM_IDENTIFIER exid, iimdb_rch00_repl.dbo.IMG_STUDY sty,
          iimdb_rch00_repl..department d, iimdb_rch00_repl..img_series imgser, iimdb_rch00_repl..img_series_location imgserl, iimdb_rch00_repl.dbo.IMG_STORE imgstr
        where
        ex.exam_id=@exam_id
        and ex.exam_id = exid.exam_id
          and examid_type_code = 'EPIC_ACCESSION_NBR'
          and ex.exam_id = sty.exam_id
          and ex.dept_id = d.dept_id
          and ex.exam_status != 'CA'
          and sty.imgsty_status = 'A'
          and sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
          and imgser_status = 'A' and imgserl_status = 'A'
          and modality not in ('KO', 'SR') and sopclass_uid != '1.2.840.10008.5.1.4.1.1.88.33'
          and (series_desc is null or series_desc not like '%:-q%')
          and imgserl_imgstr_id = imgstr.imgstr_id and imgstr_imgsys_id = 2
          and imgserl.last_action_time = (select max(sl2.last_action_time)
                                                                                    from img_series_location sl2
                                                                                    join img_store st2 on sl2.imgserl_imgstr_id = st2.imgstr_id
                                                                                  where imgserl.imgserl_imgser_id = sl2.imgserl_imgser_id
                                                                                    and imgstr.imgstr_imgsys_id = st2.imgstr_imgsys_id
                                                                                    and sl2.imgserl_status = 'A')


        select ' MORE in QREADS'   as 'dataset_name',
        imgserl.imgserl_image_count as  serl_img_count, *
        from iimdb_rch00_repl.dbo.EXAM ex, iimdb_rch00_repl.dbo.EXAM_IDENTIFIER exid, iimdb_rch00_repl.dbo.IMG_STUDY sty,
          iimdb_rch00_repl..department d, iimdb_rch00_repl..img_series imgser, iimdb_rch00_repl..img_series_location imgserl, iimdb_rch00_repl.dbo.IMG_STORE imgstr
        where
        ex.exam_id=@exam_id
        and ex.exam_id = exid.exam_id
          and examid_type_code = 'EPIC_ACCESSION_NBR'
          and ex.exam_id = sty.exam_id
          and ex.dept_id = d.dept_id
          and ex.exam_status != 'CA'
          and sty.imgsty_status = 'A'
          and sty.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
          and imgser_status = 'A' and imgserl_status = 'A'
          and modality not in ('KO', 'SR') and sopclass_uid != '1.2.840.10008.5.1.4.1.1.88.33'
          and (series_desc is null or series_desc not like '%:-q%')
          and imgserl_imgstr_id = imgstr.imgstr_id and imgstr_imgsys_id = 2
          and ( not exists (select 1
        from iimdb_rch00_repl.dbo.EXAM ex2, iimdb_rch00_repl.dbo.EXAM_IDENTIFIER exid2, iimdb_rch00_repl.dbo.IMG_STUDY sty2,
          iimdb_rch00_repl..department d2, iimdb_rch00_repl..img_series imgser2, iimdb_rch00_repl..img_series_location imgserl2, iimdb_rch00_repl.dbo.IMG_STORE imgstr2
        where
        ex2.exam_id=ex.exam_id
        and ex2.exam_id = exid2.exam_id
          and examid_type_code = 'EPIC_ACCESSION_NBR'
          and ex2.exam_id = sty2.exam_id
          and ex2.dept_id = d2.dept_id
          and ex2.exam_status != 'CA'
          and sty2.imgsty_status = 'A'
          and sty2.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
          and imgser_status = 'A' and imgserl_status = 'A'
          and imgser2.series_uid = imgser.series_uid
          and imgserl_imgstr_id = imgstr2.imgstr_id and imgstr_imgsys_id = 1 )
          or exists (select 1
        from iimdb_rch00_repl.dbo.EXAM ex2, iimdb_rch00_repl.dbo.EXAM_IDENTIFIER exid2, iimdb_rch00_repl.dbo.IMG_STUDY sty2,
          iimdb_rch00_repl..department d2, iimdb_rch00_repl..img_series imgser2, iimdb_rch00_repl..img_series_location imgserl2, iimdb_rch00_repl.dbo.IMG_STORE imgstr2
        where
        ex2.exam_id=ex.exam_id
        and ex2.exam_id = exid2.exam_id
          and examid_type_code = 'EPIC_ACCESSION_NBR'
          and ex2.exam_id = sty2.exam_id
          and ex2.dept_id = d2.dept_id
          and ex2.exam_status != 'CA'
          and sty2.imgsty_status = 'A'
          and sty2.imgsty_id = imgser_imgsty_id and imgser_id = imgserl_imgser_id
          and imgser_status = 'A' and imgserl_status = 'A'
          and imgser2.series_uid = imgser.series_uid
          and imgserl2.imgserl_image_count != imgserl.imgserl_image_count
          and imgserl_imgstr_id = imgstr2.imgstr_id and imgstr_imgsys_id = 1 )
          )


    `;

    // fetch(encodeURI(this.endpoint_sql_prefix + Counts_status_query), {})
    //   .then(response => {
    //     if (response.status !== 200) {
    //       return this.setState({
    //         placeholder: "Something went wrong in getting data"
    //       });
    //     }
    //     console.log("MULTI GRID DATA", response);
    //     return response.json();
    //   })

    fetch(
      'https://iasq1mr2:8081/exsql',

      {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dbserver: 'iimsRepl',
          sqltype: 'customSQL',
          sqltext: Counts_status_query,
        }),
      }
    )
      .then((response) => {
        if (response.status !== 200) {
          return this.setState({
            placeholder: 'Something went wrong in getting data',
          });
        }
        return response.json();
      })
      .then((data) => {
        console.info('Sending Message ...');
        console.log('multi-grid-data', data);
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

  examidChange = (event) => {
    let examid_sub = this.state.exam_id;
    console.log(examid_sub);

    this.onRefreshPINEStatus(examid_sub);
  };

  accnChange = (event) => {
    let examid_sub =
      "(select min(exam_id) from iimdb_rch00_repl..EXAM_IDENTIFIER eid where eid.examid_type_code = 'ACCESSION_NBR' and eid.examid_value = '" +
      this.state.accn +
      "') ";

    console.log(examid_sub);

    this.onRefreshPINEStatus(examid_sub);
  };

  render() {
    return this.state.columns_loaded ? (
      <React.Fragment>
        <Navbar />
        <div
          className="container-fluid "
          style={{ width: '90%', paddingTop: '65px' }}
        >
          <div
            className="form-group "
            style={{ dislplay: 'inline-block' }}
            width="200px"
          >
            <label>
              Exam ID
              <input
                className="form-control-inline ml-4"
                type="text"
                id="pat_examid"
                placeholder="IIMS Exam Id..."
                onChange={(event) => {
                  console.log(
                    'EXAMID New value:',
                    event.target.value.replace(/\D/g, '')
                  );
                  this.setState({
                    exam_id: event.target.value.replace(/\D/g, ''),
                  });
                }}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    this.examidChange();
                  }
                }}
              ></input>
            </label>
          </div>
          <label>MultiResults</label>
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
