import { Card, CardContent, Box, Typography, Divider } from '@mui/material';

interface NewsItem {
    title: string;
    date: string;
}

const NewsSection = () => {
    const news: NewsItem[] = [
        {
            title: "WCS Processing New FDA Digital Documents, Business As Usual",
            date: "Posted Feb 20, 2024"
        },
        {
            title: "Unwrapping the Sweet Surprise: Japanese KitKats Take Center Stage",
            date: "Posted Feb 15, 2024"
        },
        {
            title: "A New Era: China and Canada Join the Apostille Treaty",
            date: "Posted Feb 10, 2024"
        }
    ];

    return (
        <Card>
            <Box sx={{
                backgroundColor: 'grey.100',
                px: 3,
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    WCS News
                </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
                {news.map((item, index) => (
                    <Box key={index}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                                {item.title}
                            </Typography>
                            <Typography variant="body2" color="secondary.main">
                                {item.date}
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