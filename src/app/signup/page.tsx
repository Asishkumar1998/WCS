"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
import {
  getCountries,
  getCustomerTypes,
  getFindUsTypes,
  getIndustryTypes,
  signupCustomer,
} from "@/services/userService";
import ReCAPTCHA from "@/components/features/Orders/Common/ClientRecaptcha";
import Link from "@mui/material/Link";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import { Country } from "@/types";
import { error } from "console";
import Script from "next/script";
import { Label } from "@mui/icons-material";
import { randomString } from "../utils/randomString";
import InputField from "@/components/ui/Input/Input";
import { signupSchema } from "@/components/features/Orders/Common/SignUpValidation";
import {
  customerSignupFields,
  getFieldStyle,
} from "@/components/features/Orders/Common/SignUpField";
import { GoogleTagManager } from "@next/third-parties/google";

const CustomerSignup = () => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    contactNo: "",
    email: "",
    billAddress: {
      addressLine1: "",
      addressLine2: "",
      countryId: null,
      city: "",
      zipCode: "",
      state: "",
    },
    country: null,
    findusType: null,
    customerType: null,
    industryType: null,
    findUsOtherText: "",
    companyName: "",
    profileId: 1,
    findUsId: null,
    customerTypeId: null,
    industryTypeId: null,
    corporateMember: false,
    password: "",
    passwordExpired: false,
    agreementAccepted: false,
    permissions: [
      {
        type: "T",
        referenceId: 1,
        access: "a",
        profileId: 51,
      },
    ],
    type: "A",
  });

  const [countries, setCountries] = useState<any>([]);
  const [country, setCountry] = useState<any>(null);
  const [industryTypes, setIndustryTypes] = useState<any>([]);
  const [industryType, setIndustryType] = useState<any>(null);
  const [customerTypes, setCustomerTypes] = useState<any>([]);
  const [customerType, setCustomerType] = useState<any>(null);
  const [findusTypes, setFindusTypes] = useState<any>([]);
  const [findusType, setFindusType] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const optionMap = {
    countries: countries.map((c: any) => c.countryShortName),
    customers: customerTypes.map((cust: any) => cust.lookupName),
    findUs: findusTypes.map((cust: any) => cust.lookupName),
    industry: industryTypes.map((cust: any) => cust.lookupName),
  };

  const dropdownConfig: any = {
    countries: {
      options: countries.map((c: any) => c.countryShortName),

      labelToId: Object.fromEntries(
        countries.map((c: any) => [c.countryShortName, c.countryId]),
      ),

      idToLabel: Object.fromEntries(
        countries.map((c: any) => [c.countryId, c.countryShortName]),
      ),
    },

    customers: {
      options: customerTypes.map((c: any) => c.lookupName),

      labelToId: Object.fromEntries(
        customerTypes.map((c: any) => [c.lookupName, c.lookupId]),
      ),

      idToLabel: Object.fromEntries(
        customerTypes.map((c: any) => [c.lookupId, c.lookupName]),
      ),
    },

    findUs: {
      options: findusTypes.map((f: any) => f.lookupName),

      labelToId: Object.fromEntries(
        findusTypes.map((f: any) => [f.lookupName, f.lookupId]),
      ),

      idToLabel: Object.fromEntries(
        findusTypes.map((f: any) => [f.lookupId, f.lookupName]),
      ),
    },
    industry: {
      options: industryTypes.map((f: any) => f.lookupName),

      labelToId: Object.fromEntries(
        industryTypes.map((f: any) => [f.lookupName, f.lookupId]),
      ),

      idToLabel: Object.fromEntries(
        industryTypes.map((f: any) => [f.lookupId, f.lookupName]),
      ),
    },
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => {
      const newForm = { ...prev };

      const keys = field.split(".");
      let current = newForm;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value;
        } else {
          current[key] = { ...current[key] };
          current = current[key];
        }
      });

      // validate this field using Yup
      validateField(field, newForm);
      return newForm;
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const cId = countries.find(
        (c: any) => c.countryShortName === country,
      )?.countryId;

      const fId = findusTypes.find(
        (f: any) => f.lookupName === findusType,
      )?.lookupId;

      const ctId = customerTypes.find(
        (f: any) => f.lookupName === customerType,
      )?.lookupId;

      const iId = industryTypes.find(
        (f: any) => f.lookupName === industryType,
      )?.lookupId;

      // assign values
      const updatedForm = {
        name: form.name,
        lastName: form.lastName,
        contactNo: form.contactNo,
        email: form.email,
        billAddress: {
          addressLine1: form.billAddress.addressLine1,
          addressLine2: form.billAddress.addressLine2,
          countryId: form.country,
          city: form.billAddress.city,
          zipCode: form.billAddress.zipCode,
          state: form.billAddress.state,
        },
        findUsOtherText: form.findUsOtherText,
        companyName: form.companyName,
        profileId: 1,
        findUsId: form.findusType,
        customerTypeId: form.customerType,
        industryTypeId: form.industryType,
        corporateMember: false,
        password: randomString(10),
        passwordExpired: false,
        agreementAccepted: false,
        permissions: [
          {
            type: "T",
            referenceId: 1,
            access: "a",
            profileId: 51,
          },
        ],
        type: "A",

        captcha: captchaValid,
      };

      // YUP VALIDATION
      await signupSchema.validate(updatedForm, {
        abortEarly: false,
      });

      const response = await signupCustomer(updatedForm);

      if (response && response.userId) {
        showSnackbar("User Registered Successfully", "success");
        router.push("/thankyou");
      }
    } catch (err: any) {
      // Handle Yup validation errors
      if (err.name === "ValidationError") {
        showSnackbar(err.errors[0], "error");
        return;
      }

      // API error
      showSnackbar(err.response?.data || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateField = async (fieldName: string, updatedForm: any) => {
    try {
      await signupSchema.validateAt(fieldName, updatedForm,{ abortEarly: true });

      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error.message,
      }));
    }
  };

  const fetchCountries = async () => {
    const response = await getCountries();
    setCountries(response);
  };

  const fetchIndustries = async () => {
    const response = await getIndustryTypes();
    setIndustryTypes(response);
  };
  const fetchCustomers = async () => {
    const response = await getCustomerTypes();
    setCustomerTypes(response);
  };
  const fetchFindus = async () => {
    const response = await getFindUsTypes();
    setFindusTypes(response);
  };

  const getFieldValue = (field: string) => {
    return field.split(".").reduce((obj: any, key: string) => {
      return obj?.[key];
    }, form);
  };

  useEffect(() => {
    // const iframe = document.createElement("iframe");
    // iframe.src = "https://www.googletagmanager.com/ns.html?id=GTM-M523SLXH";
    // iframe.height = "0";
    // iframe.width = "0";
    // iframe.style.display = "none";
    // iframe.style.visibility = "hidden";
    // document.body.prepend(iframe);

    fetchCountries();
    fetchIndustries();
    fetchCustomers();
    fetchFindus();
  }, []);

  return (
    <>
      {/* <Script id="gtm-script" strategy="beforeInteractive">
        {`(function(w,d,s,l,i)
      {w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-M523SLXH');`}
      </Script> */}

      <GoogleTagManager gtmId="GTM-M523SLXH" />
      <Box
        sx={{
          minHeight: "100vh",
          background: `
          url("/world-map.png")
        `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          // overflow: "hidden",
          overflowY: "auto",
          backgroundAttachment: "fixed",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            px: 6,
            py: 2,
            color: "#fff",
            gap: 3,
          }}
        >
          {/* LOGO */}
          <Link href="/login">
            <Image
              src="/WCS-Express-Logo.png"
              alt="WCS Logo"
              width={190}
              height={160}
              style={{ cursor: "pointer" }}
            />
          </Link>

          {/* TITLE + ADDRESS COLUMN */}
          <Box sx={{ flex: 1 }}>
            {/* Title */}
            <Typography
              variant="h4"
              fontWeight={600}
              lineHeight={1.2}
              sx={{
                fontFamily: "'Lato', sans-serif !important",
                fontSize: "35px",
                marginBottom: "4px",
              }}
              color="white"
            >
              Washington Consular Services
            </Typography>

            {/* Red underline (auto width) */}
            {/* <Box
            sx={{
              height: 3,
              width: "100%",
              maxWidth: 520,
              backgroundColor: "#c8102e",
              mt: 0.5,
            }}
          /> */}

            {/* Address (touches title start) */}
            <Box
              sx={{
                borderTop: "4px solid #c7022e",
                paddingTop: "7px",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Poppins, Arial, Helvetica, sans-serif",
                  color: "white",
                  fontSize: "16.5px",
                  fontWeight: "500",
                }}
              >
                20 Courthouse Square, Suite 219, Rockville, Maryland, 20850 USA
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Poppins, Arial, Helvetica, sans-serif",
                  color: "white",
                  fontSize: "16.5px",
                  fontWeight: "500",
                }}
              >
                Email: wcs@wcss.com &nbsp; | &nbsp; Phone: +1 301 605 1500
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Poppins, Arial, Helvetica, sans-serif",
                  color: "white",
                  fontSize: "16.5px",
                  fontWeight: "500",
                }}
              >
                Toll Free: 1-866-ALL-DOCS (255-3627)
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Signup Card */}
        <Box
          sx={{
            width: 768,
            // p: 4,
            padding: "20px 40px 0px 40px",
            margin: "20px 0px",
            borderRadius: 3,
            // background: "rgba(15, 35, 65, 0.9)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight={600}
            color="#fff"
            mb={3}
          >
            Signup For WCS Express
          </Typography>

          {customerSignupFields.map((row, rowIndex) => (
            <Grid key={`signup-row-${rowIndex}`} container spacing={2} columns={16}>
              {row.map((field, fieldIndex) => (
                <Grid
                  key={`${rowIndex}-${field.name ?? fieldIndex}`}
                  size={field.name === "findUsOtherText" ? 16 : 8}
                  spacing={2}
                >
                  {field.type === "input" &&
                    (form.findusType === 903 && field.status === 1 ? (
                      <InputField
                        fullWidth
                        key={field.label}
                        placeholder={field.placeholder}
                        value={getFieldValue(field.name)}
                        error={Boolean(errors[field.name])}
                        helperText={errors[field.name] || ""}
                        onChange={(e: any) =>
                          handleChange(field.name, e.target.value)
                        }
                        sx={getFieldStyle(field.placeholder, field.required)}
                      />
                    ) : form.customerType === 591 && field.status === 2 ? (
                      <InputField
                        fullWidth
                        id={field.placeholder}
                        key={field.label}
                        placeholder={field.placeholder}
                        error={Boolean(errors[field.name])}
                        helperText={errors[field.name] || ""}
                        value={getFieldValue(field.name)}
                        onChange={(e: any) =>
                          handleChange(field.name, e.target.value)
                        }
                        sx={getFieldStyle(field.placeholder, field.required)}
                      />
                    ) : field.status === 0 ? (
                      <InputField
                        fullWidth
                        key={field.label}
                        placeholder={field.placeholder}
                        value={getFieldValue(field.name)}
                        error={Boolean(errors[field.name])}
                        helperText={errors[field.name] || ""}
                        onChange={(e: any) =>
                          handleChange(field.name, e.target.value)
                        }
                        sx={getFieldStyle(field.placeholder, field.required)}
                      />
                    ) : null)}
                  {field.type === "dropdown" &&
                    (form.customerType === 591 && field.status === 2 ? (
                      <Dropdown
                        key={field.label}
                        label={field.label}
                        options={dropdownConfig[field.optionKey].options}
                        value={
                          dropdownConfig[field.optionKey].idToLabel[
                            getFieldValue(field.name)
                          ] || ""
                        }
                        onChange={(label) =>
                          handleChange(
                            field.name,
                            dropdownConfig[field.optionKey].labelToId[label],
                          )
                        }
                        style={{
                          mb: 2,
                          backgroundColor: "#fff",
                          borderRadius: 1,
                          "& fieldset": { border: "none" },
                          "& .MuiFormLabel-asterisk": {
                            color: "red",
                          },
                          "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                            px: 0,
                            borderRadius: 0,
                            backgroundColor: "transparent",
                          },
                          "& .MuiInputLabel-root": {
                            color: form[field.name as keyof typeof form]
                              ? "transparent"
                              : "#999",
                            "& .MuiFormLabel-asterisk": {
                              color: form[field.name as keyof typeof form]
                                ? "transparent"
                                : "red",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "transparent",
                            "& .MuiFormLabel-asterisk": {
                              color: "transparent",
                            },
                          },
                        }}
                        variant="outlined"
                        required
                      />
                    ) : field.status === 0 ? (
                      <Dropdown
                        key={field.label}
                        label={field.label}
                        options={dropdownConfig[field.optionKey].options}
                        value={
                          dropdownConfig[field.optionKey].idToLabel[
                            getFieldValue(field.name)
                          ] || ""
                        }
                        onChange={(label) =>
                          handleChange(
                            field.name,
                            dropdownConfig[field.optionKey].labelToId[label],
                          )
                        }
                        style={{
                          mb: 2,
                          backgroundColor: "#fff",
                          borderRadius: 1,
                          "& fieldset": { border: "none" },
                          "& .MuiFormLabel-asterisk": {
                            color: "red",
                          },
                          "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                            px: 0,
                            borderRadius: 0,
                            backgroundColor: "transparent",
                          },
                          "& .MuiInputLabel-root": {
                            color: form[field.name as keyof typeof form]
                              ? "transparent"
                              : "#999",
                            "& .MuiFormLabel-asterisk": {
                              color: form[field.name as keyof typeof form]
                                ? "transparent"
                                : "red",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "transparent",
                            "& .MuiFormLabel-asterisk": {
                              color: "transparent",
                            },
                          },
                        }}
                        // variant="outlined"
                        required
                      />
                    ) : null)}
                </Grid>
              ))}
            </Grid>
          ))}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              my: 2,
            }}
          >
            <ReCAPTCHA
              sitekey="6LeElDUsAAAAAPMaM1facZ4cNKil_cdBznsf3wmj"
              onChange={(val) => setCaptchaValid(!!val)}
            />
          </Box>

          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              height: 48,
              backgroundColor: "#c8102e",
              color: "#fff",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#a50d25" },
              "&.Mui-disabled": {
                backgroundColor: "#c8102e",
                opacity: 0.7,
                color: "#fff",
              },
            }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Typography variant="body2" fontWeight={600} color="#fff" mb={3}>
              Already Have an Account ?{"  "}
              <Link
                href={"/login"}
                sx={{
                  color: "#c8002e",
                  cursor: "pointer",
                  textDecoration: "none",
                  ml: 0.5,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* Bottom Branding */}
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#fff",
          }}
        >
          <Image src="/logo-wcs.png" alt="WCS" width={60} height={45} />
          <Typography variant="body2">Powered by WCS</Typography>
        </Box>
      </Box>
    </>
  );
};

export default CustomerSignup;