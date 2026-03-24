"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment,
  CircularProgress,
  InputBase,
  TableContainer,
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
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
import OverlayLoader from "@/components/ui/Loader/OverlayLoader";
import { getCountries } from "@/services/formsService";
import SearchIcon from "@mui/icons-material/Search";
import {
  getAllUsersForCompany,
  signupCustomer,
  userStatusUpdate,
} from "@/services/userService";
import InputField from "@/components/ui/Input/Input";
import { Search } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";

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
  const [countries, setCountries] = useState<any[]>([]);
  const [defaultShippingId, setDefaultShippingId] = useState<number | null>(
    null,
  );
  const [defaultBillingId, setDefaultBillingId] = useState<number | null>(null);
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);

  const { showSnackbar } = useSnackbar();
  const [loader, setLoader] = useState<boolean>(false);
  const [usersLoading, setUsersLoading] = useState<boolean>(false); // dedicated loader for users tab
  const [inviteLoading, setInviteLoading] = useState<boolean>(false); // dedicated loader for invite button
  const [adLoading, setADLoading] = useState<string | null>(null); // dedicated loader for users tab

  const [loaderMessage, setLoaderMessage] = useState<string>("");

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
  });
  // Add these validation states
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
  });

  // Validation helper functions
  const validateName = (name: string) => /^[a-zA-Z\s]*$/.test(name);
  const validateEmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePhone = (phone: string) =>
    /^\+?[1-9]\d{6,14}$/.test(phone.replace(/[\s\-().]/g, ""));

  const handleFieldChange = (field: string, value: string) => {
    setNewUser({ ...newUser, [field]: value });

    let error = "";
    if (field === "firstName" || field === "lastName") {
      if (value && !validateName(value)) error = "Only alphabets are allowed";
    }
    if (field === "email") {
      if (value && !validateEmail(value)) error = "Enter a valid email address";
    }
    if (field === "contactNumber") {
      if (value && !validatePhone(value))
        error = "Enter a valid international phone number (e.g. +911234567890)";
    }
    setErrors({ ...errors, [field]: error });
  };

  const isFormValid =
    newUser.firstName &&
    newUser.lastName &&
    newUser.email &&
    newUser.contactNumber &&
    !errors.firstName &&
    !errors.lastName &&
    !errors.email &&
    !errors.contactNumber;

  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setUserId(auth.userId);
      setCustomerId(auth.customerId);
    }
  }, []);

  useEffect(() => {
    // Only fetch if on users tab, profileData is ready, and users haven't been fetched yet
    if (tab === 2 && profileData?.user?.level === 2 && users === null) {
      getUsers();
    }
  }, [tab, profileData]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    countryId: "",
    paymentOption: "",
    upoNumber: "",
    apContact: "",
  });

  const getProfileData = async () => {
    const profileResponse = await getProfile(Number(userId));
    setProfileData(profileResponse);
  };
  const getUsers = async () => {
    if (!profileData) return;
    try {
      setUsersLoading(true);
      const usersResponse = await getAllUsersForCompany(
        Number(profileData?.user?.companyName),
      );
      setUsers(Array.isArray(usersResponse) ? usersResponse : []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      showSnackbar("Failed to load users", "error");
      setUsers([]); // set empty array so we don't keep retrying
    } finally {
      setUsersLoading(false);
    }
  };
  const randomString = (length: number) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  const validateContactNumber = (phone: string) => {
    const cleaned = phone.replace(/[\s\-().]/g, "");

    // Format check: E.164 — starts with +, 7–15 digits
    const formatValid = /^\+?[1-9]\d{6,14}$/.test(cleaned);
    if (!formatValid) return false;

    // Reject all repeated digits like 9999999999, 1111111111, 0000000000
    const digitsOnly = cleaned.replace("+", "");
    const isAllRepeated = /^(\d)\1+$/.test(digitsOnly);
    if (isAllRepeated) return false;

    // Reject sequential numbers like 1234567890, 0987654321
    const isSequentialAsc = ["1234567890", "12345678", "123456789"].some(
      (seq) => digitsOnly.includes(seq),
    );
    const isSequentialDesc = ["9876543210", "98765432", "987654321"].some(
      (seq) => digitsOnly.includes(seq),
    );
    if (isSequentialAsc || isSequentialDesc) return false;

    // Minimum 7 digits required after removing country code
    if (digitsOnly.length < 7) return false;

    return true;
  };
  const handleInvite = () => {
    setInviteLoading(true);
    const newErrors = { ...errors };
    let hasError = false;

    if (newUser.firstName.length + newUser.lastName.length > 50) {
      newErrors.firstName = `First name length: ${newUser.firstName.length} chars`;
      newErrors.lastName = `Last name length: ${newUser.lastName.length} chars`;
      showSnackbar(
        "Customer Name's length should not be more than 50 characters",
        "warning",
      );
      hasError = true;
    }
    if (newUser.contactNumber) {
      if (!validateContactNumber(newUser.contactNumber)) {
        newErrors.contactNumber =
          "Invalid contact number — repeated or sequential numbers are not allowed";
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors); // single state update with both errors
      return; // stop execution, don't call createUser
    }

    createUser(); // proceed only if valid
    setInviteLoading(false);
  };
  const createUser = async () => {
    if (!newUser.firstName) {
      showSnackbar("First Name is required", "error");
      return;
    }

    if (!newUser.lastName) {
      showSnackbar("Last Name is required", "error");
      return;
    }

    if (!newUser.email) {
      showSnackbar("Email is required", "error");
      return;
    }

    if (!newUser.contactNumber) {
      showSnackbar("Contact Number is required", "error");
      return;
    }

    try {
      const payload: any = {
        name: newUser.firstName,
        lastName: newUser.lastName, 
        email: newUser.email,
        contactNo: newUser.contactNumber,

        companyName: customerId,
        password: randomString(10),
        passwordExpired: false,
        agreementAccepted: true,
        type: "A",
        status: "Pending",
        profileId: 1,
        corporateMember: true,
        permissions: [
          {
            type: "T",
            referenceId: 1,
            access: "A",
            profileId: 1,
          },
        ],
      };

      const response = await signupCustomer(payload);

      if (response && response.userId) {
        showSnackbar("User Registered Successfully", "success");
      }

      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
      });

      getUsers();
    } catch (error) {
      showSnackbar("Some thing went wrong!", "error");
    } finally {
      setInviteLoading(false);
    }
  };

  const activateUser = async (user: any) => {
    setADLoading(user.userId);
    const payload: any = {
      status: "Approved",
    };
    try {
      const response = await userStatusUpdate(payload, user);
      if (response) {
        showSnackbar(`User Activated Successfully`, "success");
      }
      getUsers();
    } catch (error) {
      showSnackbar(`Error: ${error}`, "error");
    } finally {
      setADLoading(null);
    }
  };
  const deactivateUser = async (user: any) => {
    setADLoading(user.userId);
    const payload: any = {
      status: "Pending",
    };
    try {
      const response = await userStatusUpdate(payload, user);
      if (response) {
        showSnackbar(`User De-Activated Successfully`, "success");
      }
      getUsers();
    } catch (error) {
      showSnackbar(`Error: ${error}`, "error");
    } finally {
      setADLoading(null);
    }
  };

  const getCountriesData = async () => {
    try {
      const response = await getCountries({ active: 1 });
      setCountries(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Failed to fetch countries", error);
    }
  };

  const getCustomerAddresses = async () => {
    try {
      setLoader(true);
      setLoaderMessage("Getting Profile Details...");
      const res = await getCustomer(Number(customerId));

      if (!Array.isArray(res) || res.length === 0) return;

      const customer = res[0];

      setAddresses(customer.addresses || []);
      setDefaultShippingId(customer.shippingAddressId);
      setDefaultBillingId(customer.billingAddressId);
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setLoader(false);
      setLoaderMessage("");
    }
  };

  useEffect(() => {
    if (customerId && userId) {
      getProfileData();
      getCustomerAddresses();
      getCountriesData();
    }
  }, [customerId, userId]);

  const countryShortNameById = useMemo(() => {
    return new Map(
      countries.map((country: any) => [
        Number(country.countryId),
        country.countryShortName,
      ]),
    );
  }, [countries]);

  const getCountryShortName = (countryId: any) => {
    const normalizedId = Number(countryId);
    if (Number.isNaN(normalizedId)) return "";
    return countryShortNameById.get(normalizedId) ?? "";
  };

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
      countryId: String(billAddress?.countryId || ""),
      paymentOption: profileData?.user.paymentOption || "",
      upoNumber: profileData?.user.upoNumber || "",
      apContact: profileData?.user.apContact || "",
    });
  }, [profileData]);

  const handleChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const buildUpdatePayload = () => {
    const { user, customer, billAddress } = profileData;

    const upoNumber = form.paymentOption === 'Pay On PO' ? form.upoNumber : "";

    return {
      name: form.firstName,
      lastName: form.lastName,
      contactNo: form.phone,
      paymentOption: form.paymentOption,
      UPONumber: upoNumber,
      apContact: form.apContact,
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
          countryId: Number(form.countryId) || billAddress.countryId,
          referenceId: customer.customerId,
        },
      ],
    };
  };

  const handleUpdate = async () => {
    try {
      setLoader(true);
      setLoaderMessage("Updating details...");
      const payload = buildUpdatePayload();

      await updateProfile(Number(customerId), payload);

      await getProfileData();
      showSnackbar("Profile updated successfully", "success");
    } catch (err) {
      showSnackbar("Profile update failed", "error");
      console.error("Profile update failed", err);
    } finally {
      setLoader(false);
      setLoaderMessage("");
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
    <>
      <OverlayLoader open={loader} message={loaderMessage} />
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
          {/* Only show Users tab if level === 2 */}
          {profileData?.user?.profileId === 2 && <Tab label="Users" />}
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
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
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
                              customer.createdAt,
                            ).toLocaleDateString()}
                            disabled
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormControl fullWidth>
                            <FormLabel>Payment Option</FormLabel>

                            <RadioGroup
                              value={form.paymentOption}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  paymentOption: e.target.value,
                                }))
                              }
                              sx={{ display: "flex", flexDirection: "row" }}
                            >
                              <FormControlLabel
                                value="Cheque"
                                control={<Radio />}
                                label="Cheque"
                              />

                              <FormControlLabel
                                value="Wire/ACH Transfer"
                                control={<Radio />}
                                label="Wire/ACH Transfer"
                              />

                              <FormControlLabel
                                value="Credit Card"
                                control={<Radio />}
                                label="Credit Card"
                              />

                              <FormControlLabel
                                value="Pay On Invoice"
                                control={<Radio />}
                                label="Invoice (Portal)"
                              />
                              {/* Pay On PO Option */}
                              <Box>
                                <FormControlLabel
                                  value="Pay On PO"
                                  control={<Radio />}
                                  label="Pay With Purchase Order (PO)"
                                />

                                {form.paymentOption === "Pay On PO" && (
                                  <Box sx={{ ml: 4, mt: 1 }}>
                                    <TextField
                                      fullWidth
                                      size="small"
                                      label="PO Number"
                                      value={form.upoNumber}
                                      onChange={handleChange("upoNumber")}
                                    />
                                  </Box>
                                )}
                              </Box>
                            </RadioGroup>
                          </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="AP Contact"
                            value={form.apContact}
                            onChange={handleChange("apContact")}
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
                            select
                            fullWidth
                            label="Country"
                            value={form.countryId}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                countryId: e.target.value,
                              }))
                            }
                          >
                            {countries.map((country) => (
                              <MenuItem
                                key={country.countryId}
                                value={String(country.countryId)}
                              >
                                {country.countryShortName}
                              </MenuItem>
                            ))}
                          </TextField>
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
                      {getCountryShortName(addr.countryId) || addr.country || "-"}
                    </Typography>

                    {addr.number1 && (
                      <Typography variant="body2" fontWeight={500}>
                        📞 {addr.number1}
                      </Typography>
                    )}

                    {/* Chips for Defaults */}
                    <Box
                      sx={{ mt: 2, display: "flex", flexDirection: "column" }}
                    >
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

        {/* Users */}
        {profileData?.user?.profileId === 2 && (
          <TabPanel value={tab} index={2}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                p: 2,
                borderRadius: 1,
              }}
            >
              <Typography variant="h5" color="white">
                Users
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderRadius: 1,
                  px: 1,
                  width: { xs: "130px", sm: "200px", md: "250px" },
                }}
              >
                <Search sx={{ color: "gray", fontSize: 20 }} />
                <InputBase
                  placeholder="Search Users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ ml: 1, flex: 1, color: "black" }}
                />
              </Box>
            </Box>

            {/* Invite Section */}
            <Paper sx={{ mt: 3, p: 2, border: "1px solid rgba(0, 0, 0, 0.2)" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Invite New Users
              </Typography>

              <Grid container spacing={2} alignItems="flex-start">
                <Grid size={{ xs: 12, sm: 6, md: 2.7 }}>
                  <TextField
                    fullWidth
                    type="text"
                    variant="outlined"
                    label="First Name"
                    placeholder="Enter First Name"
                    value={newUser.firstName}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    onChange={(e) =>
                      handleFieldChange("firstName", e.target.value)
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2.7 }}>
                  <TextField
                    fullWidth
                    type="text"
                    variant="outlined"
                    label="Last Name"
                    placeholder="Enter Last Name"
                    value={newUser.lastName}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    onChange={(e) =>
                      handleFieldChange("lastName", e.target.value)
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2.7 }}>
                  <TextField
                    fullWidth
                    type="email"
                    variant="outlined"
                    label="Email"
                    placeholder="Enter Email Address"
                    value={newUser.email}
                    error={!!errors.email}
                    helperText={errors.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2.7 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Contact Number"
                    placeholder="+911234567890"
                    value={newUser.contactNumber}
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[+\d\s\-().]*$/.test(value)) {
                        handleFieldChange("contactNumber", value);
                      }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 1 }}>
                  <Button
                    variant="contained"
                    // disabled={usersLoading || !isFormValid}
                    sx={{
                      // height: "56px",
                      mt: "10px",
                      mb: "10px",
                      width: "100%",
                      // "&:hover": (usersLoading || !isFormValid){ backgroundColor: "#c8102e" }
                    }}
                    onClick={handleInvite}
                  >
                    {isFormValid && inviteLoading ? (
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                    ) : (
                      "Invite"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Users Table */}
            <Paper sx={{ mt: 3 }}>
              {usersLoading ? (
                // Loading state
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 6,
                  }}
                >
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }} color="text.secondary">
                    Loading users...
                  </Typography>
                </Box>
              ) : !users || users.length === 0 ? (
                // Empty state
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography variant="h6" color="text.secondary">
                    No users found
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Invite users above to get started.
                  </Typography>
                </Box>
              ) : (
                // Table
                <TableContainer sx={{ maxHeight: 330, overflow: "auto" }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            backgroundColor: "primary.main",
                            color: "#fff",
                            textAlign: "center",
                            borderRight: "1px solid white",
                          }}
                        >
                          First Name
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "primary.main",
                            color: "#fff",
                            textAlign: "center",
                            borderRight: "1px solid white",
                          }}
                        >
                          Last Name
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "primary.main",
                            color: "#fff",
                            textAlign: "center",
                            borderRight: "1px solid white",
                          }}
                        >
                          Email Address
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "primary.main",
                            color: "#fff",
                            textAlign: "center",
                            borderRight: "1px solid white",
                          }}
                        >
                          Contact Number
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "primary.main",
                            color: "#fff",
                            textAlign: "center",
                            borderRight: "1px solid white",
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "primary.main",
                            color: "#fff",
                            textAlign: "center",
                          }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {users
                        .filter(
                          (u: any) =>
                            String(u.name || "")
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            String(u.lastName || "")
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            String(u.email || "")
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            String(u.status || "")
                              .toLowerCase()
                              .trim()
                              .includes(search.toLowerCase().trim()) ||
                            String(u.contactNo || "").includes(
                              search.toLowerCase(),
                            ),
                        )
                        .map((user: any, index: number) =>
                          String(user.userId) !== userId ? (
                            <TableRow key={index} hover>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.lastName}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell sx={{ textAlign: "end" }}>
                                {user.contactNo}
                              </TableCell>

                              <TableCell>
                                {user.status === "Approved" && (
                                  <Box
                                    sx={{
                                      fontWeight: "bold",
                                      fontSize: "15px",
                                      color: "#34a853",
                                    }}
                                  >
                                    Approved
                                  </Box>
                                )}
                                {user.status === "Pending" && (
                                  <Box
                                    sx={{
                                      fontWeight: "bold",
                                      fontSize: "15px",
                                      color: "#ff9a02",
                                    }}
                                  >
                                    Pending
                                  </Box>
                                )}
                                {user.status !== "Pending" &&
                                  user.status !== "Approved" && (
                                    <Box
                                      sx={{
                                        fontWeight: "bold",
                                        fontSize: "15px",
                                        color: "#c7022e",
                                      }}
                                    >
                                      InActive
                                    </Box>
                                  )}
                              </TableCell>

                              <TableCell sx={{ textAlign: "center" }}>
                                {user.status === "Pending" && (
                                  <LoadingButton
                                    loading={adLoading === user.userId}
                                    loadingIndicator="Loading…"
                                    onClick={() => activateUser(user)}
                                    sx={{ width: "100px" }}
                                    variant="contained"
                                  >
                                    Activate
                                  </LoadingButton>
                                )}
                                {user.status === "Approved" && (
                                  <LoadingButton
                                    loading={adLoading === user.userId}
                                    loadingIndicator="Loading…"
                                    onClick={() => deactivateUser(user)}
                                    sx={{ width: "100px" }}
                                    variant="contained"
                                  >
                                    Deactivate
                                  </LoadingButton>
                                )}
                              </TableCell>
                            </TableRow>
                          ) : null,
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </TabPanel>
        )}
      </Box>
    </>
  );
}
