import { UpdateItem } from "@/types";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  DialogContent,
  Dialog,
  DialogTitle,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { fetchAttachment } from "@/services/dashboardService";

const UpdatesSection = ({ updates }: { updates: UpdateItem[] }) => {
  const [selectedUpdate, setSelectedUpdate] = useState<UpdateItem | null>(null);

  const handleUpdateClick = async (update: UpdateItem) => {
    if (update?.attachment?.length > 0) {
      const response = await fetchAttachment(update.attachment[0].referenceId);
      update.attachment[0].url = response;
    }

    setSelectedUpdate(update);
  };

  return (
    <>
      <Card
        sx={{
          border: "1px solid #e0e0e0",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            borderColor: "#1976d2",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: "grey.100",
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            WCS Updates
          </Typography>
        </Box>

        {/* Content */}
        <CardContent sx={{ p: 3, overflowY: "auto", height: "35vh" }}>
          {updates.map((update, index) => (
            <Box key={index}>
              <Box
                sx={{
                  mb: 2,
                  cursor: "pointer",
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "grey.100" },
                }}
                onClick={() => handleUpdateClick(update)}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, mb: 0.5, color: "#2c3e50" }}
                >
                  {update.title}
                </Typography>
                <Typography variant="body2" color="secondary.main">
                  {dayjs(update.createdAt).format("MMM D, YYYY")}
                </Typography>
              </Box>
              {index < updates.length - 1 && <Divider sx={{ mb: 2 }} />}
            </Box>
          ))}
        </CardContent>
      </Card>
      {/* Popup Dialog */}
      <Dialog
        open={Boolean(selectedUpdate)}
        onClose={() => setSelectedUpdate(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            mt: 5,
            alignSelf: "flex-start",
          },
        }}
        
      >
        <DialogTitle
          sx={{
            backgroundColor: "#c70039",
            color: "white",
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {selectedUpdate?.title}
          <IconButton onClick={() => setSelectedUpdate(null)}>
            <CloseIcon sx={{ color: "white", fontWeight: "bold" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            mt: 1,
            maxHeight: "61vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "7px",
            },

            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "5px",
            },

            "&::-webkit-scrollbar-thumb": {
              background: "#bdbdbd",
              borderRadius: "5px",
            },

            "&::-webkit-scrollbar-thumb:hover": {
              background: "#9e9e9e",
            },
          }}
        >
          {/* Attachments */}
          {selectedUpdate && (
            <Box sx={{ mt: 1 }}>
              {selectedUpdate?.attachment?.length > 0 &&
                selectedUpdate?.attachment?.map((file, i) => (
                  <Box key={i} sx={{ mb: 1 }}>
                    <img
                      src={file.url.data}
                      title={file.fileName}
                      width="100%"
                      height="500px"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
              {/* Description */}
              <Box
                sx={{
                  mt: 1,
                  mb: 0,
                  "& a": {
                    color: "#ca012d",
                    textDecoration: "none",
                    fontWeight: 500,
                  },
                  "& a:hover": {
                    textDecoration: "none",
                    color: "#e34c4c",
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html: selectedUpdate?.description || "",
                }}
              />
            </Box>
          )}
          
        </DialogContent>
        <Divider sx={{ backgroundColor: "#c70039" }} />
          <Box
            sx={{
              mt: 1,
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              mx: 1,
              mb: 1,

              
            }}
          >
            {/* <Typography
              variant="body2"
              sx={{
                color: "gray",
                fontWeight: 500,
              }}
            >
              Published:{" "}
              {dayjs(selectedUpdate?.publishedDate).format("MMM D, YYYY")}
            </Typography> */}

            {/* Right Side */}
            <Button
              variant="outlined"
              onClick={() => setSelectedUpdate(null)}
              sx={{
                color: "#555",
                borderColor: "#ccc",
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
          </Box>
      </Dialog>
    </>
  );
};

export default UpdatesSection;
