"use client";

import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
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

// Users constants
const CUSTOMERID = 9682;
const USERID = 7437;

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
  const { showSnackbar } = useSnackbar();

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
    const found = languages.find((l) => l.lookupName === selectedName);
    setOriginalLangId(found ? found.lookupId : null);
  };

  const handleTranslatedLangChange = (selectedName: string) => {
    setTranslatedLang(selectedName);
    const found = languages.find((l) => l.lookupName === selectedName);
    setTranslatedLangId(found ? found.lookupId : null);
  };

  const translateLanguageOptions =
    originalLang === "English"
      ? languageOptions.filter((l) => l !== "English")
      : ["English"];

  async function uploadAndStore(file: any, type: any) {
    if (!file) return;

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file_0", file);

        const data = await uploadFile(formData);

        if (type === "attachments") setAttachments(data);
        else if (type === "coverLetter") setCoverLetter(data);
        else if (type === "shippingLabel") setShippingLabel(data);
      } catch (err) {
        console.log(err);
      }
    }
  }

  const submitOrder = async () => {
    const payload = {
      customerId: CUSTOMERID,
      orderOriginId: 611,
      orderType: 1103,
      initiatedBy: USERID,
      isUSOrigin: true,
      dockets: [
        {
          docs: [
            {
              orderOriginId: 611,
              docCategoryId: 527,
              countryId: 190,
              originCountryId: 190,
              isPostScan: true,
              translation: [
                {
                  originalLangId: originalLangId,
                  translatedLangId: translatedLangId,
                },
              ],
              attachments,
              coverLetter,
              shippingLabel,
            },
          ],
        },
      ],
    };

    if (
      originalLangId == null ||
      translatedLangId == null ||
      attachments == undefined
    ) {
      showSnackbar("Please complete all required fields", "error");
    } else {
      try {
        await postTranslationOrder(payload);
        window.location.href = "/cart?service=translation-service";
      } catch (error) {
        showSnackbar("Failed to submit order", "error");
        console.error(error);
      }
    }
  };

  return (
    <FormLayout title="Translation Service" onProceed={submitOrder}>
      {/* Original + Translated Language */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Dropdown
          label="Original Language *"
          options={languageOptions}
          value={originalLang}
          onChange={handleOriginalLangChange}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Dropdown
          label="Translated Language *"
          options={translateLanguageOptions}
          value={translatedLang}
          onChange={handleTranslatedLangChange}
          disabled={originalLang !== "English"}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <FileUploadBox
          label="Add Documents"
          required
          onSelectFile={(file) => uploadAndStore(file, "attachments")}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <FileUploadBox
          label="Add Cover Letter"
          onSelectFile={(file) => uploadAndStore(file, "coverLetter")}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <FileUploadBox
          label="Add Shipping Label"
          onSelectFile={(file) => uploadAndStore(file, "shippingLabel")}
        />
      </Grid>

      {/* Comments */}
      <Grid size={{ xs: 12, md: 6 }}>
        <InputField
          label="Additional Comments"
          placeholder="Add Additional Comments"
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
  );
}
