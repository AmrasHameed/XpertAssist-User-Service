import { Document, ObjectId } from 'mongoose';

export interface UserInterface extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  mobile: number;
  password: string;
  userImage: string;
  accountStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserRequest {
  id: string;
  name?: string;
  mobile?: number;
  userImage?: File | null;
  password?: string | null;
}

export interface RegisterUser {
  name: string;
  email: string;
  mobile: string;
  password: string;
  userImage: string;
}
