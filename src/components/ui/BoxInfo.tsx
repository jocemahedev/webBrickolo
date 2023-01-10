import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";


const BoxInfo = ({ info }: BoxInfoProps) => {
  return (
    <Box>
      <Typography variant="h6">
        {info}
      </Typography>
    </Box>
  );
};

type BoxInfoProps = {
  info: string;
};

export default BoxInfo;
