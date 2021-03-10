import sys
import os
import argparse
from sys import platform as _platform
from pathlib import Path, PureWindowsPath
import json
import urllib3
import shutil
import mmap
import struct
import glob

from ftplib import FTP
import io
import uuid
from datetime import datetime
import os
from os import listdir
from os.path import isfile, join
import certifi
import urllib
import json
import numpy as np
import pandas as pd
import ssl

DEBUG=True

class PatientDocument():

    def cdTree(self, ftparg, currentDir):
      global DEBUG        
      if currentDir != "":
        try:
            #ftparg.pwd()  
            #ftparg.dir()
            ftparg.cwd(currentDir)
            ftparg.cwd("/")
        except :
            self.cdTree(ftparg, "/".join(currentDir.split("/")[:-1]))
            ftparg.mkd(currentDir)
            ftparg.cwd("/")

    def getECWFtp(self, ftpuser, ftppass):  
        global DEBUG                 
        ftpServer = "192.168.1.17"
        ftpUser = ftpuser
        ftpPassword = ftppass

        ftp = FTP(ftpServer)
        ftp.login(user=ftpUser, passwd = ftpPassword) 
        return ftp

    def upload_document(self, ftparg ,  ftpdocpath, localfilepath):
        global DEBUG     
        if DEBUG :
             print ("Called upload_apex_document: ", ftpdocpath, localfilepath)

        #srchead, srctail = os.path.split(localfilepath)
        targethead, targettail = os.path.split(ftpdocpath)
        self.cdTree(ftparg, targethead)
        #print (localfilepath, ftpdocpath, sourcefile)
        #return
        sourcefile = open(localfilepath, 'rb')
        print ("READY TO FTP")
        if sourcefile :
            ftparg.storbinary('STOR "' + ftpdocpath  + '"', sourcefile)
        pass

    def upload_docbase_document(self, src_filepath, destfilename):
         global DEBUG        
         if DEBUG :
             print ("Called upload_docbase_document: ", src_filepath, destfilename)

         apexftp =  self.getECWFtp("staff", "qzwxec")
         fileExtension = os.path.splitext(src_filepath)[1] 
         srchead, srctail = os.path.split(src_filepath)

         full_file_path = os.path.join(src_filepath).replace("%20"," ")
         justFilename = datetime.today().strftime('%Y-%m-%d') + ' ' + os.path.splitext(destfilename)[0] 
         assignedFileName = "EMR/docbase/" + destfilename + fileExtension 

         if DEBUG :
            print ("Ready to FTP: ", assignedFileName ,  full_file_path)

         self.upload_document(apexftp , assignedFileName,  full_file_path)


    def upload_apex_document(self, src_filepath, destfilename):
         global DEBUG        
         if DEBUG :
             print ("Called upload_apex_document: ", src_filepath, destfilename)
         apexftp =  self.getECWFtp("staff", "qzwxec")
         fileExtension = os.path.splitext(src_filepath)[1] 
         srchead, srctail = os.path.split(src_filepath)

         full_file_path = os.path.join(src_filepath).replace("%20"," ")
         justFilename = datetime.today().strftime('%Y-%m-%d') + ' ' + os.path.splitext(destfilename)[0] 
         assignedFileName = "EMR/docbase/" + justFilename + fileExtension 

         if DEBUG :
            print ("Ready to FTP: ", assignedFileName ,  full_file_path)

         self.upload_document(apexftp , assignedFileName,  full_file_path)

    def upload_ecw_document(self, src_filepath, dirpath, UniqueFileName):
         global DEBUG
         if DEBUG :
             print ("Called upload_ecw_document: ", src_filepath, dirpath, UniqueFileName)

         ecwftp =  self.getECWFtp("doctor", "4DQQCB35ZCJG")
         fileExtension = os.path.splitext(src_filepath)[1] 
         srchead, srctail = os.path.split(src_filepath)

         full_file_path = os.path.join(src_filepath).replace("%20"," ")
         #justFilename = os.path.splitext(UniqueFileName)[0] 
         assignedFileName = dirpath + "/" + UniqueFileName + fileExtension 

         if DEBUG :
            print ("Ready to FTP: ", assignedFileName ,  full_file_path)

         self.upload_document(ecwftp , assignedFileName,  full_file_path)               


    def getEcwDocSQL (self, selected_patient_id, nEncounterID, dirpath, selected_folder_id, UniqueFileName_fileExtension,
                        justFileName, reviewerid, reviewername, review, scannedbyid, scannedby, scandatetime) :
        global DEBUG
        ptDocSQL =''
        ptDocSQL = (""" exec apex..mntPatientDocument 
            @patientid = {0} , 
            @encounterid = {1},
            @dirpath = '{2}',
            @documentclass = '{3}' ,
            @filename = '{4}' , 
            @customname = '{5}' , 
            @reviewerid = {6}, 
            @reviewername  = '{7}' , 
            @review  = {8},  
            @scannedbyid  = {9},  
            @scannedby  = '{10}' ,  
            @scandate = '{11}' ,
            @doc_type   = {12}
            """).format(selected_patient_id, nEncounterID, dirpath, selected_folder_id, UniqueFileName_fileExtension,
                        justFileName, reviewerid, reviewername, review, scannedbyid, scannedby,
                        scandatetime, selected_folder_id)
 
        return ptDocSQL

    def getApexSQL(self, selected_patient_id, justFileName_fileExtension,  deposit_batch_id, file_category, scannedby):
        global DEBUG     
        apexDocSQL = ""
        apexDocSQL = (""" exec apex..mntApexDocument 
        @docid = null,
        @patientid = {0} , 
        @docname = '{1}',
        @fileName = '{1}',
        @foldername = 'EOB' ,
        @dirpath = 'd:/ApexDocs/' , 
        @scannedby = '{2}' , 
        @depositbatchid = '{3}', 
        @delflag  = 0 
        """).format(selected_patient_id, justFileName_fileExtension,  scannedby, deposit_batch_id )

        return apexDocSQL


        # UniqueFileName = str(uuid.uuid4())
        # UniqueFileName = nPatientID + "_" + UniqueFileName

        srchead, srctail = os.path.split(filepath)


    def executeEcwSQL(self,sqlText):
        global DEBUG     

        ssl._create_default_https_context = ssl._create_unverified_context
        urllib3.disable_warnings()
        http = urllib3.HTTPSConnectionPool('192.168.21.199',
                                            port=8044,
                                            cert_reqs='CERT_NONE',
                                            assert_hostname=False)

        urlstring = "https://192.168.21.199:8044/exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext=" + sqlText

        if DEBUG:
            print("Executing SQL: " , urlstring)

        r = http.request('GET', urlstring)
        r.release_conn()
        data_frame = json.loads(r.data.decode('utf-8'))
        rows = json.loads(data_frame['frame0'])['rows']
        if DEBUG:
            print("Results: ", rows)

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
    parser.add_argument("-aj", "--argjson", help="args_json", default=None)
    parser.add_argument("-ecwsql", help="Ecw SQL", default=None)
    parser.add_argument("-fp",  help="filepath", default=None)    
    parser.add_argument("-p", "--pid", type=int, help="pid", default=None)
    args = parser.parse_args()

    command = None
    hostname = None
    pid = None
    dbserver = ''
    arg_sqlText = ''
    args_json_text= ''
    arg_filepath = ''
    arg_json = {}



    if args.debug:
        DEBUG = True

    if args.cmd:
        command = args.cmd
    if args.arg:
        arguments = args.arg
    if args.pid:
        pid = args.pid

    if args.argjson:
        args_json_text  = args.argjson        
    if args.ecwsql:
        arg_sqlText = args.ecwsql
    if args.fp:
        arg_filepath = args.fp        

    try :
        print ("Command: ", command)
        print ("File Path: ", arg_filepath)
        print ("SQL Text: ", arg_sqlText)
    except Exception as ex:
        pass

    try:

        if command.strip() == 'ptdocftp':
            if DEBUG:
                print("Executing ptdocftp")

            ptdoc = PatientDocument()
            ptdoc.upload_apex_document(src_filepath = arg_filepath , destfilename = "2021-03-01 ECHO")

            sys.exit(0)

        if command.strip() == 'apexdocftp':
            if DEBUG:
                print("Executing apexdocftp", arg_filepath)

            ptdoc = PatientDocument()
            ptdoc.upload_apex_document(src_filepath = arg_filepath , destfilename = "PB275")

            sys.exit(0)

        if command.strip() == 'ecwsql':
            if DEBUG:
              print("Executing eCWSQL")   

            ptdoc = PatientDocument()              
            ptdoc.executeEcwSQL(arg_sqlText)       
            sys.exit(0)

    except Exception as e:
        print(e)
        pass


if __name__ == "__main__":
    DEBUG = True
    main()