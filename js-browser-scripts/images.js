// RECOMMENDED
// script to download just the image files of each page
// file name format is "Page N.png"
// produces a total file size larger than the one produced by the other script
// produces a smaller sized PDF file when combined using Adobe Acrobat Pro
function detectPages() { // gets number of pages for validity checking
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
        downloadPages(filtered);
    } else {
        alert("Please scroll to the bottom and allow all pages to load. Refresh the page after every document.");
    }
}
function downloadPages(images) {
    n = 0;
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
        let link = document.createElement('a');
        link.download = `Page ${n}.png`;
        link.href = imgData;
        link.click();
    }
}
detectPages();