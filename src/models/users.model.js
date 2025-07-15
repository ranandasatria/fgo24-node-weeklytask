let users = [];

exports.createUser = (data)=>{
  users.push(data);
  return data;
};