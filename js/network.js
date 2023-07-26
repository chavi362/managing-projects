const newFServer = new Server();
function netWork(fXMLHttpRequest) {
    try {
        let stringUrl = fXMLHttpRequest.url.split('/');
        let address = stringUrl[2];
        if (address === "projectHub.com") {
            setTimeout(() => {
                newFServer.handler(fXMLHttpRequest);
                fXMLHttpRequest.onload();
            }, 20);
        }
        else {
            throw "the url is not valid!!";
        }
    } catch (e) {
        alert(e);
    }
}