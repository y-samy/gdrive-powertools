# View-only Google Drive PDFs - A Small Study

> [!NOTE]
> The effort to reveal the inner workings of interactions with read-only files have moved to their own folder.

> [!WARNING]
> This isn't meant to encourage copyright infringement but is only there for people who intend to archive and track important documents in case any unnoticed changes happen to them.

To address such a problem, we need to take a closer look at how Google Drive stores and displays PDFs that are limited by their owners to be view-only.\
\
*There are 2 ways Google Drive stores or displays these files.*\
One way for viewing through the mobile application. The other way is for viewing through the web.

## The Mobile Application

#### Introduction

The Google Drive mobile application, available on Android and iOS, stores and reads the PDF file in a very different way to the way it is done through a web browser. The application *actually* downloads and stores the PDF file in an inaccessible location, then opens it without download or print permissions through the Google Drive app.\
\
This can be circumvented on iOS by taking a shortcut of the file to your files, then sharing it as a PDF.\
On Android, however, things are not as straightforward for the average user.

#### File Location

Drive downloads the PDF file from the very beginning every time you tap to open that document or its link. The file is then stored under an ambiguous file name under in Android's cache directory for the app, `/data/data/com.google.android.apps.docs/cache/`, which is usually only accessible for reading on rooted devices.

#### Using a Rooted Emulator with ADB

Luckily, you don't need to root your own device, you may more easily resort to using an Android emulator that has Google Drive on it and can log into a Google account. Then once you open the PDF, you will find it has downloaded under `/data/data/com.google.android.apps.docs/cache/shiny_blobs/blobs/` with a unreadable name.\
To obtain that file, you may use a root-enabled file manager on the device, or connect to it using `adb` with root access to pull the file onto the system hosting the emulator or virtual instance of Android.\
\
The only challenge then, when doing it for multiple files in a short duration, is keeping track of which newly-spawned amiguously-named file actually is the one you just opened in the app. One way to cope with this is to clear the app's cache after every successful extraction. You may also resort to file metadata checks to verify the file you're extracting.

I've chosen to make a few python scripts for that under the `android-adb-root`, which utilize `adb` to connect to an emulator with root access to perform the extraction, and contains files that utilize the Google Drive v3 API to request the metadata from Google Drive to check it against the local file.
#### Relative Drawbacks

- Complicated setup
- [Emulator] Takes more time to load up every time
- [Emulator, Python, ADB] May not as be available on all your devices

#### Relative Advantages

- Lower subsequent internet bandwidth usage
- Usually lower disk usage
- Original file is downloaded:
- including full access to scalable graphics & text
- including highest resolution images

## Web Browser Viewer

#### Introduction

The Google Drive web viewer doesn't download, stream, or store the actual PDF anywhere on the viewer's machine. Instead, it loads pre-rendered images of each page along with its text content for selection. Sadly, this may mean you won't have access to vector graphics or the scalable text on your PDF if you choose to go down this route - unless you know how to extract the text from the HTML elements (easy) and how to place them on the PDF (harder?).\
\
Accessing these images though is very easy. They are stored as URLs in the HTML body and can be identified by a certain naming scheme: they all begin with `blob:`, as well as the name of their HTML element tag: `img`. Doing this programmatically with a bit of javascript only requires a browser, *on any device*, which has access to the javascript console: usually under "Developer Tools". It is further made easier by the fact that these image elements are ordered in the order of the pages, so downloading them sequentially guarantees identifying which image is of what page.

#### Different Methods of Storing & Manipulating the Image Files

There are a few ways we can deal with the images once we obtain them:

- Downloading them one-by-one [straightforward, but can lag a browser]
- Archiving them in a `.zip` file then downloading that [uses an extra js script]
- Making a PDF directly in the browser [using an extra js script]

The methods that use an extra js script usually fetch them from a remote file host using a URL, this is disallowed by the Google Drive PDF viewer's Content Security Policy *only when viewing a PDF directly from its url*. Meaning you can have a shortcut to that PDF on one of the Drive folders you have access to, and these scripts would work fine.\
\
I've chosen to provide access to these scripts under `js-browser-scripts`.

#### High Resolution Images & Other Caveats

- The PDF viewer will refresh the HTML body with new URLs to higher-resolution images the more you use its built-in zoom feature.
- To force all the images to load, one must scroll all the way down to the bottom of the document inside the PDF viewer after choosing the resolution (by adjusting zoom).
- The total size of all the highest-quality image files usually is many times larger than the size of the PDF itself, meaning a much higher internet bandwidth usage, much higher disk or RAM usage before compilation, and a tougher-to-compress PDF for the external script.
- When using the highest resolution images with a good close-to-lossless-compression PDF maker, the resulting file is usually smaller or close in size to the original PDF file, and almost indistinguishable in quality.

## Credits

Most of the code I will upload is inspired by, or adapted and improved from other people's code. I will credit their work in the respective directories.