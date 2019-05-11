/**
 *
 * @author: AlexandrinK <aks@cforge.org>
 */
qx.Theme.define("webapp.theme.cfdesktop.Font", {
    extend: qx.theme.indigo.Font,
    fonts: {
        "default": {
            size: 12,
            family: ["Lucida Grande", "DejaVu Sans", "Verdana", "sans-serif"],
            color: "font",
            lineHeight: 1.6
        },
        "bold": {
            size: 12,
            family: ["Lucida Grande", "DejaVu Sans", "Verdana", "sans-serif"],
            bold: true,
            color: "font",
            lineHeight: 1.6
        },
        "small": {
            size: 11,
            family: ["Lucida Grande", "DejaVu Sans", "Verdana", "sans-serif"],
            color: "font",
            lineHeight: 1.6
        },
        "monospace": {
            size: 12,
            family: ["DejaVu Sans Mono", "Courier New", "monospace"],
            color: "font",
            lineHeight: 1.6
        },
        "headline": {
            size: 22,
            family: ["serif"],
            sources: [
                {
                    family: "JosefinSlab",
                    source: [
                        "qx/decoration/Indigo/font/JosefinSlab-SemiBold.woff",
                        "qx/decoration/Indigo/font/JosefinSlab-SemiBold.ttf"
                    ]
                }
            ]
        }
    }
});