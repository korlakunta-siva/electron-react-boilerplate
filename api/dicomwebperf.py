import sys
import os
import argparse
from sys import platform as _platform
from pathlib import Path, PureWindowsPath
import pydicom
import json
import urllib3
import shutil
import mmap
import struct
import glob

import splunklib.client as client
import splunklib.results as results

DEBUG = False


def examDicomInfo(sqlText):
    global DEBUG
    #print("Started getexamDICOMInfo: " + examid)
    urllib3.disable_warnings()
    http = urllib3.HTTPSConnectionPool('iasq1mr2',
                                       port=8081,
                                       cert_reqs='CERT_NONE',
                                       assert_hostname=False)

    #     pat_exams_sql = " declare @accn varchar(20) select @accn = '" + examid + "'" + '''
    #  select serl.imgserl_id, ser.imgser_status, ser.imgser_image_count, serl.imgserl_status, ser.modality, str.store_name, serl.series_file_name, serl.last_action_time,
    #  exm.patient_cmrn, sty.acq_start_time, ser.sopclass_uid, ser.series_uid, sty.study_uid
    # FROM iimdb_rch01_prod..EXAM exm, iimdb_rch01_prod..EXAM_IDENTIFIER eid , iimdb_rch01_prod..IMG_STUDY sty,
    #   iimdb_rch01_prod..IMG_SERIES ser, iimdb_rch01_prod..IMG_SERIES_LOCATION serl, iimdb_rch01_prod..IMG_STORE str
    #  WHERE exm.exam_id = sty.exam_id and sty.imgsty_id = ser.imgser_imgsty_id
    #  and ser.imgser_id = serl.imgserl_imgser_id and serl.imgserl_imgstr_id = str.imgstr_id and str.imgstr_imgsys_id = 2 and  sty.exam_id = eid.exam_id and eid.examid_type_code = 'ACCESSION_NBR' and eid.examid_value = @accn'''

    rows = []
    try:
        #print(pat_exams_sql)
        #print(sqlText)
        #urlstring = "https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=patientsToPurge&param1=5"
        #urlstring = "https://iasq1mr2:8081/exsql?dbserver=iimsProd&sqltype=customSQL&sqltext=" + pat_exams_sql
        urlstring = "https://iasq1mr2:8081/exsql?dbserver=" + sqlText

        #print(urlstring)
        r = http.request('GET', urlstring)
        r.release_conn()
        data_frame = json.loads(r.data.decode('utf-8'))
        rows = json.loads(data_frame['frame0'])['rows']
        filePathsArr = []
        for serpath in rows:
            #print(serpath['store_name'] + "\\" + serpath['series_file_name'])
            if (serpath['imgser_status'] == 'A'
                    or (serpath['imgser_status'] != 'D'
                        and serpath['modality'] == 'KO')):
                pass
            else:
                continue
            filePathsArr.append(serpath['store_name'] + "\\" +
                                serpath['series_file_name'])

        if DEBUG:
            print("ToParse:", filePathsArr)
        return (listCISparseDicom(filePathsArr, rows))

        #return rows

    except Exception as ex:
        print('Error cisParse. :  %s ' % (ex))
    finally:
        pass

    #print(rows)
    sys.exit(0)


def splunkSearch():

    service = client.connect(host='splunk.mayo.edu',
                             username='slk02',
                             password='Sneha21A',
                             app='imsu__all_index')

    # Run an export search and display the results using the results reader.

    # Set the parameters for the search:
    # - Search everything in the last hour
    # - Run a normal-mode search
    # - Search internal index
    kwargs_export = {
        "earliest_time": "-1h",
        "latest_time": "now",
        "search_mode": "normal"
    }
    searchquery_export = "search QREADS"

    exportsearch_results = service.jobs.export(searchquery_export,
                                               **kwargs_export)

    # Get the results and display them using the ResultsReader
    reader = results.ResultsReader(exportsearch_results)
    for result in reader:
        if isinstance(result, dict):
            print("Result: %s" % result)
        elif isinstance(result, results.Message):
            # Diagnostic messages may be returned in the results
            print("Message: %s" % result)

    # Print whether results are a preview from a running search
    print("is_preview = %s " % reader.is_preview)

    # # Print installed apps to the console to verify login
    # for app in service.apps:
    #     print(app.name)

    # searchquery_normal = "search imsu__* | head 10"
    # kwargs_normalsearch = {"exec_mode": "normal"}

    # job = service.jobs.create(searchquery_normal, **kwargs_normalsearch)

    # # A normal search returns the job's SID right away, so we need to poll for completion
    # while True:
    #     while not job.is_ready():
    #         pass
    #     stats = {
    #         "isDone": job["isDone"],
    #         "doneProgress": float(job["doneProgress"]) * 100,
    #         "scanCount": int(job["scanCount"]),
    #         "eventCount": int(job["eventCount"]),
    #         "resultCount": int(job["resultCount"])
    #     }

    #     status = ("\r%(doneProgress)03.1f%%   %(scanCount)d scanned   "
    #               "%(eventCount)d matched   %(resultCount)d results") % stats

    #     sys.stdout.write(status)
    #     sys.stdout.flush()
    #     if stats["isDone"] == "1":
    #         sys.stdout.write("\n\nDone!\n\n")
    #         break

    # # Get the results and display them
    # for result in results.ResultsReader(job.results()):
    #     print(result)

    # job.cancel()
    # sys.stdout.write('\n')


def main():
    global DEBUG

    parser = argparse.ArgumentParser(
        description="Python Local OS Commands Runner")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("-v", "--verbose", action="store_true")
    group.add_argument("-q", "--quiet", action="store_true")
    parser.add_argument("-cmd", help="command_to_run")
    parser.add_argument("-debug", help="command_to_run")
    parser.add_argument("-a", "--arg", help="args", default=None)
    parser.add_argument("-dbserv", help="args", default=None)
    parser.add_argument("-sql", help="sql", default=None)
    parser.add_argument("-p", "--pid", type=int, help="pid", default=None)
    args = parser.parse_args()

    command = None
    hostname = None
    pid = None
    dbserver = ''
    sqlText = ''

    if args.cmd:
        command = args.cmd
    if args.arg:
        arguments = args.arg
    if args.pid:
        pid = args.pid
    if args.debug:
        DEBUG = True
    if args.dbserv:
        dbserver = args.dbserv
    if args.sql:
        sqlText = args.sql

    try:

        if command.strip() == 'splunk':
            #print("parse -> path: " + str(arguments))
            #parseDicom(arguments)
            print('started splunk search')
            splunkSearch()
            #print(parseDicom(arguments))
            sys.exit(0)

        if command.strip() == 'cisparse':
            #print("parse -> path: " + str(arguments))
            #parseDicom(arguments)
            print(examDicomInfo(sqlText))
            #print(parseDicom(arguments))
            sys.exit(0)

        if command.strip() == 'parse':
            #print("parse -> path: " + str(arguments))
            #parseDicom(arguments)
            print(parseDicom(arguments))
            sys.exit(0)

        if command.strip() == 'listCISparseDicom':
            #print("parse -> path: " + str(arguments))
            #parseDicom(arguments)
            print(parseDicom(arguments))
            sys.exit(0)

        if command.strip() == 'tounix':
            print("tounix ->  " + arguments)
            print(configureMountPoint(arguments))
            sys.exit(0)

        if command.strip() == 'towin':
            print("towin -> " + arguments)
            print(reverseMountPoints(arguments))
            sys.exit(0)

    except Exception as e:
        print(e)
        pass


if __name__ == "__main__":
    main()
