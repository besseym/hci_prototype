define(["common", "Chart"], function (common) {

    //start bar chart
    var ChartAdjMatrix = function (config, parent) {

        var frame,
            exists,
            width,
            height,
            svg,
            data;

        //config the object
        set(config);

        function set(config) {

            if (!common.isUndefined(config)) {

                if (!common.isUndefined(config.selector)) {

                    frame = d3.select(config.selector);
                    exists = !frame.empty();

                    if(exists) {

                        svg = frame.select("svg");

                        width = parseInt(svg.style("width"), 10);
                        height = parseInt(svg.style("height"), 10);
                    }
                }

                if (!common.isUndefined(config.data)) {
                    data = config.data;
                }
            }
        }

        function get(key){

            var value = null;

            if(key === "data") {
                value = data;
            }

            return value;
        }

        //public setter
        this.set = function(config){
            set(config);
        };

        //public getter
        this.get = function(key){
            return get(key);
        };

    };

    return {

        getInstance: function(config) {
            var parent = new Chart(config);
            ChartAxis.prototype = parent;
            return new ChartAdjMatrix(config, parent);
        }
    };
});