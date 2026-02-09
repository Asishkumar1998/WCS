"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  Divider,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  getAllStops,
  getDocStops,
  getRegionNoteAddress,
} from "@/services/TrackOrderService";
import { getOrder } from "@/services/cartServices";

interface TrackOrderDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: number | null;
  docIds: number[];
  returnInstructions?: string;
  processStartByDocId?: any;
}

export default function TrackOrderDialog({
  open,
  onClose,
  orderId,
  docIds,
  processStartByDocId,
}: TrackOrderDialogProps) {
  const [stopsByDoc, setStopsByDoc] = useState<Record<number, any[]>>({});
  const [stops, setStops] = useState<any>([]);
  const [orderDetails, setOrderDetails] = useState<any>();
  const [regionAddress, setRegionAddress] = useState<any>();
  const [returnInstructions, setReturnInstructions] = useState<string | null>(
    null,
  );

  const getStops = async () => {
    const response = await getAllStops();
    setStops(response);
  };

  const getOrderDetails = async () => {
    const response = await getOrder(Number(orderId));
    setOrderDetails(response[0]);

    if (response[0].useUserCourier)
      setReturnInstructions("Use Prepaid Label Uploaded");
    if (response[0].labelByMail)
      setReturnInstructions(
        "Enclose Return Shipping Label by mail with documents",
      );
    if (response[0].pickupOrDropOff) setReturnInstructions("Pickup / Dropoff");
  };


  useEffect(() => {
    getStops();
    getOrderDetails();
  }, [open]);

  useEffect(() => {
    if (orderDetails?.regionId && orderDetails?.regionNote) {
      const fetchRegionAddress = async () => {
        const response = await getRegionNoteAddress(
          orderDetails.customerId,
          orderDetails.regionNote,
        );
        setRegionAddress(response);
      };
      fetchRegionAddress();
    }
  }, [orderDetails]);


  const stopsMap = Object.fromEntries(
    stops.map((s: any) => [s.stopId, s.stopName]),
  );

  useEffect(() => {
    if (!orderId || !docIds) {
      setStopsByDoc({});
      return;
    }

    const ids: number[] = Array.isArray(docIds)
      ? (docIds as any[]).map((d) => Number(d))
      : typeof docIds === "string"
        ? (docIds as string).split(",").map((s) => Number(s.trim()))
        : [Number(docIds)];

    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              const files = await getDocStops({
                docId: id,
              });
              return { id, files: Array.isArray(files) ? files : [] };
            } catch {
              return { id, files: [] };
            }
          }),
        );

        if (cancelled) return;

        const map: Record<number, any[]> = {};
        results.forEach((r) => {
          map[r.id] = r.files;
        });

        setStopsByDoc(map);
      } catch {
        if (!cancelled) {
          setStopsByDoc({});
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId, JSON.stringify(docIds)]);

  const resetStates = () => {
    setStopsByDoc({});
    setStops([]);
    setOrderDetails(undefined);
    setRegionAddress(undefined);
    setReturnInstructions(null);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetStates();
        onClose();
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          fontWeight: "bold",
          mb: 4,
          position: "relative",
          pr: 6,
        }}
      >
        Track Details (Order ID: {orderId})
        <Typography
          variant="subtitle2"
          sx={{ color: "white", fontWeight: 400 }}
        >
          Doc Id: {docIds}
        </Typography>
        {/* Close Icon */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ py: 3 }}>
        {/* Stepper */}
        {Object.keys(stopsByDoc).length === 0 ? (
          <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
            >
              No attachments found
            </Typography>
          </Paper>
        ) : (
          <Box>
            {Object.entries(stopsByDoc).map(([docId, files]) => {
              const baseSteps = [
                {
                  label: "Order Placed",
                  date:
                    new Date(files[0]?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) || "",
                  description: "",
                  completed: true,
                  isBase: true,
                },
                {
                  label: "Process Started",
                  date:
                    new Date(files[0]?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) || "",
                  description: "",
                  completed: processStartByDocId[docId] === "" ? false : true,
                  isBase: true,
                },
              ];

              const dynamicSteps = files.map((details: any) => ({
                label: stopsMap[details.stopId] || `Stop ${details.stopNumber}`, // Will be replaced with API call later
                date: "",
                description: details.processDays
                  ? `Est. Processing time: ${details.processDays} days`
                  : "",
                completed: details.docStopStatusId !== 0, // 0 = pending, other values = completed
                stopId: details.stopId,
                stopNumber: details.stopNumber,
                docStopStatusId: details.docStopStatusId,
                isBase: false,
              }));

              const finalStep = {
                label: "Shipped / Completed",
                date: files.at(-1)?.estReceiveBackDate || "",
                description: "",
                completed: false,
                isBase: true,
              };

              const allSteps = [...baseSteps, ...dynamicSteps, finalStep];

              // Calculate active step (first incomplete step)
              const activeStepIndex = allSteps.findIndex(
                (step) => !step.completed,
              );
              // If all completed, show as complete (activeStep = allSteps.length)
              const activeStep =
                activeStepIndex === -1 ? allSteps.length : activeStepIndex;

              return (
                <React.Fragment key={docId}>
                  <Typography variant="caption" color="text.secondary">
                    Doc Id: {docId}
                  </Typography>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {allSteps.map((step, idx) => (
                      <Step key={idx} completed={step.completed}>
                        <StepLabel>
                          <Typography fontWeight="bold">
                            {step.label}
                          </Typography>
                          {step.date && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(step.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </Typography>
                          )}
                          {step.description && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {step.description}
                            </Typography>
                          )}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  {/* Divider between multiple docs */}
                  {Object.keys(stopsByDoc).length > 1 && <Box sx={{ my: 3 }} />}
                </React.Fragment>
              );
            })}
          </Box>
        )}
        <Divider sx={{ my: 3 }} />

        {/* Return Shipping Instructions */}
        {(regionAddress || returnInstructions) && (
          <Box>
            {/* Heading */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Return Shipping Instructions:
            </Typography>

            {/* 1️⃣ Priority → Return Address */}
            {regionAddress ? (
              <Box>
                <Typography variant="body2" ml={1}>
                  {" "}
                  • Use WCS Courier Account for additional fee.{" "}
                </Typography>
                <Typography variant="body2" ml={3}>
                  <strong>Return Address:</strong>
                  <br />
                  {regionAddress.regContactName}, {regionAddress.regAddress},{" "}
                  {regionAddress.regCity}, {regionAddress.regCountry}{" "}
                  {regionAddress.regPostalCode}.<br />
                  Phone: {regionAddress.regPhoneNumber} | Email:{" "}
                  {regionAddress.emailAddress}
                </Typography>
              </Box>
            ) : (
              /* 2️⃣ Fallback → Return Instructions */
              <Typography variant="body2" ml={2}>
                {returnInstructions}
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
