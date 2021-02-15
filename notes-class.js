class Notes{
  dbVersion=2;
  dbName="myDatabase";
  reversOrder=false;

  connect(){
   return new Promise((resolve,reject) => {

   const request=indexedDB.open(this.dbName,this.dbVersion);

   request.onupgradeneeded=()=>{
   let resultDB=request.result;
   if(!resultDB.objectStoreNames.contains("tasks"))
   resultDB.createObjectStore("tasks",{keyPath:"tid",autoIncrement:true});
   }
   request.onsuccess=()=>resolve(request.result);
   request.onerror=()=>reject(request.error.message);
   request.onblocked=()=>console.lof("page refresh plz");
   });
  }

 async accessStore(accessMode){
   let connect=await this.connect(); //return the request result
   let tx=connect.transaction("tasks",accessMode);
   return tx.objectStore("tasks");
 }

  async add(task){
  let store=await this.accessStore("readwrite");
  return store.add(task);
  }


  async delete(taskID){
  let store=await this.accessStore("readwrite");
  return store.delete(taskID);
  }

  async update(task){
    let store=await this.accessStore("readwrite");
    return store.put(task);
  }
   async all(){
     let store=await this.accessStore("readonly");
     return store.openCursor(null ,this.reversOrder ? 'next' :'prev');
    }
  async clear(){
    let store=await this.accessStore("readwrite");
    return store.clear();
  }


}
