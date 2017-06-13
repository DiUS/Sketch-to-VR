// http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html
// code structured borrowed from https://github.com/Raureif/sketch-click-dummy
// import sandbox for authorization
@import 'sandbox.js'

// In the new folder structure, the plugin won't work without this line. I don't know why the previous version didn't need this. 
var doc = NSDocumentController.sharedDocumentController().currentDocument();

var exportPath = NSHomeDirectory() + "/Documents/Sketch-to-VR/img/";

// authorize Sketch to save a file
new AppSandbox().authorize(exportPath, exportImages);

// export mocks and create HTML file
function exportImages () {

  //export artboard as images
  var slices = doc.currentPage().artboards().objectEnumerator();
  while (slice = slices.nextObject()) {
    //var slice2x = copy_layer_with_factor(slice, 2);
    [doc saveArtboardOrSlice:slice toFile:exportPath + slice.name() + '.png'];
  }
  doc.showMessage('Files exported to: ' + exportPath);
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
