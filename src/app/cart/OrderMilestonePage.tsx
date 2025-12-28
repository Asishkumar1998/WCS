"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  TextField,
  RadioGroup,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Collapse,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import Modal from "@/components/ui/Modal/Modal";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import StatusStepper from "@/components/ui/Stepper/FormStepper";
import { DescriptionOutlined } from "@mui/icons-material";
import Image from "next/image";
import { savePayment } from "./savePayment";
import { processPayLater, updateOrder } from "@/services/paymentService";
import {
  addRegionAddress,
  getFeeTypes,
  getOrderDetails,
  getOrderIdOfCart,
  getRegionAddresses,
  shippingDetailsUpload,
  shippingLabelUpload,
  updateRegionAddress,
  updateShippingDetails,
} from "@/services/cartServices";
import { shippingOptionMap } from "@/constants/shippingOptionMap";
import { getAllStops } from "@/services/TrackOrderService";
import { getLookup, uploadFile } from "@/services/formsService";
import { countries } from "@/dataset/countries";
import axios from "axios";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { CART_SERVICE_MAP } from "@/constants/serviceMap";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { getCustomer, getUser } from "@/services/userService";
import ValidatedFileUpload from "@/components/features/Orders/Common/ValidatedFileUpload";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
import {
  deleteDoc,
  deleteDocAttachments,
  deleteDocFee,
  deleteDocStatus,
  deleteDocStops,
  getDocAttachments,
  getDocFees,
  getDocStatus,
  getDocStops,
} from "@/services/deleteService";

// ===== Custom Stepper Styles =====
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 22 },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.divider,
    borderRadius: 1,
  },
}));

const StepIconRoot = styled("div")<{
  ownerState: { active?: boolean; completed?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: ownerState.active
    ? theme.palette.primary.main
    : ownerState.completed
    ? theme.palette.success.main
    : theme.palette.grey[300],
  color: "#fff",
  display: "flex",
  borderRadius: "50%",
  width: 32,
  height: 32,
  justifyContent: "center",
  alignItems: "center",
  boxShadow: ownerState.active
    ? `0 0 8px ${theme.palette.primary.main}`
    : "none",
}));

function CustomStepIcon(props: any) {
  const { active, completed, icon } = props;
  const icons: { [index: string]: React.ReactElement } = {
    1: <WorkOutlineIcon fontSize="small" />,
    2: <WorkOutlineIcon fontSize="small" />,
    3: <ScheduleIcon fontSize="small" />,
    4: <CheckCircleIcon fontSize="small" />,
  };
  return (
    <StepIconRoot ownerState={{ active, completed }}>
      {icons[String(icon)]}
    </StepIconRoot>
  );
}

// ===== Dummy Data =====
const dummyDocs = [
  {
    id: "1",
    country: "Albania",
    authority: "General",
    handlingOption: "Proceeding with attached documents",
    fileName: "Albania_Certified_Documents.pdf",
    timeline: [
      { label: "Secretary of State", sub: "7 business days" },
      { label: "Estimated Completion", sub: "Oct 13, 2025" },
    ],
    fees: [
      { label: "MD-SOS", amount: 20 },
      { label: "WCS Service Fee", amount: 90 },
    ],
  },
  {
    id: "2",
    country: "Afghanistan",
    authority: "Federal Government",
    handlingOption: "Original documents will be mailed to WCS office",
    fileName: "Afghanistan_Embassy_Forms.pdf",
    timeline: [
      { label: "U.S. Department of State", sub: "20 business days" },
      { label: "Embassy", sub: "7 business days" },
      { label: "Estimated Completion", sub: "Nov 12, 2025" },
    ],
    fees: [
      { label: "USDOS Authentication", amount: 20 },
      { label: "Afghanistan Legalization", amount: 125 },
      { label: "Money Order Fee", amount: 10 },
      { label: "WCS Service Fee", amount: 110 },
    ],
  },
];

interface CardDetails {
  amount: number | null;
  billingAddressId: number | null;
  cardCode: string;
  cardHolderName: string;
  cardNumber: string;
  cardTypeName: string;
  customerId: number | null;
  discountAmount: number | undefined;
  expirationDate: string;
  invoiceReference: string | undefined;
  orderId: number;
  paymentType: string;
  promocodeId: number | undefined;
  requestId: number | null;
  shippingAddressId: number | null;
}

export const cardTypes = [
  { id: 0, name: "No Card", img: "/cardIcons/NoCard.png" },
  { id: 1, name: "Visa", img: "/cardIcons/Visa.png", expr: "^4" },
  {
    id: 2,
    name: "Mastercard",
    img: "/cardIcons/MasterCard.png",
    expr: "^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$",
  },
  { id: 3, name: "Amex", img: "/cardIcons/Amex.png", expr: "^3[47]" },
  {
    id: 4,
    name: "Discover",
    img: "/cardIcons/Discover.png",
    expr: "^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)",
  },
  { id: 5, name: "Diners", img: "/cardIcons/Diners.png", expr: "^36" },
  {
    id: 6,
    name: "Diners - Carte Blanche",
    img: "/cardIcons/Diners.png",
    expr: "^30[0-5]",
  },
  {
    id: 7,
    name: "JCB",
    img: "/cardIcons/JCB.png",
    expr: "^35(2[89]|[3-8][0-9])",
  },
  {
    id: 8,
    name: "Visa Electron",
    img: "/cardIcons/Visa.png",
    expr: "^(4026|417500|4508|4844|491(3|7))",
  },
];

const initialForm = {
  regionId: "",
  country: "",
  company: "",
  contactName: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  phoneNumber: "",
  customerId: "",
  emailId: "",
};

export default function OrderMilestonePage() {
  const [docs, setDocs] = useState(dummyDocs);
  const [allDocs, setAllDocs] = useState<any>([]);
  const [paymentType, setPaymentType] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState<Record<string, string>>(initialForm);
  const [country, setCountry] = useState<any>(null);
  const [showExistingAddress, setShowExistingAddress] =
    useState<boolean>(false);
  const [addresses, setAddresses] = useState<any>([]);
  const [orderDetails, setOrderDetails] = useState<any>();
  const [invoiceReference, setInvoiceReference] = useState<string>("");
  const [allStops, setAllStops] = useState<any>();
  const [feeTypes, setFeeTypes] = useState<any>();
  const [docTypes, setDocTypes] = useState<any>();
  const [translationAttachment, setTranslationAttachment] = useState<any>();
  const [orderInCart, setOrderInCart] = useState<boolean>(false);
  const [customer, setCustomer] = useState<any>();
  const [user, setUser] = useState<any>();
  const isFirstRender = useRef(true);
  const [fileName, setFileName] = useState("");
  const [uploadFileData, setUploadFileData] = useState<any>();
  const [submitShipping, setSubmitShipping] = useState<boolean>(false);
  const [checked, setChecked] = useState<{
    option: string | null;
    regionAddressId: number | null;
  }>({
    option: null,
    regionAddressId: null,
  });
  const [card, setCard] = useState<CardDetails>({
    amount: null,
    billingAddressId: null,
    cardCode: "",
    cardHolderName: "",
    cardNumber: "",
    cardTypeName: "",
    customerId: null,
    discountAmount: undefined,
    expirationDate: "",
    invoiceReference: "",
    orderId: 0,
    paymentType: "",
    promocodeId: undefined,
    requestId: null,
    shippingAddressId: null,
  });
  const [shippingDetails, setShippingDetails] = useState<{
    invoiceReference: string | null;
    useUserCourier: boolean;
    labelByMail: boolean;
    pickupOrDropOff: boolean;
    regionId: number;
    regionNote: string;
  }>({
    invoiceReference: null,
    useUserCourier: false,
    labelByMail: false,
    pickupOrDropOff: false,
    regionId: 0,
    regionNote: "",
  });
  const { showSnackbar } = useSnackbar();

  const userId = localStorage.getItem("userId");
  const customerId = localStorage.getItem("customerId");

  const searchParams = useSearchParams();
  const service = searchParams.get("service") as string;

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = async () => {
    console.log(form);
    await addRegionAddress(form);
    setShowExistingAddress(false);
  };

  const handleDelete = async (docId: number) => {
    try {
      const docketId =
        orderDetails?.dockets?.find((d: any) =>
          d.docs?.some((doc: any) => doc.docId === docId)
        )?.docketId ?? null;

      if (!docketId) {
        console.error("Docket not found for docId:", docId);
        return;
      }

      const docFees = await getDocFees(docId);
      if (Array.isArray(docFees)) {
        await Promise.all(
          docFees.map((fee: any) => deleteDocFee(fee.docFeeId))
        );
      }

      const docStops = await getDocStops(docId);
      if (Array.isArray(docStops)) {
        await Promise.all(
          docStops.map((stop: any) => deleteDocStops(stop.docStopId))
        );
      }

      const docStatuses = await getDocStatus(docId);
      if (Array.isArray(docStatuses)) {
        await Promise.all(
          docStatuses.map((status: any) => deleteDocStatus(status.docStatusId))
        );
      }

      const attachments = await getDocAttachments(docId);
      if (Array.isArray(attachments)) {
        await Promise.all(
          attachments.map((att: any) => deleteDocAttachments(att.attachmentId))
        );
      }

      await deleteDoc(docId);
      showSnackbar("Document deleted successfully", "success");
      getCartOrder();
    } catch (error) {
      showSnackbar("Failed to delete document", "error");
      console.error("Delete doc failed:", error);
    }
  };

  const totalAmount = allDocs
    .reduce((sum: number, d: any) => {
      const docTotal = (d.docFees ?? []).reduce(
        (fSum: number, f: any) =>
          fSum + (Number(f.feeAmount) || 0) * (Number(f.quantity) || 1),
        0
      );

      return sum + docTotal;
    }, 0)
    .toFixed(2);

  useEffect(() => {
    if (checked.option === "courier") setOpenDialog(true);
  }, [checked]);

  const getCartOrder = async () => {
    try {
      const basePayload = CART_SERVICE_MAP[service];
      if (!basePayload) {
        return <div>Invalid service selected.</div>;
      }
      const payload = {
        customerId: customerId,
        ...basePayload,
      };
      const orderId = await getOrderIdOfCart(payload);

      if (!orderId) {
        console.error("No orderId returned");
        setOrderInCart(false);
        setAllDocs([]);
        return;
      }
      setOrderInCart(true);

      const payload1 = {
        orderId: orderId,
      };
      const response = await getOrderDetails(payload1);
      const orderData = response[0];
      setOrderDetails(orderData);
      if (service == "translation-service") {
        setTranslationAttachment(orderData?.dockets[0]?.docs[0]?.attachments);
      }

      const flattenedDocs = orderData.dockets.flatMap((docket: any) => {
        if (!docket.docs || !Array.isArray(docket.docs)) {
          return [];
        }
        return docket.docs.map((doc: any) => ({
          ...doc,
          docketId: docket.docketId,
        }));
      });
      setAllDocs(flattenedDocs);

      if (!response) {
        console.error("No order detail returned");
        setAllDocs([]);
        return;
      }

      setFeeTypes(await getFeeTypes());
      setAllStops(await getAllStops());
      setDocTypes(await getLookup({ lookupType: "DocumentCategories" }));

      // setCountries(
      //   await getCountries({
      //     active: 1,
      //   })
      // );
    } catch (error) {
      console.error("Error in getCartOrder:", error);
      setAllDocs([]);
    }
  };

  const getCustomerDetails = async () => {
    const customerDetails = await getCustomer(String(customerId));
    const userDetails = await getUser(String(userId));
    setCustomer(customerDetails[0]);
    setUser(userDetails[0]);
  };

  useEffect(() => {
    getCartOrder();
    getCustomerDetails();
  }, []);
  useEffect(() => {
    setInvoiceReference(orderDetails?.invoiceReference);
    const option = getShippingOptionFromOrder(orderDetails);
    setChecked((prev) => ({
      ...prev,
      option: option,
    }));
  }, [orderDetails]);

  const downloadAttachments = async (attachment: {
    attachmentId: string;
    fileName: string;
  }) => {
    try {
      const url = `https://wcsstestserver.azurewebsites.net/api/v1/documentattachments/${attachment.attachmentId}`;
      // Comment out the below code once the backend change are deployed.
      // const response = await axiosInstance.get(url, { responseType: "blob" });

      //Comment in the below code once the backend changes are deployed.
      //The API is directly called within this function because Blob does not allow access to files via a localhost URL.
      const response = await axios.get(url, { responseType: "blob" });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = attachment.fileName;
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.log("Download error: ", error);
    }
  };

  const convertStopsToTimeline = (stops: any[]) => {
    return stops.map((s) => ({
      label: `${
        allStops?.find((a: any) => s.stopId === a.stopId)?.description || ""
      }`, // or replace with stopName if available
      subLabel: `${
        allStops?.find((a: any) => s.stopId === a.stopId)?.processDays || ""
      } business days`, // or a formatted date
    }));
  };

  const getTimelineWithCompletion = (
    stops: any[],
    estCompletionDate: string
  ) => {
    return [
      ...convertStopsToTimeline(stops),
      {
        label: "Estimated Completion",
        subLabel: dayjs(estCompletionDate).format("MMM D, YYYY"),
      },
    ];
  };

  // Payments Section
  const getCardTypeForCardNumber = (number: any) => {
    if (!number) return cardTypes[0];

    const type = cardTypes.find((card) => {
      if (!card.expr) return false;
      const re = new RegExp(card.expr);
      return re.test(number);
    });

    return type || cardTypes[0];
  };

  card.cardTypeName = getCardTypeForCardNumber(card?.cardNumber).name;
  const cardTypeImg = getCardTypeForCardNumber(card?.cardNumber).img;

  const handlePayNow = async () => {
    if (
      orderDetails.labelByMail === false &&
      orderDetails.useUserCourier === false &&
      orderDetails.pickupOrDropOff === false &&
      submitShipping === false
    ) {
      showSnackbar("Please submit shipping details first.", "error");
      return;
    }
    if (paymentType == "") {
      showSnackbar("Please select payment type", "error");
      return;
    }
    setCard((prev) => ({
      ...prev,
      orderId: orderDetails?.orderId,
      amount: totalAmount,
    }));
    if (paymentType == "card") {
      const options = card;
      const res = await savePayment(options);
    } else {
      // await processPayLater({orderId: orderDetails?.orderId});
      await updateOrder(orderDetails?.orderId, {
        billingAddressId: customer.billingAddressId,
        confirmOrderDate: true,
        orderId: orderDetails?.orderId,
        orderStatusId: 534,
        payLaterOptions: paymentType,
        shippingAddressId: customer.shippingAddressId,
      });
    }
    window.location.href = `/confirmation?orderId=${orderDetails.orderId}`;
  };

  //Show Exisiting Addresses for Shipping Label Options
  const showExistingAddresses = async () => {
    const response = await getRegionAddresses({ customerId: customerId });
    setAddresses(response);
    setShowExistingAddress(true);
  };

  const updateRegion = async () => {
    const selectedAddressDetails = addresses.find(
      (a: any) => a.regionAddressId === checked.regionAddressId
    );

    if (!selectedAddressDetails) return;

    const payload = {
      regionId: selectedAddressDetails.regionId,
      country: selectedAddressDetails.country,
      company: selectedAddressDetails.company,
      contactName: selectedAddressDetails.contactName,
      address: selectedAddressDetails.address,
      city: selectedAddressDetails.city,
      state: selectedAddressDetails.state,
      postalCode: selectedAddressDetails.postalCode,
      phoneNumber: selectedAddressDetails.phoneNumber,
    };

    await updateRegionAddress(selectedAddressDetails.regionAddressId, payload);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (checked.regionAddressId) {
      updateRegion();
    }
  }, [checked.regionAddressId]);

  const handleShippingOptionChange = (value: any) => {
    setShippingDetails((prev) => ({
      ...prev,
      ...shippingOptionMap[value as keyof typeof shippingOptionMap],
    }));
  };

  const submitShippingDetails = async () => {
    try {
      const payload = {
        useUserCourier: shippingDetails.useUserCourier,
        labelByMail: shippingDetails.labelByMail,
        pickupOrDropOff: shippingDetails.pickupOrDropOff,
        regionId:
          checked.option === "courier"
            ? addresses.find(
                (a: any) => a.regionAddressId === checked.regionAddressId
              )?.regionId ?? shippingDetails.regionId
            : shippingDetails.regionId,
        regionNote:
          checked.option === "courier"
            ? addresses.find(
                (a: any) => a.regionAddressId === checked.regionAddressId
              )?.regionAddressId ?? shippingDetails.regionNote
            : shippingDetails.regionNote,
        ...(invoiceReference ? { invoiceReference } : {}),
      };
      await updateShippingDetails(orderDetails?.orderId, payload);

      if (checked.option === "upload") {
        const UserCourierPayload = {
          shippingLabelURL: uploadFileData?.sourceUrl,
          blobName: uploadFileData?.blobName,
          orderId: orderDetails?.orderId,
          destinationId: 547,
        };
        const response = await shippingLabelUpload(UserCourierPayload);

        const requests = allDocs.map((doc: any) => {
          const payload = {
            docId: doc.docId,
            orderId: doc.orderId,
            shippingLabelId: response[0].shippingLabelId,
            destType: doc.destinationId,
            destRefId: doc.oosAddressId ?? 0,
            shippingType: 0,
            isUsed: 0,
          };
          return shippingDetailsUpload(payload);
        });
        await Promise.all(requests);
      }
      showSnackbar("Successfully saved shipping details", "success");
      setSubmitShipping(true);
    } catch (e) {
      showSnackbar("Failed to save shipping details", "error");
      console.log(e);
    }
  };

  const handleSelectFile = async (file: File | null) => {
    if (!file) return;
    setFileName(file?.name || "");
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file_0", file);
        const data = await uploadFile(formData);
        setUploadFileData(data[0]);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getShippingOptionFromOrder = (orderDetails: any) => {
    if (!orderDetails) return "";

    if (orderDetails.useUserCourier === true) return "upload";
    if (orderDetails.labelByMail === true) return "mail";
    if (orderDetails.pickupOrDropOff === true) return "pickup";
    if (orderDetails.regionId && orderDetails.regionId !== 0) return "courier";

    return ""; // ← nothing selected
  };

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", mt: "64px" }}>
      {/* ===== Shipping Section ===== */}
      {orderInCart ? (
        <Box>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            {/* Header Row */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              {/* Left title */}
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="text.primary"
              >
                Shipping Label / Return Instructions
              </Typography>

              {/* Right-aligned Invoice Reference / PO Number */}
              <TextField
                label="Invoice Reference / PO Number"
                placeholder="Enter invoice reference or PO number"
                variant="outlined"
                size="small"
                fullWidth
                value={invoiceReference}
                onChange={(e) => setInvoiceReference(e.target.value)}
                InputLabelProps={{
                  shrink: Boolean(invoiceReference),
                }}
                sx={{
                  maxWidth: 320,
                  "& .MuiOutlinedInput-root": {
                    height: 40,
                    "& fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1565c0",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              />
            </Box>

            {/* Radio Buttons */}
            <RadioGroup
              row
              value={checked.option}
              onChange={(e) => {
                setChecked((prev) => ({
                  ...prev,
                  option: e.target.value,
                }));
                handleShippingOptionChange(e.target.value);
              }}
            >
              <FormControlLabel
                value="upload"
                control={<Radio size="small" />}
                label="Upload return shipping label"
              />
              <FormControlLabel
                value="mail"
                control={<Radio size="small" />}
                label="Enclose return shipping label by mail"
              />
              <FormControlLabel
                value="courier"
                control={<Radio size="small" />}
                label="Use WCS courier account"
              />
              <FormControlLabel
                value="eCopy"
                control={<Radio size="small" />}
                label="E-Copy"
              />
              <FormControlLabel
                value="pickup"
                control={<Radio size="small" />}
                label="Pickup"
              />
            </RadioGroup>

            {/* Collapsible Content */}
            <Collapse in={!!checked.option} timeout="auto">
              <Box mt={2} pl={4}>
                {checked.option === "upload" && (
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      * When creating a prepaid return label, please use your
                      company information (name, address, phone) as the
                      shipper/sender. Do Not use WCS information (name, address,
                      phone) as the shipper/sender.
                    </Typography>
                    <Box
                      mt={1}
                      p={2}
                      sx={{
                        width: 700,
                        // mx: "auto",
                        border: "1px dashed",
                        borderColor: "divider",
                        borderRadius: 2,
                        textAlign: "center",
                        cursor: "pointer",
                        "&:hover": { borderColor: "primary.main" },
                      }}
                    >
                      <Typography variant="body2" color="primary.main">
                        <Box sx={{ mb: 1 }}>
                          <ValidatedFileUpload
                            label="Upload File"
                            fileNameProp={fileName}
                            onChange={handleSelectFile}
                          />
                        </Box>
                      </Typography>
                    </Box>
                  </Box>
                )}

                {checked.option === "mail" && (
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    * When creating a prepaid return label, please use your
                    company information (name, address, phone) as the
                    shipper/sender. Do Not use WCS information (name, address,
                    phone) as the shipper/sender.
                  </Typography>
                )}
              </Box>
            </Collapse>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#c30010",
                  "&:hover": {
                    backgroundColor: "#a0000d",
                  },
                }}
                onClick={submitShippingDetails}
              >
                Save Shipping Details
              </Button>
            </Box>
          </Paper>

          <Grid container spacing={3}>
            {/* ===== LEFT COLUMN - Documents ===== */}
            <Grid size={{ xs: 12, md: 7 }}>
              {allDocs.map((doc: any) => (
                <Card
                  key={doc.docId}
                  sx={{
                    mb: 3,
                    border: "1px solid #e0e0e0",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      borderColor: "#1976d2",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {countries?.find(
                          (c: any) => c.countryId === doc.countryId
                        )?.countryShortName || doc.countryId}{" "}
                        —{" "}
                        {docTypes?.find(
                          (d: any) => d.lookupId === doc.docCategoryId
                        )?.lookupName || ""}
                      </Typography>
                      <Tooltip title="Remove document">
                        <IconButton
                          onClick={() => handleDelete(doc.docId)}
                          size="small"
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* Document Handling Summary */}
                    <Paper
                      elevation={0}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: "#e6f1ff",
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <DescriptionOutlined
                          sx={{ color: "#007BFF", fontSize: 24 }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          variant="body1"
                          fontWeight="600"
                          color="text.primary"
                          sx={{ lineHeight: 1.4 }}
                        >
                          {doc.isSoftCopyGiven === 651
                            ? "Proceeding with attached documents"
                            : "Original documents will be mailed to WCS office"}
                        </Typography>
                        {doc.isSoftCopyGiven == 651 &&
                        service == "us-authentication" ? (
                          <Link
                            onClick={() =>
                              downloadAttachments({
                                attachmentId: doc.attachments[0].attachmentId,
                                fileName: doc.attachments[0].fileName,
                              })
                            }
                            underline="hover"
                            color="text.secondary"
                            sx={{
                              fontSize: "0.9rem",
                              wordBreak: "break-word",
                              pointer: "cursor",
                            }}
                          >
                            {doc.attachments[0].fileName}
                          </Link>
                        ) : (
                          ""
                        )}
                        {service === "translation-service"
                          ? translationAttachment.map((a: any) => (
                              <div key={a.attachmentId}>
                                <Link
                                  onClick={() =>
                                    downloadAttachments({
                                      attachmentId: a.attachmentId,
                                      fileName: a.fileName,
                                    })
                                  }
                                  underline="hover"
                                  color="text.secondary"
                                  sx={{
                                    fontSize: "0.9rem",
                                    wordBreak: "break-word",
                                    pointer: "cursor",
                                  }}
                                >
                                  {a.fileName}
                                </Link>
                              </div>
                            ))
                          : ""}
                      </Box>
                    </Paper>

                    <StatusStepper
                      steps={getTimelineWithCompletion(
                        doc.docStops,
                        doc.estCompletionDate
                      )}
                      activeStep={doc.docStops.length - 1}
                    />

                    <List dense disablePadding>
                      {doc.instructionsList.map((i: any, index: number) => (
                        <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                          <ListItemText
                            primaryTypographyProps={{
                              variant: "body2",
                              fontSize: 13,
                              lineHeight: 1,
                            }}
                            primary={`${index + 1}. ${i.instruction}`}
                          />
                        </ListItem>
                      ))}
                      {/* Extra instruction if feeTypeId === 17 */}
                      {doc.docFees?.some((f: any) => f.feeTypeId === 17) && (
                        <ListItem disablePadding sx={{ py: 0.5 }}>
                          <ListItemText
                            primaryTypographyProps={{
                              variant: "body2",
                              fontSize: 13,
                              lineHeight: 1.3,
                            }}
                            primary={`${
                              doc.instructionsList.length + 1
                            }. Based on the state of origin of a document, additional shipping fees may be applied to ship the document to a consulate outside of Washington, DC.`}
                          />
                        </ListItem>
                      )}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <List dense disablePadding>
                      {doc.docFees.map((f: any, idx: any) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={
                              feeTypes?.find(
                                (a: any) => f.feeTypeId === a.feeTypeId
                              )?.feeTypeName
                            }
                          />
                          <Typography>
                            ${f.feeAmount * (f.quantity ?? 1)}
                          </Typography>
                        </ListItem>
                      ))}
                      <Divider />
                      <ListItem>
                        <ListItemText primary="Total" />
                        <Typography fontWeight={700}>
                          $
                          {doc.docFees
                            .reduce(
                              (a: any, b: any) => a + b.feeAmount * b.quantity,
                              0
                            )
                            .toFixed(2)}
                        </Typography>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              ))}
            </Grid>

            {/* ===== RIGHT COLUMN - Sticky Sidebar ===== */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  position: { md: "sticky" },
                  top: "80px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* Order Summary Accordion */}
                <Accordion defaultExpanded sx={{ borderRadius: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={600}>Order Summary</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      label="Customer Name"
                      fullWidth
                      size="small"
                      sx={{ mb: 3 }}
                      value={user ? `${user.name} ${user.lastName}` : ""}
                      InputProps={{
                        readOnly: true, // 🔹 makes the input read-only
                      }}
                    />
                    <TextField
                      label="Email Address"
                      fullWidth
                      size="small"
                      sx={{ mb: 3 }}
                      // defaultValue="raghvendra@redintegro.com"
                      value={user ? user.email : ""}
                      InputProps={{
                        readOnly: true, // 🔹 makes the input read-only
                      }}
                    />
                    <TextField
                      label="Phone Number"
                      fullWidth
                      size="small"
                      sx={{ mb: 3 }}
                      // defaultValue="7987076459"
                      value={user ? user.contactNo : ""}
                      InputProps={{
                        readOnly: true, // 🔹 makes the input read-only
                      }}
                    />
                    <TextField
                      label="Billing Address"
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      sx={{ mb: 3 }}
                      // defaultValue="146, 5-B, 3, TB, Aditya Nagar, Indore, MP-452010"
                      value={customer ? customer.billAddress : ""}
                      InputProps={{
                        readOnly: true, // 🔹 makes the input read-only
                      }}
                    />
                  </AccordionDetails>
                </Accordion>

                {/* Payment Card */}
                <Card sx={{ borderRadius: 2, p: 3 }}>
                  <Typography fontWeight={600} mb={2}>
                    Payment Options
                  </Typography>

                  <RadioGroup
                    row
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                  >
                    <FormControlLabel
                      value="card"
                      control={<Radio />}
                      label="Card"
                    />
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
                      value="Pay On PO"
                      control={<Radio />}
                      label="Pay with Purchase Order (PO)"
                    />
                  </RadioGroup>

                  {paymentType === "card" && (
                    <>
                      <Typography variant="body2" mt={1} mb={2}>
                        * 3.5% service charge applies to all card transactions.
                      </Typography>

                      <TextField
                        label="Cardholder's Name"
                        value={card?.cardHolderName ?? ""}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            cardHolderName: (e.target as HTMLInputElement)
                              .value,
                          })
                        }
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                      />

                      <TextField
                        label="Card Number"
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                        value={card?.cardNumber ?? ""}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            cardNumber: (e.target as HTMLInputElement).value,
                          })
                        }
                        slotProps={{
                          input: {
                            endAdornment: cardTypeImg ? (
                              <Image
                                src={cardTypeImg}
                                alt="card type"
                                className="card-type-image"
                                width={38}
                                height={28}
                              />
                            ) : null,
                          },
                        }}
                      />

                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            label="Expiry (MM/YY)"
                            onChange={(e) =>
                              setCard({
                                ...card,
                                expirationDate: (e.target as HTMLInputElement)
                                  .value,
                              })
                            }
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            label="CVV"
                            onChange={(e) =>
                              setCard({
                                ...card,
                                cardCode: (e.target as HTMLInputElement).value,
                              })
                            }
                            fullWidth
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}

                  <FormControlLabel
                    control={<Checkbox />}
                    label="I accept the terms of use"
                    sx={{ mt: 1 }}
                  />

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" gap={1.5} flexWrap="wrap">
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() =>
                        (window.location.href = `/orders/new/${service}`)
                      }
                    >
                      Add More Documents
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={handlePayNow}
                      sx={{
                        backgroundColor:
                          paymentType === "payLater" ? "#1976d2" : "#c30010",
                        "&:hover": {
                          backgroundColor:
                            paymentType === "payLater" ? "#115293" : "#a0000d",
                        },
                      }}
                    >
                      {paymentType === "card"
                        ? `Checkout & Pay $${totalAmount}`
                        : `Checkout & Confirm to Pay Later $${totalAmount}`}
                    </Button>
                  </Box>
                </Card>
              </Box>
            </Grid>
          </Grid>
          <Modal
            open={openDialog}
            onClose={() => {
              setOpenDialog(false);
              setForm(initialForm);
            }}
            title="Add New WCS Courier Address"
            type="custom"
            showActions={false} // we handle buttons inside children
          >
            <RadioGroup
              row
              value={showExistingAddress ? "true" : "false"}
              onChange={(e) => {
                const val = e.target.value === "true";
                setShowExistingAddress(val);
                if (val) showExistingAddresses();
              }}
            >
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="Add a new address"
              />
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="Use a saved address"
              />
            </RadioGroup>
            {showExistingAddress ? (
              <RadioGroup
                row
                value={checked.regionAddressId}
                onChange={(e) =>
                  setChecked((prev) => ({
                    ...prev,
                    regionAddressId: Number(e.target.value),
                  }))
                }
              >
                {addresses.map((addr: any) => (
                  <FormControlLabel
                    key={addr.regionAddressId}
                    value={addr.regionAddressId}
                    control={<Radio size="small" />}
                    label={
                      <div style={{ width: "100%" }}>
                        {/* Contact name */}
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                          {addr.contactName}
                        </div>

                        {/* Address line */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 4,
                          }}
                        >
                          <HomeIcon sx={{ fontSize: 18, marginRight: 4 }} />
                          <span>
                            {addr.address}, {addr.city}, {addr.state},{" "}
                            {addr.postalCode}, {addr.country}
                          </span>
                        </div>

                        {/* Phone */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 4,
                          }}
                        >
                          <PhoneIcon sx={{ fontSize: 18, marginRight: 4 }} />
                          <span>{addr.phoneNumber}</span>
                        </div>

                        {/* Email */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <EmailIcon sx={{ fontSize: 18, marginRight: 4 }} />
                          <span>{addr.emailId}</span>
                        </div>
                      </div>
                    }
                    sx={{
                      alignItems: "flex-start",
                      padding: "12px 8px",
                      marginBottom: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      width: "100%",
                    }}
                  />
                ))}
              </RadioGroup>
            ) : (
              <Grid container spacing={2} mt={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <CountrySelect
                    label="Select Country *"
                    value={country}
                    onChange={() => {
                      setCountry(country);
                      form.country = country.countryName;
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Region"
                    fullWidth
                    size="medium"
                    value={form.region}
                    onChange={(e) => handleChange("region", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Contact Name"
                    fullWidth
                    size="medium"
                    value={form.contactName}
                    onChange={(e) =>
                      handleChange("contactName", e.target.value)
                    }
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Company"
                    fullWidth
                    size="medium"
                    value={form.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Address"
                    fullWidth
                    size="medium"
                    multiline
                    rows={2}
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="City"
                    fullWidth
                    size="medium"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="State"
                    fullWidth
                    size="medium"
                    value={form.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Postal Code"
                    fullWidth
                    size="medium"
                    value={form.postalCode}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Phone Number"
                    fullWidth
                    size="medium"
                    value={form.phoneNumber}
                    onChange={(e) =>
                      handleChange("phoneNumber", e.target.value)
                    }
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Email Address"
                    fullWidth
                    size="medium"
                    value={form.emailId}
                    onChange={(e) => handleChange("emailId", e.target.value)}
                  />
                </Grid>
                <Grid>
                  <Box display="flex" flexWrap="wrap">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAdd}
                    >
                      Add Address
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Modal>
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="300px"
          textAlign="center"
          px={2}
        >
          {/* Heading */}
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Your cart is empty
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
            maxWidth={420}
          >
            You haven’t added any documents yet. Start by adding documents to
            proceed with your order.
          </Typography>

          <Divider sx={{ width: "100%", maxWidth: 480, mb: 3 }} />

          {/* Action Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => (window.location.href = `/orders/new/${service}`)}
          >
            Add Documents
          </Button>
        </Box>
      )}
    </Box>
  );
}
