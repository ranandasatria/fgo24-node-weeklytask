let users = [];

exports.createUser = (data)=>{
  const newUser = {
    id: users.length ? users[users.length - 1].id +1 : 1,
    ...data
  };
  users.push(newUser);
  return newUser;
};

exports.getAllUser = ()=>{
  return users;
};

exports.getUserByID = (id)=>{
 return users.find((u)=> u.id === id)
}


exports.updateUser = (id, data) => {
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;

  users[idx] = { ...users[idx], ...data };
  return users[idx];
};

exports.deleteUser = (id) => {
 const idx = users.findIndex(u => u.id === id);
 if (idx === -1) return null;
 
 return users.splice(idx, 1)[0]
}