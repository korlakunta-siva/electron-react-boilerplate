



import sys
import os
import argparse
from sys import platform as _platform
from pathlib import Path, PureWindowsPath
import pydicom
import json
import subprocess
import shutil
import mmap
import struct
import glob

def convertBytesToShort(curByte, indx) :
  if (len(curByte) < 2) :
        return 0
  else:
      return  (((curByte[indx + 1] & 0xFF) << 8) + (curByte[indx + 0] & 0xFF))

def writeImgFile(bytea, fname) :
  newByteArr = bytearray(bytea)
  newfile = open(fname, "wb")
  newfile.write(newByteArr)

def createStackFile(folderpath):

    files = glob.glob(folderpath + '*.dcm', recursive = False)
    fileOffsetStart = 0
    uidTableOffset = 0
    firstFile = True
    fileOffsets = []

    numFiles = len(files)
    for filename in files:
        #print(filename)
        fileOffsets.append(fileOffsetStart)
        st = os.stat(filename)
        fileSize = st.st_size
        fileOffsetStart += st.st_size

    uidTableOffset = fileOffsetStart + 2 + (numFiles * 8)

    newfile= bytearray()
    print(len(newfile))

    for filename in files:
        rFile = open(filename, "rb")
        fileArr = rFile.read()
        newfile.extend(fileArr)

    print(len(newfile))
    newfile.extend(int.to_bytes(numFiles, 2, byteorder='little'))
    for i in range (0, numFiles ):
        newfile.extend(int.to_bytes(fileOffsets[i], 8, byteorder='little'))

    newfile.extend(int.to_bytes(numFiles, 2, byteorder='little'))
    for filename in files:
        uid = filename.replace(".dcm", "").replace("api\\", "")
        newfile.extend(int.to_bytes(len(uid), 1, byteorder='little'))
        newfile.extend(bytearray(map(ord, uid)) )
        #print(filename, fileSize)

    startFile = bytearray()
    startFile.extend(bytearray(map(ord, "QREADS")))
    startFile.extend(int.to_bytes(3, 2, byteorder='little'))
    startFile.extend(int.to_bytes(fileOffsetStart, 8, byteorder='little'))
    startFile.extend(int.to_bytes(2147483648, 4, byteorder='little'))
    startFile.extend(int.to_bytes(uidTableOffset, 8, byteorder='little'))

    print(len(newfile))
    writeFile = open("api/NewStack.img", "wb")
    writeFile.write(newfile)
    writeFile.seek(0)
    writeFile.write(startFile)
    writeFile.close()

def parsestack(stackpath):
    print("Parsing stack file at: " , stackpath)
    offsetArray = []
    uidArray = []
    #integers = struct.unpack('H'*count, barray)
    shutil.rmtree('img')
    try:
      os.makedirs('img')
    except OSError as e:
      pass

    if os.path.isfile( stackpath):
        fh = open(stackpath, 'rb')
        m = mmap.mmap(fh.fileno(), 0, access=mmap.ACCESS_READ)
        ba = bytearray(m)
        print(ba[0:6], str(ba[0:6]))
        stacktype = int.from_bytes(ba[6:8], byteorder='little')
        offset = int.from_bytes(ba[8:16], byteorder='little')
        maxrange = int.from_bytes(ba[16:20], byteorder='little')
        uidOffset = int.from_bytes(ba[20:28], byteorder='little')

        print("stackfile Type: ", stacktype)
        print("Offset: ", offset )
        print("Maxrange: ", maxrange)
        print("UID Offset: ", uidOffset)

        numElements = int.from_bytes(ba[offset:offset+2], byteorder='little')
        print("Number of Elements: ", numElements)
        elemStart = offset + 2
        for i in range (0, numElements):
          elemOffset = int.from_bytes(ba[elemStart:elemStart+8], byteorder='little')
          #print (" seq " , i, elemOffset)
          offsetArray.append(elemOffset)
          elemStart += 8

        offsetArray.append(offset)
        # for i in range (0, numElements + 1):
        #     print(i,offsetArray[i])


        numUIDs = int.from_bytes(ba[uidOffset:uidOffset+2], byteorder='little')
        print("Number of UIDs: ", numUIDs)
        uidstart = uidOffset + 2
        for i in range (0, numUIDs):
          uidlength = int.from_bytes(ba[uidstart:uidstart+1], byteorder='little')
          #print (" seq " , i, uidlength)
          uidstart += 1
          uidString = ba[uidstart:uidstart+uidlength]
          #print("UID : ", str(uidString)[12:-2])
          uidstart += uidlength
          uidArray.append(str(uidString)[12:-2])

        for i in range (0, numUIDs ):
            uid = uidArray[i]

            #print(i,   prevOffset,  offsetArray[i], offsetArray[i+1] - offsetArray[i])
            filebytes = ba[offsetArray[i]:offsetArray[i+1]]
            writeImgFile(filebytes, "img/" + uid + '.dcm')


        # print (convertBytesToShort(ba[7:9], 0))
        # print(struct.unpack('H'*1,ba[7:9]))
        print(len(ba))
    else:
      print("File does not exist: ", stackpath)

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
       filepath = arguments #"42_19780259-1_1.2.840.113717.2.19780259.1_1.3.6.1.4.1.25403.1322.6188.20120314113107.1717.2.19780259.1.img"
       #createStackFile("api/")
       parsestack(filepath)

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
