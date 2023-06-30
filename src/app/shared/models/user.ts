export interface User {
  id: string;
  pseudo: string;
  image: string;
  email: string;
  friends: Array<string>;
  awaitFriends: Array<string>;
  pendingFriendRequests: Array<string>;
  fav: Array<string>;
  sex: string;
  objectif: number;
  createdAt: number;
  totalDist: number;
}
