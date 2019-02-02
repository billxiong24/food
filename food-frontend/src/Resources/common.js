export default {
  hostname: 'http://cmdev.colab.duke.edu:8000/'
}

export function addToList(item, list){
  var set = new Set();
  for(var i = 0; i < list.length; i++){
    set.add(list[i].id)
  }
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

function removeListFromList(listToRemove, original){
  console.log("REMOVEFROMLIST")
  console.log(listToRemove)
  console.log(original)
  var set = new Set();
  for(var i = 0; i < listToRemove.length; i++){
    set.add(listToRemove[i].id)
  }

  let newlist = original.filter(item => !set.has(item.id))
  console.log(newlist)
  return newlist
}



