const folderID = '';
const nameToCheckFor = ''

const dir = DriveApp.getFolderById(folderID);


function startCheckOwner() {

  filterCheckOwner(dir, nameToCheckFor)

}

function filterCheckOwner(folder, ownerName) {
  function getPathCheckOwner(file){
    var parents = file.getParents();
    var parent;
    var pathString = file.getName() ;
    while (parents.hasNext()){
      parent = parents.next();
      pathString = parent.getName() + "/" + pathString;
      parents = parent.getParents()
    }
    return pathString
  }

  function processFilesCheckOwner(folder){
    var files = folder.getFiles()
    while (files.hasNext()) {
      var file = files.next();
      if ( file.getOwner().getName() == ownerName){
        trueFilePath = getPathCheckOwner(file)
        Logger.log(trueFilePath)
      }
    }
  }

  function spreadFolderCheckOwner(folder){
    while (folder.hasNext()) {
      var f = folder.next();
      processFilesCheckOwner(f)
      var subFolder = f.getFolders();
      spreadFolderCheckOwner(subFolder);
    }
  }
  spreadFolderCheckOwner(dir.getFolders())
}