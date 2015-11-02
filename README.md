

## Find extension source
```
$ cd ~/.config/chromium/
$ find -name 'cite.js'
./Default/Extensions/nnnmhgkokpalnmbeighfomegjfkklkle/2.6.1_0/js/cite.js

$ mkdir -p ~/Projects/CiteThisForMe-WebCiter/v2.6.1
$ cp -p ./Default/Extensions/nnnmhgkokpalnmbeighfomegjfkklkle/2.6.1_0/ ~/Projects/CiteThisForMe-WebCiter/v2.6.1
```

## Install yeoman/generator-chrome-extension
```
$ sudo npm install -g yo
$ sudo npm install -g generator-chrome-extension

$ cd ~/Projects/CiteThisForMe-WebCiter
$ yo chrome-extension

? What would you like to call this extension? CiteThisForMe WebCiter
? How would you like to describe this extension? My Chrome Extension
? Would you like to use UI Action? Browser Action
? Would you like more UI Features? 
? Would you like to set permissions? 
   create bower.json
   create package.json
   create Gruntfile.js
identical .gitignore
identical .gitattributes
identical .bowerrc
identical .jshintrc
identical .editorconfig
   create app/manifest.json
   create app/popup.html
   create app/scripts.babel/popup.js
   create app/images/icon-19.png
   create app/images/icon-38.png
   create app/scripts.babel/background.js
   create app/scripts.babel/chromereload.js
identical .babelrc
   create app/styles/main.css
   create app/_locales/en/messages.json
   create app/images/icon-16.png
   create app/images/icon-128.png
   create test/spec/test.js
   create test/index.html
```
Go to 'chrome//extensions' from url bar and try to load with "Load unpacked extension..." and
get the following error:

Failed to load extension from: ~/Projects/CiteThisForMe-WebCiter/app
Could not load background script 'scripts/chromereload.js'.

## Use existing "Web Citer" extension source as base
```
$ cd ~/Projects/CiteThisForMe-WebCiter/v2.6.1
$ git init
$ git add .
$ git commit -m 'original extension source'

# Can't load extension that has directory starting with underscore, remove _metadata directory
$ git rm -r _metadata

# Change manifest_version to "2.6.1.1" (append ".1" at the end of version)
$ vi manifest.json
$ git add manifest.json
$ git rm images/Thumbs.db
$ git commit -m 'cleanup to load as unpack extension from chrome://extensions'

$ vi js/cite.js
                    var ref = data.referenceString;
                    ref = ref.replace(urlToCite, '[' + urlToCite + '](' + urlToCite + ')');
                    // populate the visible area
                    $('.authorName').text(data.author);
                    $('.sourceType').html(data.sourceType);
                    $('.referenceString').html(ref);
                    $('#Url').val(urlToCite);

$ git commit -m 'Fix referenceString to include markdown url'
```

## References & External Links
 * https://developer.chrome.com/extensions/devguide
 * https://github.com/yeoman/generator-chrome-extension
