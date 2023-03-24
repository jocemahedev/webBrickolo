import TextField from "@mui/material/TextField";
import { Box} from "@mui/material";
import { signIn } from "../../redux/services/firebase/AuthRequest";
import { Controller, useForm } from "react-hook-form";

import { User } from "firebase/auth";
import { useReduxDispatch } from "../../redux";
import { setCurrentCollection } from "../../redux/collection";
import { setCurrentCollector } from "../../redux/collector";
import { Collector } from "../../types/types";
import { nanoid } from "@reduxjs/toolkit";
import BoxPage from "../ui/BoxPage";
import ButtonCustom from "../ui/ButtonCustom";
import { redirect } from "react-router-dom";

export function LoginPage() {
  const dispatch = useReduxDispatch();
  const getNewCollector = (user: User): Collector => {
    return {
      name: user.displayName,
      email: user.email,
      collection: { id: nanoid(), idSets: user.uid },
    };
  };
  const { handleSubmit, control } = useForm();
  const onSubmit = (data: any) =>
     signIn(data.username, data.password)
      .then((userCredential: any) => {
        // Signed in

        const user = userCredential.user;
        const collector: Collector = getNewCollector(user);
        dispatch(setCurrentCollector(collector));
        if (collector.collection) {
          dispatch(setCurrentCollection(collector.collection));
        }
        console.log("Works!");
        redirect("/");
      })
      .catch((e) => {
        console.log(e.message);
      });

  return (
    <BoxPage titlePage="Login">
      <form>
        <Box sx={{ mx: 0, justifyContent: "center", display: "flex" }}>
          <Controller
            name={"username"}
            control={control}
            render={({ field: { onChange, value = "" } }) => (
              <TextField
                sx={{
                  marginTop: 1.2,
                  marginRight: 2,
                }}
                onChange={onChange}
                value={value}
                label={"Username"}
              />
            )}
          />
          <Controller
            name={"password"}
            control={control}
            render={({ field: { onChange, value = "" } }) => (
              <TextField
                sx={{ marginTop: 1.2, marginRight: 2 }}
                onChange={onChange}
                value={value}
                label={"Password"}
              />
            )}
          />
          <ButtonCustom title={"Submit"} onClick={handleSubmit(onSubmit)} />
        </Box>
      </form>
    </BoxPage>
  );
}
