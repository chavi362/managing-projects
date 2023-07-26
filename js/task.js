
class Task {
  constructor(code, name, priority, deadline, comments,status) {
    this.code=code;
    this.name = name;
    this.priority = priority;
    this.deadline = deadline;
    this.comments = comments;
    this.status = status||'not started';
  }
  updateStatus(status) {
    this.status = status;
    //   if (status === 'in progress') {//לחשוב אם עדיף פה או ביצירה
    //     this.dateStart = new Date();
    //   }
    // שליחת בקשת PUT לשרת עם פרטי המשימה המעודכנים
    let myXml = new FXMLHttpRequest();//לתקן לfajax
    myXml.open("PUT", `http://localhost:3000/tasks/${this.code}`);
    myXml.setRequestHeader("Content-Type", "application/json");
    myXml.send(JSON.stringify(this));
  }
}