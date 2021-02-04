import sys
import os
import argparse
from sys import platform as _platform
from pathlib import Path, PureWindowsPath
import pydicom
import json


def parseDicom (folderpath) :

    files = []
    filesdir = folderpath
    dicom_meta = {}

    filepaths = []
    if Path(filesdir).is_dir():
      for path in Path(filesdir).rglob('*.*'):
        filepaths.append(str(path))
    else:
      filepaths.append(filesdir)

    for path in filepaths:
        #print(path)
        file_full_path = path  #os.path.join(filesdir,path.name)

        if os.path.isdir(file_full_path) :
          continue
        #print(str(path))


    #if 1 > 2 :

        filename = file_full_path
        dataset = pydicom.dcmread(file_full_path)
        pat_name = dataset.PatientName
        dicom_meta = {}
        imageInstances = []

        # Normal mode:
        # print()
        # print("Filename.........:", filename)
        dicom_meta.update({'filepath' : str(filename)})
        # print("Patient id.......:", dataset.PatientID)
        dicom_meta.update({'PatientID' : dataset.PatientID})
        dicom_meta.update({'PatientName' : dataset.PatientName})
        dicom_meta.update({'DisplayName' : pat_name.family_name + ", " + pat_name.given_name})
        dicom_meta.update({'Modality' : dataset.Modality})
        dicom_meta.update({'StudyDate' : dataset.StudyDate})
        dicom_meta.update({'SOPClassUID' : dataset.SOPClassUID})
        dicom_meta.update({'SOPInstanceUID' : dataset.SOPInstanceUID})
        dicom_meta.update({'SeriesInstanceUID' : dataset.SeriesInstanceUID})
        dicom_meta.update({'StudyInstanceUID' : dataset.StudyInstanceUID})



        # print(dicom_meta)
        #print("Storage type.....:", dataset.SOPClassUID)
        #print()

        ko_set = {}
        display_name = pat_name.family_name + ", " + pat_name.given_name
        # print("Patient's name...:", display_name)
        # print("Patient id.......:", dataset.PatientID)
        # print("Modality.........:", dataset.Modality)
        # print("Study Date.......:", dataset.StudyDate)
        # print("SOPClass UID.....:", dataset.SOPClassUID)
        # print("Image UID     ...:", dataset.SOPInstanceUID)
        # print("SERIES UID    ...:", dataset.SeriesInstanceUID)
        # print("STUDY UID     ...:", dataset.StudyInstanceUID)

        #print(dataset)
        #print ("Newdata", (dataset[0x0040,0xa043][0])[0x0008,0x0100].value, (dataset[0x0040,0xa043][0])[0x0008,0x0104].value)

        try:
            iocm_code = (dataset[0x0040,0xa043][0])[0x0008,0x0100].value
            iocm_reason = (dataset[0x0040,0xa043][0])[0x0008,0x0104].value
            dicom_meta.update({"iocm_code" : iocm_code })
            dicom_meta.update({'iocm_reason' : iocm_reason})

            #print(ko_set)
            ko_series = []
            series_instances = []

            # for item in dataset[0x40,0xa730].value :
            #    for item2 in item:
            #     #print (item2.tag, item2)
            #     if item2.tag == (0x8,0x1199) :
            #         print ("Image", item2[0][0x8,0x1150].value , '  ==>  ', item2[0][0x8,0x1155].value )
            # print()

            for item in dataset[0x40,0xa730].value :
              for item2 in item:
                #print (item2.tag, item2)
                if item2.tag == (0x8,0x1199) :
                    #print ("Image", item2[0][0x8,0x1150].value , '  ==>  ', item2[0][0x8,0x1155].value )
                    ser_uid = item2[0][0x8,0x1150].value
                    img_uid = item2[0][0x8,0x1155].value
                    found_series = False
                    for seruid in ko_series :
                      if seruid['seruid'] == ser_uid :
                          found_series = True
                          imageuids = seruid['images']
                          imageuids.append(img_uid)
                          break
                    if (found_series == False) :
                        newseries = {}
                        newseries.update({'seruid': ser_uid})
                        newseries_images = []
                        newseries_images.append(img_uid)
                        newseries.update({'images': newseries_images})
                        ko_series.append(newseries)

            if len(ko_series) > 0 :
              dicom_meta.update({'koseries' : ko_series})
        except:
          pass

        # print("Patient's name...:", dicom_meta['DisplayName'])
        # print("Patient id.......:", dicom_meta['PatientID'])
        # print("Modality.........:", dicom_meta['Modality'])
        # print("Study Date.......:", dicom_meta['StudyDate'])
        # print("SOPClass UID.....:", dicom_meta['SOPClassUID'])
        # print("Image UID     ...:", dicom_meta['SOPInstanceUID'])
        # print("SERIES UID    ...:", dicom_meta['SeriesInstanceUID'])
        # print("STUDY UID     ...:", dicom_meta['StudyInstanceUID'])
        # print("          Rjected:", dicom_meta['iocm_code'], dicom_meta['iocm_reason'])

        # for ser in dicom_meta['koseries'] :
        #   print("       Series-uid:", ser['seruid'])
        #   print("         rejected:", len(ser['images']))
        # print("--------------")

        filename = ''
        files.append(dicom_meta)
        #print(dicom_meta)

    return files

        # if 'PixelData' in dataset:
        #     rows = int(dataset.Rows)
        #     cols = int(dataset.Columns)
        #     print("Image size.......: {rows:d} x {cols:d}, {size:d} bytes".format(
        #         rows=rows, cols=cols, size=len(dataset.PixelData)))
        #     if 'PixelSpacing' in dataset:
        #         print("Pixel spacing....:", dataset.PixelSpacing)

        #     # use .get() if not sure the item exists, and want a default value if missing
        #     print("Slice location...:", dataset.get('SliceLocation', "(missing)"))

        #     # plot the image using matplotlib
        #     #plt.imshow(dataset.pixel_array, cmap=plt.cm.bone)


    #dataset = pydicom.dcmread(filename)



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
       print(parseDicom(arguments))
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
