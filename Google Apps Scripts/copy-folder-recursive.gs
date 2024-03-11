/*
https://gist.github.com/KenjiOhtsuka/d4432b6d80ad2b81ab7c965de2a8a00d
*/
var sourceDirID = '';
var targetDirID = '';

function startCopyFolder() {
  // put source folder ID.
  const fromFolder = DriveApp.getFolderById(sourceDirID)
  // put destination folder ID.
  const toFolder = DriveApp.getFolderById(targetDirID)
  // copy the folder content recursively.
  copy(fromFolder, toFolder)
}

function copyFolder(fromFolder, toFolder) {
  // copy files
  var files = fromFolder.getFiles()
  while (files.hasNext()) {
    var file = files.next();
    var newFile = file.makeCopy(toFolder)
    console.log(file.getName())
    newFile.setName(file.getName())
  }

  // copy folders
  var folders = fromFolder.getFolders()
  while (folders.hasNext()) {
    var folder = folders.next()
    var newFolder = toFolder.createFolder(folder.getName())
    copy(folder, newFolder)
  }
}