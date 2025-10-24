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

export default function AttachmentsDialog({
  open,
  onClose,
}: {
  open: any;
  onClose: any;
}) {
  const orderId = 250249;
  const docId = 94473;

  const attachments: any = []; // mock empty
  const returnLabel = null;
  const conversationFiles = [
    { name: "Sample Document 1.txt", date: "Oct 1, 2025" },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          fontWeight: "bold",
          position: "relative",
          pr: 6,
        }}
      >
        Attachments (Order ID: {orderId})
        <Typography
          variant="subtitle2"
          sx={{ color: "white", fontWeight: 400 }}
        >
          Doc Id: {docId}
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

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Document Uploads */}
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Document Uploads
        </Typography>
        {attachments.length === 0 ? (
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
            <TableHead>
              <TableRow>
                <TableCell>File Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attachments.map((file: any, idx: any) => (
                <TableRow key={idx}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{file.date}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Download">
                      <IconButton color="primary">
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Return Shipping Label */}
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Return Shipping Label
        </Typography>
        {returnLabel ? (
          <Paper sx={{ p: 2, mb: 3 }}>{returnLabel}</Paper>
        ) : (
          <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
            >
              No Shipping Label found
            </Typography>
          </Paper>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Conversation Tab */}
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Conversation Tab
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {conversationFiles.map((file, idx) => (
              <TableRow key={idx}>
                <TableCell>{file.name}</TableCell>
                <TableCell>{file.date}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
