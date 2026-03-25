"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import InputField from "@/components/ui/Input/Input";
import FormLayout from "@/components/ui/Forms/FormLayout";
import { AdditionalServices } from "@/dataset/constants/constants";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import DocumentDropdown, {
  DocType,
} from "@/components/ui/Dropdown/DocumentDropdown";
import Modal from "@/components/ui/Modal/Modal";
import DocumentUpload from "../Common/DocumentUpload";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import Loader from "@/components/ui/Loader/Loader";
import { AdditionalQuestions } from "../Common/AdditionalQuestions";
import {
  createUSApostilleOrder,
  getStates,
  getStops,
  getApplicableStops,
  getStateSOSConfigs,
  getApplicableOOS,
  getOOSDeptMapping,
  getOOSAddress,
  uploadFile,
} from "@/services/formsService";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
import { CART_SERVICE_MAP } from "@/constants/serviceMap";
import { getOrderDetails, getOrderIdOfCart } from "@/services/cartServices";
import {
  buildUSApostillePayload,
  buildUSApostillePayloadFromExistingOrder,
} from "../Common/USApostillePayload";
import { updateOrder } from "@/services/paymentService";
import { getAuth } from "@/app/utils/auth";
import OverlayLoader from "@/components/ui/Loader/OverlayLoader";
import validateUSApostilleForm from "../Common/validateUSForm";
import StatusStepper from "@/components/ui/Stepper/FormStepper";

const STOP_DOCS_HAGUE_COUNTRIES = [6, 15, 28, 29, 30, 31];
const STOP_DOCS_NON_HAGUE_COUNTRIES = [6, 12, 28, 29, 30, 31];

type Stop = {
  stopId: number;
  stopName: string;
  stopSequence?: number | null;
  stopNumber?: number | null;
  isChecked?: boolean;
  isOOS?: boolean;
  oosAddressId?: number;
  oosReferenceId?: number | null;
  consulateName?: string | null;
  stopAddress?: any;
  description?: string;
  processDays?: number | null;
  rushProcessDays?: number | null;
  noProcessDays?: number | null;
  prepDays?: number | null;
  courierDays?: number | null;
};

type ApplicableStop = {
  stopId: number;
  stopSequence?: number | null;
  countryTypeId?: number | null;
  countryId?: number | null;
  docCategoryId?: number | null;
  docTypeId?: number | null;
};

type OOSRule = {
  countryId: number;
  docCategoryId: number;
  docSubCategoryId: number;
  isOOSSOS: boolean;
  isOOSEMB: boolean;
};

type StateSOSConfig = {
  stateId?: number | null;
  processDays?: number | null;
  rushProcessDays?: number | null;
  active?: boolean | null;
};

type DisplayStop = Stop & {
  __virtual?: boolean;
};

const getDisplayStopName = (name: string) => {
  if (name === "ARAB CHAMBER") return "ACC";
  if (name === "TRANSLATION") return "TRA";
  return name;
};

export default function USAppostileAndLegalizationForm({
  country,
  setCountry,
  document,
  setDocument,
}: {
  country: any;
  setCountry: (value: any) => void;
  document: any;
  setDocument: any;
}) {
  const { loading } = useSelector((state: RootState) => state.formsData);
  // const [country, setCountry] = useState<any>(null);
  // const [document, setDocument] = useState<DocType | null>(null);
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [modal, setModal] = useState({
    open: false,
    type: "warning" as const,
    message: "",
  });
  const [disabled, setDisabled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [additionalServicesState, setAdditionalServicesState] =
    useState(AdditionalServices);
  const [additionalQuestions, setAdditionalQuestions] = useState<any>([]);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [basePayload, setBasePayload] = useState<any>(null);
  const [states, setStates] = useState<any>();
  const [showCartConflict, setShowCartConflict] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const lastUploadedRef = useRef<string | null>(null);
  const [formResetKey, setFormResetKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState();
  const [uploadDocValues, setUploadDocValues] = useState<any>();
  const [message, setMesage] = useState<string>("");
  const [customerReference, setCustomerReference] = useState<any>();
  const [additionalComments, setAdditionalComments] = useState<any>();
  const [trackingNo, setTrackingNo] = useState<any>(null);
  const [courierType, setCourierType] = useState<string | null>(null);
  const [forceOriginalMail, setForceOriginalMail] = useState(false);
  const [suppressNextDocOpen, setSuppressNextDocOpen] = useState(false);
  const [allStops, setAllStops] = useState<Stop[]>([]);
  const [allApplicableStops, setAllApplicableStops] = useState<
    ApplicableStop[]
  >([]);
  const [allApplicableOOS, setAllApplicableOOS] = useState<OOSRule[]>([]);
  const [allStateSOSConfigs, setAllStateSOSConfigs] = useState<StateSOSConfig[]>([]);
  const [allOOSDeptMappings, setAllOOSDeptMappings] = useState<any[]>([]);
  const [allOOSAddresses, setAllOOSAddresses] = useState<any[]>([]);
  const [documentStops, setDocumentStops] = useState<Stop[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setCountry(null);
    setDocument(null);
    setAdditionalServices([]);
    setAdditionalServicesState([...AdditionalServices]);
    setAdditionalQuestions([]);
    setUploadedDoc(null);
    setDisabled(false);
    setDropdownOpen(false);
    setModal({ open: false, type: "warning", message: "" });
    setShowCartConflict(false);
    setForceOriginalMail(false);
    setSuppressNextDocOpen(false);
    setDocumentStops([]);
    setFieldErrors({});

    setFormResetKey((prev) => prev + 1);
  };

  const clearFieldErrors = (...keys: string[]) => {
    setFieldErrors((prev) => {
      if (keys.length === 0) return {};
      const next = { ...prev };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  };

  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setUserId(auth.userId);
      setCustomerId(auth.customerId);
    }
  }, []);

  const handleDocumentSelect = (newValue: DocType | null) => {
    if (!newValue) return;
    clearFieldErrors("document", "additionalQuestions");

    const id = newValue.docTypeId;
    const countryType = country.countryTypeId === 501 ? "HAGUE" : "NON_HAGUE";

    if (countryType === "HAGUE") {
      // Case 1: REQUIRE ORIGINALS (block upload)
      if (STOP_DOCS_HAGUE_COUNTRIES.includes(id)) {
        let warningMessage = "";

        switch (id) {
          case 30:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 31:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          // case 35:
          //   warningMessage =
          //     "The Federal Government document type you selected require originals. Please mail originals to our office.";
          //   break;
          case 36:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 28:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 15:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 29:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 6:
            warningMessage =
              "WCS does not provide services for personal government issued documents for Hague Convention countries. Please have document notarized and certified by the Secretary of State where the document was created.";
            break;
          default:
            warningMessage = "";
            break;
        }

        setModal({
          open: true,
          type: "warning",
          message: warningMessage,
        });
        setDisabled(false);
        setForceOriginalMail(true);
        setSuppressNextDocOpen(true);
        setDocument(newValue);
        setDropdownOpen(false);
        return;
      }

      // Case 2: NORMAL FLOW (no popup, no stop)
      if (!STOP_DOCS_HAGUE_COUNTRIES.includes(id)) {
        setDocument(newValue);
        setDisabled(false);
        setForceOriginalMail(false);
        setSuppressNextDocOpen(false);
        setModal((prev) => ({ ...prev, open: false }));
      }
    } else {
      // Case 1: REQUIRE ORIGINALS (block upload)
      if (STOP_DOCS_NON_HAGUE_COUNTRIES.includes(id)) {
        let warningMessage = "";

        switch (id) {
          case 30:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 31:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 35:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 36:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 28:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 15:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 29:
            warningMessage =
              "The Federal Government document type you selected require originals. Please mail originals to our office.";
            break;
          case 6:
            warningMessage =
              "For this country, all general/personal documents must be notarized and certified by the Secretary of State in the state of origin";
            break;
          default:
            warningMessage = "";
            break;
        }

        setModal({
          open: true,
          type: "warning",
          message: warningMessage,
        });
        setDisabled(false);
        setForceOriginalMail(true);
        setSuppressNextDocOpen(true);
        setDocument(newValue);
        setDropdownOpen(false);
        return;
      }

      // Case 2: NORMAL FLOW (no popup, no stop)
      if (!STOP_DOCS_NON_HAGUE_COUNTRIES.includes(id)) {
        setDocument(newValue);
        setDisabled(false);
        setForceOriginalMail(false);
        setSuppressNextDocOpen(false);
        setModal((prev) => ({ ...prev, open: false }));
      }
    }
  };
  
  const handleCountrySelect = (value: any) => {
    setCountry(value);
    setDocument(null);
    setAdditionalServices([]);
    setForceOriginalMail(false);
    setDocumentStops([]);
    clearFieldErrors("country", "document", "additionalQuestions");
  };

  const handleAdditionalQuestionsChange = (questions: any[]) => {
    setAdditionalQuestions(questions);
    clearFieldErrors("additionalQuestions");
  };

  const getOriginState = () => {
    const selectedStateId = Number(
      additionalQuestions.find((q: any) => q.questionId === 2)?.answer,
    );
    if (selectedStateId) {
      return states?.find((s: any) => s.stateId === selectedStateId);
    }
    return states?.find(
      (s: any) => String(s.stateName).toUpperCase() === "MARYLAND",
    );
  };

  const normalizeStops = ({
    stops,
    applicableStops,
    selectedCountry,
    selectedDocument,
    isRush,
  }: {
    stops: Stop[];
    applicableStops: ApplicableStop[];
    selectedCountry: any;
    selectedDocument: any;
    isRush: boolean;
  }) => {
    const applicableStopMap: Record<number, ApplicableStop> = {};

    applicableStops.forEach((applicableStop) => {
      if (
        selectedCountry &&
        applicableStop.countryTypeId &&
        applicableStop.countryTypeId !== 0 &&
        applicableStop.countryTypeId !== selectedCountry.countryTypeId
      ) {
        return;
      }
      if (
        selectedCountry &&
        applicableStop.countryId &&
        applicableStop.countryId !== 0 &&
        applicableStop.countryId !== selectedCountry.countryId
      ) {
        return;
      }
      if (
        selectedDocument &&
        applicableStop.docCategoryId &&
        applicableStop.docCategoryId !== 0 &&
        applicableStop.docCategoryId !== selectedDocument.docCategoryId
      ) {
        return;
      }
      if (
        selectedDocument &&
        applicableStop.docTypeId &&
        applicableStop.docTypeId !== 0 &&
        applicableStop.docTypeId !== selectedDocument.docTypeId
      ) {
        return;
      }

      const shippingException =
        (selectedCountry?.shippingException === 1 &&
          selectedCountry?.countryId !== 13 &&
          selectedCountry?.countryId !== 133 &&
          selectedCountry?.countryId !== 204 &&
          applicableStop.stopId === 2 &&
          selectedDocument?.docCategoryId === 523) ||
        (selectedCountry?.shippingException === 1 &&
          selectedCountry?.countryId === 144 &&
          applicableStop.stopId === 2 &&
          selectedDocument?.docCategoryId === 522) ||
        (selectedCountry?.shippingException === 1 &&
          applicableStop.stopId === 3 &&
          selectedDocument?.docCategoryId === 523);

      if (shippingException) return;
      if (applicableStop.stopId === 11 || applicableStop.stopId === 14) return;

      if (selectedCountry?.countryId === 174 && applicableStop.stopId === 5) {
        return;
      }
      if (
        selectedCountry?.countryId === 93 &&
        selectedDocument?.docCategoryId !== 522 &&
        applicableStop.stopId === 6
      ) {
        return;
      }
      if (
        selectedCountry?.countryId === 93 &&
        applicableStop.stopId === 6 &&
        !isRush
      ) {
        return;
      }
      if (
        isRush &&
        applicableStop.stopId === 3 &&
        [93, 53, 195, 199, 97, 188].includes(selectedCountry?.countryId) &&
        selectedDocument?.docCategoryId === 522
      ) {
        return;
      }

      applicableStopMap[applicableStop.stopId] = applicableStop;
    });

    return stops
      .map((stop) => {
        const applicableStop = applicableStopMap[stop.stopId];
        return {
          ...stop,
          isChecked: applicableStop != null,
          stopSequence: applicableStop?.stopSequence ?? null,
          stopNumber: applicableStop?.stopSequence ?? null,
          isOOS: false,
          oosAddressId: 0,
          oosReferenceId: null,
          consulateName: null,
          stopAddress: null,
        };
      })
      .sort((a, b) => {
        const aSeq = a.stopSequence ?? Number.MAX_SAFE_INTEGER;
        const bSeq = b.stopSequence ?? Number.MAX_SAFE_INTEGER;
        return aSeq - bSeq;
      });
  };

  const applyStateSOSConfigToStops = ({
    stops,
    originState,
    isRush,
  }: {
    stops: Stop[];
    originState: any;
    isRush: boolean;
  }) => {
    if (!Array.isArray(stops) || !originState || !Array.isArray(allStateSOSConfigs)) {
      return stops;
    }

    const stateSOSConfig =
      allStateSOSConfigs.find(
        (config) => Number(config.stateId) === Number(originState.stateId),
      ) || allStateSOSConfigs.find((config) => config.stateId == null);

    if (!stateSOSConfig) {
      return stops;
    }

    return stops.map((stop) => {
      if (stop.stopId !== 2) {
        return stop;
      }

      const processDays =
        stateSOSConfig.processDays == null
          ? stop.processDays
          : stateSOSConfig.processDays;
      const rushProcessDays =
        stateSOSConfig.rushProcessDays == null ||
        stateSOSConfig.rushProcessDays === 0
          ? processDays
          : stateSOSConfig.rushProcessDays;

      return {
        ...stop,
        processDays,
        rushProcessDays,
        noProcessDays: isRush ? rushProcessDays ?? processDays : processDays,
      };
    });
  };
  const enrichOOSStops = ({
    stops,
    selectedCountry,
    selectedDocument,
    originState,
    docTypeId,
  }: {
    stops: Stop[];
    selectedCountry: any;
    selectedDocument: any;
    originState: any;
    docTypeId: number;
  }) => {
    if (!originState || !selectedCountry || !selectedDocument) return stops;

    if (String(originState.stateName).toUpperCase() === "MARYLAND") {
      return stops.map((stop) => ({
        ...stop,
        isOOS: false,
        oosAddressId: 0,
        oosReferenceId: null,
        consulateName: null,
        stopAddress: null,
      }));
    }

    const docSubCategoryId =
      selectedCountry.countryId === 199 || selectedCountry.countryId === 53
        ? docTypeId
        : 0;

    const applicableOOS = allApplicableOOS.filter(
      (rule) =>
        rule.countryId === selectedCountry.countryId &&
        rule.docCategoryId === selectedDocument.docCategoryId &&
        rule.docSubCategoryId === docSubCategoryId,
    );

    if (!applicableOOS.length) return stops;

    const activeRule = applicableOOS[0];

    return stops.map((stop) => {
      const cleanStop = {
        ...stop,
        isOOS: false,
        oosAddressId: 0,
        oosReferenceId: null,
        consulateName: null,
        stopAddress: null,
      };

      const isSOSOOS = activeRule.isOOSSOS === true && stop.stopId === 2;
      const isEMBOOS = activeRule.isOOSEMB === true && stop.stopId === 5;
      if (!isSOSOOS && !isEMBOOS) return cleanStop;

      const mapping = allOOSDeptMappings.find((m: any) => {
        if (stop.stopId === 2) {
          return (
            m.deptType === "STATE" &&
            m.stateOfOriginId === originState.stateId
          );
        }
        return (
          m.deptType === "CONSULATE" &&
          m.destinationCountryId === selectedCountry.countryId &&
          m.stateOfOriginId === originState.stateId
        );
      });

      if (!mapping) return cleanStop;

      const address = allOOSAddresses.find(
        (addr: any) => addr.oosAddressId === mapping.oosAddressId,
      );

      return {
        ...cleanStop,
        isOOS: true,
        oosAddressId: mapping.oosAddressId ?? 0,
        oosReferenceId: mapping.deptId ?? null,
        consulateName:
          stop.stopId === 5 ? mapping.deptName : originState.stateShortName,
        stopName: stop.stopId === 5 ? "EMB" : stop.stopName,
        stopAddress: address ?? null,
      };
    });
  };

  useEffect(() => {
    if (
      (country?.countryShortName === "Kuwait" ||
        country?.countryShortName === "Egypt") &&
      document
    ) {
      setAdditionalServicesState([
        ...AdditionalServices,
        "Optional Arab Chamber Stamp",
      ]);
    } else {
      setAdditionalServicesState([...AdditionalServices]);
    }
  }, [country, document]);

  const handleDocumentUpload = async (data: any) => {
    clearFieldErrors("uploadOption", "uploadDocument");
    if (!data.uploadedFile) {
      lastUploadedRef.current = null;
      setUploadedDoc(null);
    }
    setTrackingNo(data.trackingNumberNested || null);
    setCourierType(data.courierNested || null);
    setUploadDocValues(data);
    setNumberOfPages(data?.numPages);
    const file: File | null = data?.uploadedFile;
    if (!file) return;

    const fileKey = `${file.name}-${file.size}`;

    if (lastUploadedRef.current === fileKey) {
      return;
    }

    lastUploadedRef.current = fileKey;

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file_0", file);
        const data = await uploadFile(formData);
        showSnackbar("Document uploaded successfully", "success");
        setUploadedDoc(data);
      } catch (err) {
        console.log(err);
        showSnackbar("Error while uploading document", "error");
      }
    }
  };

  const numberOfProducts =
    country?.countryId === 130
      ? Number(
          additionalQuestions.find((q: any) => q.questionId === 12)?.answer,
        ) || null
      : null;

  const submitOrder = async (): Promise<boolean> => {
    const {
      isValid,
      error,
      fieldErrors: nextFieldErrors,
    } = validateUSApostilleForm({
      country,
      document,
      additionalQuestions,
      uploadDocValues,
      });

    if (!isValid) {
      setFieldErrors(nextFieldErrors);
      showSnackbar(error, "error");
      return false;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    let payload;
    try {
      const countryId = country?.countryId;
      const docCategoryId = document?.docCategoryId;
      const docTypeId = document?.docTypeId;
      const originState = Number(
        additionalQuestions.find((q: any) => q.questionId === 2)?.answer,
      );
      const nusaccRequired =
        additionalQuestions.find((q: any) => q.questionId === 8)?.answer ===
        "Yes";
      if (basePayload == null) {
        payload = buildUSApostillePayload({
          countryId,
          docCategoryId,
          additionalServices,
          uploadedDoc,
          docTypeId,
          originState,
          nusaccRequired,
          numberOfProducts,
          numberOfPages,
          customerReference,
          additionalComments,
          trackingNo,
          courierType,
          nestedSelection: uploadDocValues?.nestedSelection ?? null,
          stops: payloadStops,
        });
        await createUSApostilleOrder(payload);
        showSnackbar("Order created successfully", "success");
      } else {
        payload = buildUSApostillePayloadFromExistingOrder({
          basePayload,
          countryId,
          docCategoryId,
          additionalServices,
          uploadedDoc,
          docTypeId,
          originState,
          nusaccRequired,
          numberOfProducts,
          numberOfPages,
          customerReference,
          additionalComments,
          trackingNo,
          courierType,
          nestedSelection: uploadDocValues?.nestedSelection ?? null,
          stops: payloadStops,
        });
        await updateOrder(payload.orderId, payload);
      }
      return true;
    } catch (error) {
      showSnackbar("Failed to submit order", "error");
      console.error(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const addToCart = async () => {
    setMesage("Adding to Cart...");
    const success = await submitOrder();
    if (success) {
      showSnackbar("Document added to Cart", "success");
      resetForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const proceedToCart = async () => {
    setMesage("Processing checkout...");
    const success = await submitOrder();
    if (success) window.location.href = "/cart?service=us-authentication";
  };

  // Get the previous cart order details.
  const getCartOrder = async () => {
    try {
      const basePayload = CART_SERVICE_MAP["us-authentication"];
      if (!basePayload) {
        return <div>Invalid service selected.</div>;
      }
      const payload = {
        userId: userId,
        ...basePayload,
      };
      const orderId = await getOrderIdOfCart(payload);
      if (orderId != null) {
        const response = await getOrderDetails({ orderId: orderId });
        const orderData = response[0];
        setBasePayload(orderData);
      }
    } catch (error) {
      console.error("Error in getCartOrder:", error);
    }
  };


  const fetchStates = async () => {
    try {
      const response = await getStates();
      setStates(response);
    } catch (e) {
      console.log("Failed to fetch states.", e);
    }
  };

  const fetchStopsMetadata = async () => {
    try {
      const [
        stopsRes,
        applicableStopsRes,
        applicableOOSRes,
        stateSOSConfigsRes,
        oosDeptRes,
        oosAddressRes,
      ] = await Promise.all([
        getStops(),
        getApplicableStops(),
        getApplicableOOS(),
        getStateSOSConfigs(),
        getOOSDeptMapping(),
        getOOSAddress(),
      ]);

      setAllStops(Array.isArray(stopsRes) ? stopsRes : []);
      setAllApplicableStops(
        Array.isArray(applicableStopsRes) ? applicableStopsRes : [],
      );
      setAllApplicableOOS(
        Array.isArray(applicableOOSRes) ? applicableOOSRes : [],
      );
      setAllStateSOSConfigs(
        Array.isArray(stateSOSConfigsRes) ? stateSOSConfigsRes : [],
      );
      setAllOOSDeptMappings(Array.isArray(oosDeptRes) ? oosDeptRes : []);
      setAllOOSAddresses(Array.isArray(oosAddressRes) ? oosAddressRes : []);
    } catch (e) {
      console.log("Failed to fetch stop metadata.", e);
    }
  };

  useEffect(() => {
    if (customerId) {
      getCartOrder();
    }
    fetchStates();
    fetchStopsMetadata();
  }, [customerId, formResetKey]);

  useEffect(() => {
    if (
      !country ||
      !document ||
      !allStops.length ||
      !allApplicableStops.length
    ) {
      setDocumentStops([]);
      return;
    }

    const isRush = additionalServices.includes("Rush");
    const normalizedStops = normalizeStops({
      stops: allStops,
      applicableStops: allApplicableStops,
      selectedCountry: country,
      selectedDocument: document,
      isRush,
    });

    const originState = getOriginState();
    const withStateSOS = applyStateSOSConfigToStops({
      stops: normalizedStops,
      originState,
      isRush,
    });
    const withOOS = enrichOOSStops({
      stops: withStateSOS,
      selectedCountry: country,
      selectedDocument: document,
      originState,
      docTypeId: document?.docTypeId ?? 0,
    });

    setDocumentStops(withOOS);
  }, [
    country,
    document,
    additionalServices,
    allStops,
    allApplicableStops,
    allApplicableOOS,
    allStateSOSConfigs,
    allOOSDeptMappings,
    allOOSAddresses,
    states,
    additionalQuestions,
  ]);

  useEffect(() => {
    setShowCartConflict(
      additionalQuestions.find((q: any) => q.questionId === 1)?.answer === "No",
    );
  }, [additionalQuestions]);

  const getServiceTooltip = (service: string) => {
    if (service === "Post-Scan") return "Scan of Legalized Document";
    if (service === "Pre-Scan") return "Scan of Original Document";
    return null;
  };

  const selectedStopsBase = documentStops
    .filter((stop) => stop.isChecked)
    .sort((a, b) => (a.stopSequence ?? 0) - (b.stopSequence ?? 0));

  const payloadStops = selectedStopsBase.map((stop, index) => ({
    ...stop,
    stopSequence: stop.stopSequence ?? index + 1,
    stopNumber: stop.stopNumber ?? stop.stopSequence ?? index + 1,
    noProcessDays:
      stop.noProcessDays ??
      (additionalServices.includes("Rush")
        ? stop.rushProcessDays ?? stop.processDays
        : stop.processDays),
  }));

  const selectedStops: DisplayStop[] = (() => {
    const withArabChamber = [...selectedStopsBase];
    const arabChamberSelected =
      additionalQuestions.find((q: any) => q.questionId === 8)?.answer ===
      "Yes";

    if (!arabChamberSelected) return withArabChamber;

    const hasACCAlready = withArabChamber.some(
      (stop) =>
        String(stop.stopName).toUpperCase() === "ARAB CHAMBER" ||
        String(stop.stopName).toUpperCase() === "ACC",
    );

    if (hasACCAlready) return withArabChamber;

    const accStop: DisplayStop = {
      stopId: -8,
      stopName: "ARAB CHAMBER",
      isChecked: true,
      __virtual: true,
    };

    const countryName = String(country?.countryShortName ?? "").toUpperCase();
    const isKuwait = countryName === "KUWAIT";

    if (isKuwait) {
      const embassyIndex = withArabChamber.findIndex(
        (stop) =>
          String(stop.stopName).toUpperCase().includes("EMB") ||
          String(stop.stopName).toUpperCase().includes("EMBASSY"),
      );

      if (embassyIndex >= 0) {
        withArabChamber.splice(embassyIndex, 0, accStop);
      } else {
        withArabChamber.push(accStop);
      }
      return withArabChamber;
    }

    // Default behavior for Qatar/Egypt/Yemen/Lebanon/Algeria and others:
    // append ACC as last operational step before Customer marker.
    withArabChamber.push(accStop);
    return withArabChamber;
  })();

  const routeStops: DisplayStop[] = [...selectedStops];

  if (loading) return <Loader />;

  return (
    <>
      <Dialog open={showCartConflict} disableEscapeKeyDown onClose={() => {}}>
        <DialogTitle>Notarization Required</DialogTitle>

        <DialogContent>
          <Typography>
            Please have your document <strong>signed and notarized</strong> from
            the <strong> U.S. address mentioned on the document</strong>.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Once notarization is completed, you may contact us to proceed with
            further processing of your order.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setAdditionalQuestions((prev: any) =>
                prev.filter((item: any) => item.questionId !== 1),
              );
              setShowCartConflict(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <OverlayLoader open={isSubmitting} message={message} />
      <FormLayout
        key={formResetKey}
        title="U.S. Apostilles and Legalizations"
        country={country}
        document={document}
        onProceed={proceedToCart}
        onCart={addToCart}
        display={true}
      >
        <Grid alignItems="stretch" container spacing={2}>
          {/* Country */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CountrySelect
              label="Select or Type Country"
              value={country}
              required
              error={Boolean(fieldErrors.country)}
              helperText={fieldErrors.country || ""}
              onChange={handleCountrySelect}
            />
          </Grid>

          {/* Service */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <InputField
              label="Selected Service"
              placeholder="Please select a country"
              value={
                country?.countryTypeId == 502
                  ? "Legalization"
                  : country?.countryTypeId == 501
                    ? "Apostille"
                    : ""
              }
              slotProps={{
                input: {
                  readOnly: true,
                  sx: { fontWeight: 700 },
                },
              }}
            />
          </Grid>

          {/* Document */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <DocumentDropdown
              label="Select or Type Document"
              country={country}
              value={document}
              required
              pinnedDocTypeIds={[78, 35, 36]}
              onChange={handleDocumentSelect}
              open={dropdownOpen}
              onOpen={() => {
                if (suppressNextDocOpen) {
                  setSuppressNextDocOpen(false);
                  return;
                }
                setDropdownOpen(true);
              }}
              onClose={() => setDropdownOpen(false)}
              disabled={!country}
              error={Boolean(fieldErrors.document)}
              helperText={fieldErrors.document || ""}
            />
          </Grid>

          {/* Additional Services - single line on desktop, wraps only on mobile */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  height: 56,
                  display: "flex",
                  alignItems: "center",
                  px: 1.25,
                  "&:hover fieldset": {
                    borderColor: "rgba(0,0,0,0.12)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(0,0,0,0.12)",
                  },
                },
              }}
            >
              <InputLabel shrink>Additional Services</InputLabel>

              <OutlinedInput
                notched
                label="Additional Services"
                inputComponent={() => (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      overflowX: "auto",
                      height: "100%",
                      pl: "6px",
                    }}
                  >
                    <FormGroup
                      row
                      sx={{
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                        justifyContent: "flex-start",
                        alignItems: "center",
                        "& .MuiFormControlLabel-root": {
                          flex: "0 0 auto",
                          whiteSpace: "nowrap",
                          "& .MuiTypography-root": {
                            fontSize: "0.9rem",
                          },
                          "& .MuiCheckbox-root": {
                            transform: "scale(0.9)",
                            p: "2px",
                          },
                        },
                      }}
                    >
                      {additionalServicesState.map((service) => {
                        const tooltipText = getServiceTooltip(service);
                        const checkboxLabel = (
                          <FormControlLabel
                            key={service}
                            control={
                              <Checkbox
                                checked={additionalServices.includes(service)}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setAdditionalServices((prev) =>
                                    checked
                                      ? [...prev, service]
                                      : prev.filter((s) => s !== service),
                                  );
                                }}
                                disabled={disabled}
                              />
                            }
                            label={service}
                          />
                        );
                        return tooltipText ? (
                          <Tooltip
                            key={service}
                            title={tooltipText}
                            arrow
                            placement="top"
                          >
                            <span>{checkboxLabel}</span>
                          </Tooltip>
                        ) : (
                          checkboxLabel
                        );
                      })}
                    </FormGroup>
                  </Box>
                )}
                sx={{
                  "& .MuiOutlinedInput-input": {
                    height: "auto",
                    padding: 0,
                  },
                }}
              />
            </FormControl>
          </Grid>

          {/* Additional Details (with floating label) */}
          <Grid size={{ xs: 12, md: 12, sm: 12 }}>
            <AdditionalQuestions
              country={country}
              states={states}
              setAdditionalPreferences={handleAdditionalQuestionsChange}
              resetQuestionId={showCartConflict ? 1 : null}
              docCategoryId={document?.docCategoryId}
              error={Boolean(fieldErrors.additionalQuestions)}
              helperText={fieldErrors.additionalQuestions || ""}
            />
          </Grid>

          {/* Document Upload (takes full width on mobile, half on md+) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", width: "100%" }}>
              <DocumentUpload
                onChange={handleDocumentUpload}
                country={country}
                forceOriginalMail={forceOriginalMail}
                error={Boolean(
                  fieldErrors.uploadOption || fieldErrors.uploadDocument,
                )}
                errorText={
                  fieldErrors.uploadOption || fieldErrors.uploadDocument || ""
                }
                onInteraction={() =>
                  clearFieldErrors("uploadOption", "uploadDocument")
                }
              />
            </Box>
          </Grid>

          {/* Additional Comments */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <InputField
              label="Additional Comments"
              placeholder="Enter comments..."
              disabled={disabled}
              multiline
              minRows={9}
              onChange={(e) => setAdditionalComments(e.target.value)}
              sx={{
                height: "100%",
                "& .MuiOutlinedInput-root": {
                  height: "100%",
                  alignItems: "flex-start",
                },
                "& textarea": {
                  height: "100% !important",
                  resize: "none",
                },
              }}
            />
          </Grid>

          {/* <InfoCard
            message="Selecting Rush/Expedited as additional service will skip US Department of State authentication for Egypt & Kuwait ,UAE ,Lebanon (General document only), and Vietnam (General and Federal Government document)."
            visible={infoCardVisible}
          /> */}

          {/* Customer Reference */}
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <InputField
              label="Customer Reference"
              placeholder="Enter reference number"
              disabled={disabled}
              onChange={(e) => setCustomerReference(e.target.value)}
            />
          </Grid>

          {country && document && documentStops.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  overflow: "hidden",
                  mt: 1,
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography fontWeight={700}>Processing Steps</Typography>
                </Box>

                <Box sx={{ p: 2 }}>
                  <Box sx={{ width: "100%", overflowX: "auto", pb: 0.5 }}>
                    <Box
                      sx={{
                        minWidth: `${Math.max(routeStops.length, 4) * 120}px`,
                      }}
                    >
                      <StatusStepper
                        uniformColor={true}
                        steps={routeStops.map((stop) => ({
                          label:
                            stop.isOOS && stop.consulateName
                              ? `${getDisplayStopName(stop.stopName)} (${stop.consulateName})`
                              : getDisplayStopName(
                                  stop.description || stop.stopName,
                                ),
                        }))}
                        activeStep={Math.max(routeStops.length - 1, 0)}
                        orientation="horizontal"
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* <Modal
          open={modal.open}
          onClose={() => {
            setModal((prev) => ({ ...prev, open: false }));
            setDropdownOpen(false);
            setSuppressNextDocOpen(true);
          }}
          type={modal.type}
          title="Document Restriction"
          message={modal.message}
          confirmText="OK"
          onConfirm={() => {
            setModal((prev) => ({ ...prev, open: false }));
            setDropdownOpen(false);
            setSuppressNextDocOpen(true);
          }}
        /> */}
      </FormLayout>
    </>
  );
}











