// http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html
// code structured borrowed from https://github.com/Raureif/sketch-click-dummy
// http://sketchplugins.com/d/75-ajax-fetch-api/5
// import sandbox for authorization
@import 'sandbox.js'

// In the new folder structure, the plugin won't work without this line. I don't know why the previous version didn't need this. 
var doc = NSDocumentController.sharedDocumentController().currentDocument();
var apiURL = "https://4tmk2xerlg.execute-api.us-west-2.amazonaws.com/sketch_to_vr_api";
var bucket = "/3dius-sketch-to-vr";
var menuFilename = "/ui.png";

var exportPath = NSHomeDirectory() + "/Documents/Sketch-to-VR/img";

var menuImage;

// authorize Sketch to save a file
new AppSandbox().authorize(exportPath, exportForVR);

// export mocks and create HTML file
function exportForVR () {

  networkRequest(["-v", "-X", "PUT","-H", "Content-Type:image/png","--data-binary","@"+exportPath + menuFilename,apiURL + bucket + menuFilename]);
}

function networkRequest(args) {
  var task = NSTask.alloc().init();
  task.setLaunchPath("/usr/bin/curl");

  task.setArguments(args);
  var outputPipe = [NSPipe pipe];
  [task setStandardOutput:outputPipe];
  task.launch();

  log("uploading\n\n");
  var responseData = [[outputPipe fileHandleForReading] readDataToEndOfFile];
  var responseString = [[[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding]];
  //var parsed = tryParseJSON(responseString);
  //if(!parsed) {
  log(responseString);

  //}
}

// http://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try
function tryParseJSON (jsonString){
  try {
    var o = JSON.parse(jsonString);

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns 'null', and typeof null === "object",
    // so we must check for that, too.
    if (o && typeof o === "object" && o !== null) {
      return o;
    }
  }
  catch (e) { }

  return false;
}

// Resize the layer based on factor, borrowed from https://github.com/Raureif/sketch-click-dummy/pull/11
function copy_layer_with_factor(original_slice, factor){
    var copySlice = [original_slice duplicate];
    var frame = [copySlice frame];
    var rect = [copySlice absoluteInfluenceRect],
    // slice = [MSExportRequest requestWithRect:rect scale:factor];
    slice = MSExportRequest.new();
    slice.rect = rect;
    slice.scale = factor;
    [copySlice removeFromParent];
    //log("Slicing " + slice);
    return slice;
}

function onRun() {
}
