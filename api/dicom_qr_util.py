import sys
import argparse
from sys import platform as _platform

def isRunningInWindows():
    if _platform == "linux" or _platform == "linux2":
        return False
    elif _platform == "darwin":
         return False
    elif _platform == "win32":
        return True
    elif _platform == "win64":
        return True
    else :
        print(_platform)
        return True


def getOSFriendlyPath(PathName):
  MappedPath = ""
  if  isRunningInWindows():
    MappedPath = reverseMountPoints(PathName)
  else:
    MappedPath = configureMountPoint(PathName)

  return MappedPath


def configureMountPoint(uncPathName):
  MappedPath = ""
  if (uncPathName != "") :
     if (uncPathName.startswith("\\\\mfad.mfroot.org\\RCHDept")) :
          MappedPath = uncPathName.replace(r"\\\\\\\\mfad.mfroot.org\\\\RCHDept\\\\", r"/qreadscis/mcr/")
     elif (uncPathName.startswith(r"\\\\mfad\\RCHDept")) :
          MappedPath = uncPathName.replace("\\\\\\\\mfad\\\\RCHDept\\\\", "/qreadscis/mcr/")
     elif (uncPathName.startswith("\\\\mcsqread11")) :
          MappedPath = uncPathName.replace("\\\\\\\\mcsqread11\\\\", "/qreadscis/mca/")
     elif (uncPathName.startswith("\\\\mfad\\mcaapp\\QREADS")) :
          MappedPath = uncPathName.replace("\\\\\\\\mfad\\\\mcaapp\\\\QREADS\\\\", "/qreadscis/mcs/")
     elif (uncPathName.startswith("\\\\mfad.mfroot.org\\mcaapp\\QREADS")) :
          MappedPath = uncPathName.replace("\\\\\\\\mfad.mfroot.org\\\\mcaapp\\\\QREADS\\\\", "/qreadscis/mcs/")
     elif (uncPathName.startswith("\\\\mfad.mfroot.org\\rchdept")) :
          MappedPath = uncPathName.replace("\\\\\\\\mfad.mfroot.org\\\\rchdept\\\\", "/qreadscis/mcr/")
     elif (uncPathName.startswith("\\\\mfad\\mcf")) :
          MappedPath = uncPathName.replace("\\\\\\\\mfad\\\\mcf\\\\", "/cig/mcf/")
     elif (uncPathName.startswith("\\\\mfad.mfroot.org\\mcf")) :
          MappedPath = uncPathName.replace("\\\\\\\\mfad.mfroot.org\\\\mcf\\\\", "/cig/mcf/")
     else:
       MappedPath = uncPathName
       pass

     MappedPath = MappedPath.replace("\\\\", "/")
  return uncPathName


def reverseMountPoints(uncPathName):
        MappedPath = ""
        if (uncPathName != None) :
            #Map STORE_PATH to UNIX mount points - this is case sensitive
            if (uncPathName.startswith("/qreadscis/mcr/")):
                uncPathName = uncPathName.replace("/qreadscis/mcr/", "\\mfad.mfroot.org\\RCHDept\\")
            elif (uncPathName.startswith("/qreadscis/mca/")):
                uncPathName = uncPathName.replace("/qreadscis/mca/", "\\mcsqread11\\")
            elif (uncPathName.startswith("/qreadscis/mcs/")):
                uncPathName = uncPathName.replace("/qreadscis/mcs/", "\\mfad.mfroot.org\\mcaapp\\QREADS\\")
            elif (uncPathName.startswith("/cig/mcf/")):
                uncPathName = uncPathName.replace("/cig/mcf/", "\\mfad.mfroot.org\\mcf\\")
            elif (uncPathName.startswith("/cig/mcr/")):
                uncPathName = uncPathName.replace("/cig/mcr/", "\\\\rchqrdvs01\\cig")
            else:
                uncPathName = uncPathName.replace("/cig/mcf/", "\\mfad.mfroot.org\mcf\\")

            MappedPath = uncPathName.replace("/", "\\")
            #print(uncPathName)

        return MappedPath

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

    if command.strip() == 'checkos' :
       print("checkos -> win: " + str(isRunningInWindows()))
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
