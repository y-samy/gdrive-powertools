// RECOMMENDED
// same as images.js but adds them to zip file
// WARNING: gets blocked by CSP when viewing a pdf directly from a link
// workaround: star the file or add shortcut to your drive and open from there
// alt workaround (chromium): save the scripts as snippets in dev tools, load them,
// then run start(remoteDeps = false)
function detectPages() {
    let pages = document.getElementsByTagName('img');
    let n = 0;
    let filtered = [];
    for (let p in pages) {
        page = pages[p];
        if (!/^blob:/.test(page.src)) {
            continue;
        }
        n++;
        filtered.push(pages[p]);
    }
    correct = confirm(`${n} Pages were found. Is this number correct?`);
    if (correct == true) {
        return filtered;
    } else {
        alert("If the number was incorrect, please scroll to the bottom and allow all pages to load. Refresh the webpage after every document.");
        return null;
    }
}

function makeArchive(data) {
    if (data == null) return null;
    let defaultName = JSON.parse(document.getElementById("drive-active-item-info").innerHTML).title.replace('.pdf', '');
    let archiveName = prompt("Please choose a name for the .zip archive:", defaultName);
    if (archiveName == null) return;
    const zip = new JSZip();
    n = 0;
    for (let i in data) {
        n++;
        filename = `Page ${n}.png`;
        zip.file(filename, data[i], { base64: true });
        console.log(`File "${filename}" added to archive.`);
    }
    zip.generateAsync({ type: 'blob' }).then(function (content) {
        console.log("Archive ready. Saving..");
        saveAs(content, `${archiveName}.zip`);
    });
}

function getPageData(images) {
    if (images == null) return null;
    n = 0;
    imgDataList = [];
    for (let i in images) {
        n++;
        img = images[i];
        console.log(`Obtaining image for page ${n}`);
        let can = document.createElement('canvas');
        let con = can.getContext("2d");
        can.width = img.width;
        can.height = img.height;
        con.drawImage(img, 0, 0, img.width, img.height);
        let imgData = can.toDataURL("image/png", 1.0);
        imgDataList.push(imgData.replace('data:image/png;base64,', ''));
    }
    return imgDataList;
}


function loadDeps(srcList, nTotal, mainLoop) {
    loadedScripts = 0;
    for (let src in srcList) {
        let script = document.createElement("script");
        script.src = srcList[src];
        script.type = "text/javascript";
        script.addEventListener('load', () => {
            loadedScripts++;
            if (loadedScripts == nTotal) {
                mainLoop();
            }
        });
        document.body.appendChild(script);
    }

}


function start(remoteDeps = true) {

    function main() {
        return makeArchive(getPageData(detectPages()));
    }

    depSources = ["https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js", "https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"];
    nDeps = 2;
    if (remoteDeps == true) {
        loadDeps(depSources, nDeps, main);
    } else if (remoteDeps == false) {
        main();
    }
}

start();