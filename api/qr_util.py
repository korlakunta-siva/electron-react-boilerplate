import sys
import os
import argparse
from sys import platform as _platform
from pathlib import Path, PureWindowsPath
import pydicom
import json
import subprocess



def genELQFile (folderpath) :

    files = []
    filesdir = folderpath
    dicom_meta = {}
    hasKOSeries = False

    elq_file = open (folderpath + "/ExamList.qreads", "w")
    elq_file.write ("PatLastName|JaneOrJohn|2-200-200|15-Aug-1948|M|\n")

    elq_file.write ("C|14-Apr-2008  11:14:09| |US-MSK|PMR|MCR")

    filepaths = []
    if Path(filesdir).is_dir():
      for path in Path(filesdir).rglob('*.dcm'):
        filepaths.append(path)
    else:
      filepaths.append(filesdir)

    #print("File Directory:", folderpath)
    for path in filepaths:
        #print(path)
        file_full_path = str(path)  #os.path.join(filesdir,path.name)
        justFileName = path.name

        if os.path.isdir(file_full_path) :
          continue
        #print(str(path))


    #if 1 > 2 :

        filename = file_full_path

        try:
          dataset = pydicom.dcmread(file_full_path)
          pat_name = dataset.PatientName
        except:
          pass
          continue

        dicom_meta = {}
        imageInstances = []





        #print(filename.replace(folderpath, "")[1:])

        # Normal mode:
        # print()
        # print("Filename.........:", filename)
        dicom_meta.update({'filepath' : str(filename)})
        # print("Patient id.......:", dataset.PatientID)
        dicom_meta.update({'PatientID' : dataset.PatientID})
        dicom_meta.update({'PatientName' : dataset.PatientName})
        dicom_meta.update({'DisplayName' : pat_name.family_name + ", " + pat_name.given_name})
        dicom_meta.update({'Modality' : dataset.Modality})
        dicom_meta.update({'Accession' : dataset[0x8,0x50].value})
        dicom_meta.update({'StudyDate' : dataset.StudyDate})
        dicom_meta.update({'SeriesNumber' : dataset.SeriesNumber})
        dicom_meta.update({'SOPClassUID' : dataset.SOPClassUID})
        dicom_meta.update({'SOPInstanceUID' : dataset.SOPInstanceUID})
        dicom_meta.update({'SeriesInstanceUID' : dataset.SeriesInstanceUID})
        dicom_meta.update({'StudyInstanceUID' : dataset.StudyInstanceUID})
        elq_file.write ("|")
        elq_file.write (str(dataset.SeriesNumber))
        elq_file.write (":1:")
        elq_file.write (filename.replace(folderpath, "")[1:])

        #print(dicom_meta)

    elq_file.write ("\nFINISHED")
    elq_file.close()




def main():

  parser = argparse.ArgumentParser(description="Python Local OS Commands Runner")
  group = parser.add_mutually_exclusive_group()
  group.add_argument("-v", "--verbose", action="store_true")
  group.add_argument("-q", "--quiet", action="store_true")
  parser.add_argument("-cmd",  help="command_to_run")
  parser.add_argument("-a", "--arg",  help="args", default=None)
  parser.add_argument("-p", "--pid", type=int, help="pid", default=None)
  args = parser.parse_args()

  command = None
  hostname = None
  pid = None

  if args.cmd :
    command = args.cmd
  if args.arg :
    arguments = args.arg
  if args.pid :
      pid = args.pid


  try:

    if command.strip() == 'parse' :
      #  print("parse -> path: " + str(arguments))
       genELQFile(arguments)
       prog = []
       prog.append("cmd.exe /c Qreads.vbs")
       prog.append("MODE=STANDALONE")
       prog.append("LOCALIMAGEDIRECTORY=" + arguments)
      #  + C:\share\Data\testdata\nt3
      #  "C:\WKSAdmin\Replicated Files\Local Launchers\Qreads.vbs" MODE=STANDALONE LOCALIMAGEDIRECTORY=C:\share\Data\testdata\nt3
       #print (prog)
       #subprocess.call(prog)
       os.system("\"C:\WKSAdmin\Replicated Files\Local Launchers\Qreads.vbs\" MODE=STANDALONE LOCALIMAGEDIRECTORY=" + arguments)
       sys.exit(0)

    if command.strip() == 'tounix' :
       print("tounix ->  " + arguments)
       print(configureMountPoint(arguments))
       sys.exit(0)

    if command.strip() == 'towin' :
       print("towin -> " + arguments)
       print(reverseMountPoints(arguments))
       sys.exit(0)

  except Exception as e:
        print (e)
        pass

if __name__ == "__main__":
    main()
