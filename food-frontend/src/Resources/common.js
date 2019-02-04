export default {
  hostname: 'https://cmdev.colab.duke.edu:8000/'
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
  console.log(newlist)
  console.log(original)
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



