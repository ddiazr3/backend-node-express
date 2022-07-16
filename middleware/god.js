const isGod = (req) => {

     if(req.user.role === "62c4b37653076f0483dde2e9"){
          return true
     }
     return false
}

module.exports = {
     isGod
}
