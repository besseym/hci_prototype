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

        var dataNodeLink,
            nodeLinkChart;

        chartUtil.loadNodeLinkData("graph_bionic.json", function(error, data) {

            if (error) throw error;

            dataNodeLink = DataNodeLink.getInstance(data);

            nodeLinkChart = ChartNodeLink.getInstance({selector: "#chart-graph-video", data: dataNodeLink});
            nodeLinkChart.display();
        });

        $( "#form-hightlight input[name=highlight]:radio" ).change(function(event) {

            var value = $(this).val(),
                typeColorArray = nodeLinkChart.highlight(value);

            buildColorKey(typeColorArray);
        });

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

    }
);