requirejs.config({
    paths: {
        d3: '/hci_prototype/bower_components/d3/d3.min'
    }
});

require(
    [
        "common", "chart/chartUtil", "chart/DataNodeLink", "chart/ChartNodeLink"
    ],
    function(common, chartUtil, DataNodeLink, ChartNodeLink) {

        var selectedNodeId,

            p,
            parameterMap = common.getParameterMap(),

            dataNodeLink,
            nodeLinkChart,

            flashSuccess = $("#flash-success"),
            flashSuccessCloseBtn = flashSuccess.find("#btn-close-success"),
            flashSuccessMsg = flashSuccess.find("#flash-success-msg"),

            flashInfo = $("#flash-info"),
            flashInfoCloseBtn = flashInfo.find("#btn-close-info"),
            flashInfoMsg = flashInfo.find("#flash-info-msg"),

            flashWarning = $("#flash-warning"),
            flashWarningCloseBtn = flashWarning.find("#btn-close-warning"),
            flashWarningMsg = flashWarning.find("#flash-warning-msg"),

            flashDanger = $("#flash-danger"),
            flashDangerCloseBtn = flashDanger.find("#btn-close-danger"),
            flashDangerMsg = flashDanger.find("#flash-danger-msg"),

            nodeDialog = $("#n-dialog"),
            nodeDialogSelectBtn = nodeDialog.find("#d-n-select-btn"),
            nodeDialogThisToSelectedBtn = nodeDialog.find("#d-n-this-to-selected-btn"),
            nodeDialogSelectedToThisBtn = nodeDialog.find("#d-n-selected-to-this-btn"),

            linkDialog = $("#l-dialog"),
            linkDialogBtn = linkDialog.find("#l-btn"),

            selectTabPane = $("#tab-pane-select"),
            connectionTableBody = selectTabPane.find("#s-n-c-tbl tbody");

        //intialize
        if(!common.isUndefined(parameterMap)){

            for(p in parameterMap){

                switch(p){
                    case 'content':

                        if(parameterMap[p] === 'matrix'){
                            focusHighlightTab();
                            focusMatrixContent();
                        }

                        break;
                }
            }
        }

        function populateNodeDialog(d){

            var hasSelected = !common.isUndefined(selectedNodeId),
                isSelectedNode = selectedNodeId === d.id,
                isConnectedToSelected,
                selectBlk, thisToSelectedBlk, selectedToThisBlk;

            nodeDialog.find("#n-d-id").text(d.id);
            nodeDialog.find("#n-d-title").text(d.title);
            nodeDialog.find("#n-d-type").text(d.type);

            nodeDialog.find("#n-d-series-id").text(d.seriesId);
            nodeDialog.find("#n-d-season-number").text(d.seasonNumber);
            nodeDialog.find("#n-d-show-id").text(d.showId);

            if(hasSelected && !isSelectedNode){
                isConnectedToSelected = dataNodeLink.isConnected(selectedNodeId, d.id);
            }

            selectBlk = nodeDialog.find("#d-n-select");
            if(!hasSelected || !isSelectedNode ){
                selectBlk.css("display", "block");
            }
            else {
                selectBlk.css("display", "none");
            }

            thisToSelectedBlk = nodeDialog.find("#d-n-this-to-selected");
            selectedToThisBlk = nodeDialog.find("#d-n-selected-to-this");
            if(hasSelected && !isSelectedNode && !isConnectedToSelected){

                thisToSelectedBlk.css("display", "block");
                selectedToThisBlk.css("display", "block");
            }
            else {

                thisToSelectedBlk.css("display", "none");
                selectedToThisBlk.css("display", "none");
            }
        }

        function setNodeDialogLocation(location){

            nodeDialog.css("left", location.left).css("top", location.top).css("visibility", "visible");
        }

        function hideNodeDialog(){

            nodeDialog.css("visibility", "hidden");
        }

        function populateLinkDialog(d){

            linkDialog.find("#source").text(d.source.title);
            linkDialog.find("#target").text(d.target.title);

            linkDialog.find("#l-btn").attr("href", d.id);
        }

        function setLinkDialogLocation(location){

            linkDialog.css("left", location.left).css("top", location.top).css("visibility", "visible");
        }

        function hideLinkDialog(){

            linkDialog.css("visibility", "hidden");
        }

        $( "#form-search" ).submit(function( event ) {

            var isMatch = false,
                graph,
                formArray = $( this ).serializeArray();

            jQuery.each( formArray, function( i, field ) {

                if(field.name === "showId"){

                    switch(field.value){

                        case "3412157":
                            graph = "graph_show_3412157.json";
                            isMatch = true;
                            break;

                        case "3413913":
                            graph = "graph_show_3413913.json";
                            isMatch = true;
                            break;
                    }

                }
                else if(field.name === "seriesId"){

                    switch(field.value){

                        case "701":
                            graph = "graph_series_701.json";
                            isMatch = true;
                            break;

                        case "1003303":
                            graph = "graph_series_1003303.json";
                            isMatch = true;
                            break;
                    }

                }
                else if(field.name === "keywords"){

                    switch(field.value){

                        case "test":
                            graph = "graph_test.json";
                            isMatch = true;
                            break;

                        case "america":
                            graph = "graph_america.json";
                            isMatch = true;
                            break;

                        case "bionic":
                            graph = "graph_bionic.json";
                            isMatch = true;
                            break;

                        case "speed":
                            graph = "graph_speed.json";
                            isMatch = true;
                            break;

                        case "design":
                            graph = "graph_design.json";
                            isMatch = true;
                            break;

                        case "crime":
                            graph = "graph_crime.json";
                            isMatch = true;
                            break;

                        case "robots":
                            graph = "graph_robots.json";
                            isMatch = true;
                            break;
                    }
                }
            });

            if(isMatch){
                $('#content-viz').show();
                $('#content-overview').hide();

                chartUtil.loadNodeLinkData(graph, function(error, data) {

                    if (error) throw error;

                    if(!common.isUndefined(nodeLinkChart)){
                        nodeLinkChart.clear();
                    }

                    dataNodeLink = DataNodeLink.getInstance(data);

                    nodeLinkChart = ChartNodeLink.getInstance({

                        selector: "#chart-graph-video",
                        data: dataNodeLink,

                        focusSelectTab: focusSelectTab,
                        buildSelectPanel: buildSelectPanel,

                        populateNodeDialog: populateNodeDialog,
                        setNodeDialogLocation: setNodeDialogLocation,
                        hideNodeDialog: hideNodeDialog,

                        populateLinkDialog: populateLinkDialog,
                        setLinkDialogLocation: setLinkDialogLocation,
                        hideLinkDialog: hideLinkDialog
                    });

                    nodeLinkChart.display();

                    focusHighlightTab();
                    focusVizContent();
                });
            }
            else {
                showWarningMsg("The search criteria you provided returned too many search results. Please refine your search.");
            }

            event.preventDefault();
        });

        $( "#form-hightlight input[name=highlight]:radio" ).change(function(event) {

            var value = $(this).val(),
                typeColorArray = nodeLinkChart.highlight(value);

            buildColorKey(typeColorArray);
        });

        //node dialog actions
        nodeDialogSelectBtn.on('click', function( event ) {

            selectedNodeId = nodeDialog.find("#n-d-id").text();

            buildSelectPanel(dataNodeLink.getNode(selectedNodeId), dataNodeLink.getNodeConnect(selectedNodeId));
            focusSelectTab();

            nodeLinkChart.focusOnNode(selectedNodeId);

            event.preventDefault();
        });

        nodeDialogThisToSelectedBtn.on('click', function( event ) {

            var nodeId = nodeDialog.find("#n-d-id").text();
            nodeLinkChart.makeLink(selectedNodeId, nodeId);

            event.preventDefault();
        });

        nodeDialogSelectedToThisBtn.on('click', function( event ) {

            var nodeId = nodeDialog.find("#n-d-id").text();
            nodeLinkChart.makeLink(nodeId, selectedNodeId);

            event.preventDefault();
        });

        //link dialog actions
        linkDialogBtn.on('click', function( event ) {

            var id = $(this).attr('href'),
                connectionRow = connectionTableBody.find("#s-" + id);
            nodeLinkChart.breakLink(id);

            if(connectionRow.length > 0){
                connectionRow.remove();
            }

            event.preventDefault();
        });

        linkDialogBtn.on("mouseover", function() {

            $(this).children('i').removeClass( "fa-link" ).addClass( "fa-chain-broken" );
        });

        linkDialogBtn.on("mouseout", function() {

            $(this).children('i').removeClass( "fa-chain-broken" ).addClass( "fa-link" );
        });

        function buildSelectPanel(d, connect){

            var j,
                connection,
                connectionBtnArray,
                connectOutArray = [];

            selectTabPane.find("#s-n-title").text(d.title);

            selectTabPane.find("#s-n-id").text(d.id);
            selectTabPane.find("#s-n-type").text(d.type);

            selectTabPane.find("#s-n-series-id").text(d.seriesId);
            selectTabPane.find("#s-n-season-number").text(d.seasonNumber);
            selectTabPane.find("#s-n-show-id").text(d.showId);

            selectTabPane.find("#s-n-url a").attr('href', d.url);

            connectionTableBody.empty();

            //console.log(connect);
            if(!common.isUndefined(connect)){

                for(j = 0; j < connect.connectionArray.length; j++){

                    connection = connect.connectionArray[j];

                    connectOutArray = [
                        "<tr id='s-" + connection.l.id + "'>",
                        "<td>",
                        "<i class='fa fa-bars'></i>",
                        "</td>",
                        "<td>",
                        connection.n.title,
                        "</td>",
                        "<td>",
                        connection.n.type,
                        "</td>",
                        "<td>",
                        connection.n.rating,
                        "</td>",
                        "<td>",
                        "<a class='s-l-btn btn btn-lg btn-default' href='" + connection.l.id + "'>",
                        "<i class='fa fa-link'></i>",
                        "</a>",
                        "</td>",
                        "<tr>"
                    ];

                    connectionTableBody.append(connectOutArray.join(""));

                }
            }

            connectionBtnArray = connectionTableBody.find('.s-l-btn');
            connectionBtnArray.on("mouseover", function() {

                $(this).children('i').removeClass( "fa-link" ).addClass( "fa-chain-broken" );
            });

            connectionBtnArray.on("mouseout", function() {

                $(this).children('i').removeClass( "fa-chain-broken" ).addClass( "fa-link" );
            });

            connectionBtnArray.on("click", function(event){

                var id = $(this).attr('href');
                nodeLinkChart.breakLink(id);

                connectionTableBody.find("#s-" + id).remove();

                event.preventDefault();
            });
        }

        function buildColorKey(typeColorArray){

            var i, typeColor, keyColorList, outArray;

            if(typeColorArray !== null){

                keyColorList = $("#key-color .list-group");
                keyColorList.empty();

                for(i = 0; i < typeColorArray.length; i++){

                    typeColor = typeColorArray[i];
                    //typeColor.color;

                    outArray = [
                        "<li class='list-group-item'>",
                        "<svg height='15' width='15'>",
                        "<rect width='15' height='15' fill='",
                        typeColor.color,
                        "' />",
                        "</svg> ",
                        typeColor.name,
                        "</li>"];

                    keyColorList.append(outArray.join(""));
                }
            }
        }

        function focusSearchTab() {

            $('#tabs-dialog a[href="#tab-pane-search"]').tab('show');
        }

        function focusHighlightTab() {

            $('#nav-tab-hightlight').css("visibility", "visible");
            $('#tabs-dialog a[href="#tab-pane-highlight"]').tab('show');
        }

        function focusSelectTab() {

            $('#nav-tab-select').css("visibility", "visible");
            $('#tabs-dialog a[href="#tab-pane-select"]').tab('show');
        }

        function focusVizContent() {

            $('#content-overview').css("display", "none");
            $('#content-viz').css("display", "block");
        }

        flashSuccessCloseBtn.on("click", function(event){

            flashSuccess.css("display", "none");
            event.preventDefault();
        });

        flashInfoCloseBtn.on("click", function(event){

            flashInfo.css("display", "none");
            event.preventDefault();
        });

        flashWarningCloseBtn.on("click", function(event){

            flashWarning.css("display", "none");
            event.preventDefault();
        });

        flashDangerCloseBtn.on("click", function(event){

            flashDanger.css("display", "none");
            event.preventDefault();
        });

        function showSuccessMsg(msg){
            flashSuccessMsg.text(msg);
            flashSuccess.css("display", "block");
        }

        function showInfoMsg(msg){
            flashInfoMsg.text(msg);
            flashInfo.css("display", "block");
        }

        function showWarningMsg(msg){
            flashWarningMsg.text(msg);
            flashWarning.css("display", "block");
        }

        function showDangerMsg(msg){
            flashDangerMsg.text(msg);
            flashDanger.css("display", "block");
        }

    }
);
