import sys
import os
import argparse
from sys import platform as _platform
from pathlib import Path, PureWindowsPath
from datetime import datetime, timezone
import json
import urllib3
import shutil
import mmap
import struct
import glob
import uuid
from ecwUtil import PatientDocument

DEBUG=True

class dotdict(dict):
    """dot.notation access to dictionary attributes"""
    __getattr__ = dict.get
    __setattr__ = dict.__setitem__
    __delattr__ = dict.__delitem__

def utc_to_local(utc_dt):
    return utc_dt.replace(tzinfo=timezone.utc).astimezone(tz=None)

def process_document(request_json):
   global DEBUG

   scannedby = "Korlakunta, Siva"
   scannedbyid = 9121
  
   processed_input = {}

   processed_input['file_operation'] = request_json.get('fileop')
   processed_input['dest_docutype'] = request_json.get('docutype')           
   processed_input['file_category'] = request_json.get('filecategory')
   processed_input['full_file_path'] = request_json.get('filename')
   processed_input['dest_filename'] =  request_json.get('renameto')
   processed_input['dest_filedate'] = request_json.get('filedate')[:10]     
   processed_input['selected_patient_id'] = request_json.get('patientid')
   processed_input['selected_patient_name'] =  request_json.get('patientname')
   processed_input['op_context'] = request_json.get('context')  

   processed_input['ecw_encid'] = request_json.get('ecw_encid')
   processed_input['apex_docid'] = request_json.get('apexdocid')
   processed_input['ecw_docid'] = request_json.get('ecwdocid') 

   processed_input['dest_pagenum'] = request_json.get('pagenum')
   processed_input['dest_docupages'] = request_json.get('docupages')
 
   processed_input['dest_renameto'] = request_json.get('renameto')
   processed_input['dest_actiondesc'] = request_json.get('actiondesc')
   processed_input['doc_ecwfilename'] = request_json.get('ecwfilename')                 

   processed_input['apex_docid'] = -1
   processed_input['ecw_docid'] = -1   

   if processed_input['apex_docid'] == None:
       processed_input['apex_docid'] = -100

   if processed_input['ecw_docid'] == None:
       processed_input['ecw_docid'] = -1  

   if processed_input['ecw_encid'] == None :        
       processed_input['ecw_encid'] = 0

   if processed_input['dest_docutype'] ==None :
       processed_input['dest_docutype'] = ''

   if (processed_input['dest_docutype'].lower() == "linq report"  or processed_input['dest_docutype'].lower() == "linq ql") :
        processed_input['file_category'] = "RTHMLR"

   if (processed_input['dest_docutype'].lower() == "mcot daily"  or processed_input['dest_docutype'].lower() == "mcot report") :
        processed_input['file_category'] = "RTHMMCOT"        

   if (processed_input['dest_docutype'].lower() == "pm remote ql" ) :
        processed_input['file_category'] = "RTHMPM"

   if (processed_input['dest_docutype'].lower() == "event report" ) :
        processed_input['file_category'] = "RTHMWEVENT" 


   print("INPUT:",processed_input)               

   if 'rename' in processed_input['file_operation']:
       pass
       target_full_file_name = ''
       #print(processed_input['full_file_path'])
       src_dirname = os.path.dirname(processed_input['full_file_path'])
       src_base, src_extension = os.path.splitext(processed_input['full_file_path'])
       #print(src_dirname, src_extension)

       #print(processed_input['dest_filename'])
       if processed_input['selected_patient_id'] != None and processed_input['selected_patient_id'] != 0 :
            target_full_file_name = os.path.join(src_dirname, processed_input['dest_filename'].strip() + "_" + str(processed_input['selected_patient_id'])  + src_extension) 
       else:
            target_full_file_name = os.path.join(src_dirname, processed_input['dest_filename'].strip() + src_extension)            

       os.rename(processed_input['full_file_path'], target_full_file_name)       
       print ("Call rename: ", processed_input['full_file_path'], target_full_file_name) 

       request_json['new_name'] = target_full_file_name                     

       jsonPS = {
                'responsetype': 'DONE',
                'message' : 'Completed: {0}'.format(processed_input['file_operation']),
                'inputjson': request_json
       }

       return json.dumps(jsonPS)

       #return JsonResponse(jsonPS, safe=False)

   if 'uploademr' in processed_input['file_operation']:
       pass
       print(processed_input['full_file_path'])

#    if 'uploademr' in file_operation or 'loadindocbase' in file_operation :
#        pass
#    else:
#        jsonPS = {
#            'responsetype': 'ERROR',
#            'message' : 'Invalid operation: {0}'.format(file_operation),
#            'inputjson': request_json
#            }
#        return JsonResponse(jsonPS, safe=False)


   dirpath = ""
   now = datetime.now()
   foldername_year=now.year
   foldername_date=datetime.today().strftime('%m%d%Y')
   dirpath = "mobiledoc/" + str(foldername_year) + "/" + foldername_date

   UniqueFileName = str(uuid.uuid4()).upper()
   UniqueFileName = str(processed_input['selected_patient_id']) + "_" + UniqueFileName
   fileExtension = os.path.splitext(processed_input['full_file_path'])[1] 
   justFileName = processed_input['dest_filename'].strip()

   print("READY FOR ACTION",  processed_input['file_operation'], dirpath, justFileName + fileExtension,  UniqueFileName )
   #"EMR/" +

   jsonPS=''  
   inTesting = True
   patDoc = PatientDocument()

   if 'uploademr' in processed_input['file_operation']: 

       if processed_input['apex_docid'] == -1 :

         if ( processed_input['file_category'] == "EOB" or processed_input['file_category'] == "OPMT" or
              processed_input['file_category'] == "HOSP" ):
           print ("IN APEXDOC")
           try: 

                #    apexftp =  PatientDocument.getECWFtp("staff", "qzwxec")
                #    PatientDocument.upload_document(apexftp , "EMR/" + str(selected_patient_id) + "_" +justFileName + fileExtension,  translatePath(full_file_path))
                #    PatientDocument.upload_document(apexftp , "EMR/" + UniqueFileName + fileExtension,  translatePath(full_file_path))

               patDoc.upload_apex_document(src_filepath = processed_input['full_file_path'] , 
                                          destfilename = str(processed_input['selected_patient_id']) + "_" + justFileName + fileExtension)

               scannedby = "Korlakunta, Siva"
               print ("APEXDOC GETTING SQL TEXT")               
               sqlText = patDoc.getApexSQL(
                                processed_input['selected_patient_id'], justFileName, 
                                str(processed_input['selected_patient_id']) + "_" + justFileName + fileExtension  , 
                                processed_input['file_category'],
                                scannedby )

               print("SQL Text: ", sqlText)
               patDoc.executeEcwSQL(sqlText)

                #    apexDocSQL = (""" exec apex..mntApexDocument 
                #            @docid = null,
                #            @patientid = {0} , 
                #            @docname = '{1}',
                #            @fileName = '{2}',
                #            @foldername = 'EMR' ,
                #            @dirpath = 'd:/ApexDocs/' , 
                #            @scannedby = null , 
                #            @depositbatchid = '{3}', 
                #            @delflag  = 0 
                #         """).format(selected_patient_id, justFileName, str(selected_patient_id) + "_" + justFileName + fileExtension,  '')

                #    urlstring= APIHOSTURL + 'exsql?dbserver=ecwSQL&sqltype=customSQL&sqltext='
                #    urlstring = urlstring + quote(apexDocSQL, safe=':/?*=\'')
                #    print(urlstring)
                #    jsonPS = execRestQueryAsJsonString(urlstring)
                #    jsonPS.update({'responsetype' : 'DONE'})
           except Exception as err: 
               print(err)
               jsonPS = {
                   'responsetype': 'ERROR',
                   'message' : 'Invalid operation: {0}'.format(processed_input['file_operation'])
                   }

               json.dumps(jsonPS)

               #return JsonResponse(jsonPS, safe=False)


       if processed_input['ecw_docid'] == -1 :
           print ("IN ECW DOC")
           try:

              #PatientDocument.upload_document(ftp , dirpath + "/" + UniqueFileName + fileExtension,  translatePath(full_file_path))
              print(dirpath + "/" + UniqueFileName + fileExtension,  processed_input['full_file_path'])

              fullFileName = UniqueFileName + fileExtension  
              customFileName = justFileName
              scannedby = "Korlakunta, Siva"
              scannedbyid = 9121

              scandatetime = datetime.now().strftime("%m/%d/%Y %H:%M:%S")
              review = 0
              reviewerid = 0
              reviewername = ''
              processed_input['selected_folder_id'] = 0
              print ("FILE CAtegory: ", processed_input['file_category'])

              if (processed_input['file_category'] == "EOB"  or processed_input['file_category'] == "OPMT" or processed_input['file_category'] == "HOSP" ):
                    reviewerid = 17811 #Laurie Walker
                    reviewername = "Walker, Laurie" #Laurie Walker

                    processed_input['selected_patient_id'] = str(PhyquestBillingID)
                    deposit_batch_id = os.path.splitext(processed_input['dest_filename'])[0] 
                    processed_input['dest_filename'] = datetime.today().strftime('%Y-%m-%d') + ' ' + os.path.splitext(dest_filename)[0] 

                    if (processed_input['file_category'] == "HOSP"):
                        processed_input['selected_folder_id'] = 113
                        processed_input['dest_filename'] = processed_input['dest_filename'] + " Hospital Sheets"

                    if (processed_input['file_category'] == "EOB" or processed_input['file_category'] == "OPMT" ):
                        processed_input['selected_folder_id'] = 106                      

                    if (processed_input['file_category'] == "EOB"):
                        processed_input['selected_folder_id'] = 106  
                        reviewerid = 17811 #Laurie Walker
                        reviewername = "Walker, Laurie" #Laurie Walker                             

                    if (processed_input['file_category'] == "OPMT"):
                        processed_input['selected_folder_id'] = 106   
                        reviewerid = 112 #Hema
                        reviewername = "KORLAKUNTA, HEMA LATHA"                        
                        processed_input['selected_patient_id'] = str(ApexBillingID)
                        deposit_batch_id = os.path.splitext(dest_filename)[0] 
                        processed_input['dest_filename'] = datetime.today().strftime('%Y-%m-%d') + ' ' + os.path.splitext(dest_filename)[0]                                                                

              elif (processed_input['file_category'] == "TREADMILL"  or processed_input['file_category'] == "EKG" ):
                    reviewerid = 112 #Hema
                    reviewername = "KORLAKUNTA, HEMA LATHA"
                    review = 2
                    processed_input['selected_folder_id']=152
                    customFileName = justFileName
                    fullFileName = UniqueFileName + fileExtension

              elif (processed_input['file_category'] == "RTHMLR" or processed_input['file_category'] == "RTHMPM"  or  processed_input['file_category'] == "RTHMMCOT"  or  processed_input['file_category'] == "RTHMWEVENT"):
                reviewerid = 122; #Hema
                reviewername = "KORLAKUNTA, HEMA LATHA" #KORLAKUNTA, HEMA
                #customFileName = dest_filedate.strftime("%Y-%m-%d") + ' ' + justFileName.strip()
                customFileName = processed_input['dest_filename'].strip()             
             
                if (processed_input['file_category'] == "RTHMLR"):
                    processed_input['selected_folder_id'] = 154
                if (processed_input['file_category'] == "RTHMPM"):
                    processed_input['selected_folder_id'] = 114
                if (processed_input['file_category'] == "RTHMMCOT"):
                    processed_input['selected_folder_id'] = 119     
                if (processed_input['file_category'] == "RTHMWEVENT" ):
                     processed_input['selected_folder_id'] = 174

              elif (processed_input['file_category'] == "ECHO" or processed_input['file_category'] == "CAROTID"  or  
                   processed_input['file_category'] == "LED"  or  processed_input['file_category'] == "NUCLEAR"):

                    reviewerid = 122; #Hema
                    review = 1                    
                    reviewername = "KORLAKUNTA, HEMA LATHA" #KORLAKUNTA, HEMA
                    #customFileName = dest_filedate.strftime("%Y-%m-%d") + ' ' + justFileName.strip()
                    customFileName = processed_input['dest_filename'].strip()             
                    processed_input['selected_folder_id'] = 107                                   
              else: 
                  pass

              print("Selected Category: ", processed_input['selected_patient_id'], 
                    processed_input['file_category'],  processed_input['selected_folder_id'],
                    processed_input['dest_filename'], reviewerid, reviewername) 
              print ("ECWDOC GETTING SQL TEXT")
              sqlText = ''
              sqlText = patDoc.getEcwDocSQL(processed_input['selected_patient_id'], processed_input['ecw_encid'], 
                            dirpath, processed_input['selected_folder_id'], fullFileName, 
                            customFileName, reviewerid, reviewername, review, scannedbyid, scannedby, scandatetime )      
                                         
              print("SQL Text: ", sqlText)

              patDoc.upload_ecw_document(src_filepath = processed_input['full_file_path'] , 
                                        dirpath = dirpath, 
                                        UniqueFileName = UniqueFileName) 

              patDoc.executeEcwSQL(sqlText)                                        

              jsonPS = {}
              jsonPS.update({'responsetype' : 'DONE'})

              target_full_file_name = ''
              if  target_full_file_name == '' :
                print(processed_input['full_file_path'])
                src_dirname = os.path.dirname(processed_input['full_file_path'])
                src_base, src_extension = os.path.splitext(processed_input['full_file_path'])
                print(src_dirname, src_extension)
                if processed_input['selected_patient_id'] != None :
                        target_full_file_name = os.path.join(src_dirname, processed_input['dest_filename'] + "_" + str(processed_input['selected_patient_id']) + "_DELETED" + src_extension) 
                else:
                        target_full_file_name = os.path.join(src_dirname, processed_input['dest_filename'] + "_DELETED" + src_extension)               

              os.rename(processed_input['full_file_path'], target_full_file_name)

              jsonPS.update({'new_name' : target_full_file_name})  
              request_json['new_name'] = target_full_file_name                         

              jsonPS = {
                'responsetype': 'DONE',
                'message' : 'Completed: {0}'.format(processed_input['file_operation']),
                'inputjson': request_json
              }
              return json.dumps(jsonPS)

           except Exception as err:
               print(err)
               jsonPS = {
                   'responsetype': 'ERROR',
                   'message' : 'Invalid operation: {0}'.format(processed_input['file_operation'])
                   }
               return json.dumps(jsonPS)

   print(jsonPS)
   return json.dumps({'responsetype': 'DONE', 'message': jsonPS})

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
    parser.add_argument("-dbserv", help="args", default=None)
    parser.add_argument("-sql", help="sql", default=None)
    parser.add_argument("-p", "--pid", type=int, help="pid", default=None)
    args = parser.parse_args()

    command = None
    hostname = None
    pid = None
    dbserver = ''
    sqlText = ''
    args_json_text= ''
    arg_json = {}


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
    if args.argjson:
        args_json_text  = args.argjson        
    if args.sql:
        sqlText = args.sql


    try:

        try :
            #print ("JSON-TEXT Received: ", args_json_text)
            args_json = json.loads(args_json_text) 
            #print ("JSON Received: ", args_json)
        except Exception as ex:
             print("Converting text to Json :" , ex)
             sys.exit(0)

        if command.strip() == 'testecwdb':
            if DEBUG:
                print("Executing testecwdb")

            ptdoc = PatientDocument()
            ptdoc.executeEcwSQL(" set rowcount 10 select name, patientid from apex..vPatient ")

            sys.exit(0)

        if command.strip() == 'emrupload':
            if DEBUG:
                print("Executing emrupload")

            process_document(args_json)       

            # ptdoc = PatientDocument()
            # ptdoc.upload_apex_document(src_filepath = arg_filepath , destfilename = "2021-03-01 ECHO")

            sys.exit(0)

        if command.strip() == 'apexupload':
            if DEBUG:
                print("Executing emrupload")

            process_document(args_json)      

            # ptdoc = PatientDocument()
            # ptdoc.upload_apex_document(src_filepath = arg_filepath , destfilename = "ENHCHO")
                            
            sys.exit(0)            

        if command.strip() == 'renamemove':
            if DEBUG:
                print("Executing renamemove")            
            #print(parseDicom(arguments))
            sys.exit(0)

        if command.strip() == 'rename':
            if DEBUG:
                print("Executing rename", args_json)     

            process_document(args_json)        
            #print(parseDicom(arguments))
            sys.exit(0)

      
    except Exception as e:
        print(e)
        pass


if __name__ == "__main__":
    DEBUG = True
    main()