import subprocess
import argparse
import json
import shutil
import os
from datetime import datetime as localdate
from pathlib import Path


# \\R0303393\c$\Program Files\Mayo Foundation\QREADS Web Service\appbase\logs

def get_logfile_and_show(hostname) :

    print("From Python Get Log : " + hostname)
    source_path = r"\\" + hostname + "\c$\Program Files\Mayo Foundation\QREADS 5"
    dest_path = r"C:\TEMP"
    source_filename =   "\\qreads5.log"
    dt = localdate.now().strftime("-%Y-%m-%d-%H-%M-%S")
    dest_name = "\\" + hostname + "_qreads5" + dt + ".log"
    print(source_path + source_filename, dest_path + dest_name)
    shutil.copyfile(source_path + source_filename, dest_path + dest_name)
    progpath = "start \"C:\\Program Files\\Notepad++\\notepad++.exe\" "
    #print(progpath +  dest_path + dest_name)

    os.system(progpath +  dest_path + dest_name )


    #subprocess.run([progpath, dest_path + dest_name])
    #runProcess(progpath +  dest_path + dest_name)


def get_wslogfolder_and_show(hostname) :
    print("From Python Open WS Log Folder : " + hostname)
    source_path = r"\\" + hostname + "\c$\Program Files\Mayo Foundation\QREADS Web Service\\appbase\logs"
    progpath = "start \"C:\\Program Files\\Notepad++\\notepad++.exe\" "
    os.system("start explorer \"" +  source_path  + "\"")

def get_logfolder_and_show(hostname) :
    print("From Python Open Log Folder : " + hostname)
    source_path = r"\\" + hostname + "\c$\Program Files\Mayo Foundation\QREADS 5"
    progpath = "start \"C:\\Program Files\\Notepad++\\notepad++.exe\" "
    os.system("start explorer \"" +  source_path  + "\"")

def get_wkslogfolder_and_show(hostname) :
    print("From Python Open Log Folder : " + hostname)
    source_path = r"\\" + hostname + "\c$\WKSAdmin\Logs"
    progpath = "start \"C:\\Program Files\\Notepad++\\notepad++.exe\" "
    os.system("start explorer \"" +  source_path  + "\"")


def get_wslogfile_and_show(hostname) :
    print("From Python Get WS Log : " + hostname)

    source_path = r"\\" + hostname + "\c$\Program Files\Mayo Foundation\QREADS Web Service\\appbase\logs"
    dest_path = r"C:\TEMP"
    source_filename =   "\\QReadsWebService.log"
    dt = localdate.now().strftime("-%Y-%m-%d-%H-%M-%S")
    dest_name = "\\" + hostname + "_qreadsws" + dt + ".log"
    print(source_path + source_filename, dest_path + dest_name)
    shutil.copyfile(source_path + source_filename, dest_path + dest_name)
    progpath = "start \"C:\\Program Files\\Notepad++\\notepad++.exe\" "
    #print(progpath +  dest_path + dest_name)

    os.system(progpath +  dest_path + dest_name )


    #subprocess.run([progpath, dest_path + dest_name])
    #runProcess(progpath +  dest_path + dest_name)

def get_file_and_show(hostname) :
        print("get_file_and_show :From Python Get WS Log : " + hostname)

        #ostname = hostname[:-9] + '6721check'
        progpath_pdf = hostname + ".pdf"
        progpath_jpg = hostname + ".jpg"
        progpath_png = hostname + ".png"
        print(os.path.isfile(progpath_pdf), Path(progpath_pdf).is_file())
        if os.path.isfile(progpath_pdf) :
              print("Open file: " + progpath_pdf)
              os.system(progpath_pdf)
        elif os.path.isfile(progpath_jpg) :
              print("Open file: " + progpath_jpg)
              os.system(progpath_jpg)
        elif os.path.isfile(progpath_png) :
              print("Open file: " + progpath_png)
              os.system(progpath_png)
        else:
          print("Open file???: " + progpath_pdf)
        # progpath = " \"" + hostname + ".pdf\" "
        # os.system(progpath)

def runProcess(exe):
    p = subprocess.Popen(exe, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    while(True):
        # returns None while subprocess is running
        retcode = p.poll()
        line = p.stdout.readline()
        yield line
        if retcode is not None:
            break

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

  # print("Got Command: " + command)
  # if hostname != None :
  #   print("Got Hostname: " + hostname)
  # if pid != None :
  #   print("Got pid: " + str(pid))

  if command.strip() == 'showfile' :
    get_file_and_show(str(hostname))
    return

  if command.strip() == 'logfile' :
    get_logfile_and_show(str(hostname))
    return

  if command.strip() == 'wslogfile' :
    get_wslogfile_and_show(str(hostname))
    return

  if command.strip() == 'wslogfolder' :
    get_wslogfolder_and_show(str(hostname))
    return

  if command.strip() == 'logfolder' :
    get_logfolder_and_show(str(hostname))
    return

  if command.strip() == 'wksadmlogfolder' :
    get_wkslogfolder_and_show(str(hostname))
    return



  cmd_to_run = ""

  if command.strip() == 'tasklist' and hostname != None :
      cmd_to_run: 'tasklist /s ' +  str(hostname)
      processes = []
      for line in runProcess("WMIC /node:" + hostname + " PROCESS get Commandline,Processid,CREATIONDATE  /format:csv" ):
          line_args = str(line)[2:-1].split(',')

          if (len(line_args) > 2) :
              #print(line_args)
                try :
                  proc = {
                    'host' : line_args[0].strip(),
                    'cmdline' : line_args[1].strip(),
                    'created' :  localdate.strptime( line_args[2].strip().replace('\\r', '').replace('\\n', '')[:14], '%Y%m%d%H%M%S').strftime('%Y-%m-%d %H:%M:%S'),
                    'pid' : line_args[3].strip().replace('\\r', '').replace('\\n', '')
                  }
                  processes.append(proc)
                except Exception as e:
                  #print (e)
                  pass

      print(json.dumps(processes))

if __name__ == "__main__":
    main()
