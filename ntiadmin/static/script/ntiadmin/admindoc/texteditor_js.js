
function buildToolbar(){
    document.write('<div id="kenfo-texteditor-toolbar" class="text-toolbar", tabindex="1234">');
    document.write('<button id="kenfo-texteditor-toolbar-h1" type="button" ><i class="fa fa-header text-toolbar" style="font-size:24px;"></i></button>'); //onclick="formatDoc('formatblock', 'h1');"
    document.write('<button id="kenfo-texteditor-toolbar-h2" type="button" ><i class="fa fa-header text-toolbar" style="font-size:18px;" ></i></button>'); //onclick="formatDoc('formatblock', 'h2');"
    document.write('<button id="kenfo-texteditor-toolbar-h3" type="button" ><i class="fa fa-header text-toolbar" style="font-size:12px;" ></i></button>'); //onclick="formatDoc('formatblock', 'h3');"
    document.write('<button id="kenfo-texteditor-toolbar-p" type="button" ><i class="fa fa-paragraph text-toolbar" tabindex="4"></i></button>'); //onclick="formatDoc('formatblock', 'p');"
    document.write('<button id="kenfo-texteditor-toolbar-b" type="button" ><i class="fa fa-bold text-toolbar" ></i></button>'); //onclick="formatDoc('bold');"
    document.write('<button id="kenfo-texteditor-toolbar-i" type="button" ><i class="fa fa-italic text-toolbar" ></i></button>'); //onclick="formatDoc('italic');"
    document.write('<button id="kenfo-texteditor-toolbar-u" type="button" ><i class="fa fa-underline text-toolbar" ></i></button>'); //onclick="formatDoc('underline');"
    document.write('<button id="kenfo-texteditor-toolbar-lft" type="button" ><i class="fa fa-align-left text-toolbar" ></i></button>'); //onclick="formatDoc('justifyleft');"
    document.write('<button id="kenfo-texteditor-toolbar-cnt" type="button" ><i class="fa fa-align-center text-toolbar" ></i></button>'); //onclick="formatDoc('justifycenter');"
    document.write('<button id="kenfo-texteditor-toolbar-rgt" type="button" ><i class="fa fa-align-right text-toolbar" ></i></button>'); //onclick="formatDoc('justifyright');"
    document.write('<button id="kenfo-texteditor-toolbar-num" type="button" ><i class="fa fa-list-ol text-toolbar" ></i></button>'); //onclick="formatDoc('insertorderedlist');"
    document.write('<button id="kenfo-texteditor-toolbar-dot" type="button" ><i class="fa fa-list-ul text-toolbar" ></i></button>'); //onclick="formatDoc('insertunorderedlist');"
    document.write('</div>');
    
    document.getElementById("kenfo-texteditor-toolbar-h1").addEventListener('click', function(){formatDoc('formatblock', 'h1');});
    document.getElementById("kenfo-texteditor-toolbar-h2").addEventListener('click', function(){formatDoc('formatblock', 'h2');});
    document.getElementById("kenfo-texteditor-toolbar-h3").addEventListener('click', function(){formatDoc('formatblock', 'h3');});
    document.getElementById("kenfo-texteditor-toolbar-p").addEventListener('click', function(){formatDoc('formatblock', 'p');});
    document.getElementById("kenfo-texteditor-toolbar-b").addEventListener('click', function(){formatDoc('bold');});
    document.getElementById("kenfo-texteditor-toolbar-i").addEventListener('click', function(){formatDoc('italic');});
    document.getElementById("kenfo-texteditor-toolbar-u").addEventListener('click', function(){formatDoc('underline');});
    document.getElementById("kenfo-texteditor-toolbar-lft").addEventListener('click', function(){formatDoc('justifyleft');});
    document.getElementById("kenfo-texteditor-toolbar-cnt").addEventListener('click', function(){formatDoc('justifycenter');});
    document.getElementById("kenfo-texteditor-toolbar-rgt").addEventListener('click', function(){formatDoc('justifyright');});
    document.getElementById("kenfo-texteditor-toolbar-num").addEventListener('click', function(){formatDoc('insertorderedlist');});
    document.getElementById("kenfo-texteditor-toolbar-dot").addEventListener('click', function(){formatDoc('insertunorderedlist');});

}

var setupDone = false;

var currentTextBlock = null;
var textBlocks;
var toolbar, hidebar;
var hidebartimer;
var usingToolbar = false;
var commandQueue = [];

function hidetoolbar(){
    hidebartimer = setTimeout(function(){
            toolbar.style.visibility = 'hidden';
        },1000);
}

function setup(){
    console.log("### SETUP");
    buildToolbar();
    
    toolbar = document.getElementById('kenfo-texteditor-toolbar');
    toolbar.style.visibility = "hidden";
    toolbar.addEventListener('mouseover', function(event){
        clearTimeout(hidebartimer);
        usingToolbar = true;
    });


    console.log("Init Blocks...");
    textBlocks = document.getElementsByClassName('kenfo-texteditor');

    let indexID = 0;
    for (let element of textBlocks){
        element.id = "textblock" + indexID
        indexID++;
        console.log("Found...");
        runtextbuilder(element);
    }


/*
    STYLESHEET ?
*/
    let head = document.getElementById('head');
    document.execCommand("defaultParagraphSeparator", false, "p");
    console.log("### END SETUP");
}

function runtextbuilder(element){
    console.log("Runtextbuilder");

    element.contentEditable = "true";//"plaintext-only";

    


    element.addEventListener('focus', function(event){
        console.log("Focus:" + event.target.id);
        toolbar.style.visibility = 'visible';

        currentTextBlock = event.target;
        moveToolbar(currentTextBlock);
        
        clearTimeout(hidebartimer);
        
    });

    element.addEventListener('blur', function(event){
        //Always return "body" on blur
        //console.log("Active element: " + document.activeElement);
        hidetoolbar();

    });

    console.log("textbuilder running");


}

function formatDoc(sCmd, sValue = null) {
    hidebar = false;
    clearTimeout(hidebartimer);
    try {
        if(sValue == null){
            document.execCommand(sCmd);
        }
        else{
            document.execCommand(sCmd, false, sValue);
        }
        
    } catch (error) {
        console.log("Error: " + error);
    }
    currentTextBlock.focus(); 
}

function moveToolbar(textBlock){
    
    textBlock.parentNode.appendChild(toolbar);


}

