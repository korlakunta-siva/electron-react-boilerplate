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

DEBUG = False


def parseCISstackFile(stackpath, seriesInfo):
    offsetArray = []
    uidArray = []
    imagesArr = []
    if os.path.isfile(stackpath):
        fh = open(stackpath, 'rb')
        m = mmap.mmap(fh.fileno(), 0, access=mmap.ACCESS_READ)
        ba = bytearray(m)

        #print(ba[0:6], str(ba[0:6]))

        stacktype = int.from_bytes(ba[6:8], byteorder='little')
        offset = int.from_bytes(ba[8:16], byteorder='little')
        maxrange = int.from_bytes(ba[16:20], byteorder='little')
        uidOffset = int.from_bytes(ba[20:28], byteorder='little')

        # print("stackfile Type: ", stacktype)
        # print("Offset: ", offset )
        # print("Maxrange: ", maxrange)
        # print("UID Offset: ", uidOffset)

        numElements = int.from_bytes(ba[offset:offset + 2], byteorder='little')

        #print("Number of Elements: ", numElements)

        elemStart = offset + 2
        for i in range(0, numElements):
            elemOffset = int.from_bytes(ba[elemStart:elemStart + 8],
                                        byteorder='little')
            #print (" seq " , i, elemOffset)
            offsetArray.append(elemOffset)
            elemStart += 8

        offsetArray.append(offset)
        # for i in range (0, numElements + 1):
        #     print(i,offsetArray[i])

        numUIDs = int.from_bytes(ba[uidOffset:uidOffset + 2],
                                 byteorder='little')

        #print("Number of UIDs: ", numUIDs)

        uidstart = uidOffset + 2
        for i in range(0, numUIDs):
            uidlength = int.from_bytes(ba[uidstart:uidstart + 1],
                                       byteorder='little')
            #print (" seq " , i, uidlength)
            uidstart += 1
            uidString = ba[uidstart:uidstart + uidlength]
            #print("UID : ", str(uidString)[12:-2])
            uidstart += uidlength
            uidArray.append(str(uidString)[12:-2])

        for i in range(0, numUIDs):
            uid = uidArray[i]

            #print(i,   prevOffset,  offsetArray[i], offsetArray[i+1] - offsetArray[i])
            filebytes = ba[offsetArray[i]:offsetArray[i + 1]]

            dicom_meta = {}

            dicom_meta.update({'filepath': str(uid) + ".dcm"})
            dicom_meta.update({'PatientID': seriesInfo['patient_cmrn']})
            dicom_meta.update({'PatientName': ''})
            dicom_meta.update({'DisplayName': ''})
            dicom_meta.update({'Modality': seriesInfo['modality']})
            dicom_meta.update({'Accession': ''})
            dicom_meta.update({'StudyDate': seriesInfo['acq_start_time']})
            dicom_meta.update({'SOPClassUID': seriesInfo['sopclass_uid']})
            dicom_meta.update({'SOPInstanceUID': uid})
            dicom_meta.update({'SeriesInstanceUID': seriesInfo['series_uid']})
            dicom_meta.update({'StudyInstanceUID': seriesInfo['study_uid']})

            imagesArr.append(dicom_meta)

        return (imagesArr)

        #######   writeImgFile(filebytes, "img/" + uid + '.dcm')

        # print (convertBytesToShort(ba[7:9], 0))
        # print(struct.unpack('H'*1,ba[7:9]))
        #print(len(ba))
    else:
        print("File does not exist: ", stackpath)


def parseDicom(folderpath):

    files = []
    filesdir = folderpath
    dicom_meta = {}
    hasKOSeries = False

    filepaths = []
    if Path(filesdir).is_dir():
        for path in Path(filesdir).rglob('*.*'):
            filepaths.append(str(path))
    else:
        filepaths.append(filesdir)

    for path in filepaths:
        #print(path)
        file_full_path = path  #os.path.join(filesdir,path.name)

        if os.path.isdir(file_full_path):
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

        # Normal mode:
        # print()
        # print("Filename.........:", filename)
        dicom_meta.update({'filepath': str(filename)})
        # print("Patient id.......:", dataset.PatientID)
        dicom_meta.update({'PatientID': dataset.PatientID})
        dicom_meta.update({'PatientName': dataset.PatientName})
        dicom_meta.update(
            {'DisplayName': pat_name.family_name + ", " + pat_name.given_name})
        dicom_meta.update({'Modality': dataset.Modality})
        dicom_meta.update({'Accession': dataset[0x8, 0x50].value})
        dicom_meta.update({'StudyDate': dataset.StudyDate})
        dicom_meta.update({'SOPClassUID': dataset.SOPClassUID})
        dicom_meta.update({'SOPInstanceUID': dataset.SOPInstanceUID})
        dicom_meta.update({'SeriesInstanceUID': dataset.SeriesInstanceUID})
        dicom_meta.update({'StudyInstanceUID': dataset.StudyInstanceUID})

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
            iocm_code = (dataset[0x0040, 0xa043][0])[0x0008, 0x0100].value
            iocm_reason = (dataset[0x0040, 0xa043][0])[0x0008, 0x0104].value
            dicom_meta.update({"iocm_code": iocm_code})
            dicom_meta.update({'iocm_reason': iocm_reason})
            hasKOSeries = True

            #print(ko_set)
            ko_series = []
            series_instances = []

            # for item in dataset[0x40,0xa730].value :
            #    for item2 in item:
            #     #print (item2.tag, item2)
            #     if item2.tag == (0x8,0x1199) :
            #         print ("Image", item2[0][0x8,0x1150].value , '  ==>  ', item2[0][0x8,0x1155].value )
            # print()

            #for item in dataset[0x40,0xa730].value :

            for item in dataset[0x40, 0xa375].value:
                #print("SERIES",item)
                for item2 in item:

                    if item2.tag == (0x8, 0x1115):
                        #print ("ITEM2 ", item2.value)
                        try:
                            for item3 in item2.value:
                                #print ("ITEM3-SERIES ", item3[0x20,0x000e].value)
                                #print ("ITEM3-IMAGE ", item3[0x8,0x1199].value)
                                #if item2.tag == (0x0020,0x000e) :
                                #     print("IN KO a", item2)
                                # if item3.tag == (0x0020,0x000e) :
                                ser_uid = item3[0x20, 0x000e].value
                                #   print("GOT SERIES_UID", ser_uid)
                                for item4 in item3[0x8, 0x1199].value:
                                    #print("IN KO b", item4[0x8,0x1155])
                                    #print ("Image", item3[0][0x8,0x1150].value , '  ==>  ', item2[0][0x8,0x1155].value )
                                    img_uid = item4[0x8, 0x1155].value
                                    #print("GOT IMG_UID", ser_uid, img_uid)

                                    #print("IN KO", ser_uid, img_uid)
                                    found_series = False
                                    for seruid in ko_series:
                                        if seruid['seruid'] == ser_uid:
                                            found_series = True
                                            imageuids = seruid['images']
                                            imageuids.append(img_uid)
                                            break
                                    if (found_series == False):
                                        newseries = {}
                                        newseries.update({'seruid': ser_uid})
                                        newseries_images = []
                                        newseries_images.append(img_uid)
                                        newseries.update(
                                            {'images': newseries_images})
                                        ko_series.append(newseries)

                        except Excetion as ex2:
                            #print("ERROR", ex2)
                            pass

                    # # if item2.tag == (0x0020,0x000e) :
                    # #     print("IN KO a", item2)
                    # if item2.tag == (0x8,0x1199) :

                    #     print("IN KO b", item2[0][0x8,0x1155])

                    #     #print ("Image", item2[0][0x8,0x1150].value , '  ==>  ', item2[0][0x8,0x1155].value )
                    #     ser_uid = '123' #item2[0][0x0020,0x000e].value
                    #     img_uid = item2[0][0x8,0x1155].value
                    #     #print("IN KO", ser_uid, img_uid)
                    #     print(ser_uid, img_uid)
                    #     found_series = False
                    #     for seruid in ko_series :
                    #       if seruid['seruid'] == ser_uid :
                    #           found_series = True
                    #           imageuids = seruid['images']
                    #           imageuids.append(img_uid)
                    #           break
                    #     if (found_series == False) :
                    #         newseries = {}
                    #         newseries.update({'seruid': ser_uid})
                    #         newseries_images = []
                    #         newseries_images.append(img_uid)
                    #         newseries.update({'images': newseries_images})
                    #         ko_series.append(newseries)

            #print("DONE PARSNG FOR KO")
            if len(ko_series) > 0:
                hasKOSeries = True
                dicom_meta.update({'iocmko': 'yes'})
                dicom_meta.update({'iocm_series': len(ko_series)})
                imgcount = 0
                for ser in ko_series:
                    imgcount = imgcount + len(ser['images'])
                dicom_meta.update({'iocm_images': imgcount})
                dicom_meta.update({'koseries': ko_series})
            else:
                dicom_meta.update({'iocmko': 'no'})
                dicom_meta.update({'iocm_series': 0})
                dicom_meta.update({'iocm_images': 0})
                dicom_meta.update({'koseries': ''})
        except Exception as err:
            #print ("ERROR", err)
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

    if hasKOSeries:
        pass
        for dicom_meta in files:
            try:
                if (len(dicom_meta['koseries']) > 0):
                    dicom_meta.update({'iocmko': 'yes'})
                    dicom_meta.update({'iocm_series': len(ko_series)})
                    imgcount = 0
                    for ser in ko_series:
                        imgcount = imgcount + len(ser['images'])
                    dicom_meta.update({'iocm_images': imgcount})
                    dicom_meta.update({'koseries': ko_series})
            except:
                dicom_meta.update({"iocm_code": ''})
                dicom_meta.update({'iocm_reason': ''})
                dicom_meta.update({'iocmko': 'no'})
                dicom_meta.update({'iocm_series': ''})
                dicom_meta.update({'iocm_images': ''})
                dicom_meta.update({'koseries': ''})
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


def listCISparseDicom(listfolderpath, seriesArr):

    global DEBUG

    files = []
    examSummary = []
    dicom_meta = {}
    hasKOSeries = False

    filepaths = []
    for argFilePath in list(listfolderpath):
        if Path(argFilePath).is_dir():
            for path in Path(argFilePath).rglob('*.*'):
                filepaths.append(str(path))
        else:
            filepaths.append(argFilePath)

    #print("Files to Parse", filepaths)

    for path in filepaths:
        #print(path)
        file_full_path = path  #os.path.join(filesdir,path.name)

        if os.path.isdir(file_full_path):
            continue
        #print(str(path))

    #if 1 > 2 :

        filename = file_full_path
        seriesInfo = {}
        for serpath in seriesArr:
            if serpath['store_name'] + "\\" + serpath[
                    'series_file_name'] == filename:
                seriesInfo = serpath

        if (".img" in filename):
            if DEBUG:
                print("PARSE STACK :" + filename)
            dcmFiles = parseCISstackFile(filename, seriesInfo)
            #print("STACK", len(dcmFiles), filename)
            for dcmfile in dcmFiles:
                files.append(dcmfile)
                if DEBUG:
                    print("DCM File UID: ", dcmfile['SeriesInstanceUID'])
            continue
        else:
            if DEBUG:
                print("PARSE DICOM :" + filename)
            pass

        try:
            dataset = pydicom.dcmread(file_full_path)
            pat_name = dataset.PatientName
        except:
            pass
            continue

        dicom_meta = {}
        imageInstances = []

        # Normal mode:
        # print()
        # print("Filename.........:", filename)
        dicom_meta.update({'filepath': str(filename)})
        # print("Patient id.......:", dataset.PatientID)
        dicom_meta.update({'PatientID': dataset.PatientID})
        dicom_meta.update({'PatientName': dataset.PatientName})
        dicom_meta.update(
            {'DisplayName': pat_name.family_name + ", " + pat_name.given_name})
        dicom_meta.update({'Modality': dataset.Modality})
        dicom_meta.update({'Accession': dataset[0x8, 0x50].value})
        dicom_meta.update({'StudyDate': dataset.StudyDate})
        dicom_meta.update({'SOPClassUID': dataset.SOPClassUID})
        dicom_meta.update({'SOPInstanceUID': dataset.SOPInstanceUID})
        dicom_meta.update({'SeriesInstanceUID': dataset.SeriesInstanceUID})
        dicom_meta.update({'StudyInstanceUID': dataset.StudyInstanceUID})

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
            iocm_code = (dataset[0x0040, 0xa043][0])[0x0008, 0x0100].value
            iocm_reason = (dataset[0x0040, 0xa043][0])[0x0008, 0x0104].value
            dicom_meta.update({"iocm_code": iocm_code})
            dicom_meta.update({'iocm_reason': iocm_reason})
            hasKOSeries = True

            #print(ko_set)
            ko_series = []
            series_instances = []

            # for item in dataset[0x40,0xa730].value :
            #    for item2 in item:
            #     #print (item2.tag, item2)
            #     if item2.tag == (0x8,0x1199) :
            #         print ("Image", item2[0][0x8,0x1150].value , '  ==>  ', item2[0][0x8,0x1155].value )
            # print()

            #for item in dataset[0x40,0xa730].value :

            for item in dataset[0x40, 0xa375].value:
                #print("SERIES",item)
                for item2 in item:

                    if item2.tag == (0x8, 0x1115):
                        #print ("ITEM2 ", item2.value)
                        try:
                            for item3 in item2.value:
                                #print ("ITEM3-SERIES ", item3[0x20,0x000e].value)
                                #print ("ITEM3-IMAGE ", item3[0x8,0x1199].value)
                                #if item2.tag == (0x0020,0x000e) :
                                #     print("IN KO a", item2)
                                # if item3.tag == (0x0020,0x000e) :
                                ser_uid = item3[0x20, 0x000e].value
                                #   print("GOT SERIES_UID", ser_uid)
                                for item4 in item3[0x8, 0x1199].value:
                                    #print("IN KO b", item4[0x8,0x1155])
                                    #print ("Image", item3[0][0x8,0x1150].value , '  ==>  ', item2[0][0x8,0x1155].value )
                                    img_uid = item4[0x8, 0x1155].value
                                    #print("GOT IMG_UID", ser_uid, img_uid)

                                    #print("IN KO", ser_uid, img_uid)
                                    found_series = False
                                    for seruid in ko_series:
                                        if seruid['seruid'] == ser_uid:
                                            found_series = True
                                            imageuids = seruid['images']
                                            imageuids.append(img_uid)
                                            break
                                    if (found_series == False):
                                        newseries = {}
                                        newseries.update({'seruid': ser_uid})
                                        newseries_images = []
                                        newseries_images.append(img_uid)
                                        newseries.update(
                                            {'images': newseries_images})
                                        ko_series.append(newseries)

                        except Excetion as ex2:
                            #print("ERROR", ex2)
                            pass

                    # # if item2.tag == (0x0020,0x000e) :
                    # #     print("IN KO a", item2)
                    # if item2.tag == (0x8,0x1199) :

                    #     print("IN KO b", item2[0][0x8,0x1155])

                    #     #print ("Image", item2[0][0x8,0x1150].value , '  ==>  ', item2[0][0x8,0x1155].value )
                    #     ser_uid = '123' #item2[0][0x0020,0x000e].value
                    #     img_uid = item2[0][0x8,0x1155].value
                    #     #print("IN KO", ser_uid, img_uid)
                    #     print(ser_uid, img_uid)
                    #     found_series = False
                    #     for seruid in ko_series :
                    #       if seruid['seruid'] == ser_uid :
                    #           found_series = True
                    #           imageuids = seruid['images']
                    #           imageuids.append(img_uid)
                    #           break
                    #     if (found_series == False) :
                    #         newseries = {}
                    #         newseries.update({'seruid': ser_uid})
                    #         newseries_images = []
                    #         newseries_images.append(img_uid)
                    #         newseries.update({'images': newseries_images})
                    #         ko_series.append(newseries)

            #print("DONE PARSNG FOR KO")
            if len(ko_series) > 0:
                hasKOSeries = True
                dicom_meta.update({'iocmko': 'yes'})
                dicom_meta.update({'iocm_series': len(ko_series)})
                imgcount = 0
                for ser in ko_series:
                    imgcount = imgcount + len(ser['images'])
                dicom_meta.update({'iocm_images': imgcount})
                dicom_meta.update({'koseries': ko_series})
            else:
                dicom_meta.update({'iocmko': 'no'})
                dicom_meta.update({'iocm_series': 0})
                dicom_meta.update({'iocm_images': 0})
                dicom_meta.update({'koseries': ''})
        except Exception as err:
            #print ("ERROR", err)
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
    if DEBUG:
        print("PARSE DONE" + str(len(files)))

    dictSeries = {}
    rejectedInfo = []
    seriesUIDs = set([x['SeriesInstanceUID'] for x in files])

    for ser in seriesUIDs:

        for file1 in files:
            # if DEBUG:
            #     print("PARSE DONE step 1", ser, file1)
            if 'koseries' in file1.keys():
                rejectedInfo.append(file1['koseries'])
            if (ser == file1['SeriesInstanceUID']):
                imageUID = file1['SOPInstanceUID']
                if ser in dictSeries.keys():
                    serinfo = dictSeries[ser]
                    serinfo['images'].append(imageUID)
                    serinfo['count'] += 1
                else:
                    serinfo = {}
                    serinfo['count'] = 1
                    serinfo['images'] = []
                    serinfo['rejected'] = []
                    serinfo['images'].append(imageUID)
                    dictSeries[ser] = serinfo

    if DEBUG:
        print("PARSE2 DONE rejected: ", rejectedInfo)

    for kos in rejectedInfo:
        kos_seruid = kos[0]['seruid']
        kos_images = kos[0]['images']
        if DEBUG:
            print(" INFO: ", len(kos), kos, kos_seruid, kos_images)

        if kos_seruid in dictSeries:
            serdict = dictSeries[kos_seruid]
            serdict['rejected'] = kos_images
        else:
            serdict = {}
            serdict['rejected'] = kos_images
            serdict['images'] = kos_images
            serdict['count'] = len(kos_images)
            dictSeries[kos_seruid] = serdict

            #dictSeries[kos_seruid]

        # if DEBUG:
        #     try:
        #         print(" INFO-A: ", dictSeries[kos_seruid])
        #     except Exception as err:
        #         print(err)
        # serdict = dictSeries[kos_seruid]
        # serdict['rejected'] = kos_images

        # if DEBUG:
        #     print(" INFO2: ", len(kos_images), kos_seruid, serdict['rejected'])

    if DEBUG:
        print("SUMMARY")
    for dictkey in dictSeries.keys():
        serinfo = dictSeries[dictkey]
        ser_rejected = 0
        ser_rejected_still_remain = 0
        yet_to_remove = []
        if 'rejected' in serinfo.keys():
            ser_rejected = len(serinfo['rejected'])
            for instkey in serinfo['rejected']:
                if instkey in serinfo['images']:
                    ser_rejected_still_remain += 1
                    yet_to_remove.append(instkey)
        if ser_rejected_still_remain > 0:
            serinfo['to_remove_count'] = ser_rejected_still_remain
            serinfo['to_remove_images'] = yet_to_remove

        origSeriesInfo = {}
        for serpath in seriesArr:
            if serpath['series_uid'] == dictkey:
                origSeriesInfo = serpath
                origSeriesInfo['imgcount'] = serinfo['count']
                origSeriesInfo['rejected'] = ser_rejected
                origSeriesInfo[
                    'rejected_to_remove'] = ser_rejected_still_remain
                origSeriesInfo['imguids'] = serinfo['images']
                origSeriesInfo['rejuids'] = serinfo['rejected']
                origSeriesInfo['rejuids_remaining'] = yet_to_remove

        if DEBUG:
            print(serinfo['count'], len(serinfo['images']), ser_rejected,
                  ser_rejected_still_remain, yet_to_remove, dictkey)

            print(origSeriesInfo)

    if DEBUG:
        print(seriesArr)
    return (seriesArr)
    #print(dictSeries[])
    #print(rejectedInfo)
    #print(ser, file1['SeriesInstanceUID'])

    # for val in (set([ x['SeriesInstanceUID'] for x in files])):
    #    imgcount = 0
    #    for ( valx in files ) :
    #      if  (valx['SeriesInstanceUID'] == val) :
    #         imgcount += 1

    #   # print ("===> ", val, imgcount)

    # for file1 in files:
    #     foundSer = False
    #     try:
    #         serUID = dicom_meta['SeriesInstanceUID']
    #         print("This Series : " + serUID)
    #         for curSer in examSummary:
    #             seruid_var = curSer['SeriesInstanceUID']
    #             curImageCount = curSer['ImageCount'] + 1
    #             print(seruid_var, serUID, seruid_var == serUID)
    #             if serUID == seruid_var:
    #                 curSer.update({'ImageCount': curImageCount})
    #                 foundSer = True
    #                 break

    #         if (foundSer == False):
    #             print("Adding Series", serUID)
    #             newSer = {}
    #             newSer.update({'SERIES_UID': serUID, 'ImageCount': 1})
    #             examSummary.append(newSer)

    #     except Exception as err:
    #         print(err)
    #         pass

    #print(examSummary)

    # if hasKOSeries :
    #    pass
    #    for dicom_meta in files :
    #       try:
    #           serUID = dicom_meta['SeriesInstanceUID']

    #                   dicom_meta.update({'PatientID' : dataset.PatientID})
    #     dicom_meta.update({'PatientName' : dataset.PatientName})
    #     dicom_meta.update({'DisplayName' : pat_name.family_name + ", " + pat_name.given_name})
    #     dicom_meta.update({'Modality' : dataset.Modality})
    #     dicom_meta.update({'Accession' : dataset[0x8,0x50].value})
    #     dicom_meta.update({'StudyDate' : dataset.StudyDate})
    #     dicom_meta.update({'SOPClassUID' : dataset.SOPClassUID})
    #     dicom_meta.update({'SOPInstanceUID' : dataset.SOPInstanceUID})
    #     dicom_meta.update({'SeriesInstanceUID' : dataset.SeriesInstanceUID})
    #     dicom_meta.update({'StudyInstanceUID' : dataset.StudyInstanceUID})
    #         if (len(dicom_meta['koseries']) > 0):
    #             dicom_meta.update({'iocmko' : 'yes'})
    #             dicom_meta.update({'iocm_series' : len(ko_series)})
    #             imgcount = 0
    #             for ser in ko_series:
    #                 imgcount = imgcount + len(ser['images'])
    #             dicom_meta.update({'iocm_images' : imgcount})
    #             dicom_meta.update({'koseries' : ko_series})
    #       except:
    #           dicom_meta.update({"iocm_code" : '' })
    #           dicom_meta.update({'iocm_reason' : ''})
    #           dicom_meta.update({'iocmko' : 'no'})
    #           dicom_meta.update({'iocm_series' : '' })
    #           dicom_meta.update({'iocm_images' : ''})
    #           dicom_meta.update({'koseries' : ''})

    # print(files)
    #return files

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
