import { v4 as uuid } from "uuid";

import { C2SInitMessage, MatchResult, User } from "../types.js";
import logger from "./logger.js";
import { matchedUserCounter } from "./monitor.js";
import {
  addUserToState,
  getUsersByChatType,
  removeUserFromState,
} from "./user-manager.js";
import { getBestMatchForUser } from "./user-matcher.js";
import WebSocketManager from "./websocket-manager.js";

const RECENT_MATCH_REMEMBER_INTERVAL = 5 * 60 * 1000;

/**
 * Initializes a WebSocket connection and attempts to match the user.
 * @param {WebSocketManager} wsManager - The WebSocket manager.
 * @param {C2SInitMessage} payload - The initialization message payload.
 */
export const initializeWebSocketConnection = async (
  wsManager: WebSocketManager,
  payload: C2SInitMessage,
) => {
  const internalUser: User = createUser(wsManager, payload);

  logger.info(
    `Performing match for user ${internalUser.id} ${internalUser.chatType}`,
  );
  const match = getBestMatchForUser(
    internalUser,
    getUsersByChatType(internalUser.chatType),
  );

  if (match) {
    await handleMatch(internalUser, match, payload.sdp);
  } else {
    logger.info(`Adding user ${internalUser.id} to state`);
    setupRemoveUserFromState(wsManager, internalUser.id);
    addUserToState(internalUser);
  }
};

const setupRemoveUserFromState = (
  wsManager: WebSocketManager,
  userId: string,
) => {
  const timeoutId = setTimeout(() => {
    removeUserFromState(userId);
  }, 20_000);

  wsManager.on("close", () => {
    clearTimeout(timeoutId);
    removeUserFromState(userId);
  });
};

/**
 * Creates a new user object.
 * @param {WebSocketManager} wsManager - The WebSocket manager.
 * @param {C2SInitMessage} payload - The initialization message payload.
 * @returns {User} - The created user object.
 */
const createUser = (
  wsManager: WebSocketManager,
  payload: C2SInitMessage,
): User => {
  return {
    chatType: payload.chatType,
    id: uuid(),
    interests:
      payload.interests.length > 15
        ? payload.interests.slice(0, 15)
        : payload.interests,
    recentMatches: new Set(),
    sdp: payload.sdp,
    ws: wsManager,
  };
};

/**
 * Handles a successful match between users.
 * @param {User} internalUser - The internal user.
 * @param {MatchResult} match - The match result.
 * @param {string} sdp - The session description protocol.
 */
const handleMatch = async (
  internalUser: User,
  match: MatchResult,
  sdp: string,
) => {
  logger.info(`Match found for user ${internalUser.id} is ${match.peer.id}`);
  let answer;
  try {
    logger.info(
      `Sending answer request to ${match.peer.id} from ${internalUser.id}`,
    );
    answer = await match.peer.ws.requestAndWaitForAnswer(
      sdp,
      match.matchedInterests,
    );
  } catch {
    logger.error(
      `User ${match.peer.id} did not respond to answer request from ${internalUser.id}. Destroying.`,
    );
    match.peer.ws.destroy();
  }

  if (answer) {
    matchedUserCounter.inc();
    setupIceCandidateExchange(internalUser, match.peer);
    logger.info(`Sending answer to ${internalUser.id} from ${match.peer.id}`);
    internalUser.ws.sendPeerAnswer(answer, match.matchedInterests);
  } else {
    addUserToState(internalUser);
  }
};

/**
 * Sets up ICE candidate exchange between two users.
 * @param {User} userA - The first user.
 * @param {User} userB - The second user.
 */
const setupIceCandidateExchange = (userA: User, userB: User) => {
  logger.info(`User, ${userB.id} responded with answer`);
  userA.ws.onIceCandidate((candidate) =>
    userB.ws.sendPeerIceCandidate(candidate),
  );

  userB.ws.onIceCandidate((candidate) =>
    userA.ws.sendPeerIceCandidate(candidate),
  );
};

/**
 * Updates the recent matches for two users.
 * @param {User} peerA - The first user.
 * @param {User} peerB - The second user.
 */
// TODO: Use this when number of users increase
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateRecentMatches = (peerA: User, peerB: User) => {
  peerA.recentMatches.add(peerB.id);
  setTimeout(
    () => peerA.recentMatches.delete(peerB.id),
    RECENT_MATCH_REMEMBER_INTERVAL,
  );

  peerB.recentMatches.add(peerA.id);
  setTimeout(
    () => peerB.recentMatches.delete(peerA.id),
    RECENT_MATCH_REMEMBER_INTERVAL,
  );
};
