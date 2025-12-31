"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Grid,
  Chip,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedIcon from "@mui/icons-material/Verified";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import {
  getCustomer,
  getProfile,
  updateDefaultAddress,
  updateProfile,
} from "@/services/dashboardService";
import AddressDialog from "@/components/features/Orders/Dialogs/AddressDialog";
import { getAuth } from "../utils/auth";

function TabPanel({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const [tab, setTab] = useState(0);
  const [profileData, setProfileData] = React.useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [defaultShippingId, setDefaultShippingId] = useState<number | null>(
    null
  );
  const [defaultBillingId, setDefaultBillingId] = useState<number | null>(null);
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setUserId(auth.userId);
      setCustomerId(auth.customerId);
    }
  }, []);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const getProfileData = async () => {
    const profileResponse = await getProfile(Number(userId));
    setProfileData(profileResponse);
  };

  const getCustomerAddresses = async () => {
    try {
      const res = await getCustomer(Number(customerId));

      if (!Array.isArray(res) || res.length === 0) return;

      const customer = res[0];

      setAddresses(customer.addresses || []);
      setDefaultShippingId(customer.shippingAddressId);
      setDefaultBillingId(customer.billingAddressId);
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    }
  };

  useEffect(() => {
    if (customerId && userId) {
      getProfileData();
      getCustomerAddresses();
    }
  }, [customerId, userId]);

  useEffect(() => {
    if (!profileData) return;

    const { user, billAddress } = profileData;

    setForm({
      firstName: user?.name || "",
      lastName: user?.lastName || "",
      phone: user?.contactNo || "",
      addressLine1: billAddress?.addressLine1 || "",
      addressLine2: billAddress?.addressLine2 || "",
      city: billAddress?.city || "",
      state: billAddress?.state || "",
      zipCode: billAddress?.zipCode || "",
    });
  }, [profileData]);

  const handleChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const buildUpdatePayload = () => {
    const { user, customer, billAddress } = profileData;

    return {
      name: form.firstName,
      lastName: form.lastName,
      contactNo: form.phone,
      paymentOption: "Cheque", // required by backend
      referenceId: customer.customerId,
      userId: user.userId,
      industryTypeId: customer.industryTypeId,
      billingAddress: [
        {
          addressId: billAddress.addressId,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          countryId: billAddress.countryId,
          referenceId: customer.customerId,
        },
      ],
    };
  };

  const handleUpdate = async () => {
    try {
      const payload = buildUpdatePayload();

      await updateProfile(Number(userId), payload);

      await getProfileData();
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  const handleSetDefaultShipping = async (addressId: number) => {
    try {
      await updateDefaultAddress(Number(customerId), {
        shippingAddressId: addressId,
      });

      await getCustomerAddresses(); // refresh UI
    } catch (err) {
      console.error("Failed to set default shipping", err);
    }
  };

  const handleSetDefaultBilling = async (addressId: number) => {
    try {
      await updateDefaultAddress(Number(customerId), {
        billingAddressId: addressId,
      });

      await getCustomerAddresses(); // refresh UI
    } catch (err) {
      console.error("Failed to set default billing", err);
    }
  };

  return (
    <Box sx={{ p: 3, mt: "64px" }}>
      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Profile Info" />
        <Tab label="Addresses" />
      </Tabs>

      {/* Profile Info */}
      <TabPanel value={tab} index={0}>
        {profileData &&
          (() => {
            const { user, customer } = profileData;

            return (
              <>
                {/* HEADER CARD */}
                <Card
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  <CardContent
                    sx={{ display: "flex", alignItems: "center", gap: 3 }}
                  >
                    <Avatar sx={{ bgcolor: "white", color: "primary.main" }}>
                      {user.name[0]}
                      {user.lastName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {user.name} {user.lastName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <EmailIcon fontSize="small" /> {user.email}
                      </Typography>
                      <Chip
                        icon={
                          user.status === "Approved" ? (
                            <VerifiedIcon />
                          ) : (
                            <HourglassTopIcon />
                          )
                        }
                        label={
                          user.status === "Approved" ? "Approved" : "Pending"
                        }
                        color={
                          user.status === "Approved" ? "success" : "warning"
                        }
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </CardContent>
                </Card>

                {/* PROFILE FORM */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Profile Information
                    </Typography>

                    <Grid container spacing={3}>
                      {/* Personal */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={form.firstName}
                          onChange={handleChange("firstName")}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={form.lastName}
                          onChange={handleChange("lastName")}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={user.email}
                          disabled
                        />
                      </Grid>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={form.phone}
                        onChange={handleChange("phone")}
                      />

                      {/* Company */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Company Name"
                          value={customer.customerName}
                          disabled
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Industry"
                          value="Technology / IT"
                          disabled
                        />
                      </Grid>

                      {/* Account */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Account Status"
                          value={user.status}
                          disabled
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Account Created On"
                          value={new Date(
                            customer.createdAt
                          ).toLocaleDateString()}
                          disabled
                        />
                      </Grid>

                      {/* Billing Address */}
                      <Grid size={{ xs: 12 }}>
                        <Typography fontWeight={600}>
                          Billing Address
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Address Line 1"
                          value={form.addressLine1}
                          onChange={handleChange("addressLine1")}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Address Line 2"
                          value={form.addressLine2}
                          onChange={handleChange("addressLine2")}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          label="City"
                          value={form.city}
                          onChange={handleChange("city")}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          label="State"
                          value={form.state}
                          onChange={handleChange("state")}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          label="Postal Code"
                          value={form.zipCode}
                          onChange={handleChange("zipCode")}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Country"
                          value="India"
                          disabled
                        />
                      </Grid>
                    </Grid>

                    {/* ACTIONS */}
                    <Box
                      mt={3}
                      display="flex"
                      justifyContent="flex-end"
                      gap={2}
                    >
                      <Button variant="contained" onClick={handleUpdate}>
                        Update
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </>
            );
          })()}
      </TabPanel>

      {/* Addresses */}
      <TabPanel value={tab} index={1}>
        <Grid container spacing={3}>
          {/* Add Address Card */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              onClick={() => {
                setSelectedAddress(null);
                setOpenAddAddress(true);
              }}
              sx={{
                p: 3,
                height: "100%",
                textAlign: "center",
                border: "2px dashed",
                borderColor: "primary.main",
                bgcolor: "grey.50",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              <AddIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography color="primary" fontWeight={600}>
                Add Address
              </Typography>
            </Paper>
          </Grid>

          {/* Address Cards */}
          {addresses.map((addr) => {
            const isDefaultShipping = addr.addressId === defaultShippingId;
            const isDefaultBilling = addr.addressId === defaultBillingId;

            return (
              <Grid key={addr.addressId} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    height: "100%",
                    position: "relative",
                    borderLeft: `6px solid ${
                      isDefaultShipping ? "#1976d2" : "#9e9e9e"
                    }`,
                  }}
                  elevation={3}
                >
                  {/* Top Action Buttons */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setSelectedAddress(addr);
                          setOpenAddAddress(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="Delete">
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip> */}
                  </Box>

                  {/* Address Content */}
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 0.5 }}
                  >
                    {addr.addressLine1}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {addr.addressLine2}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {addr.city}, {addr.state}, {addr.zipCode}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    India
                  </Typography>

                  {addr.number1 && (
                    <Typography variant="body2" fontWeight={500}>
                      📞 {addr.number1}
                    </Typography>
                  )}

                  {/* Chips for Defaults */}
                  <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isDefaultShipping}
                          onChange={() => {
                            if (!isDefaultShipping) {
                              handleSetDefaultShipping(addr.addressId);
                            }
                          }}
                        />
                      }
                      label={
                        isDefaultShipping
                          ? "Default Shipping"
                          : "Set Default Shipping"
                      }
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isDefaultBilling}
                          onChange={() => {
                            if (!isDefaultBilling) {
                              handleSetDefaultBilling(addr.addressId);
                            }
                          }}
                        />
                      }
                      label={
                        isDefaultBilling
                          ? "Default Billing"
                          : "Set Default Billing"
                      }
                    />
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>

      <AddressDialog
        open={openAddAddress}
        onClose={() => setOpenAddAddress(false)}
        customerId={Number(customerId)}
        address={selectedAddress}
        onSuccess={getCustomerAddresses}
      />
    </Box>
  );
}
