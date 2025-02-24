import { Document, Types } from "mongoose";

export interface UserInterface extends Document {
  _id: Types.ObjectId;
  fullName?: string;
  avatar?: string;
  email: string;
  password?: string;
  country?: string;
  companyName?: string;
  domain?: string;
  isActive?: boolean;
  isVerified?: boolean;
  shopify?: boolean;
  shopifyDomain?: string;
  jwt?: string;
  shopifyId?: string;
  shopifyToken?: string;
  shopifyScriptId?: string;
  wix?: boolean;
  wixDomain?: string;
  wixInstanceId?: string;
  wixRefreshToken?: string;
  wixScriptAdded?: boolean;
  plan?: string;
  installed?: boolean;
  widget_type?: string;
  renamingEmail?: boolean;
  disabled?: boolean;
}
