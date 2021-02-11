Option Explicit
'****DO NOT USE ANY SPACES IN AppName****  AppName is used by MSL_Launcher in GetAppLaunchString() Function below
Const AppName = "Qreads"
'Set Persist= True if this application is one we want to remain running in Patient Care Mode when a new user unlocks the workstation.
'If Persist is False then MSL_Launcher will terminate this app when a new user unlocks the workstation in Patient Care Mode.
Const Persist = True

Const HKEY_CLASSES_ROOT = &H80000000
Const HKEY_CURRENT_USER = &H80000001
Const HKEY_LOCAL_MACHINE = &H80000002
Const HKEY_USERS = &H80000003

Const ForAppending = 8

Dim objWshShell, objArgs, objNetwork, objFSO, objWMI, objReg

Dim strKeyPath, strValueName, strValue, OSVersion, strMsg, intAnswer, strResult, strLogShare, LogFile, strUserName, strMSLLauncher
Dim strProgramFiles, strAppFolder, strSiteName, strInstallPackagesPath, strAppExe, strAppJar, strLauncher, strRunString, strArg, strArgs, strLogEntry, strComputerName
Dim strJavaVersion, strQREADSJava64BitBundle, strQREADSJava32BitBundle, strQREADSJavaDestDir, strQREADSJava, strJRockitJavaBundle, strJRockitJavaDestDir, strJRockitJava
Dim strServer, strMCRProdServer, strMCAProdServer, strMCFProdServer, strMCRIntServer, strMCAIntServer, strMCFIntServer, strTstServer
Dim strJavaExe, strEnvironment, strJVMOptions, bOfflineMode, strAppSourceDir

'Set objNetwork = CreateObject("WScript.Network")
'Set objWMI = GetObject("winmgmts:\\.\root\CIMV2") 
Set objWshShell = WScript.CreateObject("WScript.Shell")
Set objArgs = WScript.Arguments
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objReg = GetObject("winmgmts:{impersonationLevel=impersonate}!\\.\root\default:StdRegProv")

strUserName=UCase(objWshShell.ExpandEnvironmentStrings("%USERNAME%"))
strComputerName=objWshShell.ExpandEnvironmentStrings("%COMPUTERNAME%")
strSiteName=objWshShell.ExpandEnvironmentStrings("%MF_AD_OU_SITE_NAME%")
strInstallPackagesPath=objWshShell.ExpandEnvironmentStrings("%MF_INSTALL_PACKAGES_PATH%")
strMSLLauncher = "C:\Program Files\Mayo Foundation\MSL\Launchers\MSL_Launcher.exe"

strProgramFiles = "C:\Program Files"
strAppFolder = strProgramFiles & "\Mayo Foundation\QREADS 5"
strLauncher = "QREADS Launcher.vbs"

strJVMOptions = "-XX:SurvivorRatio=4 -XX:NewRatio=10 -Xms512M -Xmx2G"
strQREADSJava64BitBundle = "QREADS\Java\jre1.8.0_161-64-Bit"
strQREADSJava32BitBundle = "QREADS\Java\jre1.8.0_40"
strJRockitJavaBundle = "QREADS 5\jrockit-jre1.6.0_45"
strJavaExe = Java64BitExe()

bOfflineMode = false

'**********************************************************
'** Initialize the QREADS server and routelist params.   **
'**********************************************************

strMCRProdServer = "server=http://qreadsprod8.mayo.edu/MCRQREADS/ routelist=mcrRouteList.config"
strMCAProdServer = "server=http://mcaqrdprod8.mayo.edu/MCAQREADS/ routelist=mcaRouteList.config"
strMCFProdServer = "server=http://mcfqrdprod8.mayo.edu/MCFQREADS/ routelist=mcfRouteList.config"
strMCRIntServer = "server=http://qreadsint8.mayo.edu/MCRQREADS/"
strMCAIntServer = "server=http://mcaqrdint8.mayo.edu/MCAQREADS/"
strMCFIntServer = "server=http://mcfqrdint8.mayo.edu/MCFQREADS/"
strTstServer = "server=http://qreadsdev8.mayo.edu/MCRQREADS/"

'********************************************************
'** Get the site and install packages path.            **
'********************************************************

GetSite()

'********************************************************
'** Determine and set the environment if specified.    **
'** The default is production. Determine if an offline **
'** mode was requested and if so bypass server setup.  **
'********************************************************

For Each strArg in objArgs
	If StrComp(strArg, "environment=int", 1) = 0 Then
		strEnvironment = "\Integration"
	ElseIf StrComp(strArg, "environment=test", 1) = 0 Then
		strEnvironment = "\Test"
	ElseIf StrComp(strArg, "mode=orbackup", 1) = 0 Then
		bOfflineMode = true
	ElseIf StrComp(strArg, "mode=standalone", 1) = 0 Then
		bOfflineMode = true
	End If
	strArgs = strArgs & " " & strArg
Next
'WScript.Echo "strArgs: " & strArgs

'********************************************************
'** For MCHS use the MCR install packages path and the **
'** MCR server configuration.                          **
'********************************************************

If bOfflineMode = true Then
	strServer = ""

ElseIf strEnvironment = "" Then
	'**********************
	'** PROD Environment **
	'**********************
	Select Case(strSiteName)
		Case "MCR"
			strServer = strMCRProdServer
		Case "MCA"
			strServer = strMCAProdServer
		Case "MCF"
			strServer = strMCFProdServer
		Case Else
			strServer = strMCRProdServer
			strInstallPackagesPath = "\\mfad.mfroot.org\rchapp\WKSAdmin\install_packages"
	End Select

ElseIf strEnvironment = "\Integration" Then
	'**********************
	'** INT Environment  **
	'**********************
	Select Case(strSiteName)
		Case "MCR"
			strServer = strMCRIntServer
		Case "MCA"
			strServer = strMCAIntServer
		Case "MCF"
			strServer = strMCFIntServer
		Case Else
			strServer = strMCRIntServer
			strInstallPackagesPath = "\\mfad.mfroot.org\rchapp\WKSAdmin\install_packages"
	End Select

ElseIf strEnvironment = "\Test" Then
	'**********************
	'** TEST Environment **
	'**********************
	Select Case(strSiteName)
		Case "MCR"
			strServer = strTstServer
		Case "MCA"
			strServer = strTstServer
		Case "MCF"
			strServer = strTstServer
		Case Else
			strServer = strTstServer
			strInstallPackagesPath = "\\mfad.mfroot.org\rchapp\WKSAdmin\install_packages"
	End Select

End If

'********************************************************
'** Attempt to download the QREADS Launcher.vbs for    **
'** the specific environment requested.                **
'********************************************************

strAppSourceDir = strInstallPackagesPath & "\QREADS\QREADS 5"  & strEnvironment
strAppFolder = strAppFolder & strEnvironment
strRunString = "robocopy " & Chr(34) & strAppSourceDir & Chr(34) & " " & Chr(34) & strAppFolder & Chr(34) & " " & Chr(34) & strLauncher & Chr(34) & " /R:3 /W:1"

'Wait for the copy to finish before continuing.
'WScript.Echo "Executing: " & strRunString
objWshShell.Run strRunString, 0, True

'********************************************************
'** If the launcher is found then call it.             **
'********************************************************
strLauncher = strAppFolder & "\" & strLauncher

If objFSO.FileExists(strLauncher) Then
	strRunString = Chr(34) & strLauncher & Chr(34) & strArgs
	'WScript.Echo "Executing: " & strRunString
	objWshShell.Run strRunString, 0, False

Else
	'****************************************************
	'** Otherwise just try to launch QREADS from here. **
	'****************************************************
	strAppJar = strAppFolder & "\QReadsApp.jar"

	If objFSO.FileExists(strAppJar) Then
		If objFSO.FileExists(strJavaExe) Then

			objWshShell.CurrentDirectory = strAppFolder
			strRunString = Chr(34) & strJavaExe & Chr(34) & " -Djava.library.path=" & Chr(34) & strAppFolder & Chr(34) & " " & strJVMOptions & " -jar " & Chr(34) & strAppJar & Chr(34) & " " & strServer & strArgs

			'Make intWindowStyle a constant when launching QReads directly. If it is set to hide then QReads will not show on some operating systems.
			'WScript.Echo "Executing: " & strRunString
			objWshShell.Run strRunString, 1, False

		Else
			strLogEntry = GetTimeStamp() & " [Qreads.vbs] ERROR - Unable to access " & strJavaExe & " indicating a missing or incomplete Java installation on this device. Cannot launch QREADS at this time." & vbCrLf
			WriteFile "\\mfad.mfroot.org\rchapp\logging\QREADS\Startup", strComputerName & ".log", strLogEntry

		End If
	Else
		strLogEntry = GetTimeStamp() & " [Qreads.vbs] ERROR - Unable to access " & strAppJar & " indicating a missing or incomplete QREADS installation on this device. Cannot launch QREADS at this time." & vbCrLf
		WriteFile "\\mfad.mfroot.org\rchapp\logging\QREADS\Startup", strComputerName & ".log", strLogEntry

	End If
End If

'Set objNetwork = Nothing
'Set objWMI = Nothing
Set objWshShell = Nothing
Set objFSO = Nothing
Set objReg = Nothing

WScript.Quit(0)

'*********************************
'**  Functions and Subroutines  **
'*********************************

Function Java32BitVersion()
	On Error Resume Next

	If StrComp(OSBitCheck(), "64-bit") = 0 Then
		Java32BitVersion = objWshShell.RegRead("HKLM\SOFTWARE\Wow6432Node\JavaSoft\Java Runtime Environment\CurrentVersion")
	Else
		Java32BitVersion = objWshShell.RegRead("HKLM\SOFTWARE\JavaSoft\Java Runtime Environment\CurrentVersion")
	End If

End Function

Function Java64BitVersion()
	On Error Resume Next

	Java64BitVersion = objWshShell.RegRead("HKLM\SOFTWARE\JavaSoft\Java Runtime Environment\CurrentVersion")

End Function

Function Java32BitExe()
	On Error Resume Next

	strJRockitJavaDestDir = strProgramFiles & "\Mayo Foundation\" & strJRockitJavaBundle
	'Set the JRockit JRE launch executable for 32-Bit Java.
	strJRockitJava = strJRockitJavaDestDir & "\bin\javaw.exe"

	strQREADSJavaDestDir = strProgramFiles & "\Mayo Foundation\" & strQREADSJava32BitBundle
	'Set the bundled JRE launch executable for 32-Bit Java.
	strQREADSJava = strQREADSJavaDestDir & "\bin\javaw.exe"

	If objFSO.FileExists(strJRockitJava) Then
		Java32BitExe = strJRockitJava
		strJVMOptions = "-client -Xms512M -Xmx768M"
	ElseIf objFSO.FileExists(strQREADSJava) Then
		Java32BitExe = strQREADSJava
	ElseIf StrComp(OSBitCheck(), "64-bit") = 0 Then
		Java32BitExe = "C:\Windows\SysWOW64\javaw.exe"
	Else
		Java32BitExe = "C:\Windows\system32\javaw.exe"
	End If

End Function

Function Java64BitExe()
	On Error Resume Next

	strQREADSJavaDestDir = strProgramFiles & "\Mayo Foundation\" & strQREADSJava64BitBundle
	'Set the bundled JRE launch executable for 64-Bit Java.
	strQREADSJava = strQREADSJavaDestDir & "\bin\javaw.exe"

	'The decision was made to not fall back to the system installed Java but
	'rather to identify that the dedicated JRE bundle has not been installed
	'and have that issue serviced.
'	If objFSO.FileExists(strQREADSJava) Then
		Java64BitExe = strQREADSJava
'	Else
'		Java64BitExe = "C:\Windows\system32\javaw.exe"
'	End If

End Function

Function OSBitCheck()
	On Error Resume Next
	strKeyPath = "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"
	strValueName = "PROCESSOR_ARCHITECTURE"

	objReg.GetStringValue HKEY_LOCAL_MACHINE, strKeyPath, strValueName, strValue

	If strValue = "AMD64" Then
		OSBitCheck = "64-bit"
	Else
		OSBitCheck = "32-bit"
	End If
End Function

Function GetSite()
	On Error Resume Next

	'Verify "MF_AD_OU_SITE_NAME" and "MF_INSTALL_PACKAGES_PATH" System Environment Variables are set
	If IsNothing(strSiteName) Or IsNothing(strInstallPackagesPath) Or strSiteName = "%MF_AD_OU_SITE_NAME%" Or strInstallPackagesPath = "%MF_INSTALL_PACKAGES_PATH%" Then
		'"MF_AD_OU_SITE_NAME" or "MF_INSTALL_PACKAGES_PATH" System Environment Variables NOT set. Query Registry.

		strKeyPath = "SOFTWARE\Mayo Foundation\MFLogon"
		strValueName = "MF_AD_OU_SITE_NAME"	
		objReg.GetStringValue HKEY_LOCAL_MACHINE,strKeyPath,strValueName,strSiteName

		strValueName = "MF_INSTALL_PACKAGES_PATH"
		objReg.GetStringValue HKEY_LOCAL_MACHINE,strKeyPath,strValueName,strInstallPackagesPath

		If IsNothing(strSiteName) Then
			strSiteName = "MCR"
		End If

		If IsNothing(strInstallPackagesPath) Then
			strInstallPackagesPath = "\\mfad.mfroot.org\rchapp\WKSAdmin\install_packages"
		End If	
	End If
	
End Function

Function WriteFile(filePath, fileName, contents)
	On Error Resume Next
	Dim outStream

	If objFSO.FolderExists(filePath) Then

		fileName = objFSO.buildpath(filePath, fileName)
		Set outStream = objFSO.OpenTextFile(fileName, ForAppending, True)
		outStream.Write contents
		outStream.Close

	End If

End Function

Function GetTimeStamp()
	On Error Resume Next
	dateTime = Now
	intTimer = Timer()

	datePortion = Year(dateTime) & "-" & Right("0" & Month(dateTime), 2) & "-" & Right("0" & Day(dateTime), 2)
	timePortion = Right("0" & Hour(dateTime), 2) & ":" & Right("0" & Minute(dateTime), 2) & ":" & Right("0" & Second(dateTime), 2)

	intSeconds = Hour(dateTime) * 3600 + Minute(dateTime) * 60 + Second(dateTime)
	intMilliseconds = Round((intTimer - intSeconds) * 1000)
	milliSeconds = Right("00" & intMilliseconds, 3)

	GetTimeStamp = datePortion & " " & timePortion & "." & milliSeconds

	'WScript.Echo "GetTimeStamp: " & GetTimeStamp

End Function

Function GetOSVersion()
	Dim strComputer, objWMIService, colOperatingSystems, objOperatingSystem, sOSVer

	'Get OS version
	strComputer = "."
	Set objWMIService = GetObject("winmgmts:" _
	    & "{impersonationLevel=impersonate}!\\" & strComputer & "\root\cimv2")

	Set colOperatingSystems = objWMIService.ExecQuery _
	    ("Select * from Win32_OperatingSystem")

	For Each objOperatingSystem in colOperatingSystems
		sOSVer = objOperatingSystem.Version
		sOSVer = Left(sOSVer, 3)
		OSVersion = CSng(sOSVer)    
	Next
End Function

Sub LogResult(ResultCode)
	If StrComp(CStr(ResultCode), "0", 1) = 0	Then
		Set LogFile = objFSO.CreateTextFile(strLogShare & "\" & strComputerName & ".txt", True)
		LogFile.WriteLine(Date & " " & Time & "   Install succeeded. Exit Code: " & CStr(ResultCode))
		LogFile.Close
	Else
		Set LogFile = objFSO.CreateTextFile(strLogShare & "\" & strComputerName & ".txt", True)
		LogFile.WriteLine(Date & " " & Time & "   Install failed. Exit Code: " & CStr(ResultCode))
		LogFile.Close
	End If
End Sub

Function GetAppLaunchString(AppToLaunch)
	Dim bAutostart
	
	If WScript.Arguments.Count = 0 Then
		bAutostart = false
	Else
		If StrComp(UCase(WScript.Arguments.Item(0)), "AUTOSTART", 1) = 0 Then
			bAutostart = True
		Else
			bAutostart = False
		End If
	End If
	
	If strUserName = "MFT0001" Then
		'Patient Care Mode. Launch everything using MSL_Launcher
		'If no switches are passed(i.e. -restart and/or -nokill)to MSL_Launcher then by default it terminates everything it launches when a 
		'user context change occurs(i.e. User A logs in, locks workstation, user B unlocks workstation)
		'-restart switch - MSL_Launcher WILL terminate app upon user context change but then restarts the app again automatically for next user to use.
		'-nokill switch  - MSL_Launcher WILL NOT terminate the app upon a user context change and will leave it running for next user to use.
		If objFSO.FileExists(strMSLLauncher) Then
			If bAutostart Then '-restart
				If Persist Then '-nokill
					'Autostart=True, Persist=True. In this situation, MSL_Launcher launches app but DOES NOT TERMINATE app when another user unlocks workstation.  If user closes app,
					'locks workstation, and new user unlocks workstation, MSL_Launcher will relaunch application since it's an application set in Mayo Dock to be autostarted.
					GetAppLaunchString = Chr(34) & strMSLLauncher & Chr(34) & " " & Chr(34) & "-" & AppName & " -loadprofile -restart -nokill -" & AppToLaunch & Chr(34)
				Else '-restart only
					'Autostart=True, Persist=False. In this situation, MSL_Launcher launches app, DOES TERMINATE app when another user unlocks workstation, but then relaunches it
					'for new user to use. We also use MSL_Launcher with restart switch in case a user closes the app during the session, we want to ensure it's launched for next 
					'user because it's an app set in Mayo Dock to be autostarted.
					GetAppLaunchString = Chr(34) & strMSLLauncher & Chr(34) & " " & Chr(34) &  "-" & AppName & " -loadprofile -restart -" & AppToLaunch & Chr(34)
				End If
			Else
				If Persist Then '-nokill
					'Autostart=False, Persist=True. In this situation, MSL_Launcher launches app but DOES NOT TERMINATE app when another user unlocks workstation.  If user closes app,
					'locks workstation, and new user unlocks workstation, MSL_Launcher WILL NOT relaunch application since it's NOT an application set in Mayo Dock to be autostarted.
					GetAppLaunchString = Chr(34) & strMSLLauncher & Chr(34) & " " & Chr(34) & "-" & AppName & " -loadprofile -nokill -" & AppToLaunch & Chr(34)
				Else				
					'Autostart=False, Persist=False. In this situation, MSL_Launcher launches app. If workstation is locked and a new user unlocks workstation, this app will be
					'terminated.  Also, this app is not restarted since it's not set in Mayo Dock to be an autostarted app. User will need to launch manually via Mayo Dock.
					GetAppLaunchString = Chr(34) & strMSLLauncher & Chr(34) & " " & Chr(34) & "-" & AppName & " -loadprofile -" & AppToLaunch & Chr(34)
				End If
			End If
		Else
			MsgBox "Unable to find MSL Launcher. Cannot launch " & AppName & " using MSL_Launcher.", vbOKOnly + vbExclamation, "MSL Launcher Not Installed!"
			GetAppLaunchString = AppToLaunch
		End If
	Else
		'Office Mode - Launch app normally without using MSL_Launcher.
		GetAppLaunchString = AppToLaunch
	End If
	
End Function

Function IsNothing(Value)
	On Error Resume Next

	Dim vTest
	Dim iArrayStart
	Dim iCtr, nDim, nRows, nCols, x, y
	Dim objLog, strErrMsg
	Dim bFlag : bFlag = false
	
	If IsEmpty(Value) Then
		IsNothing = True
		Exit Function
	End If
	
	If IsNull(Value) Then
		IsNothing = True
		Exit Function
	End If
	
	If VarType(Value) = vbString Then
		If Value = "" Then
			IsNothing = True
			Exit Function
		End If
	End If
	
	If IsNumeric(Value) Then
		If Value = 0 Then
			IsNothing = True
			Exit Function
		End If
	End If
	
	If IsObject(Value) Then
		If Value Is Nothing Then
			IsNothing = True
			Exit Function
		End If
	End If
	
	'Check for arrays	
	If IsArray(Value) Then
		nDim = NoDim(Value)
		'Handle mutli dim arrays
		If nDim = 0 then
			IsNothing = true
			Exit Function
		Elseif nDim = 1 then 'check single dim array
			On Error Resume Next
			'Handle Single dim arrays
			vTest = Value(0)
			iArrayStart = IIf(Err.Number = 0, 0, 1)
			Err.Clear
			On Error GoTo 0
			For iCtr = iArrayStart To UBound(Value)
				If Not IsNothing(Value(iCtr)) Then
					'Has something in it
					bFlag = True
					Exit For
				End If
			Next 
		
			IsNothing = Not bFlag
			Exit Function
		ElseIf nDim = 2 then
			nRows = Ubound(Value, 2)+1
			nCols = Ubound(Value, 1)+1 
		
			For x = 0 to nRows - 1
				For y = 0 to nCols - 1
					If not IsNothing(Value(y,x)) then
						bFlag = True
						Exit For
					End if
				Next
				If (bFlag) then
					Exit For
				End if
			Next
			IsNothing = Not bFlag
			Exit Function
		End if
	End If
	
	IsNothing = False
	
End Function