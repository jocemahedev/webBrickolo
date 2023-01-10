import { Button } from "@mui/material";
import { signOut } from "./../redux/services/firebase/AuthRequest";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
