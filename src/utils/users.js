const users = [];

const addUser = ({ id, room, username }) => {
  // clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //validate the data
  if (!username || !room) {
    return {
      error: "Username and room are required",
    };
  }

  // check for existing user
  const existingUser = users.find((user) => {
    return user.username === username && user.room === room;
  });

  //validate username
  if (existingUser) {
    return {
      error: "This username already exists in this room",
    };
  }

  //store user
  const user = { username, id, room };
  users.push(user);
  return { user };
};


const removeUser = (id) => {
  const index = users.findIndex(user => user.id === id)

  if(index !== -1){
    return users.splice(index, 1)[0];
  }
  return {
    error: 'User does not exists'
  }
};


const getUser = (id) => {
  return users.find(user => user.id === id);
};

const getUsersInRoom = (room) => {
  const roommies = users.filter((user)=> {
    return user.room === room
  })
  return roommies;
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}