import { NewsItem } from "@/types";
import { Card, CardContent, Box, Typography, Divider } from "@mui/material";

const NewsSection = ({ news }: { news: NewsItem[] }) => {
  return (
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
          WCS News
        </Typography>
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 3, overflowY: "auto", height: "35vh" }}>
        {news?.map((item, index) => (
          <Box key={index}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, mb: 0.5, color: "#2c3e50" }}
              >
                {item.title.rendered}
              </Typography>
              <Typography variant="body2" color="secondary.main">
                {item.modified}
              </Typography>
            </Box>
            {index < news.length - 1 && <Divider sx={{ mb: 2 }} />}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default NewsSection;
