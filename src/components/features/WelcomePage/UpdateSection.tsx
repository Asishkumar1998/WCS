import { Card, CardContent, Box, Typography, Divider } from '@mui/material';

interface UpdateItem {
    title: string;
    date: string;
}

const UpdatesSection = () => {
    const updates: UpdateItem[] = [
        {
            title: "Electronic Export Documents - CFG, COE, EPL",
            date: "Posted Aug 10, 2023"
        },
        {
            title: "New Test Processing Updates",
            date: "Posted Aug 10, 2023"
        },
        {
            title: "Test Heading 10th Aug 2023",
            date: "Posted Aug 10, 2023"
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
                    WCS Updates
                </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
                {updates.map((update, index) => (
                    <Box key={index}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                                {update.title}
                            </Typography>
                            <Typography variant="body2" color="secondary.main">
                                {update.date}
                            </Typography>
                        </Box>
                        {index < updates.length - 1 && <Divider sx={{ mb: 2 }} />}
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
};

export default UpdatesSection;