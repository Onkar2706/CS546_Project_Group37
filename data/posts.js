import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validate from "../helpers.js";
import bcrypt from "bcryptjs";
import pkg from "validator";