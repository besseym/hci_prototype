define(function () {

    function isUndefined(v) {
        return (typeof(v) === "undefined");
    }

    return {

        log: function (m) {
            console.log(m);
        },

        hasValue: function (v) {
            return !isUndefined(v) && v !== null;
        },

        isUndefined: function (v) {
            return isUndefined(v);
        }

    };
});