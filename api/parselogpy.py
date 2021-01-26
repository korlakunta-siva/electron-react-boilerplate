import os
import argparse
import datetime
import glob
import pandas as pd
import json
"""
USAGE:
log4j_parser.py some_log_file
"""

import sys
from collections import Counter

def generate_log_report(logfile):
    '''return'''

    r=[]  # list of log entries
    for line in logfile:
        l = len(r)
        if line.strip() == "":
            pass
        elif line[0] in " \t\n\l" and l>0:
            # append stack trace to the log entry
            r[l-1][len(r[l-1])-1] += " " + line.strip()
        else:
            m = line.strip().replace("\t", " ").split(" ",4)   # a list of up to 5 elements
                                            # timestamp - level - component - ...
                                            # may vary
            i = 0
            while i<len(m):
                if m[i] == "":
                    m.pop(i)
                else:
                    i += 1
            #print(m)
            r.append(m)
    return r

def parse_file(filename):

    file_events = []

    infile_name = r"c:\temp\r5087474_qreadsws-2021-01-22-14-55-47.log"
    #infile_name = r"c:\temp\R0301769_qreadsws-2021-01-22-09-44-09.log"
    infile_name = filename


    try:
        infile=open(infile_name,'r')
    except IOError:
        pass
        return file_events
        print ("You must specify a valid file to parse")
        sys.exit(1)

    # you can either import the generate_log_report
    # call it and receive a list of log entries (as a list of up to 5 elements)
    # or run this module via command line
    # here is an example, what you can do with the list of log file entries:



    log_report=generate_log_report(infile)


    if "MFLogon" in infile_name :
          for row in log_report:
            if "Setting MAYO_USER_NAME" in row[3]:
              event_time = row[0] + ' ' + row[1]
              event_desc = "Windows Logon -> User login "
              event_line =  row[3]

              #print(event_time, row)
              event_datetime = None
              try:
                event_datetime = datetime.datetime.strptime(event_time, '%m/%d/%Y %H:%M:%S.%f')
              except:
                try:
                  event_datetime = datetime.datetime.strptime(event_time, '%m/%d/%Y %H:%M:%S,%f')
                except:
                  try:
                    event_datetime = datetime.datetime.strptime(event_time, '%m/%d/%Y %H:%M:%S:%f')
                  except:
                    pass

              try :
                newrow = {
                  'event_at' : event_datetime,  'event_desc' : event_desc , 'event_source': filename, 'event_line' : event_line
                }
                file_events.append(newrow)
              except:
                pass
          return file_events
    # elif 'MayoDoc' in infile_name :
    #       return file_events

    elif 'EpicWarpDriveLauncher' in infile_name :
          for row in log_report:

            if len(row) <5 :
              continue

            if "StartHyperspace" in row[4]:

              event_time = row[0] + ' ' + row[1]
              event_desc = "Start EPIC "
              event_line =  row[4]

              #print(event_time, row)
              event_datetime = None
              try:
                event_datetime = datetime.datetime.strptime(event_time, '%m/%d/%Y %H:%M:%S.%f')
              except:
                try:
                  event_datetime = datetime.datetime.strptime(event_time, '%m/%d/%Y %H:%M:%S,%f')
                except:
                  try:
                    event_datetime = datetime.datetime.strptime(event_time, '%m/%d/%Y %H:%M:%S:%f')
                  except:
                    pass

              try :
                newrow = {
                  'event_at' : event_datetime,  'event_desc' : event_desc , 'event_source': filename, 'event_line' : event_line
                }
                file_events.append(newrow)
              except:
                pass
          return file_events
    else:
      pass


    #print("Done parsing")
    for row in log_report:

      # if "Server:414 - Started" in row[4]:
      #       print(event_time, "QREADS Webservice Started")
      event_desc = ""

      if len(row) >4  and  "Logged In User" in row[4]:
            event_time = row[0] + ' ' + row[1]
            event_desc = "QREADS LOG -> User logged in "

      if len(row) >4  and  "Incoming single instance launch data" in row[4]:
            event_time = row[0] + ' ' + row[1]
            event_desc =  "QREADS LOG -> EPIC Lauched Exam "

      if len(row) >4  and  "Startup Param Count (8)" in row[4]  and "SingleInstanceLaunch=EPIC" in row[4]:
            event_time = row[0] + ' ' + row[1]
            prevent_desc = "QREADS LOG -> EPIC Lauched Exam in New QREADS Instance"

      if len(row) >4  and  "Terminating QREADS Application" in row[4]:
            event_time = row[0] + ' ' + row[1]
            event_desc =  "QREADS LOG -> User Logout "

      if len(row) >4  and  "Shutting down QREADS application" in row[4]:
            event_time = row[0] + ' ' + row[1]
            event_desc =  "QREADS LOG -> QREADS QUIT "

      if len(row) >4  and  "Startup Param Count" in row[4]:
            event_time = row[0] + ' ' + row[1]
            event_desc =  "QREADS LOG -> CMD Start Args "



      if len(row) >4  and "Server:414 - Started" in row[4]:
            event_time = row[0] + ' ' + row[1]
            event_desc = "QREADS Webservice Started"

      if len(row) >4  and "Successfully sent request to launch new QREADS instance for EPIC" in row[4]:
            event_time = row[0] + ' ' + row[1]
            event_desc =  "QREADS Webservice started new QREADS instance for EPIC"

      if len(row) >4  and "Successfully sent new context to QREADS for EPIC" in row[4]:
            event_time = row[0] + ' ' + row[1]
            event_desc =  "QREADS Webservice sent new Exam to QREADS"

      if len(row) >4  and "[RunQREADSWeb] - Started Web Service" in row[4]:
            event_time = row[1] + ' ' + row[2]
            event_desc =  "MayoDock Started QREADS Webservice"

      if len(row) >4  and "[StartApps] Starting C:\\WKSAdmin\\Replicated Files\\MayoDock\\Patient Care\\Qreads.lnk" in row[4]:
            event_time = row[1] + ' ' + row[2]
            event_desc =  "MayoDock Started QREADS"

      if len(row) >4  and "[CloseApps] Killing QREADS" in row[4]:
            event_time = row[1] + ' ' + row[2]
            event_desc =  "MayoDock Killed QREADS"

      if len(row) >4 and "javaw Port: 9780" in row[4]  in row[4]:
            event_time = row[1] + ' ' + row[2]
            event_desc =  "MayoDockStarter ->QRWebservice"

      # if len(row) >4 and "Port: 9780" in row[4]  and "[ProcessTasks] TCP Process" in row[4]:
      #       event_time = row[1] + ' ' + row[2]
      #       event_desc =  "Process Task : QREADS WebService"

      if len(row) >4 and "[Program] argument passed" in row[4] in row[4]:
            event_time = row[1] + ' ' + row[2]
            event_desc =  "MayoDockStarter -> UserSwitch"

      if len(row) >4 and "[ProcessTasks] Entering" in row[4] in row[4]:
            event_time = row[1] + ' ' + row[2]
            event_desc =  "MayoDockStarter -> Clearing Previous User"

      if len(row) >4 and "StartApps] Entering" in row[4] in row[4]:
            event_time = row[1] + ' ' + row[2]
            event_desc =  "MayoDockStarter -> Starting New User"

      if len(row) > 4 and event_desc != "" :

        event_datetime = None
        try:
          event_datetime = datetime.datetime.strptime(event_time, '%Y-%m-%d %H:%M:%S.%f')
        except:
          try:
            event_datetime = datetime.datetime.strptime(event_time, '%Y-%m-%d %H:%M:%S,%f')
          except:
            try:
              event_datetime = datetime.datetime.strptime(event_time, '%Y-%m-%d %H:%M:%S:%f')
            except:
              pass

        try :
          newrow = {
            'event_at' : event_datetime,  'event_desc' : event_desc , 'event_source': filename, 'event_line' : row[4]
          }
          file_events.append(newrow)
        except:
          pass
          # newrow = {
          #   'event_at' : datetime.datetime.strptime(event_time, '%Y-%m-%d %H:%M:%S:%f'),  'event_desc' : event_desc ,'event_source': filename,  'event_line' : row[4]
          # }

          # file_events.append(newrow)




    infile.close()
    return (file_events)

def parse_folders(hostname):

  file_events = []

  #files = glob.glob(r'\\' + hostname + '\c$\WKSAdmin\Logs\**\MayoDockStarter*.log*', recursive = True)
  #files = glob.glob(r'\\' + hostname + '\c$\WKSAdmin\Logs\MayoDock\**\MayoDoc*.log*', recursive = True)
  files = [r'\\' + hostname + '\c$\WKSAdmin\Logs\EpicWarpDriveLauncher.log']
  for file in files:
      #print(file)
      file_events.extend(parse_file( file))

  files = glob.glob(r'\\' + hostname + '\c$\WKSAdmin\Logs\**\MFLogon*.log*', recursive = True)
  for file in files:
      #print(file)
      file_events.extend(parse_file( file))

  files = glob.glob(r'\\' + hostname + '\c$\WKSAdmin\Logs\**\MayoDockStarter*.log*', recursive = True)
  for file in files:
    #print(file)
    file_events.extend(parse_file( file))

  folder_list = [r'\\' + hostname + '\c$\Program Files\Mayo Foundation\QREADS Web Service\\appbase\logs',r'\\' + hostname + '\c$\Program Files\Mayo Foundation\QREADS 5']
  #folder_list = [ r'\\r5087474\c$\WKSAdmin\Logs\MayoDockStarter.log']
  for fldr in folder_list:
    # if ".log" in fldr:
    #     #print(fldr)
    #     file_events.extend(parse_file( fldr))
    #     continue

    #print(fldr)
    #for filename in os.listdir(fldr):

    files = glob.glob(fldr + '\**\qreads*.log*', recursive = True)
    for file in files:
          #print(file)

          file_events.extend(parse_file( file))

      # if ".log" in filename:
      #     #print(os.path.join(fldr, filename))
      #     file_events.extend(parse_file(os.path.join(fldr, filename)))
      # else:
      #     continue

    df = pd.DataFrame(file_events)
    df['event_at'] = df['event_at'].dt.strftime('%Y-%m-%d %H:%M:%S.%f')

    temp = df.sort_values(by='event_at', ascending=False, inplace=True)
    ws_qr_events = []
    for jdict in df.to_dict(orient='records'):
      ws_qr_events.append(jdict)


  return (ws_qr_events)


def main():

  parser = argparse.ArgumentParser(description="Python Local OS Commands Runner")
  group = parser.add_mutually_exclusive_group()
  group.add_argument("-v", "--verbose", action="store_true")
  group.add_argument("-q", "--quiet", action="store_true")
  parser.add_argument("-host", "--host",  help="hostname", default=None)
  parser.add_argument("-cmd",  help="command_to_run")
  parser.add_argument("-p", "--pid", type=int, help="pid", default=None)
  args = parser.parse_args()

  command = None
  hostname = None
  pid = None

  if args.cmd :
    command = args.cmd
  if args.host :
    hostname = args.host
  if args.pid :
      pid = args.pid


  if command.strip() == 'trylog' :
    file_events = []

    #files = glob.glob(r'\\' + hostname + '\c$\WKSAdmin\Logs\**\MFLogon*.log*', recursive = True)
    #files = glob.glob(r'\\' + hostname + '\c$\WKSAdmin\Logs\**\MayoDockStarter*.log*', recursive = True)
    #files = glob.glob(r'\\' + hostname + '\c$\WKSAdmin\Logs\MayoDock\**\MayoDoc*.log*', recursive = True)
    files = [r'\\' + hostname + '\c$\WKSAdmin\Logs\EpicWarpDriveLauncher.log']


    for file in files:
      #print(file)
      file_events = parse_file( file)
      print(file_events)
      return

  if command.strip() == 'consolog' :
    consolg_events = parse_folders(str(hostname))
    print(json.dumps(consolg_events))
    return


if __name__ == "__main__":
    main()



# if __name__=="__main__":

#     parse_folders()
#     sys.exit()

#     if not len(sys.argv)>1:
#         sys.exit(1)
#     #infile_name=sys.argv[0]
#     #infile_name = r"c:\temp\r5087474_qreads5-2021-01-22-14-09-53.log"
#     infile_name = r"c:\temp\r5087474_qreadsws-2021-01-22-14-55-47.log"
#     #infile_name = r"c:\temp\R0301769_qreadsws-2021-01-22-09-44-09.log"
#     print(infile_name)
#     try:
#         infile=open(infile_name,'r')
#     except IOError:
#         print ("You must specify a valid file to parse")
#         sys.exit(1)

#     # you can either import the generate_log_report
#     # call it and receive a list of log entries (as a list of up to 5 elements)
#     # or run this module via command line
#     # here is an example, what you can do with the list of log file entries:


#     log_report=generate_log_report(infile)
#     print("Done parsing")

#     for row in log_report:
#       event_time = row[0] + ' ' + row[1]
#       # if "Server:414 - Started" in row[4]:
#       #       print(event_time, "QREADS Webservice Started")

#       if len(row) >4  and  "Logged In User" in row[4]:
#             print(event_time, "QREADS LOG -> User logged in ", row[4])

#       if len(row) >4  and  "Incoming single instance launch data" in row[4]:
#             print(event_time, "QREADS LOG -> EPIC Lauched Exam ", row[4])

#       if len(row) >4  and  "Startup Param Count (8)" in row[4]  and "SingleInstanceLaunch=EPIC" in row[4]:
#             print(event_time, "QREADS LOG -> EPIC Lauched Exam in New QREADS Instance", row[4])

#       if len(row) >4  and  "Terminating QREADS Application" in row[4]:
#             print(event_time, "QREADS LOG -> User Logout ", row[4])

#       if "Server:414 - Started" in row[4]:
#             print(event_time, "QREADS Webservice Started")
#       if "Successfully sent request to launch new QREADS instance for EPIC" in row[4]:
#             print(event_time, "QREADS Webservice started new QREADS instance for EPIC")
#       if "Successfully sent new context to QREADS for EPIC" in row[4]:
#             print(event_time, "QREADS Webservice sent new Exam to QREADS")






#     infile.close()

