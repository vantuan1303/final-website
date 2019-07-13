const User = require('./models/user.model')
let string = "3, 4,5d26b42aa79fbe0a2ef1bdd9, 5"
let userIds = string.split(",")
// console.log(userIds)
// 5d26d9a853741c0fd8ace4de
const find = async () => {
    try {
        let id = "5e26d9a853741c0fd8ace4de"
        if (id.match(/^[0-9a-fA-F]{24}$/)){
            let foundUser = await User.findById(id)
            if(!foundUser) {
                console.log("000")
            } else {
                console.log("111")
            }
        } else {
            console.log("2222")
        }
    } catch (error){
        console.log(error)
    }
    

}
// userIds.forEach(userId => {
//     let user = User.findById("5d26b42aa79fbe0a2ef1bdd9")
//         if (!user.length) { //Ko thấy user
//             console.log("not found")
//         } else {
//             console.log(userId)
//         }
// })
find()