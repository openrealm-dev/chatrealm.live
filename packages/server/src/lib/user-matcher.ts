import { MatchResult, User } from "../types.js";
import { removeUserFromState } from "./user-manager.js";

/**
 * Get the matched interests between two users.
 * @param interestsA - Interests of the first user.
 * @param interestsB - Interests of the second user.
 * @returns Array of matched interests.
 */
const getMatchedInterests = (
  interestsA: string[],
  interestsB: string[],
): string[] => {
  return interestsA.filter((interest) => interestsB.includes(interest));
};

/**
 * Find the best match for a given user from a list of peers.
 * @param user - The user to find a match for.
 * @param peers - List of potential matching peers.
 * @returns The best match result or null if no match is found.
 */
export const getBestMatchForUser = (
  user: User,
  peers: User[],
): MatchResult | undefined => {
  let bestScore = user.interests.length;
  let bestMatch: MatchResult | undefined;

  for (const peer of peers) {
    const matchedInterests = getMatchedInterests(
      user.interests,
      peer.interests,
    );
    const score = user.interests.length - matchedInterests.length;

    if (score === 0) {
      bestMatch = { matchedInterests, peer };
      removeUserFromState(peer.id);
      break;
    }

    if (score < bestScore) {
      bestScore = score;
      bestMatch = { matchedInterests, peer };
    }
  }

  return bestMatch;
};
