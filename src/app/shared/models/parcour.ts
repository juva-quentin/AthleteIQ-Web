import {Timer} from "./timer";
import {Polyline} from "./polyline";

export interface Parcour {
  VM : number;
  allPoints: Polyline[]
  createdAt: string;
  description: string;
  owner: string;
  shareTo: [];
  timer: Timer
  title: string;
  totalDistance: number;
  type: string;
}
