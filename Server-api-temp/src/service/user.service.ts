// import { Usermodel } from "../models/users.model";
// import jwt from 'jsonwebtoken';

// class UserService {
    
//     static async registerUser(email: any,studentid: any,password: any){
//         try {
//             // ! create user by real_users_model
//             const createUser = new Usermodel({email,studentid,password,role:'student'});
//             return await createUser.save();
//         } catch (error) {
//             throw error;
//         }
//     }

//     static async checkuser (email: any   ) {
//         try {
//             return await new Usermodel({ email });
//         } catch (error) {
//             throw error;
//         }
//     }

//     // static async generateToken(tokenData,secreatKey,jwt_expire){
//     //     return
//     // }

// }
// export default UserService;
// export { UserService };