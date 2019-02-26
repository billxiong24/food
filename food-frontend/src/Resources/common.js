const local = {
  hostname: 'https://cmdev.colab.duke.edu:8000/',
  url: 'http://localhost:3000/',
  https: false,
  colab_client_id: 'code-monkeys-local',
  colab_client_secret: 'sBzEYfj3%24g%3D%3Ds%3D9ykGvZg%40jkM%24JIAzqdatRwCZ%23cSredSCwoJB',
  colab_redirect_uri: 'http%3A%2F%2Flocalhost%3A3000%2Flogin',
}

const dev = {
  hostname: 'https://cmdev.colab.duke.edu:8000/',
  url: 'https://cmdev.colab.duke.edu/',
  https: true,
  colab_client_id: 'code-monkeys-dev',
  colab_client_secret: 'Lqwk%2BlPGuFElds3RWUsM%21yaCxlTcDSjfe%23i77%21bVBlzeUXwDac',
  colab_redirect_uri: 'https%3A%2F%2Fcmdev.colab.duke.edu%2Flogin',
}

const prod = {
  hostname: 'https://codemonkeys.colab.duke.edu:8000/',
  url: 'https://codemonkeys.colab.duke.edu/',
  https: true,
  colab_client_id: 'code-monkeys-prod',
  colab_client_secret: 'mYCevAXgB5d%23yHe38ipctjl%25AE%2AxaAk4eQdK2%233IzrDXL92k%219%0D%0A',
  colab_redirect_uri: 'https%3A%2F%2Fcodemonkeys.colab.duke.edu%2Flogin',
}

const ritwikvm = {
  hostname: 'http://vcm-8738.vm.duke.edu:8000/',
  url: 'http://localhost:3000/',
  https: false,
  colab_client_id: 'code-monkeys-ritwik',
  colab_client_secret: 'mYCevAXgB5d%23yHe38ipctjl%25AE%2AxaAk4eQdK2%233IzrDXL92k%219%0D%0A',
  colab_redirect_uri: 'https%3A%2F%2Fcodemonkeys.colab.duke.edu%2Flogin',
}

const config = process.env.REACT_APP_STAGE === 'prod' ? prod :
              (process.env.REACT_APP_STAGE === 'dev' ? dev : local);


export default {
  ...config
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export function hashcode(string){
  var hash = 0, i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function addToList(item, list){
  var set = new Set();
  for(var i = 0; i < list.length; i++){
    set.add(list[i].id)
  }
  list = JSON.parse(JSON.stringify(list))
  if(!set.has(item.id)){
    list.push(item)
  }
  return list
}

export function removeFromList(item,list){
  if(Array.isArray(item)){
    return removeListFromList(item,list)
  }else{
    return removeListFromList([item],list)
  }
}

export function findDifferences(newlist,original){
  var originalSet = new Set();
  for(var i = 0; i < original.length; i++){
    originalSet.add(original[i].id)
  }
  let additions = [];
  for(var i = 0; i < newlist.length; i++){
    if(!originalSet.has(newlist[i].id)){
      additions.push(newlist[i])
    }
  }
  var newSet = new Set();
  let deletions = [];
  for(var i = 0; i < newlist.length; i++){
    newSet.add(newlist[i].id)
  }
  for(var i = 0; i < original.length; i++){
    if(!newSet.has(original[i].id)){
      deletions.push(original[i])
    }
  }
  return {
    original,
    newlist,
    additions,
    deletions
  }
}

function removeListFromList(listToRemove, original){
  var set = new Set();
  for(var i = 0; i < listToRemove.length; i++){
    set.add(listToRemove[i].id)
  }

  let newlist = original.filter(item => !set.has(item.id))
  return newlist
}
export function isInteger(string){
  return String(string).match(/^[0-9]+$/) != null;
}

export function isIngredientCSV(string){
  return String(string).match(/^ingredients([a-zA-Z0-9_.\-\(\):])*(.csv)$/)
}

export function isFormulaCSV(string){
  return String(string).match(/^formula([a-zA-Z0-9_.\-\(\):])*(.csv)$/)
}

export function isSKUCSV(string){
  return String(string).match(/^sku([a-zA-Z0-9_.\-\(\):])*(.csv)$/)
}

export function isProductLineCSV(string){
  return String(string).match(/^product_line([a-zA-Z0-9_.\-\(\):])*(.csv)$/)
}

export function isPrice(string){
  return String(string).match(/(\d)+(\.(\d){1,2}|)/) != null;
}

export function isUPCNumber(string){
  return String(string).match(/^(?=.*0)[0-9]{12}$/) != null;
}

export function getFormInsertErrors(formula) {
    let errs = [];
    if(!formula.name || formula.name === "") {
        errs.push({
            errMsg:"Must have a name",
            id: hashcode("Must have a name")
        });
    }
    return errs;
}

export function getFormUpdateErrors(formula) {
    let errs = [];
    if(!formula.name || formula.name === "") {
        errs.push({
            errMsg:"Must have a name",
            id: hashcode("Must have a name")
        });
    }
    if(formula.num === "" || !formula.num || isNaN(formula.num)) {
        errs.push({
            errMsg:"Must be valid num",
            id: hashcode("Must be valid num")
        });
    }
    return errs;
}

export function getIngErrors(ing){
  let errors = []
  let message;
  if(ing.name === undefined || ing.name == ""){
    message = "Name is Empty"
    errors.push({errMsg:message,id:hashcode(message)})
  }
  if(ing.num === undefined){
    message = "Ingredient Number is Empty"
    errors.push({errMsg:message,id:hashcode(message)})
  }

  if(ing.pkg_size === undefined || ing.pkg_size == ""){
    message = "Package Size is Empty"
    errors.push({errMsg:message,id:hashcode(message)})
  }

  if(ing.pkg_cost === undefined){
    message = "Package Cost is Empty"
    errors.push({errMsg:message,id:hashcode(message)})
  }

  if(!isInteger(ing.num)){
    message = "Ingredient Number is Invalid"
    errors.push({errMsg:message,id:hashcode(message)})
  }
  if(!isPrice(ing.pkg_cost)){
    message = "Price is Invalid"
    errors.push({errMsg:message,id:hashcode(message)})
  }
  return errors
}


// {      
//   name: "sku3",     
//   case_upc: 123305,     
//   unit_upc: 655653,     
//   unit_size: "12 lbs",     
//   count_per_case: 998,    
//   prd_line: "prod4",    
//   comments: "commentingg"    
// }
export function skuCheckFormula(formula) {
    let errors = [];
    if(!formula) {
        let message = "Formula is Empty"
        errors.push({errMsg:message,id:hashcode(message)})
    }

    return errors;
}
export function getSkuErrors(sku){
  let errors = []
  let message;
  if(sku.name === undefined || sku.name == ""){
    message = "Name is Empty"
    errors.push({errMsg:message,id:hashcode(message)})
  }
  if(sku.num === undefined){
    message = "SKU Number is Empty"
    errors.push({errMsg:message,id:hashcode(message)})
  }

  if(sku.case_upc === undefined){
    message = "Case UPC is Empty"
    errors.push({errMsg:message,id:hashcode(message)})
  }

  if(sku.unit_upc === undefined){
    message = "Unit UPC is Empty"
    errors.push({errMsg:message,id:hashcode(message)})
  }


  if(sku.unit_size === undefined || sku.unit_size == ""){
    message = "Unit Size is Empty"
    errors.push({errMsg:message,id:hashcode(message)})
  }

  if(sku.count_per_case === undefined){
    message = "Count Per Case is Empty"
    errors.push({errMsg:message,id:hashcode(message)})
  }

  if(sku.prd_line === undefined || sku.prd_line == ""){
    message = "Product Line is Empty"
    errors.push({errMsg:message,id:hashcode(message)})
  }

  if(!isInteger(sku.num)){
    message = "SKU Number is Invalid"
    errors.push({errMsg:message,id:hashcode(message)})
  }
  if(!isInteger(sku.count_per_case)){
    message = "Count Per Case is Invalid"
    errors.push({errMsg:message,id:hashcode(message)})
  }
  if(!isUPCNumber(sku.case_upc)){
    message = "Case UPC Number does not conform to UPC-A standard"
    errors.push({errMsg:message,id:hashcode(message)})
  }
  if(!isUPCNumber(sku.unit_upc)){
    message = "Unit UPC Number does not conform to UPC-A standard"
    errors.push({errMsg:message,id:hashcode(message)})
  }
  return errors
}

export function createError(message){
  return {errMsg:message,id:hashcode(message)}
}
