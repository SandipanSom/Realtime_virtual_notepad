import React from 'react';

const UserList = ({ users }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Active users:</span>
      <div className="flex -space-x-2">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="relative"
            title={user.name}
          >
            <div
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
              style={{ backgroundColor: user.color }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            {index < users.length - 1 && (
              <div className="absolute -right-1 top-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
            )}
          </div>
        ))}
      </div>
      {users.length === 0 && (
        <span className="text-sm text-gray-400">No other users</span>
      )}
    </div>
  );
};

export default UserList;
