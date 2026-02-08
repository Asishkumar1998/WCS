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
import { getAllStops, getDocStops } from "@/services/TrackOrderService";

interface TrackOrderDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: number | null;
  docIds: number[];
  returnInstructions?: string;
}

export default function TrackOrderDialog({
  open,
  onClose,
  orderId,
  docIds,
  returnInstructions,
}: TrackOrderDialogProps) {
  const [stopsByDoc, setStopsByDoc] = useState<Record<number, any[]>>({});
  const [stops, setStops] = useState<any>([]);

  const getStops = async () => {
    const response = await getAllStops();
    setStops(response);
  };

  useEffect(() => {
    getStops();
  }, [open]);

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
                  completed: files.length > 0,
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
        {returnInstructions && (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Return Shipping Instructions:
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {returnInstructions}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
