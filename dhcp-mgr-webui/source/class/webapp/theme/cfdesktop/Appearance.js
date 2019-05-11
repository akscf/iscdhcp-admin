/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Theme.define("webapp.theme.cfdesktop.Appearance", {
    extend: qx.theme.indigo.Appearance,
    appearances: {
        //========================================================================================================================================================
        // toolbar
        //========================================================================================================================================================
        "toolbar": {
            style: function (states) {
                return {
                    paddingLeft: 3,
                    paddingRight: 1,
                    backgroundColor: "light-background"
                };
            }
        },
        "toolbar/part": {
            style: function (states) {
                return {
                    margin: [1, 5]
                };
            }
        },
        "toolbar-separator": {
            style: function (states) {
                return {
                    decorator: "toolbar-separator",
                    margin: [7, 5],
                    width: 4
                };
            }
        },
        "toolbar-button": {
            alias: "atom",
            style: function (states) {
                var decorator = "button-box";

                if (states.disabled) {
                    decorator = "button-box";
                } else if (states.hovered && !states.pressed && !states.checked) {
                    decorator = "button-box-hovered";
                } else if (states.hovered && (states.pressed || states.checked)) {
                    decorator = "button-box-pressed-hovered";
                } else if (states.pressed || states.checked) {
                    decorator = "button-box-pressed";
                }

                if (states.left) {
                    decorator += "-left";
                } else if (states.right) {
                    decorator += "-right";
                } else if (states.middle) {
                    decorator += "-middle";
                }

                var margin = [7, 0, 7, 0];
                if (states.left || states.middle || states.right) {
                    margin = [7, 0, 7, 0];
                }

                return {
                    cursor: states.disabled ? undefined : "pointer",
                    decorator: decorator,
                    margin: margin,
                    padding: [3, 5]
                };
            }
        },
        //========================================================================================================================================================
        // scrollbar
        //========================================================================================================================================================
        "scrollbar/slider/knob": {
            style: function (states) {
                var decorator = "scroll-knob";
                if (!states.disabled) {
                    if (states.hovered && !states.pressed && !states.checked) {
                        decorator = "scroll-knob-hovered";
                    } else if (states.hovered && (states.pressed || states.checked)) {
                        decorator = "scroll-knob-pressed-hovered";
                    } else if (states.pressed || states.checked) {
                        decorator = "scroll-knob-pressed";
                    }
                }

                return {
                    height: 10,
                    width: 10,
                    cursor: states.disabled ? undefined : "pointer",
                    decorator: decorator,
                    minHeight: states.horizontal ? undefined : 20,
                    minWidth: states.horizontal ? 20 : undefined
                };
            }
        },
        "scrollbar/button": {
            style: function (states) {
                return {
                    padding: 0,
                    height: 0,
                    width: 0,
                    cursor: "pointer",
                    decorator: null
                }
            }
        },
        "scrollbar/button-begin": "scrollbar/button",
        "scrollbar/button-end": "scrollbar/button",
        //========================================================================================================================================================
        // TABLE
        //========================================================================================================================================================
        "table-header-cell": {
            alias: "atom",
            style: function (states) {
                return {
                    decorator: states.first ? "table-header-cell-first" : "table-header-cell",
                    minWidth: 12,
                    font: "default",
                    paddingTop: 2,
                    paddingLeft: 5,
                    cursor: states.disabled ? undefined : "pointer",
                    sortIcon: states.sorted ? (qx.theme.simple.Image.URLS["table-" + (states.sortedAscending ? "ascending" : "descending")]) : undefined
                }
            }
        },
        //================================================================================================================================================================================================
        // TABVIEW
        //================================================================================================================================================================================================
        "tabview-page/button": {
            style: function (states) {
                var decorator;

                // default padding
                if (states.barTop || states.barBottom) {
                    var padding = [5, 12, 5, 9];
                } else {
                    var padding = [5, 4, 5, 4];
                }

                // decorator
                if (states.checked) {
                    if (states.barTop) {
                        decorator = "tabview-page-button-top";
                    } else if (states.barBottom) {
                        decorator = "tabview-page-button-bottom"
                    } else if (states.barRight) {
                        decorator = "tabview-page-button-right";
                    } else if (states.barLeft) {
                        decorator = "tabview-page-button-left";
                    }
                } else {
                    for (var i = 0; i < padding.length; i++) {
                        padding[i] += 1;
                    }
                    // reduce the size by 1 because we have different decorator border width
                    if (states.barTop) {
                        padding[2] -= 1;
                    } else if (states.barBottom) {
                        padding[0] -= 1;
                    } else if (states.barRight) {
                        padding[3] -= 1;
                    } else if (states.barLeft) {
                        padding[1] -= 1;
                    }
                }

                return {
                    zIndex: states.checked ? 10 : 5,
                    decorator: decorator,
                    textColor: states.disabled ? "text-disabled" : states.checked ? null : "link",
                    padding: padding,
                    cursor: "pointer"
                };
            }
        },
        //================================================================================================================================================================================================
        // KeYBOARD
        //================================================================================================================================================================================================
        "keyb-button-frame": {
            alias: "atom",
            style: function (states) {
                var decorator = "button-box";

                if (!states.disabled) {
                    if (states.hovered && !states.pressed && !states.checked) {
                        decorator = "button-box-hovered";
                    } else if (states.hovered && (states.pressed || states.checked)) {
                        decorator = "button-box-pressed-hovered";
                    } else if (states.pressed || states.checked) {
                        decorator = "button-box-pressed";
                    }
                }

                if (states.invalid && !states.disabled) {
                    decorator += "-invalid";
                } else if (states.focused) {
                    decorator += "-focused";
                }

                return {
                    decorator: decorator,
                    padding: [3, 8],
                    cursor: states.disabled ? undefined : "pointer",
                    height: 48,
                    width: 48,
                    minWidth: 48,
                    minHeight: 48
                };
            }
        },
        "keyb-button-frame/label": {
            alias: "atom/label",
            style: function (states) {
                return {
                    textColor: states.disabled ? "text-disabled" : undefined
                };
            }
        },
        "keyb-button": {
            alias: "keyb-button-frame",
            include: "keyb-button-frame",
            style: function (states) {
                return {
                    center: true
                };
            }
        }
    }
});