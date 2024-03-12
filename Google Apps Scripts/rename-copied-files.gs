/* https://gist.github.com/edoan/181094b112b848404dd814d44b71369c */
function copiesRenamer() {
  var folders = DriveApp.getFoldersByName('B');
  var folder = folders.next();
  var files = folder.getFiles();
  
  while(files.hasNext()){
    var file = files.next()
    var fileName = file.getName();
    if (fileName.indexOf('Copy of ') > -1) {
        fileName= fileName.split('Copy of ')[1];
        file.setName(fileName);
    };
  };
}
