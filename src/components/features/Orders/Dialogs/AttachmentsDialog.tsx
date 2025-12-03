import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Divider,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import {
  getAttachments,
  getConversationAttachments,
  getShippingDetails,
} from "@/services/formsService";
import React from "react";
import axios from "axios";

export default function AttachmentsDialog({
  open,
  onClose,
  orderId,
  docIds,
}: {
  open: any;
  onClose: any;
  orderId: number | null;
  docIds: any;
}) {
  const [attachmentsByDoc, setAttachmentsByDoc] = useState<
    Record<number, any[]>
  >({});
  const [shippingDetailsByDoc, setShippingDetailsByDoc] = useState<
    Record<number, any[]>
  >({});
  const [conversationAttachments, setConversationAttachments] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);

  useEffect(() => {
    if (!orderId || !docIds) {
      setAttachmentsByDoc({});
      setAttachments([]);
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
              const files = await getAttachments({
                orderId: orderId,
                docId: id,
              });
              return { id, files: Array.isArray(files) ? files : [] };
            } catch {
              return { id, files: [] };
            }
          })
        );

        if (cancelled) return;

        const map: Record<number, any[]> = {};
        results.forEach((r) => {
          map[r.id] = r.files;
        });

        setAttachmentsByDoc(map);
        // flattened list (optionally include docId on each file)
        setAttachments(
          results.flatMap((r) =>
            r.files.map((f: any) => ({ ...(f || {}), docId: r.id }))
          )
        );
      } catch {
        if (!cancelled) {
          setAttachmentsByDoc({});
          setAttachments([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId, JSON.stringify(docIds)]);

  useEffect(() => {
    if (!orderId || !docIds) {
      setShippingDetailsByDoc({});
      // setAttachments([]);
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
              const files = await getShippingDetails({
                docId: id,
              });
              return { id, files: Array.isArray(files) ? files : [] };
            } catch {
              return { id, files: [] };
            }
          })
        );

        if (cancelled) return;

        const map: Record<number, any[]> = {};
        results.forEach((r) => {
          map[r.id] = r.files;
        });

        setShippingDetailsByDoc(map);
      } catch {
        if (!cancelled) {
          setShippingDetailsByDoc({});
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId, JSON.stringify(docIds)]);

  const fetchConversationAttachments = async () => {
    const response = await getConversationAttachments({ orderId: orderId });
    setConversationAttachments(response);
  };
  useEffect(() => {
    fetchConversationAttachments();
  }, [orderId]);

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

  const downloadShippingLabel = async (shippingLabel: {
    shippingLabelId: string;
    fileName: string;
  }) => {
    try {
      const url = `https://wcsstestserver.azurewebsites.net/api/v1/shippingLabelattachments/${shippingLabel.shippingLabelId}`;
      // Comment out the below code once the backend change are deployed.
      // const response = await axiosInstance.get(url, { responseType: "blob" });

      //Comment in the below code once the backend changes are deployed.
      //The API is directly called within this function because Blob does not allow access to files via a localhost URL.
      const response = await axios.get(url, { responseType: "blob" });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = shippingLabel.fileName;
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.log("Download error: ", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setAttachmentsByDoc({});
        setAttachments([]);
        onClose();
      }}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          fontWeight: "bold",
          position: "relative",
          pr: 6,
        }}
      >
        Attachments (Order ID: {orderId}){/* Close Icon */}
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

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Document Uploads */}
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Document Uploads
        </Typography>
        {Object.keys(attachmentsByDoc).length === 0 ? (
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
          <Table size="small" sx={{ mb: 3 }}>
            <TableBody>
              {Object.entries(attachmentsByDoc).map(([docId, files]) => {
                const filteredFiles = (files || []).filter(
                  (f: any) => Number(f?.referenceId) === 0
                );
                if (filteredFiles.length === 0)
                  return (
                    <>
                      {" "}
                      <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontStyle="italic"
                        >
                          No Attachments found.
                        </Typography>
                      </Paper>{" "}
                    </>
                  );

                return (
                  <React.Fragment key={docId}>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="caption" color="text.secondary">
                          Doc ID: {docId}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {filteredFiles.map((file: any, idx: any) => (
                      <TableRow key={`file-${docId}-${idx}`}>
                        <TableCell>{file.fileName}</TableCell>
                        <TableCell>
                          {new Date(file.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Download">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                downloadAttachments({
                                  attachmentId:
                                    file.attachmentId ?? file.id ?? "",
                                  fileName:
                                    file.fileName ?? file.name ?? "download",
                                })
                              }
                              disabled={!file?.attachmentId && !file?.id}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Return Shipping Label */}
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Return Shipping Label
        </Typography>
        {Object.keys(shippingDetailsByDoc).length === 0 ||
        Object.values(shippingDetailsByDoc).every(
          (files) => files.length === 0
        ) ? (
          <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
            >
              No Shipping Label found.
            </Typography>
          </Paper>
        ) : (
          <Table size="small" sx={{ mb: 3 }}>
            <TableBody>
              {Object.entries(shippingDetailsByDoc).map(([docId, files]) => (
                <React.Fragment key={docId}>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="caption" color="text.secondary">
                        Doc ID: {docId}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {files.map((details: any, idx: any) => {
                    const file = details.shippingLabel;
                    return (
                      <TableRow key={`file-${docId}-${idx}`}>
                        <TableCell>
                          {(file.blobName || "").split("_").pop()}
                        </TableCell>
                        <TableCell>
                          {new Date(file.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Download">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                downloadShippingLabel({
                                  shippingLabelId:
                                    file.shippingLabelId ?? file.id ?? "",
                                  fileName:
                                    (file.blobName || "").split("_").pop() ??
                                    file.name ??
                                    "download",
                                })
                              }
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Conversation Tab */}
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Conversation Tab
        </Typography>
        {conversationAttachments.length === 0 ? (
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
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>File Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {conversationAttachments.map((file, idx) => (
                <TableRow key={idx}>
                  <TableCell>{file.fileName}</TableCell>
                  <TableCell>
                    {new Date(file.modifiedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Download">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          downloadAttachments({
                            attachmentId: file.attachmentId ?? file.id ?? "",
                            fileName: file.fileName ?? file.name ?? "download",
                          })
                        }
                        disabled={!file?.attachmentId && !file?.id}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
