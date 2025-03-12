
const mockAuthApi = {
  register: (userData) => {
    return new Promise((resolve, reject) => {
      try {

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email already exists
        if (users.some(user => user.email === userData.email)) {
          throw new Error('Email already registered');
        }
        
  
        const newUser = {
          id: 'user-' + Date.now(),
          ...userData,
          password: btoa(userData.password), 
        };
        
        // Add to users array
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Create a mock token
        const token = btoa(`${userData.email}:${Date.now()}`);
        
        // Return user data without password and token
        const { password, ...userWithoutPassword } = newUser;
        resolve({
          user: userWithoutPassword,
          token
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && btoa(password) === u.password);
        
        if (!user) {
          throw new Error('Invalid credentials');
        }
        
        // Create a mock token
        const token = btoa(`${email}:${Date.now()}`);
        
        // Return user data without password and token
        const { password: pwd, ...userWithoutPassword } = user;
        resolve({
          user: userWithoutPassword,
          token
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  
  getProfile: () => {
    return new Promise((resolve, reject) => {
      try {

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        
        const email = atob(token).split(':')[0];
        
        // Find user by email
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // Return user data without password
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      } catch (error) {
        reject(error);
      }
    });
  },
  
  updateProfile: (userData) => {
    return new Promise((resolve, reject) => {
      try {
        // Get current token
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        
        // Extract email from token
        const email = atob(token).split(':')[0];
        
        // Find and update user
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        let updatedUser = null;
        
        const updatedUsers = users.map(user => {
          if (user.email === email) {
            updatedUser = { ...user, ...userData };
            return updatedUser;
          }
          return user;
        });
        
        if (!updatedUser) {
          throw new Error('User not found');
        }
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Return user data without password
        const { password, ...userWithoutPassword } = updatedUser;
        resolve(userWithoutPassword);
      } catch (error) {
        reject(error);
      }
    });
  }
};

// Export the functions using the mock implementation
export const registerUser = async (userData) => {
  try {
    return await mockAuthApi.register(userData);
  } catch (error) {
    throw { response: { data: { message: error.message } } };
  }
};

export const loginUser = async (email, password) => {
  try {
    return await mockAuthApi.login(email, password);
  } catch (error) {
    throw { response: { data: { message: error.message } } };
  }
};

export const getUserProfile = async () => {
  try {
    return await mockAuthApi.getProfile();
  } catch (error) {
    throw { response: { data: { message: error.message } } };
  }
};

export const updateUserProfile = async (userData) => {
  try {
    return await mockAuthApi.updateProfile(userData);
  } catch (error) {
    throw { response: { data: { message: error.message } } };
  }
};