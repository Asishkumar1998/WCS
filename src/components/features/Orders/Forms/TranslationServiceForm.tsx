"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import InputField from "@/components/ui/Input/Input";
import FormLayout from "@/components/ui/Forms/FormLayout";
import {
  getLookup,
  postTranslationOrder,
  uploadFile,
} from "@/services/formsService";
import { FileUploadBox } from "../Common/TranslationFileUpload";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
import { getOrderDetails, getOrderIdOfCart } from "@/services/cartServices";
import { CART_SERVICE_MAP } from "@/constants/serviceMap";
import { deleteOrder } from "@/services/deleteService";
import buildTranslationPayload from "../Common/TranslationPayload";
import { getAuth } from "@/app/utils/auth";
import OverlayLoader from "@/components/ui/Loader/OverlayLoader";

type Lang = {
  lookupId: number;
  lookupType: string;
  lookupCode: string;
  lookupName: string;
};

export default function TranslationServiceForm() {
  const [languages, setLanguages] = useState<Lang[]>([]);
  const [originalLang, setOriginalLang] = useState<string>("");
  const [originalLangId, setOriginalLangId] = useState<number | null>(null);
  const [translatedLang, setTranslatedLang] = useState("");
  const [translatedLangId, setTranslatedLangId] = useState<number | null>(null);
  const [attachments, setAttachments] = useState<any>();
  const [coverLetter, setCoverLetter] = useState<any>();
  const [shippingLabel, setShippingLabel] = useState<any>();
  const [basePayload, setBasePayload] = useState<any>(null);
  const [showCartConflict, setShowCartConflict] = useState(false);
  const [existingOrderId, setExistingOrderId] = useState<number | null>(null);
  const [loader, setLoader] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [additionalComments, setAdditionalComments] = useState("");

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setUserId(auth.userId);
      setCustomerId(auth.customerId);
    }
  }, []);

  const { showSnackbar } = useSnackbar();

  const clearFieldErrors = (...keys: string[]) => {
    setFieldErrors((prev) => {
      if (keys.length === 0) return {};
      const next = { ...prev };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  };

  const fetchLanguages = async () => {
    const response = await getLookup({ lookupType: "TranslationLanguage" });
    setLanguages(response);
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const languageOptions = languages.map((l) => l.lookupName);

  const handleOriginalLangChange = (selectedName: string) => {
    if (selectedName !== "English") handleTranslatedLangChange("English");
    else handleTranslatedLangChange("");

    setOriginalLang(selectedName);
    clearFieldErrors("originalLang");
    const found = languages.find((l) => l.lookupName === selectedName);
    setOriginalLangId(found ? found.lookupId : null);
  };

  const handleTranslatedLangChange = (selectedName: string) => {
    setTranslatedLang(selectedName);
    clearFieldErrors("translatedLang");
    const found = languages.find((l) => l.lookupName === selectedName);
    setTranslatedLangId(found ? found.lookupId : null);
  };

  const translateLanguageOptions =
    originalLang === "English"
      ? languageOptions.filter((l) => l !== "English")
      : ["English"];

  async function uploadAndStore(file: any, type: any) {
    if (!file) {
      if (type === "attachments") setAttachments(undefined);
      else if (type === "coverLetter") setCoverLetter(undefined);
      else if (type === "shippingLabel") setShippingLabel(undefined);
      return;
    }
    if (type === "attachments") clearFieldErrors("attachments");

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file_0", file);

        const data = await uploadFile(formData);

        if (type === "attachments") setAttachments(data);
        else if (type === "coverLetter") setCoverLetter(data);
        else if (type === "shippingLabel") setShippingLabel(data);

        showSnackbar("Document uploaded successfully", "success");
      } catch (err) {
        console.log(err);
        showSnackbar("Error while uploading document.File size should be below 50MB", "error");
      }
    }
  }

  const submitOrder = async () => {
    const errors: Record<string, string> = {};

    if (originalLangId == null) {
      errors.originalLang = "Original Language is required";
    }
    if (translatedLangId == null) {
      errors.translatedLang = "Translated Language is required";
    }
    if (attachments == undefined) {
      errors.attachments = "Add Documents is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showSnackbar(Object.values(errors)[0], "error");
      return;
    }

    setFieldErrors({});
    setLoader(true);
    setLoaderMessage("Processing Checkout...");
    try {
      const payload = buildTranslationPayload({
        originalLangId,
        translatedLangId,
        attachments,
        coverLetter,
        shippingLabel,
        additionalComments,
      });
      await postTranslationOrder(payload);
      window.location.href = "/cart?service=translation-service";
    } catch (error) {
      showSnackbar("Failed to submit order", "error");
      console.error(error);
    } finally {
      setLoader(false);
      setLoaderMessage("");
    }
  };

  // Get the previous cart order details.
  const getCartOrder = async () => {
    try {
      setLoader(true);
      setLoaderMessage("Checking for an existing order");
      const basePayload = CART_SERVICE_MAP["translation-service"];
      if (!basePayload) {
        return <div>Invalid service selected.</div>;
      }
      const payload = {
        userId: userId,
        ...basePayload,
      };
      const orderId = await getOrderIdOfCart(payload);
      if (orderId) {
        setExistingOrderId(orderId);
        setShowCartConflict(true);
      }
      if (orderId != null) {
        const response = await getOrderDetails({ orderId: orderId });
        const orderData = response[0];
        setBasePayload(orderData);
      }
    } catch (error) {
      console.error("Error in getCartOrder:", error);
    }finally {
      setLoader(false);
      setLoaderMessage("");
    }
  };

  useEffect(() => {
    if (customerId) {
      getCartOrder();
    }
  }, [customerId]);
  
  return (
    <>
      <Dialog open={showCartConflict} disableEscapeKeyDown onClose={() => {}}>
        <DialogTitle>Order Already in Cart</DialogTitle>

        <DialogContent>
          <Typography>
            You already have an order in your cart. Please choose one of the
            options below to continue.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              window.location.href = "/cart?service=translation-service";
            }}
          >
            Go to Cart
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              await deleteOrder(existingOrderId!);
              setShowCartConflict(false);
              setExistingOrderId(null);
            }}
          >
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>
      <OverlayLoader open={loader} message={loaderMessage} />
      <FormLayout title="Translation Service" onProceed={submitOrder}>
        {/* Original + Translated Language */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Original Language"
            options={languageOptions}
            value={originalLang}
            required
            error={Boolean(fieldErrors.originalLang)}
            helperText={fieldErrors.originalLang || ""}
            onChange={handleOriginalLangChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Dropdown
            label="Translated Language"
            options={translateLanguageOptions}
            value={translatedLang}
            required
            error={Boolean(fieldErrors.translatedLang)}
            helperText={fieldErrors.translatedLang || ""}
            onChange={handleTranslatedLangChange}
            disabled={originalLang !== "English"}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FileUploadBox
            label="Add Documents"
            required
            error={Boolean(fieldErrors.attachments)}
            helperText={fieldErrors.attachments || ""}
            onSelectFile={(file) => uploadAndStore(file, "attachments")}
            fileName={attachments?.[0]?.documentName || ""}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FileUploadBox
            label="Add Cover Letter"
            onSelectFile={(file) => uploadAndStore(file, "coverLetter")}
            fileName={coverLetter?.[0]?.documentName || ""}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FileUploadBox
            label="Add Shipping Label"
            onSelectFile={(file) => uploadAndStore(file, "shippingLabel")}
            fileName={shippingLabel?.[0]?.documentName || ""}
          />
        </Grid>

        {/* Comments */}
        <Grid size={{ xs: 12, md: 6 }}>
          <InputField
            label="Additional Comments"
            placeholder="Add Additional Comments"
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            multiline
            rows={5}
            sx={{
              height: "100.1%",
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
      </FormLayout>
    </>
  );
}
