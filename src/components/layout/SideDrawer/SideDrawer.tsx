"use client";

import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Collapse,
  useMediaQuery,
  Theme,
  tooltipClasses,
} from "@mui/material";
import {
  Home,
  Assignment,
  AddBox,
  Person,
  Info,
  Logout,
  Menu,
  ChevronLeft,
  ExpandLess,
  ExpandMore,
  Notifications,
  LibraryAdd,
  ShoppingCart,
} from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "../../../../public/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { toggleDrawer } from "@/app/store/features/uiSlice";
import { styled } from "@mui/material/styles";

const drawerWidth = 240;
const collapsedWidth = 60;

const navItems = [
  {
    text: "Home Page",
    icon: <Home />,
    href: "/",
  },
  {
    text: "My Orders",
    icon: <Assignment />,
    children: [
      { text: "All Orders", href: "/orders/all" },
      { text: "Drafts", href: "/orders/drafts" },
    ],
  },
  {
    text: "New Order",
    icon: <AddBox />,
    children: [
      { text: "U.S Authentication", href: "/orders/new/us-authentication" },
      {
        text: "Global Authentication",
        href: "/orders/new/global-authentication",
      },
      { text: "Translation Service", href: "/orders/new/translation-service" },
      { text: "Visa Service", href: "/orders/new/visa-service" },
      { text: "Notary Service", href: "/orders/new/notary-service" },
      { text: "Dispatch Service", href: "/orders/new/dispatch-service" },
    ],
  },
  {
    text: "Bulk Ordering",
    icon: <LibraryAdd />,
    href: "/orders/bulk-ordering",
  },
  {
    text: "Notifications",
    icon: <Notifications />,
    href: "/notifications",
  },
  {
    text: "FAQ",
    icon: <Info />,
    href: "/faq",
  },
  {
    text: "Cart",
    icon: <ShoppingCart />,
    href: "/cart",
  },
  {
    text: "Profile",
    icon: <Person />,
    href: "/accounts/profile",
  },
];

// Styled submenu tooltip (for collapsed parent items)
const SubmenuTooltip = styled(({ className, ...props }: any) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[4],
    borderRadius: 6,
    padding: 0,
    minWidth: 180,
  },
}));

const SubmenuList = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  "& a": {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    textDecoration: "none",
    color: theme.palette.text.primary,
    fontSize: "14px",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const SideDrawer = () => {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.ui.drawerOpen);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const pathname = usePathname();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const handleExpand = (itemText: string) => {
    if (!open) return;
    setExpanded((prev) => ({
      ...prev,
      [itemText]: !prev[itemText],
    }));
  };

  const renderNavItem = ({ text, icon, href, children }: any) => {
    const hasChildren = Array.isArray(children);

    const isActive =
      href && pathname === href
        ? true
        : hasChildren
        ? children.some((c: any) => pathname.startsWith(c.href))
        : false;

    if (!hasChildren) {
      return (
        <Link
          href={href || "#"}
          key={text}
          passHref
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Tooltip title={!open ? text : ""} placement="right">
            <ListItem
              sx={{
                backgroundColor: isActive ? "#2c4a6e" : "transparent",
                "&:hover": { backgroundColor: "#2c4a6e" },
              }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
                {icon}
              </ListItemIcon>
              {open && <ListItemText primary={text} />}
            </ListItem>
          </Tooltip>
        </Link>
      );
    }

    const firstChildHref = children[0]?.href || "#";

    return (
      <div key={text}>
        <SubmenuTooltip
          title={
            !open ? (
              <SubmenuList>
                {children.map((c: any) => (
                  <Link href={c.href} key={c.text} passHref>
                    {c.text}
                  </Link>
                ))}
              </SubmenuList>
            ) : (
              ""
            )
          }
          placement="right-start"
          disableInteractive
        >
          <ListItem
            onClick={() =>
              open
                ? handleExpand(text)
                : (window.location.href = firstChildHref)
            }
            sx={{
              backgroundColor: isActive ? "#2c4a6e" : "transparent",
              "&:hover": { backgroundColor: "#2c4a6e" },
              cursor: "pointer",
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
              {icon}
            </ListItemIcon>
            {open && <ListItemText primary={text} />}
            {open && (expanded[text] ? <ExpandLess /> : <ExpandMore />)}
          </ListItem>
        </SubmenuTooltip>

        {open && (
          <Collapse in={expanded[text]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {children.map((child) => {
                const childActive = pathname.startsWith(child.href);
                return (
                  <Link
                    href={child.href}
                    key={child.text}
                    passHref
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItem
                      sx={{
                        pl: 6,
                        backgroundColor: childActive
                          ? "#345a82"
                          : "transparent",
                        "&:hover": { backgroundColor: "#345a82" },
                      }}
                    >
                      <ListItemText primary={child.text} />
                    </ListItem>
                  </Link>
                );
              })}
            </List>
          </Collapse>
        )}
      </div>
    );
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedWidth,
          transition: "width 0.3s ease",
          overflowX: "hidden",
          whiteSpace: "nowrap",
          backgroundColor: "primary.main",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      {/* Top Section */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Image
            src={logo}
            width={open ? 100 : 50}
            height={open ? 100 : 50}
            alt="Logo"
          />
        </div>

        <Divider sx={{ borderColor: "#2c3e50" }} />

        <List>{navItems.map(renderNavItem)}</List>
      </div>

      {/* Bottom Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderTop: "1px solid #2c3e50",
          padding: open ? "0 8px" : "8px 0",
        }}
      >
        {open ? (
          <ListItem
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              href="/signout"
              passHref
              style={{
                textDecoration: "none",
                color: "inherit",
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </Link>

            <IconButton
              onClick={() => dispatch(toggleDrawer())}
              sx={{ color: "#fff" }}
            >
              <ChevronLeft />
            </IconButton>
          </ListItem>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Tooltip title="Sign Out" placement="right">
              <IconButton
                component={Link}
                href="/account/profile"
                sx={{ color: "#fff" }}
              >
                <Logout />
              </IconButton>
            </Tooltip>

            <IconButton
              onClick={() => dispatch(toggleDrawer())}
              sx={{ color: "#fff" }}
            >
              <Menu />
            </IconButton>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default SideDrawer;
