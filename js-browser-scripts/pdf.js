// script to combine the losslessly compressed images into a PDF
// usually produces a much larger PDF file than using Acrobat Pro to make it from the image files
// adapted from https://codingcat.codes/2019/01/09/download-view-protected-pdf-google-drive-js-code/
// will not work if you open the document in an isolated window, as in: not from within a google drive folder
let jspdf = document.createElement("script");
jspdf.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
jspdf.onload = function createpdf() {
    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF();
    var width = pdf.internal.pageSize.getWidth();
    var height = pdf.internal.pageSize.getHeight();
    pages = detectPages();
    if (pages == false) {
        return;
    }
    n = 0;
    for (let i in pages) {
        let img = pages[i];
        if (!/^blob:/.test(img.src)) {
            continue;
        }
        let can = document.createElement('canvas');
        let con = can.getContext("2d");
        can.width = img.width;
        can.height = img.height;
        con.drawImage(img, 0, 0, img.width, img.height);
        let imgData = can.toDataURL("image/jpeg", 1.0);
        pdf.addImage(imgData, 'jpeg', 0, 0, width, height, i, "MEDIUM");
        n++;
        console.log("Adding Page " + n);
        if (n < pages.length) {
            pdf.addPage();
        }
    }
    let defaultName = JSON.parse(document.getElementById("drive-active-item-info").innerHTML).title.replace('.pdf', '');;
    let documentName = prompt("Please choose a name for the PDF:", defaultName);
    if (documentName == null) return;
    pdf.save(`${documentName}.pdf`);
};

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
    correct = confirm(n + " Pages were found. Is this number correct?");
    if (correct == true) {
        return filtered;
    } else {
        alert("Please scroll to the bottom and allow all pages to load. Refresh the page after every document.");
        return false;
    }
};
document.body.appendChild(jspdf);