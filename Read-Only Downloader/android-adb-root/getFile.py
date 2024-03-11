from getFileMetaData import main as getMetaData
import subprocess
from time import time, sleep

def adbShellCMD(cmd):
    return ['adb', 'shell', cmd]

def getModDate():
    cmd = adbShellCMD('su root stat -c "%Y" /data/data/com.google.android.apps.docs/cache/shiny_blobs/blobs')
    return int(subprocess.check_output(cmd).decode().replace("\n",""))

def getModDateForFiles():
    cmd = adbShellCMD('su root ls /data/data/com.google.android.apps.docs/cache/shiny_blobs/blobs')
    fileList = list(subprocess.check_output(cmd).decode().split("\r\n"))[0:-1]
    dateList = {}
    for file in fileList:
        date = adbShellCMD(str('su root stat -c "%Y" /data/data/com.google.android.apps.docs/cache/shiny_blobs/blobs/' + file))
        dateList.update({file:(int(subprocess.check_output(date).decode().replace("\n","")))})
    return dateList


fileID = str(input("Enter file ID:"))

fileData = getMetaData(fileID)
fileName = fileData["name"]
fileSize = int(fileData["size"])



def openInDrive(id):
    link = str("https://drive.google.com/file/d/" + id + "/view")
    cmd = adbShellCMD(str('am force-stop com.google.android.apps.docs'))
    subprocess.run(cmd)
    startTime = int(time())
    sleep(3)
    cmd = adbShellCMD(str('am start -n com.google.android.apps.docs/.drive.openurl.OpenUrlActivity "' + link + '"'))
    subprocess.run(cmd)
    return startTime


timeOfRunning = openInDrive(fileID)

while getModDate() < timeOfRunning:
    continue

def identifyFile(fileModDates, folderModDate):
    for i in fileModDates:
        if fileModDates[i] == folderModDate:
            return str(i)

file = identifyFile(getModDateForFiles(), getModDate())
filePath = str("/data/data/com.google.android.apps.docs/cache/shiny_blobs/blobs/" + file)

def getFileSize(path):
    cmd = adbShellCMD(str("su root du -b " + path))
    return int(subprocess.check_output(cmd).decode().strip("\rnt").replace(path,""))


def pullFile(path, name):
    outFolder = r"/storage/emulated/0/GDRIVE-OUT/"
    cmd = adbShellCMD(str("su root mkdir " + outFolder))
    subprocess.run(cmd)
    cmd = adbShellCMD(str("su root cp " + path + " " + outFolder + str('"' + name + '"')))
    subprocess.run(cmd)
    cmd = ["adb", "pull", str(outFolder + name), "./Output/"]
    subprocess.run(cmd, shell=True)
    cmd = adbShellCMD(str("rm -rf " + outFolder + "*"))
    subprocess.run(cmd)

if getFileSize(filePath) == fileSize:
    pullFile(filePath, fileName)
    