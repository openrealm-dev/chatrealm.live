import { ChatType, User } from "../types.js";
import { queueSizeGuage } from "./monitor.js";

const userIdVsInfo: Map<string, User> = new Map();
const videoUsers: Map<string, User> = new Map();
const textUsers: Map<string, User> = new Map();

/**
 * Adds a user to the state.
 * @param {User} user - The user to add.
 * @returns {Map<string, User>} - The updated user map.
 */
export const addUserToState = (user: User): Map<string, User> => {
  queueSizeGuage.inc();
  if (user.chatType === "video") {
    videoUsers.set(user.id, user);
  } else {
    textUsers.set(user.id, user);
  }

  userIdVsInfo.set(user.id, user);
  return userIdVsInfo;
};

/**
 * Retrieves a user from the state by ID.
 * @param {string} id - The user ID.
 * @returns {User | undefined} - The user, if found.
 */
export const getUserFromState = (id: string): undefined | User => {
  return userIdVsInfo.get(id);
};

/**
 * Retrieves all users from the state.
 * @returns {User[]} - An array of all users.
 */
export const getAllUsersFromState = (): User[] => {
  return [...userIdVsInfo.values()];
};

/**
 * Retrieves all video chat users from the state.
 * @returns {User[]} - An array of video chat users.
 */
export const getVideoUsersFromState = (): User[] => {
  return [...videoUsers.values()];
};

/**
 * Retrieves all text chat users from the state.
 * @returns {User[]} - An array of text chat users.
 */
export const getTextUsersFromState = (): User[] => {
  return [...textUsers.values()];
};

/**
 * Retrieves users by chat type from the state.
 * @param {ChatType} chatType - The chat type to filter by.
 * @returns {User[]} - An array of users filtered by chat type.
 */
export const getUsersByChatType = (chatType: ChatType): User[] => {
  return chatType === "video"
    ? [...videoUsers.values()]
    : [...textUsers.values()];
};

/**
 * Removes a user from the state by ID.
 * @param {string} id - The user ID.
 * @returns {boolean} - True if the user was removed, false otherwise.
 */
export const removeUserFromState = (id: string): boolean => {
  const user = userIdVsInfo.get(id);
  if (!user) {
    return false;
  }

  queueSizeGuage.dec();
  userIdVsInfo.delete(id);

  if (user.chatType === "video") {
    videoUsers.delete(id);
  } else {
    textUsers.delete(id);
  }

  return true;
};
