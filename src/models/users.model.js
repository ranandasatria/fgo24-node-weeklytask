let users = [];

exports.createUser = (data)=>{
  users.push(data);
  return data;
};

exports.getUser = ()=>{
  return users;
};