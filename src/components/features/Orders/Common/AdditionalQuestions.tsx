import Dropdown from "@/components/ui/Dropdown/Dropdown";
import ToolTip from "@/components/ui/Tooltip/Tooltip";
import ADDITIONAL_QUESTION_COUNTRY_MAP from "@/dataset/additionalQuesWithCountryMap";
import { ADDITIONAL_QUESTIONS } from "@/dataset/constants/constants";
import { AdditionalQuestionsComponent } from "@/types";
import { InfoOutlined } from "@mui/icons-material";
import {
  Box,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Grid,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Typography,
  IconButton,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

const INPUT_MAP: any = {
  3: ["Yes", "No"],
  7: ["Corporate", "Personal"],
  14: ["LOA", "POA"],
};

const GENERAL_CATEGORY_ID = 522;
const FEDERAL_CATEGORY_ID = 521;

export const AdditionalQuestions = ({
  country,
  states,
  setAdditionalPreferences,
  resetQuestionId,
  docCategoryId,
  error = false,
  helperText = "",
}: AdditionalQuestionsComponent & {
  resetQuestionId?: number | null;
  docCategoryId?: number | null;
  error?: boolean;
  helperText?: string;
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const countryTypeName = String((country as any)?.countryTypeName ?? "")
    .trim()
    .toLowerCase();
  const isHagueCountry =
    Number(country?.countryTypeId) === 501 || countryTypeName === "hague";

  const resolvedQuestions = useMemo(() => {
    const ids = ADDITIONAL_QUESTION_COUNTRY_MAP[country?.countryId] ?? [];

    return ids.map((id: number) => ({
      id,
      text: (ADDITIONAL_QUESTIONS[id].text ?? "(missing question)").replace(
        /<countryName>/g,
        country?.countryShortName ?? "",
      ),
      subText: (ADDITIONAL_QUESTIONS[id].subText || "").replace(
        /<countryName>/g,
        country?.countryShortName ?? "",
      ),
    }));
  }, [country?.countryId, country?.countryShortName]);

  const setPreferences = (questionId: number, answer: string) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: answer };

      const finalArray = Object.entries(updated).map(([id, a]) => ({
        questionId: Number(id),
        answer: a,
      }));

      setAdditionalPreferences(finalArray);
      return updated;
    });
  };

  useEffect(() => {
    if (resetQuestionId) {
      setAnswers((prev) => {
        const updated = { ...prev };
        delete updated[resetQuestionId];
        return updated;
      });
    }
  }, [resetQuestionId]);

  const stateOptions = useMemo(() => states?.map((s) => s.stateName), [states]);

  const visibleQuestions = useMemo(() => {
    return resolvedQuestions.filter((q) => {

      if (docCategoryId === GENERAL_CATEGORY_ID) {
        return [1, 2, 15, 8, 12].includes(q.id);
      }


      if (docCategoryId === FEDERAL_CATEGORY_ID) {
        return [8, 12].includes(q.id);
      }

      return false;
    });
  }, [resolvedQuestions, docCategoryId]);

  if (
    docCategoryId !== GENERAL_CATEGORY_ID &&
    docCategoryId !== FEDERAL_CATEGORY_ID
  ) {
    return null;
  }

  if (!visibleQuestions.length) return null;

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth variant="outlined" error={error}>
          <InputLabel
            shrink
            sx={{
              px: 0.5,
              borderRadius: 0.5,
              backgroundColor: "background.paper",
            }}
          >
            Additional Details *
          </InputLabel>

          <OutlinedInput
            notched
            label="Additional Details *"
            error={error}
            inputComponent={() => (
              <Box sx={{ py: 1, width: "100%" }}>
                {visibleQuestions.map(
                  (
                    {
                      text,
                      subText,
                      id,
                    }: { text: string; subText: string; id: number },
                    index: number,
                  ) => {
                    const options = INPUT_MAP[id] ?? ["Yes", "No"];

                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 2,
                          py: 0.5,
                          px: 1.2,
                          minHeight: 40, // compact line
                          width: "100%",
                        }}
                      >
                        {/* Question + Tooltip */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: "#333",
                              fontSize: "0.95rem",
                              mr: 0.5,
                              overflow: "hidden",
                            }}
                            title={text}
                          >
                            {text}
                          </Typography>

                          {subText ? (
                            <ToolTip title={subText} arrow placement="right">
                              <IconButton
                                size="small"
                                sx={{ p: 0.3 }}
                                aria-label={`info-${id}`}
                              >
                                <InfoOutlined
                                  fontSize="small"
                                  sx={{ color: "#555" }}
                                />
                              </IconButton>
                            </ToolTip>
                          ) : null}
                        </Box>

                        {/* Answers */}
                        <Box
                          sx={{ width: { xs: "50%", sm: "35%", md: "30%" } }}
                        >
                          {id === 1 ? null : id === 2 ? (
                            /* Question 2 → State Dropdown */
                            // <FormControl
                            //   fullWidth
                            //   size="small"
                            //   sx={{ alignItems: "flex-end" }}
                            // >
                            //   <OutlinedInput
                            //     label="Select State"
                            //     value={answers[id] ?? ""}
                            //     onChange={(e: any) =>
                            //       setPreferences(id, e.target.value)
                            //     }
                            //     style={{
                            //       width: "73%",
                            //     }}
                            //     inputComponent={() => (
                            //       <select
                            //         title="Select State"
                            //         value={answers[id] ?? ""}
                            //         onChange={(e) =>
                            //           setPreferences(id, e.target.value)
                            //         }
                            //         style={{
                            //           width: "100%",
                            //           height: 32,
                            //           borderRadius: 4,
                            //         }}
                            //       >
                            //         <option value="" disabled>
                            //           Select State
                            //         </option>
                            //         {states.map((state) => (
                            //           <option
                            //             key={state.stateId}
                            //             value={state.stateId}
                            //           >
                            //             {state.stateName}
                            //           </option>
                            //         ))}
                            //       </select>
                            //     )}
                            //   />
                            // </FormControl>
                            <Dropdown
                              label="Select State"
                              options={stateOptions}
                              value={
                                states.find(
                                  (s) =>
                                    String(s.stateId) === String(answers[id]),
                                )?.stateName || ""
                              }
                              onChange={(selectedName: string) => {
                                const selectedState = states.find(
                                  (s) => s.stateName === selectedName,
                                );
                                if (selectedState) {
                                  setPreferences(
                                    id,
                                    String(selectedState.stateId),
                                  );
                                }
                              }}
                              required={!isHagueCountry}
                            />
                          ) : id === 12 ? (
                            <FormControl fullWidth size="small">
                              <OutlinedInput
                                value={answers[id] ?? ""}
                                onChange={(e) =>
                                  setPreferences(id, e.target.value)
                                }
                                sx={{
                                  height: 32,
                                  fontSize: "0.9rem",
                                }}
                              />
                            </FormControl>
                          ) : (
                            /* All Other Questions → Radios */
                            <RadioGroup
                              row
                              value={answers[id] ?? ""}
                              onChange={(e: any) =>
                                setPreferences(id, e.target.value)
                              }
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                gap: 1,
                              }}
                            >
                              <FormControlLabel
                                value={options[0]}
                                control={<Radio size="small" />}
                                label={options[0]}
                                sx={{
                                  ".MuiFormControlLabel-label": {
                                    fontSize: "0.9rem",
                                  },
                                  width: "90px",
                                }}
                              />

                              <FormControlLabel
                                value={options[1]}
                                control={<Radio size="small" />}
                                label={options[1]}
                                sx={{
                                  ".MuiFormControlLabel-label": {
                                    fontSize: "0.9rem",
                                  },
                                }}
                              />
                            </RadioGroup>
                          )}
                        </Box>
                      </Box>
                    );
                  },
                )}
              </Box>
            )}
          />
          {error && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default AdditionalQuestions;
