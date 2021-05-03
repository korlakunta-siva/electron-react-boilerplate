"C:\\Program Files\\Mayo Foundation\\QREADS\\Java\\jre1.8.0_161-64-Bit\\bin\\javaw.exe" -Djava.library.path="C:\\Program Files\\Mayo Foundation\\QREADS 5" -XX:SurvivorRatio=4 -XX:NewRatio=10 -Xms512M -Xmx2G -jar "C:\\Program Files\\Mayo Foundation\\QREADS 5\\QReadsApp.jar" environment=prod MODE=STANDALONE FILE="C:\\share\\Data\\testdata\\2-200-718\\13_IIMS48374740_1.2.840.10008.127011585384674569620456315532155189961_1.2.840.10008.227426026003653930219426723048205098588.img"

exec IIMSP_Lookup_Examlist_CMRN @patient_cmrn = 9966064
select \* from dcm_sop_class dsc where dsc.dsc_sopclass_uid = '1.2.840.10008.5.1.4.1.1.78.3'

        declare
    	@exam_id			int,
    @report_status          varchar(10),
    @online_status          tinyint,
    @archive_status         tinyint ,
    @cis_img_count     int,
    @midia_img_count     int,
    @midia_instance_count         int,
       @ret_status INT

    select @exam_id = 58785099

           exec @ret_status=dbo.iimsp_getimgcnt_status @exam_id,
            null,
            @online_status          OUTPUT,
            @archive_status         OUTPUT,
            @report_status          OUTPUT,
            @cis_img_count        OUTPUT,
            @midia_instance_count OUTPUT,
            @midia_img_count         OUTPUT

            select @exam_id as exam_id, @ret_status as ret_status, @online_status          ,
            @archive_status     as archive_status    ,
            @report_status       as report_status   ,
            @cis_img_count     as cis_img_count   ,
            @midia_instance_count as midia_instance_count ,
            @midia_img_count        as midia_img_count
