hljs.initHighlightingOnLoad();

$(function() {

  function writeIFrame(iframe,code) {
    iframe = (iframe.contentWindow) ? iframe.contentWindow : (iframe.contentDocument.document) ? iframe.contentDocument.document : iframe.contentDocument;
    iframe.document.open();
    iframe.document.write(code);
    iframe.document.close();
  } 

  function writeWindow(code) {
    var w = window.open('','game');
    w.document.write(code);
    w.document.close();
  }
  
  function addScript(str) {
   return str.replace(/SCRIPTEND/g,'</s' + 'cript>').replace(/SCRIPT/g,'<script>')
  }

  function windowGame() {
    var code = addScript($("#game-header").html());
    code += "<scr" + 'ipt>' + addScript(example.getValue()) + '</scr' + 'ipt>';
    code += addScript($("#game-footer").html());

    writeWindow(code);
  }

  function runGame() {
    var code = addScript($("#game-header").html());
    code += "<scr" + 'ipt>' + addScript(example.getValue()) + '</scr' + 'ipt>';
    code += addScript($("#game-footer").html());
    
    writeIFrame($("#demo")[0],code);
  }

  var example = CodeMirror.fromTextArea(
    $("#example")[0], 
    {
      lineNumbers: true,
      matchBrackets: true,
      mode: 'text/javascript'
    }
  );

  var touchDevice = ('ontouchstart' in document);
  if(!touchDevice) {
    runGame();
    $("#rungame").on("click",runGame);
  } else {
    $(".right").remove();
    $("#rungame").on("click",windowGame);
  }
  

  example.setSize("100%","420px");

  //var socket = window.socket = io.connect();

});
