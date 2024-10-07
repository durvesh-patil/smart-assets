"use client";
import useAssets from "@/hooks/useAssets";
import { Box } from "@mui/material";

export default function Assets() {
  const { assetsList } = useAssets();
  console.log(assetsList);
  return <Box>assets page</Box>;
}
