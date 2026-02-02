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
  TextField,
  RadioGroup,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Collapse,
  Link,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import Modal from "@/components/ui/Modal/Modal";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import StatusStepper from "@/components/ui/Stepper/FormStepper";
import { DescriptionOutlined, Email, Home, Phone } from "@mui/icons-material";
import Image from "next/image";
import { savePayment } from "./savePayment";
import { updateOrder } from "@/services/paymentService";
import {
  addRegionAddress,
  getFeeTypes,
  getOrderDetails,
  getOrderIdOfCart,
  getRegion,
  getRegionAddress,
  getRegionAddresses,
  restoreFee,
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
  deleteCartOrder,
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
import Loader from "@/components/ui/Loader/Loader";
import { getAuth } from "../utils/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchFormsSharedData } from "../store/features/formsSlice";
import OverlayLoader from "@/components/ui/Loader/OverlayLoader";

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
  regionName: "",
};

export default function OrderMilestonePage() {
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
  const [orderInCart, setOrderInCart] = useState<boolean>();
  const [customer, setCustomer] = useState<any>();
  const [user, setUser] = useState<any>();
  const isFirstRender = useRef(true);
  const [fileName, setFileName] = useState("");
  const [uploadFileData, setUploadFileData] = useState<any>();
  const [submitShipping, setSubmitShipping] = useState<boolean>(false);
  const [region, setRegion] = useState<any>();
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
  const [expiryError, setExpiryError] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<number | null>(null);
  const [nameError, setNameError] = useState<string>("");
  const [cardNumberError, setCardNumberError] = useState<string>("");
  const [cvvError, setCvvError] = useState<string>("");
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>(
    {},
  );

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
  const [loading, setLoading] = useState<boolean>(false);

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [allRegions, setAllRegions] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setUserId(auth.userId);
      setCustomerId(auth.customerId);
    }
  }, []);

  const getRegions = async () => {
    try {
      const response = await getRegion();
      setAllRegions(response);
    } catch (e) {
      console.log("Error in getRegion: ", e);
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const sharedFormData = useSelector((state: RootState) => state.formsData);

  useEffect(() => {
    if (
      !sharedFormData.countries.length ||
      !sharedFormData.documentTypes.length
    ) {
      dispatch(fetchFormsSharedData());
    }
  }, [dispatch, sharedFormData]);

  const searchParams = useSearchParams();
  const service = searchParams.get("service") as string;

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateAddressForm = () => {
    const errors: Record<string, string> = {};

    if (!country) errors.country = "Country is required";
    if (!form.contactName.trim())
      errors.contactName = "Contact name is required";
    if (!form.address.trim()) errors.address = "Address is required";
    if (!form.city.trim()) errors.city = "City is required";
    if (!form.postalCode.trim()) errors.postalCode = "Postal code is required";
    if (!form.phoneNumber.trim())
      errors.phoneNumber = "Phone number is required";

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateAddressForm()) {
      showSnackbar("Please fill all required fields", "error");
      return;
    }

    try {
      const { regionName, ...payload } = form;
      if (customerId) payload.customerId = customerId;
      console.log(payload);
      const response = await addRegionAddress(payload);
      if (response) {
        setChecked((prev) => ({
          ...prev,
          regionAddressId: Number(response[0]?.regionAddressId),
        }));
        setRegion(response[0]);
      }
      showSnackbar("Address added successfully", "success");
      setShowExistingAddress(false);
      setAddressErrors({});
      setForm(initialForm);
      setCountry(null);
      setOpenDialog(false);
    } catch (error) {
      console.log("Failed to add address: ", error);
      showSnackbar("Failed to add address", "error");
    }
  };

  const confirmDeleteDocument = async () => {
    if (!docToDelete) return;

    try {
      setLoading(true);
      const docketId =
        orderDetails?.dockets?.find((d: any) =>
          d.docs?.some((doc: any) => doc.docId === docToDelete),
        )?.docketId ?? null;

      if (!docketId) {
        console.error("Docket not found for docId:", docToDelete);
        return;
      }

      const docFees = await getDocFees(docToDelete);
      if (Array.isArray(docFees)) {
        await Promise.all(
          docFees.map((fee: any) => deleteDocFee(fee.docFeeId)),
        );
      }

      const docStops = await getDocStops(docToDelete);
      if (Array.isArray(docStops)) {
        await Promise.all(
          docStops.map((stop: any) => deleteDocStops(stop.docStopId)),
        );
      }

      const docStatuses = await getDocStatus(docToDelete);
      if (Array.isArray(docStatuses)) {
        await Promise.all(
          docStatuses.map((status: any) => deleteDocStatus(status.docStatusId)),
        );
      }

      const attachments = await getDocAttachments(docToDelete);
      if (Array.isArray(attachments)) {
        await Promise.all(
          attachments.map((att: any) => deleteDocAttachments(att.attachmentId)),
        );
      }

      await deleteDoc(docToDelete);
      if (allDocs.length == 1) {
        await deleteCartOrder(orderDetails.orderId);
        setOrderInCart(false);
      }
      showSnackbar("Document deleted successfully", "success");
      getCartOrder();
    } catch (error) {
      showSnackbar("Failed to delete document", "error");
      console.error("Delete doc failed:", error);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setDocToDelete(null);
    }
  };

  let totalAmount = allDocs
    .reduce((sum: number, d: any) => {
      const docTotal = (d.docFees ?? []).reduce(
        (fSum: number, f: any) =>
          fSum + (Number(f.feeAmount) || 0) * (Number(f.quantity) || 1),
        0,
      );

      return sum + docTotal;
    }, 0)
    .toFixed(2);

  const getCartOrder = async () => {
    try {
      setLoading(true);
      const basePayload = CART_SERVICE_MAP[service];
      if (!basePayload) {
        return <div>Invalid service selected.</div>;
      }
      const payload = {
        userId: userId,
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
      if (orderData?.regionNote) {
        const response = await getRegionAddress(orderData.regionNote);
        setRegion(response[0]);
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

      if (orderData[0]?.useUserCourier === true) {
        setFileName(
          flattenedDocs[0].oosShippingDetail
            ?.slice(-1)[0]
            ?.shippingLabel?.blobName?.split("_")
            .pop(),
        );
      }

      if (!response) {
        console.error("No order detail returned");
        setAllDocs([]);
        return;
      }

      setFeeTypes(await getFeeTypes());
      setAllStops(await getAllStops());
      setDocTypes(await getLookup({ lookupType: "DocumentCategories" }));
    } catch (error) {
      console.error("Error in getCartOrder:", error);
      setAllDocs([]);
    } finally {
      setLoading(false);
    }
  };

  const hasFedex60Fee = allDocs.some((doc: any) =>
    doc.docFees?.some((fee: any) => fee.feeTypeId === 33),
  );

  if (checked.option === "courier" && !hasFedex60Fee)
    totalAmount = (Number(totalAmount) + 100).toFixed(2);

  const getCustomerDetails = async () => {
    const customerDetails = await getCustomer(String(customerId));
    const userDetails = await getUser(String(userId));
    setCustomer(customerDetails[0]);
    setUser(userDetails[0]);
  };

  useEffect(() => {
    if (customerId) {
      getCartOrder();
      getCustomerDetails();
      getRegions();
    }
  }, [customerId]);

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
    estCompletionDate: string,
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

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);

    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  };

  const validateExpiry = (value: string) => {
    if (!/^\d{2}\/\d{2}$/.test(value)) {
      return "Expiry date must be in MM/YY format";
    }

    const [mm, yy] = value.split("/").map(Number);

    if (mm < 1 || mm > 12) {
      return "Invalid month";
    }

    const currentYear = dayjs().year() % 100; // last 2 digits
    const currentMonth = dayjs().month() + 1;

    if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
      return "Card has expired";
    }

    return "";
  };

  card.cardTypeName = getCardTypeForCardNumber(card?.cardNumber).name;
  const cardTypeImg = getCardTypeForCardNumber(card?.cardNumber).img;

  const handlePayNow = async () => {
    if (
      orderDetails.labelByMail === false &&
      orderDetails.useUserCourier === false &&
      orderDetails.pickupOrDropOff === false &&
      orderDetails.regionId === 0 &&
      submitShipping === false
    ) {
      showSnackbar("Please save Shipping details first.", "error");
      return;
    }
    if (!isPolicyAccepted) {
      showSnackbar("Please accept Cancellation & Refund Policy.", "error");
      return;
    }
    if (paymentType == "") {
      showSnackbar("Please select payment type", "error");
      return;
    }
    if (paymentType === "card") {
      const nameErr = validateName(card.cardHolderName);
      const numErr = validateCardNumber(card.cardNumber);
      const expiryErr = validateExpiry(card.expirationDate);
      const cvvErr = validateCVV(card.cardCode);

      setNameError(nameErr);
      setCardNumberError(numErr);
      setExpiryError(expiryErr);
      setCvvError(cvvErr);

      if (nameErr || numErr || expiryErr || cvvErr) {
        showSnackbar(nameErr || numErr || expiryErr || cvvErr, "error");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      if (!hasFedex60Fee && checked.option === "courier") {
        const payload = allDocs[0];
        const updatedPayload = {
          ...payload,
          docFees: [
            ...(payload.docFees ?? []),
            {
              docFeeName: "FEDEX RETURN FEE",
              feeAmount: 100,
              feeTypeId: 33,
              invoicedAmount: 100,
            },
          ],
        };
        await restoreFee(updatedPayload);
      }
      const paymentCard = {
        ...card,
        orderId: orderDetails?.orderId,
        amount: totalAmount,
        paymentType: paymentType,
        customerId: Number(customerId),
      };

      setCard(paymentCard);
      let response;
      if (paymentType == "card") {
        paymentCard.amount = Number(totalAmount) + totalAmount * 0.035;
        response = await savePayment(paymentCard);
      } else {
        response = await updateOrder(orderDetails?.orderId, {
          billingAddressId: customer.billingAddressId,
          confirmOrderDate: true,
          orderId: orderDetails?.orderId,
          orderStatusId: 534,
          payLaterOptions: paymentType,
          shippingAddressId: customer.shippingAddressId,
        });
      }
      if (response.success != false)
        window.location.href = `/confirmation?orderId=${orderDetails.orderId}`;
      else {
        console.log(response);
        showSnackbar(`${response.message}`, "error");
      }
    } catch (e) {
      showSnackbar("Payment failed", "error");
      console.log(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  //Show Exisiting Addresses for Shipping Label Options
  const showExistingAddresses = async () => {
    const response = await getRegionAddresses({ customerId: customerId });
    setAddresses(response);
    setShowExistingAddress(true);
  };

  const updateRegion = async () => {
    const selectedAddressDetails = addresses.find(
      (a: any) => a.regionAddressId === checked.regionAddressId,
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

    const response = await updateRegionAddress(
      selectedAddressDetails.regionAddressId,
      payload,
    );
    setRegion(response[0]);
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
    if (checked.option === "") {
      showSnackbar("Please select Shipping Label/Return Instructions", "error");
      return;
    }
    try {
      const payload = {
        useUserCourier: shippingDetails.useUserCourier,
        labelByMail: shippingDetails.labelByMail,
        pickupOrDropOff: shippingDetails.pickupOrDropOff,
        regionId:
          checked.option === "courier"
            ? (addresses.find(
                (a: any) => a.regionAddressId === checked.regionAddressId,
              )?.regionId ?? shippingDetails.regionId)
            : shippingDetails.regionId,
        regionNote:
          checked.option === "courier"
            ? (addresses.find(
                (a: any) => a.regionAddressId === checked.regionAddressId,
              )?.regionAddressId ?? shippingDetails.regionNote)
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
        showSnackbar("Successfully Upload Return Shipping Label", "success");
      } catch (err) {
        showSnackbar("Failed to Upload Return Shipping Label", "error");
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

  const validateName = (value: string) =>
    value.trim() ? "" : "Cardholder name is required";

  const validateCardNumber = (value: string) =>
    !value || value.replace(/\s/g, "").length < 12
      ? "Enter a valid card number"
      : "";

  const validateCVV = (value: string) =>
    !value || value.length < 3 || value.length > 5 ? "Enter a valid CVV" : "";

  if (loading) return <Loader />;

  return (
    <>
      <OverlayLoader open={isSubmitting} message="Processing Payment..." />
      <Box sx={{ p: 3, bgcolor: "background.default", mt: "64px" }}>
        {/* ===== Shipping Section ===== */}
        {orderInCart ? (
          <Box>
            <Grid container spacing={3}>
              {/* ===== LEFT COLUMN - Documents ===== */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Box
                // sx={{
                //   maxHeight: "calc(100vh - 0px)",
                //   overflowY: "auto",
                //   pr: 1,
                // }}
                >
                  {(service === "us-authentication" ||
                    service === "notary-service" ||
                    service === "dispatch-service") && (
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() =>
                        (window.location.href = `/orders/new/${service}`)
                      }
                      sx={{
                        borderRadius: 0,
                        mb: 3,
                        height: 48,
                        textTransform: "none",
                        fontWeight: 600,
                        borderWidth: 2,
                        borderColor: "primary.main",
                        color: "primary.main",
                        backgroundColor: "#f5f9ff",
                        "&:hover": {
                          backgroundColor: "#e3f2fd",
                          borderColor: "primary.dark",
                        },
                      }}
                    >
                      Add More Documents
                    </Button>
                  )}

                  {allDocs.map((doc: any, docIndex: number) => (
                    <Card
                      key={doc.docId}
                      sx={{
                        mb: 3,
                        border: "1px solid #e0e0e0",
                        borderRadius: "0px",
                        transition: "0.3s",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                          borderColor: "#1976d2",
                        },
                      }}
                    >
                      <Accordion defaultExpanded sx={{ borderRadius: 0 }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ bgcolor: "#e9e7e7" }}
                        >
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                            height={1}
                          >
                            <Grid size={{ xs: 3 }}>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {(
                                  countries?.find(
                                    (c: any) => c.countryId === doc.countryId,
                                  )?.countryShortName || doc.countryId
                                ).toUpperCase()}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 3 }}>
                              <Typography variant="subtitle1">
                                {docTypes?.find(
                                  (d: any) => d.lookupId === doc.docCategoryId,
                                )?.lookupName || ""}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 4 }}>
                              <Typography variant="subtitle1">
                                Customer Ref: <b>{doc.internalReference}</b>
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 1 }}>
                              <Tooltip title="Remove document">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setDocToDelete(doc.docId);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <DeleteIcon color="error" />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ borderRadius: 0 }}>
                          {/* Document Handling Summary */}
                          <Paper
                            elevation={0}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              backgroundColor: "#f9fafb",
                              mb: 1,
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

                            <Box sx={{ mb: 2 }}>
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
                              service == "us-authentication" &&
                              doc.attachments?.length > 0 ? (
                                <Link
                                  onClick={() =>
                                    downloadAttachments({
                                      attachmentId:
                                        doc.attachments[0].attachmentId,
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
                          <Box
                            sx={{
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            {/* Header Row */}
                            <Grid container>
                              <Grid
                                size={{ xs: 6 }}
                                sx={{
                                  borderRight: "1px solid",
                                  borderColor: "divider",
                                  p: 1.5,
                                }}
                              >
                                <Typography fontWeight={700}>
                                  Processing Steps & Timelines
                                </Typography>
                              </Grid>

                              <Grid size={{ xs: 6 }} sx={{ p: 1.5 }}>
                                <Typography fontWeight={700}>
                                  Price Details / Cost Estimate
                                </Typography>
                              </Grid>
                            </Grid>

                            <Divider />

                            <Grid container>
                              <Grid
                                size={{ xs: 6 }}
                                sx={{
                                  borderRight: "1px solid",
                                  borderColor: "divider",
                                }}
                              >
                                <StatusStepper
                                  steps={getTimelineWithCompletion(
                                    doc.docStops,
                                    doc.estCompletionDate,
                                  )}
                                  activeStep={doc.docStops.length - 1}
                                />
                              </Grid>

                              <Grid size={{ xs: 6 }}>
                                <List dense disablePadding>
                                  {doc.instructionsList.map(
                                    (i: any, index: number) => (
                                      <ListItem
                                        key={index}
                                        disablePadding
                                        sx={{ py: 0.5, px: 1 }}
                                      >
                                        <ListItemText
                                          primaryTypographyProps={{
                                            variant: "body2",
                                            fontSize: 13,
                                            lineHeight: 1,
                                          }}
                                          primary={`${index + 1}. ${i.instruction}`}
                                        />
                                      </ListItem>
                                    ),
                                  )}
                                  {doc.docFees?.some(
                                    (f: any) => f.feeTypeId === 17,
                                  ) && (
                                    <ListItem
                                      disablePadding
                                      sx={{ py: 0.5, px: 1 }}
                                    >
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
                                <List dense disablePadding>
                                  {doc.docFees.map((f: any, idx: any) => {
                                    const feeName =
                                      f.description?.trim() ||
                                      feeTypes?.find(
                                        (a: any) => a.feeTypeId === f.feeTypeId,
                                      )?.feeTypeName;
                                    return (
                                      <ListItem key={idx} sx={{ py: 0.5 }}>
                                        <ListItemText primary={feeName} />
                                        <Typography>
                                          $
                                          {(
                                            f.feeAmount * (f.quantity ?? 1)
                                          ).toFixed(2)}
                                        </Typography>
                                      </ListItem>
                                    );
                                  })}
                                  {checked.option === "courier" &&
                                    docIndex === 0 &&
                                    !hasFedex60Fee && (
                                      <ListItem>
                                        <ListItemText primary="Fedex Return Fee" />
                                        <Typography>$100.00</Typography>
                                      </ListItem>
                                    )}
                                  <Divider />
                                  <ListItem>
                                    <ListItemText
                                      primary="Total"
                                      primaryTypographyProps={{
                                        fontWeight: 700,
                                      }}
                                    />
                                    {checked.option === "courier" &&
                                    docIndex === 0 ? (
                                      <Typography fontWeight={700}>
                                        $
                                        {(
                                          Number(
                                            doc.docFees.reduce(
                                              (a: any, b: any) =>
                                                a + b.feeAmount * b.quantity,
                                              0,
                                            ),
                                          ) + 100
                                        ).toFixed(2)}
                                      </Typography>
                                    ) : (
                                      <Typography fontWeight={700}>
                                        $
                                        {doc.docFees
                                          .reduce(
                                            (a: any, b: any) =>
                                              a + b.feeAmount * b.quantity,
                                            0,
                                          )
                                          .toFixed(2)}
                                      </Typography>
                                    )}
                                  </ListItem>
                                </List>
                              </Grid>
                            </Grid>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </Card>
                  ))}
                </Box>
              </Grid>

              {/* ===== RIGHT COLUMN - Sticky Sidebar ===== */}
              <Grid
                size={{ xs: 12, md: 5 }}
                // sx={{
                //   maxHeight: "calc(100vh - 0px)",
                //   overflowY: "auto",
                //   pr: 1,
                // }}
              >
                <Box
                  sx={{
                    position: { md: "sticky" },
                    // top: "80px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {/* Shipping Details Section */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1,
                      borderRadius: 0,
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: "background.paper",
                    }}
                  >
                    {/* Invoice Reference / PO NUmber */}
                    <Box
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 0.5,
                        overflow: "hidden",
                        width: "100%",
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#c30010",
                          height: 38,
                          display: "flex",
                          alignItems: "center",
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          color="white"
                          sx={{ letterSpacing: "0.3px" }}
                        >
                          INVOICE REFERENCE / PO NUMBER
                        </Typography>
                      </Box>
                      <TextField
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
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 0,
                            height: 40,
                            "& fieldset": {
                              borderColor: "#1976d2",
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* Shipping Label / Return Instructions */}
                    <Box sx={{ mb: 1, border: "1px solid" }}>
                      <Box
                        sx={{
                          backgroundColor: "primary.main",
                          height: 38,
                          display: "flex",
                          alignItems: "center",
                          px: 2,
                        }}
                      >
                        {/* Left title */}
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          color="white"
                          sx={{ letterSpacing: "0.3px" }}
                        >
                          SHIPPING LABEL / RETURN INSTRUCTIONS
                        </Typography>
                      </Box>

                      {/* Radio Buttons */}
                      <Box sx={{ px: 2, py: 1 }}>
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
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Grid size={{ xs: 6 }}>
                            <FormControlLabel
                              value="courier"
                              control={
                                <Radio
                                  size="small"
                                  onClick={() => {
                                    setChecked((prev) => ({
                                      ...prev,
                                      option: "courier",
                                    }));
                                    handleShippingOptionChange("courier");
                                    setOpenDialog(true); // ✅ ALWAYS opens
                                  }}
                                />
                              }
                              label="Create Return Label"
                            />
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <FormControlLabel
                              value="eCopy"
                              control={<Radio size="small" />}
                              label="E-Copy Only"
                            />
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <FormControlLabel
                              value="upload"
                              control={<Radio size="small" />}
                              label="Upload Return Label"
                            />
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <FormControlLabel
                              value="pickup"
                              control={<Radio size="small" />}
                              label="Pickup"
                            />
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <FormControlLabel
                              value="mail"
                              control={<Radio size="small" />}
                              label="Enclose Label by mail"
                            />
                          </Grid>
                        </RadioGroup>

                        {/* Collapsible Content */}
                        <Collapse in={!!checked.option} timeout="auto">
                          <Box mt={1} pl={4}>
                            {checked.option === "upload" && (
                              <Box mb={2}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  * When creating a prepaid return label, please
                                  use your company information (name, address,
                                  phone) as the shipper/sender. Do Not use WCS
                                  information (name, address, phone) as the
                                  shipper/sender.
                                </Typography>
                                <Box
                                  mt={1}
                                  p={2}
                                  sx={{
                                    border: "1px dashed",
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    "&:hover": { borderColor: "primary.main" },
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="primary.main"
                                  >
                                    <Box sx={{ mb: 1 }}>
                                      <ValidatedFileUpload
                                        label="Upload File"
                                        fileNameProp={fileName}
                                        onChange={handleSelectFile}
                                      />
                                    </Box>
                                  </Typography>
                                  {fileName && (
                                    <Box
                                      mt={2}
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="space-between"
                                    >
                                      <Box textAlign="left">
                                        <Box fontWeight={500}>{fileName}</Box>
                                      </Box>

                                      <IconButton
                                        size="small"
                                        onClick={() => {
                                          setUploadFileData("");
                                          setFileName("");
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                            )}

                            {checked.option === "mail" && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                mb={2}
                              >
                                * When creating a prepaid return label, please
                                use your company information (name, address,
                                phone) as the shipper/sender. Do Not use WCS
                                information (name, address, phone) as the
                                shipper/sender.
                              </Typography>
                            )}
                            {checked.option === "courier" && region && (
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                flexWrap="wrap"
                                mb={2}
                              >
                                {/* Name */}
                                <Typography fontWeight={600}>
                                  {region.contactName}
                                </Typography>

                                {/* Address */}
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={0.5}
                                >
                                  <Home fontSize="small" />
                                  <Typography variant="body2">
                                    {region.address}, {region.city},{" "}
                                    {region.state}, {region.postalCode},{" "}
                                    {region.country}
                                  </Typography>
                                </Box>

                                {/* Phone */}
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={0.5}
                                >
                                  <Phone fontSize="small" />
                                  <Typography variant="body2">
                                    {region.phoneNumber}
                                  </Typography>
                                </Box>

                                {/* Email */}
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={0.5}
                                >
                                  <Email fontSize="small" />
                                  <Typography variant="body2">
                                    {region.emailId}
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Collapse>
                      </Box>
                    </Box>

                    {/* Shipping Details Button */}
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

                  {/* Order Summary */}
                  <Box
                    sx={{
                      display: "flex",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        width: "50%",
                        borderRight: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box
                        sx={{
                          height: 38,
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "#cbcbcb",
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          color="black"
                        >
                          Order Summary
                        </Typography>
                      </Box>

                      <Box sx={{ px: 2, py: 2 }}>
                        <Typography variant="body2">
                          Order Total: <b>${totalAmount}</b>
                        </Typography>
                        <Typography variant="body2">
                          Total Documents: <b>{allDocs.length}</b>
                        </Typography>
                      </Box>
                    </Box>

                    {/* Billing Information */}
                    <Box sx={{ width: "50%" }}>
                      <Box
                        sx={{
                          height: 38,
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "#cbcbcb",
                          px: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          color="black"
                        >
                          Billing Information
                        </Typography>
                      </Box>

                      <Box sx={{ px: 2, py: 2 }}>
                        <Typography variant="body2">
                          {customer?.billAddress || "-"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Cancellation & Refund Policy */}
                  <Card
                    sx={{
                      borderRadius: 0,
                      p: 3,
                      backgroundColor: "#fafafa",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    {/* Heading */}
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      gutterBottom
                      sx={{ color: "#333" }}
                    >
                      Cancellation & Refund Policy
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#555",
                        lineHeight: 1.6,
                      }}
                    >
                      Orders may be cancelled within <strong>24 hours</strong>{" "}
                      for a full refund, except for{" "}
                      <strong>same-day service</strong> orders. After 24 hours,
                      cancellation requests may be eligible for a{" "}
                      <strong>partial refund</strong>, excluding WCS service
                      fees or any embassy/agency fees that have already been
                      incurred.
                      <br /> Embassy and agency fees are subject to change.
                    </Typography>

                    {/* Acceptance */}
                    <FormControlLabel
                      sx={{ mt: 2 }}
                      control={
                        <Checkbox
                          checked={isPolicyAccepted}
                          onChange={(e) =>
                            setIsPolicyAccepted(e.target.checked)
                          }
                        />
                      }
                      label={
                        <Typography variant="body2" fontWeight={500}>
                          I have read and accept the cancellation and refund
                          policy
                        </Typography>
                      }
                    />
                  </Card>

                  {/* Payment Card */}
                  <Box sx={{ border: "1px solid" }}>
                    <Box
                      sx={{
                        backgroundColor: "primary.main",
                        height: 38,
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        color="white"
                        sx={{ letterSpacing: "0.3px" }}
                      >
                        Payment Options
                      </Typography>
                    </Box>
                    <Box sx={{ px: 2, py: 1 }}>
                      <RadioGroup
                        row
                        value={paymentType}
                        onChange={(e) => setPaymentType(e.target.value)}
                      >
                        <Grid size={{ xs: 6 }}>
                          <FormControlLabel
                            value="card"
                            control={<Radio />}
                            label="Credit/Debit Cart"
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <FormControlLabel
                            value="Cheque"
                            control={<Radio />}
                            label="Company's Check"
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <FormControlLabel
                            value="Wire/ACH Transfer"
                            control={<Radio />}
                            label="ACH/Wire Transfer"
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <FormControlLabel
                            value="Pay On PO"
                            control={<Radio />}
                            label="Purchase Order (PO)"
                          />
                        </Grid>
                      </RadioGroup>

                      {paymentType === "card" && (
                        <>
                          <Typography variant="body2" mt={1} mb={2}>
                            * 3.5% service charge applies to all card
                            transactions.
                          </Typography>

                          <TextField
                            label="Cardholder's Name"
                            value={card?.cardHolderName ?? ""}
                            error={Boolean(nameError)}
                            helperText={nameError}
                            onChange={(e) => {
                              const value = e.target.value;
                              setCard({
                                ...card,
                                cardHolderName: (e.target as HTMLInputElement)
                                  .value,
                              });
                              setNameError(validateName(value));
                            }}
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
                            error={Boolean(cardNumberError)}
                            helperText={cardNumberError}
                            onChange={(e) => {
                              setCard({
                                ...card,
                                cardNumber: (e.target as HTMLInputElement)
                                  .value,
                              });
                              const value = e.target.value;
                              setCardNumberError(validateCardNumber(value));
                            }}
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
                                value={card.expirationDate}
                                error={Boolean(expiryError)}
                                helperText={expiryError}
                                fullWidth
                                size="small"
                                inputProps={{
                                  maxLength: 5,
                                  inputMode: "numeric",
                                }}
                                onChange={(e) => {
                                  const formatted = formatExpiry(
                                    e.target.value,
                                  );
                                  setCard({
                                    ...card,
                                    expirationDate: formatted,
                                  });

                                  const error = validateExpiry(formatted);
                                  setExpiryError(error);
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <TextField
                                label="CVV"
                                error={Boolean(cvvError)}
                                helperText={cvvError}
                                onChange={(e) => {
                                  setCard({
                                    ...card,
                                    cardCode: (e.target as HTMLInputElement)
                                      .value,
                                  });
                                  const value = e.target.value;
                                  setCvvError(validateCVV(value));
                                }}
                                fullWidth
                                size="small"
                              />
                            </Grid>
                          </Grid>
                        </>
                      )}

                      <Divider sx={{ my: 2 }} />
                    </Box>
                    <Box display="flex" flexWrap="wrap">
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handlePayNow}
                        sx={{
                          borderRadius: 0,
                          backgroundColor:
                            paymentType === "payLater" ? "#1976d2" : "#c30010",
                          "&:hover": {
                            backgroundColor:
                              paymentType === "payLater"
                                ? "#115293"
                                : "#a0000d",
                          },
                        }}
                      >
                        {paymentType === "card"
                          ? `Checkout & Pay $${totalAmount}`
                          : `Checkout & Confirm to Pay Later $${totalAmount}`}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Modal
              open={openDialog}
              onClose={() => {
                setOpenDialog(false);
                setForm(initialForm);
                setAddressErrors({});
              }}
              title="Add New WCS Courier Address"
              type="custom"
              showActions={false}
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
                  onChange={(e) => {
                    setChecked((prev) => ({
                      ...prev,
                      regionAddressId: Number(e.target.value),
                    }));
                    setOpenDialog(false);
                  }}
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
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
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
                      label="Select Country"
                      value={country}
                      required
                      onChange={(value: any) => {
                        setCountry(value);
                        // form.country = value?.countryName ?? "";
                        const matchedRegion = allRegions.find(
                          (r: any) => r.regionId === value?.regionId,
                        );
                        setForm((prev) => ({
                          ...prev,
                          country: value?.countryName ?? "",
                          regionId: matchedRegion?.regionId ?? "",
                          regionName: matchedRegion?.name ?? "",
                        }));
                        setAddressErrors((prev) => ({ ...prev, country: "" }));
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Region"
                      fullWidth
                      size="medium"
                      value={form.regionName}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        backgroundColor: "#f9fafb",
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Contact Name"
                      fullWidth
                      size="medium"
                      value={form.contactName}
                      error={Boolean(addressErrors.contactName)}
                      helperText={addressErrors.contactName}
                      onChange={(e) => {
                        handleChange("contactName", e.target.value);
                        setAddressErrors((prev) => ({
                          ...prev,
                          contactName: "",
                        }));
                      }}
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
                      error={Boolean(addressErrors.address)}
                      helperText={addressErrors.address}
                      onChange={(e) => {
                        handleChange("address", e.target.value);
                        setAddressErrors((prev) => ({ ...prev, address: "" }));
                      }}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="City"
                      fullWidth
                      size="medium"
                      value={form.city}
                      error={Boolean(addressErrors.city)}
                      helperText={addressErrors.city}
                      onChange={(e) => {
                        handleChange("city", e.target.value);
                        setAddressErrors((prev) => ({ ...prev, city: "" }));
                      }}
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
                      error={Boolean(addressErrors.postalCode)}
                      helperText={addressErrors.postalCode}
                      onChange={(e) => {
                        handleChange("postalCode", e.target.value);
                        setAddressErrors((prev) => ({
                          ...prev,
                          postalCode: "",
                        }));
                      }}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Phone Number"
                      fullWidth
                      size="medium"
                      value={form.phoneNumber}
                      error={Boolean(addressErrors.phoneNumber)}
                      helperText={addressErrors.phoneNumber}
                      inputProps={{
                        inputMode: "tel",
                      }}
                      onKeyDown={(e) => {
                        const allowedControlKeys = [
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                          "Home",
                          "End",
                        ];

                        const allowedCharRegex = /^[0-9+()]$/;

                        if (allowedControlKeys.includes(e.key)) return;

                        if (!allowedCharRegex.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        const pastedText = e.clipboardData.getData("text");

                        if (!/^[0-9+()]*$/.test(pastedText)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        handleChange("phoneNumber", e.target.value);
                        setAddressErrors((prev) => ({
                          ...prev,
                          phoneNumber: "",
                        }));
                      }}
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
        ) : orderInCart !== undefined ? (
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
        ) : (
          ""
        )}
      </Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Document</DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this document?
            <br />
            This action <strong>cannot be undone</strong>.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={confirmDeleteDocument}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
