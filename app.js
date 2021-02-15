let object=new Notes();
object.connect();

let hijri_date=new Intl.DateTimeFormat('ar-TN-u-ca-islamic', {day: 'numeric', month: 'long',weekday: 'long',year : 'numeric'}).format(Date.now());

reversebutton.onclick=reversOrder;
clearbutton.onclick=claerObjects;
window.onload=getAllObject;
document.addEventListener('submit',(event)=>{
  event.preventDefault();
  let target=event.target;//return which form that submmited
  console.log(target);
  if(target &&  target.classList.contains("addtask")){
  addObject(target);
}else if(target &&  target.classList.contains("update-task")){
  upadteObject(target);
}
});

document.addEventListener('click',(event)=>{
  let {target}=event;
  if(target && target.id===("delete")){
  let objectID=Number(target.dataset.id);
  deleteObject(objectID);
}else if(target && target.id===("edit")) {
 editTask(target);
}
})
window.addEventListener('load',()=>{
// today_date.style.background='rgb(209,176,247,0.2)';
today_date.style.borderRadius=20+'px';

today_date.innerText=hijri_date;

})


async function reversOrder(){
  object.reversOrder = !object.reversOrder;
  getAllObject();
}

function editTask(task){
let taskID='task-'+task.dataset.id;
let taskContainer=document.getElementById(taskID);
let oldText=taskContainer.querySelector(".text").innerText;
let form2=`  <form class="update-task" data-id=${task.dataset.id}>
    <textarea class="editClass" >${oldText}</textarea>
    <button type="btn"class="btn" name="submit">تحديث</button>
  </form>`;
  taskContainer.innerHTML=form2;
}

async function  addObject(target){
let component=target.querySelector("textarea");
let textInput=component.value;
let add=await object.add({text:textInput});
add.onsuccess=()=>{
  getAllObject();
  component.value="";

}
}

async function  deleteObject(taskID){

  if(confirm('هل انت متأكد انك تريد حذف المهمة ؟')){
    let deletedRequest=await object.delete(taskID);
    deletedRequest.onsuccess=()=>{
    document.getElementById('task-'+taskID).remove();
    }

    deletedRequest.onerror=()=>{
    alert("Error while delete")
    }
  }else{
    return false;
  }

}


async function  upadteObject(target){
  let component=target.querySelector("textarea");
  let textInput=component.value;
  let updatedRequest=await object.update({tid:Number(target.dataset.id),text:textInput});
  updatedRequest.onsuccess=getAllObject;
}

async function  getAllObject(){
let allRequest=await object.all();
let arrayTasks=[];
allRequest.onsuccess=()=>{
  let cursor=allRequest.result;
  if(cursor){
    arrayTasks.push(cursor.value)
    cursor.continue();
  }else{
    displayTask(arrayTasks);
  }
}

}

function displayTask(arrayTasks){
  let UlElement=document.createElement("div");
  UlElement.className='listTask';
  let container=document.getElementById("tasks");
  for(let i=0;i<arrayTasks.length;i++ ){
    let elem=document.createElement("div");
    let task=arrayTasks[i];
    elem.className='task';
    elem.id='task-'+task.tid;
    elem.innerHTML=`<div class="">

     <span class="text" >${task.text}</span>
    </div>
    <div class="icons">
        <i class="fa fa-edit" id="edit" data-id='${task.tid}''> </i>
        <i class="fa fa-close" id="delete" data-id='${task.tid}'></i>
    </div>`;
    UlElement.append(elem);

  }
  container.innerHTML='';
    container.append(UlElement);
}


async function  claerObjects(){
  if(confirm("هل انت متأكد انك تريد حذف المهام جميعها ؟")){
let clearRequest=await object.clear();
clearRequest.onsuccess=()=>{
  getAllObject();
}
}else{
  return false;
}

}




function getDay()
{
  let date=new Date();
  let num=date.getDate();
  let days=["الاحد","الاثنين","الثلاثاء","الاربعاء","الخميس","الجمعة","السبت"];
  let requiredIndex=(num % 7)+1; // TO get the day if the date  bigger than 6
  return days[requiredIndex];
}
