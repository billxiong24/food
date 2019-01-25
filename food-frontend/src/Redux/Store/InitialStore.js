export default {
  // For now, only persistent data about users is who is actually logged in if there is someone logged in
  users: {
    name: null,
    isSuccess: false,
    errMsg: null
  },
  // Persistent data concerning routing
  route: 0,
  // Persistent data concnerning ingredients view
  ingredients: {
    filters: [],
    cards: []
  }
}