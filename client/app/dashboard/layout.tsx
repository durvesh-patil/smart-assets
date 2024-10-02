"use client";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Drawer,
  List,
  ListItemText,
  IconButton,
  Toolbar,
  Divider,
  Typography,
  Grid2 as Grid,
  Box,
  ListItemButton,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { ReactNode } from "react";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 240;

interface menuItem {
  name: string;
  url: string;
  icon: string;
}
const MenuItems = [
  { name: "Assets", url: "/dashboard/assets", icon: "" },
  { name: "Templates", url: "/dashboard/templates", icon: "" },
  { name: "Employees", url: "/dashboard/employees", icon: "" },
];

export default function SideBar({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <div>
      <Toolbar>
        <Typography variant="h6">SmartAssets</Typography>
      </Toolbar>
      <Divider />
      <List>
        {MenuItems.map((obj: menuItem, index: number) => (
          <Link
            href={obj.url}
            key={obj.name}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemButton>
              <ListItemText primary={obj.name} />
            </ListItemButton>
          </Link>
        ))}
      </List>
      <Divider />
    </div>
  );

  console.log(isMobile);
  return (
    <Grid container>
      {isMobile ? (
        <Grid item="true" sx={{ p: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            variant={isMobile ? "temporary" : "permanent"} // Toggle between permanent and temporary for mobile
            open={mobileOpen || !isMobile} // On mobile, respect mobileOpen state
            onClose={handleDrawerToggle} // Close drawer on mobile
            ModalProps={{ keepMounted: true }} // Improve performance on mobile
            sx={{
              width: drawerWidth,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </Grid>
      ) : (
        <Grid
          item="true"
          xs={12}
          sm={3}
          md={2}
          sx={{
            borderRight: 1,
            borderColor: "grey.300",
            minHeight: "100vh",
          }}
        >
          <Box component="nav">
            <Toolbar />
            {/* <Typography>SmartAssets</Typography> */}

            <List sx={{}}>
              {MenuItems.map((obj: menuItem, index: number) => (
                <Link
                  href={obj.url}
                  key={obj.name}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItemButton sx={{ width: "12rem" }}>
                    <ListItemText primary={obj.name} />
                  </ListItemButton>
                </Link>
              ))}
            </List>
          </Box>
        </Grid>
      )}
      <Grid item="true" xs={12} size={12}>
        <Box component="main">{children}</Box>
      </Grid>
    </Grid>
  );
}