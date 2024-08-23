import { ReactNode } from 'react';
import { Types } from '@gilbarbara/components';
import { Dispatch } from 'redux';
import { ValueOf } from 'type-fest';

import { AlertPosition, AlertType, Status } from './common';

export interface AlertData {
  icon: Types.Icons;
  id: string;
  message: ReactNode;
  position: AlertPosition;
  timeout: number;
  type: AlertType;
}

export interface Topic {
  cached: boolean;
  data: Array<Record<string, any>>;
  message: string;
  status: ValueOf<Status>;
  updatedAt: number;
}

export interface AlertsState {
  data: AlertData[];
}

export interface AppState {
  query: string;
}

export interface GitHubState {
  topics: Record<string, Topic>;
}

export interface User {
  user_id?: string;
  name?: string;
  email?: string;
  user_role?: number;
  dob?: Date;
}

export interface UserState {
  isAuthenticated: boolean;
  user: User;
  status: ValueOf<Status>;
  token: string;
  role: string;
  error: string;
}

export interface RootState {
  alerts: AlertsState;
  app: AppState;
  github: GitHubState;
  user: UserState;
  event: EventState;
}

export interface IFormInput {
  email: string;
  password: string;
}

export interface WithDispatch {
  dispatch: Dispatch;
}

export interface Event {
  event_id?: string;
  event_name: string;
  organizer_name: string;
  event_date: string;
  venue: Venue;
  category: Category;
  image?: FileList; 
  status?: string;
}

export interface EventState {
  events: Event[]; 
  categories: Category[]; 
  venues: Venue[]; 
  currentEvent: Event | null;
  eventToApprove: Event | null;
  status: string;
  error: string | null;
  isModalOpen: boolean;
  isEditMode: boolean;
  isConfirmModalOpen: boolean;
}

export interface Venue {
  venue_id?: string;
  venue_name: string;
  city: string;
  country: string;
  capacity: number;
}

export interface Category {
  category_id?: string;
  category_name: string;
}

