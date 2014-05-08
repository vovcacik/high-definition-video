/**
 * @see http://wiki.greasespot.net/Content_Script_Injection
 */
var hdv = {
    init: function() {
        if (gBrowser) gBrowser.addEventListener("DOMContentLoaded", this.onDOMContentLoaded);
    },
    onDOMContentLoaded: function(event) {
        var doc = event.originalTarget;
        if (!doc || !doc.body) return;

        var script = doc.createElement('script');
        script.setAttribute("type", "application/javascript");
        script.setAttribute("src", "chrome://hdv/content/hdv.js");
        script.setAttribute("charset", "UTF-8");
        doc.body.appendChild(script);
        doc.body.removeChild(script);
    }
}

window.addEventListener("load", function() {
    hdv.init();
    window.removeEventListener("load", this, false);
});
