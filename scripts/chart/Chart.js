define(["common"], function (common) {

    //start bar chart
    var Chart = function (config) {

        var selector,
            exists = false,
            width = 100,
            height = 100,
            padding = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            transition = {
                enabled: true,
                duration: 1000
            },
            data;

        //config the object
        set(config);

        //public setter
        this.set = function(config){
            set(config);
        };

        //public getter
        this.get = function(key){
            return get(key);
        };

        function set(config){

            if (!common.isUndefined(config)) {

                if (!common.isUndefined(config.selector)) {
                    selector = config.selector;
                }

                if (!common.isUndefined(config.exists)) {
                    exists = config.exists;
                }

                if (!common.isUndefined(config.width)) {
                    width = config.width;
                }

                if (!common.isUndefined(config.height)) {
                    height = config.height;
                }

                if (!common.isUndefined(config.pTop)) {
                    padding.top = config.pTop;
                }
                if (!common.isUndefined(config.pRight)) {
                    padding.right = config.pRight;
                }
                if (!common.isUndefined(config.pBottom)) {
                    padding.bottom = config.pBottom;
                }
                if (!common.isUndefined(config.pLeft)) {
                    padding.left = config.pLeft;
                }
                if (!common.isUndefined(config.padding)) {

                    if (!common.isUndefined(config.padding.top)) {
                        padding.top = config.padding.top;
                    }
                    if (!common.isUndefined(config.padding.right)) {
                        padding.right = config.padding.right;
                    }
                    if (!common.isUndefined(config.padding.bottom)) {
                        padding.bottom = config.padding.bottom;
                    }
                    if (!common.isUndefined(config.padding.left)) {
                        padding.left = config.padding.left;
                    }
                }

                if (!common.isUndefined(config.transition)) {

                    if (!common.isUndefined(config.transition.enabled)) {
                        transition.enabled = config.transition.enabled;
                    }

                    if (!common.isUndefined(config.transition.duration)) {
                        transition.duration = config.transition.duration;
                    }
                }

                if (!common.isUndefined(config.data)) {
                    data = config.data;
                }
            }
        }

        function get(key){

            if(key === "selector") {
                return selector;
            }
            else if(key === "width"){
                return width;
            }
            else if(key === "height") {
                return height;
            }
            else if(key === "padding") {
                return padding;
            }
            else if(key === "transition") {
                return transition;
            }
            else if(key === "rangeX") {
                return [padding.left, width - padding.right];
            }
            else if(key === "rangeY") {
                return [height - padding.bottom, padding.top];
            }
            else if(key === "data") {
                return data;
            }

            return null;
        }

        this.exists = function(){
            return exists;
        };
    };

    return {

        getInstance: function(config) {
            return new Chart(config);
        }
    };
});