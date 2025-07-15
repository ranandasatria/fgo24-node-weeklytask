let users = [];

exports.createUser = (data)=>{
  const newUser = {
    id: users.length ? users[users.length - 1].id +1 : 1,
    ...data
  };
  users.push(newUser);
  return newUser;
};

exports.getUser = ()=>{
  return users;
};