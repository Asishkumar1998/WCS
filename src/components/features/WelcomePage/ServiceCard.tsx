import { Card, CardContent, Box, Typography, Avatar, SvgIconTypeMap } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import Image from 'next/image';
import Button from '@/components/ui/Button/Button';

interface ServiceCardProps {
    icon: string;
    title: string;
    description?: string;
    onClick?: () => void;
}

const ServiceCard = ({ icon, title, description, onClick }: ServiceCardProps) => {
    return (
        <Card
            sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid #e0e0e0',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    borderColor: '#1976d2',
                },
            }}
            onClick={onClick}
        >
            <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar
                        sx={{
                            width: 56,
                            height: 56,
                            mr: 2,
                            bgcolor: '#f5f5f5',
                            color: '#1976d2',
                        }}
                    >
                        <Image src={icon} alt='Service Image' height={50} width={50} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {description}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ServiceCard;