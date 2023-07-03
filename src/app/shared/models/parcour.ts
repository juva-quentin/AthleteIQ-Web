import {Timer} from "./timer";
import {Polyline} from "./polyline";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Parcour {
  VM : number;
  allPoints: Polyline[]
  createdAt: Timestamp;
  description: string;
  owner: string;
  shareTo: string[];
  timer: Timer
  title: string;
  totalDistance: number;
  type: string;
}
