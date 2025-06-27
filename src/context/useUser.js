import { useContext } from "react";
import { UserContext } from "./UserContextInstance";

export const useUser = () => useContext(UserContext);
