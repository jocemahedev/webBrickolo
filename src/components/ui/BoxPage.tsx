import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import {  ReactNode } from "react";


const BoxPage = ({ titlePage, children }: BoxPageProps) => {
  return (
    <Box
      sx={{
        mx: 5,
        py: 4,
      }}
    >
      <Typography
        sx={{ mx: 0, display: "flex", justifyContent: "center", width: "100%" }}
        variant="h3"
        color="text.primary"
        gutterBottom
      >
        {titlePage}
      </Typography>
      {children}
    </Box>
  );
};

type BoxPageProps = {
  titlePage: string;
  children: ReactNode;
};

export default BoxPage;
