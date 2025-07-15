let users = [];

exports.createUser = (data)=>{
  const newUser = {
    id: users.length ? users[users.length - 1].id +1 : 1,
    ...data
  };
  users.push(newUser);
  return newUser;
};

exports.getAllUser = (keyword)=>{
  if (!keyword){
    return users;
  }
  const term = keyword.toLowerCase();
  return users.filter(
    (u) => u.email.toLowerCase().includes(term)
  )
};

exports.getUserByID = (id)=>{
 return users.find((u)=> u.id === id)
}

exports.getUserByEmail = (email)=>{
  return users.find((u)=>u.email === email)
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