/**
 *  perl_wsp class name
 *
 * Copyright (C) AlexandrinKS
 * https://akscf.me/
 */
qx.Class.define("fw.core.qooxdoo.models.SearchFilter", {
    extend: qx.core.Object,
    construct: function (resultsStart, resultsLimit) {
        this.setClass('WSP.Models.SearchFilter');
        this.set({
            text                : null,
            sortColumn          : null,
            sortCondition       : null,
            sortDirection       : null,
            sortCaseSensitive   : null,
            resultsStart        : (resultsStart ? resultsStart : 0),
            resultsLimit        : (resultsLimit ? resultsLimit : 0)
        }, null);
    },
    properties: {
        'class'                 : {},
        text                    : {},
        sortColumn              : {},
        sortCondition           : {},
        sortDirection           : {},
        sortCaseSensitive       : {},
        resultsStart            : {},
        resultsLimit            : {}
    }
});

