(function(root) {
    "use strict";
    function createXhrObject() {
        var oXhr = null;
        if (typeof XMLHttpRequest !== 'undefined')
        {
            oXhr = new XMLHttpRequest();
        }
        else
        {
            var versions = [
                "MSXML2.XmlHttp.5.0",
                "MSXML2.XmlHttp.4.0",
                "MSXML2.XmlHttp.3.0",
                "MSXML2.XmlHttp.2.0",
                "Microsoft.XmlHttp"
            ];

            for (var i = 0, len = versions.length; i < len; i++)
            {
                try
                {
                    oXhr = new ActiveXObject(versions[i]);
                    break;
                }
                catch(e){}
            } // end for
        }
        return oXhr;
    }

    root.Ajax = {
        Request: function (sBaseUrl, oOptions)
        {
            var fNoop = function() {}
                , fSuccess = oOptions.success || fNoop
                , fComplete = oOptions.complete || fNoop
                , fError = oOptions.error || fNoop
                , bAsync = oOptions.async || true;

            this.oXhr = createXhrObject();

            /**
             * States as of http://www.w3.org/TR/XMLHttpRequest/#states
             *  0: request not initialized
             *  1: server connection established
             *  2: request received
             *  3: processing request
             *  4: request finished and response is ready
             */
            this.oXhr.onreadystatechange = function()  {

                if(this.oXhr.readyState < 4) return;

                if(this.oXhr.status !== 200)
                {
                    fError.call(null, this.oXhr);
                }
                else
                {
                    fSuccess.call(null, this.oXhr);
                }
                // all is well
                fComplete.call(null, this.oXhr);
            }.bind(this);

            this.start = function()
            {
                this.oXhr.open('GET', sBaseUrl, false);
                this.oXhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
                this.oXhr.send('');
            };

            this.abort = function()
            {
                this.oXhr.abort();
            };
        }
    };
}(window));