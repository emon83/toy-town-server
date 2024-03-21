
const registerUserIntoDB = async (payload) => {
    console.log(payload);
    // const result = await User.create(payload);
  
    // //* create token and sent to the  client
    // const jwtPayload = {
    //   _id: result._id,
    //   email: result.email,
    //   role: result.role,
    // };
  
    // const userData = {
    //   ...jwtPayload,
    //   username: result.username,
    // };
  
    // const token = createToken(
    //   jwtPayload,
    //   config.jwt_access_secret,
    //   config.jw,
    // );
  
    // return {
    //   user: userData,
    //   token,
    // };
  };

  export const UserServices = {
    registerUserIntoDB,
  };
  