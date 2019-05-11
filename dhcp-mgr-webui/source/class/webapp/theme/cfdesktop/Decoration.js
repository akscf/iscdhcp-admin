/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Theme.define("webapp.theme.cfdesktop.Decoration", {
    extend: qx.theme.indigo.Decoration,
    decorations: {
        //======================================================================================================================================================================
        // WINDOW
        //======================================================================================================================================================================
        "window": {
            style: {
                width: 1,
                color: "window-border",
                shadowLength: 1,
                shadowBlurRadius: 0,
                shadowColor: "shadow",
                backgroundColor: "background",
                radius: 0
            }
        },
        "window-caption": {
            style: {
                radius: [0, 0, 0, 0],
                color: "window-border",
                widthBottom: 1
            }
        },
        "window-caption-active": {
            style: {
                radius: [0, 0, 0, 0],
                color: "highlight",
                widthBottom: 3
            }
        },
        //======================================================================================================================================================================
        // SCROLLBAR
        //======================================================================================================================================================================
        "scroll-knob": {
            style: {
                radius: 0,
                width: 1,
                color: "button-border",
                backgroundColor: "scrollbar-bright"
            }
        },
        //======================================================================================================================================================================
        // TABVIEW
        //======================================================================================================================================================================
        "tabview-page-button-top": {
            style: {
                width: [1, 1, 0, 1],
                backgroundColor: "background",
                color: "border-main",
                radius: [0, 0, 0, 0]
            }
        },
        "tabview-page-button-bottom": {
            include: "tabview-page-button-top",
            style: {
                radius: [0, 0, 0, 0],
                width: [0, 1, 1, 1]
            }
        },
        "tabview-page-button-left": {
            include: "tabview-page-button-top",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 0, 1, 1]
            }
        },
        "tabview-page-button-right": {
            include: "tabview-page-button-top",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 1, 1, 0]
            }
        },
        //======================================================================================================================================================================
        // TEXTFIELDS
        //======================================================================================================================================================================
        "inset": {
            style: {
                width: 1,
                color: "border-light"
            }
        },
        "focused-inset": {
            style: {
                width: 2,
                color: "background-selected"
            }
        },
        "border-invalid": {
            style: {
                width: 2,
                color: "invalid"
            }
        },
        //======================================================================================================================================================================
        // BUTTONS
        //======================================================================================================================================================================
        "button-box": {
            style: {
                radius: 0,
                width: 1,
                color: "button-border",
                gradientStart: ["button-box-bright", 40],
                gradientEnd: ["button-box-dark", 70],
                backgroundColor: "button-box-bright"
            }
        },
        "button-box-pressed": {
            include: "button-box",
            style: {
                gradientStart: ["button-box-bright-pressed", 40],
                gradientEnd: ["button-box-dark-pressed", 70],
                backgroundColor: "button-box-bright-pressed"
            }
        },
        "button-box-pressed-hovered": {
            include: "button-box-pressed",
            style: {
                color: "button-border-hovered"
            }
        },
        "button-box-hovered": {
            include: "button-box",
            style: {
                color: "button-border-hovered"
            }
        },
        "button-hover": {
            style: {
                backgroundColor: "button",
                radius: 0
            }
        },
        "radiobutton": {
            style: {
                radius: 0,
                width: 1,
                color: "button-border",
                innerColor: "background",
                innerWidth: 2
            }
        },
        "button-box-right": {
            include: "button-box",
            style: {
                radius: [0, 0, 0, 0]
            }
        },
        "button-box-pressed-right": {
            include: "button-box-pressed",
            style: {
                radius: [0, 0, 0, 0]
            }
        },
        "button-box-pressed-hovered-right": {
            include: "button-box-pressed-hovered",
            style: {
                radius: [0, 0, 0, 0]
            }
        },
        "button-box-hovered-right": {
            include: "button-box-hovered",
            style: {
                radius: [0, 0, 0, 0]
            }
        },
        "button-box-focused-right": {
            include: "button-box-focused",
            style: {
                radius: [0, 0, 0, 0]
            }
        },
        "button-box-hovered-focused-right": {
            include: "button-box-hovered-focused",
            style: {
                radius: [0, 0, 0, 0]
            }
        },
        "button-box-pressed-focused-right": {
            include: "button-box-pressed-focused",
            style: {
                radius: [0, 0, 0, 0]
            }
        },
        "button-box-pressed-hovered-focused-right": {
            include: "button-box-pressed-hovered-focused",
            style: {
                radius: [0, 0, 0, 0]
            }
        },
        "button-box-right-borderless": {
            include: "button-box",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 1, 1, 0]
            }
        },
        "button-box-pressed-right-borderless": {
            include: "button-box-pressed",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 1, 1, 0]
            }
        },
        "button-box-pressed-hovered-right-borderless": {
            include: "button-box-pressed-hovered",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 1, 1, 0]
            }
        },
        "button-box-hovered-right-borderless": {
            include: "button-box-hovered",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 1, 1, 0]
            }
        },
        "button-box-top-right": {
            include: "button-box",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 1, 1, 0]
            }
        },
        "button-box-pressed-top-right": {
            include: "button-box-pressed",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 1, 1, 0]
            }
        },
        "button-box-pressed-hovered-top-right": {
            include: "button-box-pressed-hovered",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 1, 1, 0]
            }
        },
        "button-box-hovered-top-right": {
            include: "button-box-hovered",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 1, 1, 0]
            }
        },
        "button-box-bottom-right": {
            include: "button-box",
            style: {
                radius: [0, 0, 0, 0],
                width: [0, 1, 1, 0]
            }
        },
        "button-box-pressed-bottom-right": {
            include: "button-box-pressed",
            style: {
                radius: [0, 0, 0, 0],
                width: [0, 1, 1, 0]
            }
        },
        "button-box-pressed-hovered-bottom-right": {
            include: "button-box-pressed-hovered",
            style: {
                radius: [0, 0, 0, 0],
                width: [0, 1, 1, 0]
            }
        },
        "button-box-hovered-bottom-right": {
            include: "button-box-hovered",
            style: {
                radius: [0, 0, 0, 0],
                width: [0, 1, 1, 0]
            }
        },
        "button-box-bottom-left": {
            include: "button-box",
            style: {
                radius: [0, 0, 0, 0],
                width: [0, 0, 1, 1]
            }
        },
        "button-box-pressed-bottom-left": {
            include: "button-box-pressed",
            style: {
                radius: [0, 0, 0, 0],
                width: [0, 0, 1, 1]
            }
        },
        "button-box-pressed-hovered-bottom-left": {
            include: "button-box-pressed-hovered",
            style: {
                radius: [0, 0, 0, 0],
                width: [0, 0, 1, 1]
            }
        },
        "button-box-hovered-bottom-left": {
            include: "button-box-hovered",
            style: {
                radius: [0, 0, 0, 0],
                width: [0, 0, 1, 1]
            }
        },
        "button-box-top-left": {
            include: "button-box",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 0, 0, 1]
            }
        },
        "button-box-pressed-top-left": {
            include: "button-box-pressed",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 0, 0, 1]
            }
        },
        "button-box-pressed-hovered-top-left": {
            include: "button-box-pressed-hovered",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 0, 0, 1]
            }
        },
        "button-box-hovered-top-left": {
            include: "button-box-hovered",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 0, 0, 1]
            }
        },
        "button-box-middle": {
            include: "button-box",
            style: {
                radius: 0,
                width: [1, 0, 1, 1]
            }
        },
        "button-box-pressed-middle": {
            include: "button-box-pressed",
            style: {
                radius: 0,
                width: [1, 0, 1, 1]
            }
        },
        "button-box-pressed-hovered-middle": {
            include: "button-box-pressed-hovered",
            style: {
                radius: 0,
                width: [1, 0, 1, 1]
            }
        },
        "button-box-hovered-middle": {
            include: "button-box-hovered",
            style: {
                radius: 0,
                width: [1, 0, 1, 1]
            }
        },
        "button-box-left": {
            include: "button-box",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 0, 1, 1]
            }
        },
        "button-box-pressed-left": {
            include: "button-box-pressed",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 0, 1, 1]
            }
        },
        "button-box-pressed-hovered-left": {
            include: "button-box-pressed-hovered",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 0, 1, 1]
            }
        },
        "button-box-hovered-left": {
            include: "button-box-hovered",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 0, 1, 1]
            }
        },
        "button-box-focused-left": {
            include: "button-box-focused",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 0, 1, 1]
            }
        },
        "button-box-hovered-focused-left": {
            include: "button-box-hovered-focused",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 0, 1, 1]
            }
        },
        "button-box-pressed-hovered-focused-left": {
            include: "button-box-pressed-hovered-focused",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 0, 1, 1]
            }
        },
        "button-box-pressed-focused-left": {
            include: "button-box-pressed-focused",
            style: {
                radius: [0, 0, 0, 0],
                width: [1, 0, 1, 1]
            }
        },
        //======================================================================================================================================================================
        // custom
        //======================================================================================================================================================================
        "message-enter-area-focusout": {
            style: {
                width: 2,
                color: "#000000"
            }
        },
        "message-enter-area-focusin": {
            style: {
                width: 2,
                color: "background-selected" // #ff8933, e77928
            }
        }
    }
});