
class FXMLHttpRequest {
  constructor() {
    this.method = null;
    this.url = null;
    this.data = null;
    this.responseText = null;
    this.status = null;
    this.readyState = 0;
    this.headers = [];
    this.load = null;
  }

  open(method, url) {
    // alert("open 1");
    this.method = method;
    this.url = url;
    this.readyState = 1;
  }

  setRequestHeader(name, value) {
    this.headers.push({ name, value });
  }
   send(data) {
    this.data = data;
    this.readyState = 2;
    this.status =  netWork(this);
  }
}