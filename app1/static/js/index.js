/**
 * Created by sahin on 5/12/17.
 */


$(function() {
});

// function initGraph(){
//         var childDirLabels = "{{ focusDirNames|safe }}".replace(/\'/ig,'\"').trim();
//         childDirLabels = JSON.parse(childDirLabels);
//         var childDirNames = "{{ focusDirs|safe }}".replace(/\'/ig,'\"').trim();
//         childDirNames = JSON.parse(childDirNames);
//
//         var childDirSize = childDirLabels.length;
//
//         // POSITION DATA ADDITION FROM SAVED FILE
//         var networkPositionJSON = '{{ focusLocations | safe}}';
//         var networkPositionData = JSON.parse(networkPositionJSON);
//
//         var nodeData = [];
//
//         function getLocationEntryFromID(locationsjson, nodeid){
//             for(var ii = 0;ii< childDirSize+1; ii++){
//                 if(locationsjson[ii]["id"] == nodeid){
//                     return locationsjson[ii];
//                 }
//             }
//
//         }
//
//         nodeData.push( {id: -1, group: 'focus', label: '{{ focusName }}',x: getLocationEntryFromID(networkPositionData,-1)["x"],y:getLocationEntryFromID(networkPositionData,-1)["y"]} );
//         for(var ii = 0;ii< childDirSize; ii++){nodeData.push( {id: childDirNames[ii], label: childDirLabels[ii], x:getLocationEntryFromID(networkPositionData,childDirNames[ii])["x"],y:getLocationEntryFromID(networkPositionData,childDirNames[ii])["y"]  } );}
//         var nodes = new vis.DataSet(nodeData);
//
//
//         var edgeData = [];
//         for(var ii = 0;ii< childDirSize; ii++){edgeData.push( {from: -1, to: childDirNames[ii] ,length: 250} );}
//         var edges = new vis.DataSet(edgeData);
//
//
//         var container = document.getElementById('mynetwork');
//         var data = {nodes: nodes,edges: edges,};
//         var options = {
//           layout:{
//               hierarchical:{
//                   enabled: false,
//                   levelSeparation: 170,
//               },
//           },
//           physics:{
//             enabled: false,
//           },
//           interaction: {
//             dragNodes: true,// do not allow dragging nodes
//             zoomView: true, // do not allow zooming
//             dragView: true,
//           },
//           edges:{
//               smooth: {
//                   enabled: false,
//                   type: "horizontal",
//                   roundness: 0.55
//                 },
//           },
//           nodes:{
//             shape : 'box',
//             scaling: {label: {enabled: true,},},
//             font: '25px arial black',
//             margin: 15,
//             fixed: {
//               x:false,
//               y:false
//             },
//           },
//           groups: {
//             focus: {color:{background:'turquoise',border:'black',highlight:{background:'cyan',border:'black'}},fixed:{x:false,y:false},borderWidth:4}
//           },
//         };
//
//         // initialize your network!
//         var network = new vis.Network(container, data, options);
//
//
//         var ctrlPressed = false;
//         $(document).keydown(function(event){
//             if(event.which=="17")
//                 ctrlPressed = true;
//         });
//
//         $(document).keyup(function(event){
//             if(event.which=="17")
//                 ctrlPressed = false;
//         });
//
//
//         network.on("click",function (nwparams) {
//             var clickedNodeId = nwparams['nodes'][0]
//             if(clickedNodeId != undefined){
//                 var clickedNode = nodes.get(clickedNodeId);
//                 var clickedName = clickedNode["label"]
//
//                 if(clickedName == "{{ focusName }}"){
//                     window.location.href = "/node?path="+"{{ focusPath }}";
//                 }
//
//                 var clickedDirIndex = childDirLabels.indexOf(clickedName);
//                 var clickedDirName = childDirNames[clickedDirIndex];
//                 if(clickedDirName != undefined){
//                     if(ctrlPressed){
//                         window.location.href = "/node?path="+"{{ focusPath }}"+"/"+clickedDirName;
//                     }else{
//                         window.location.href = "/index?path="+"{{ focusPath }}"+"/"+clickedDirName;
//                     }
//
//                 }
//             }
//         });
// }


function addNewNode(focuspath) {
    $.ajax({
        url: '/ajax?',
        contentType: 'application/json',
        data: {'addnode':'','path':focuspath},
        dataType: 'json',
        complete: function () {
            window.location.reload(true);
        },
    });
}

function editTheNode(focuspath) {
    var editedFocusName = $("#editedfocusname").val();

    $.ajax({
        url: '/ajax?',
        contentType: 'application/json',
        data: {'editnode':'','path':focuspath,'name':editedFocusName},
        dataType: 'json',
        complete: function () {
            window.location.href = "/index?path="+focuspath;
        },
    });
}

function deleteTheNode(focuspath) {

    var temp = focuspath.match(/(.+)\/.+?/);
    if(temp !=null){
        $.ajax({
            url: '/ajax?',
            contentType: 'application/json',
            data: {'deletenode':'','path':focuspath},
            dataType: 'json',
            complete: function () {
                window.location.href = "/index?path="+temp[1];
            },
        });
    }else{
        alert("Is this root?");
    }
}

function navigateToParent(focuspath){
    var temp = focuspath.match(/(.+)\/.+?/);
    if(temp !=null){
        window.location.href = "/index?path="+temp[1];
    }else{
        alert("Is this root?");
    }
}


function saveLocations_objectToArray(obj) {
    return Object.keys(obj).map(function (key) {
      obj[key].id = key;
      return obj[key];
    });
}
function saveLocations(focuspath) {
    var nodes = saveLocations_objectToArray(network.getPositions());

    // function saveLocations_addConnections(elem, index) {elem.connections = network.getConnectedNodes(index);}
    //nodes.forEach(saveLocations_addConnections);
    var exportValue = JSON.stringify(nodes, undefined, 2);

    $.ajax({
        url: '/ajax?',
        contentType: 'application/json',
        data: {'exportnetwork':'','path':focuspath,'data':exportValue},
        dataType: 'json',
        complete: function () {
            $("#savelocationsmodal").modal('show');
        },
    });
}
