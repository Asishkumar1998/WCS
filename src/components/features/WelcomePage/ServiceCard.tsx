import { Card, CardContent, Box, Typography, Avatar, SvgIconTypeMap } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import Image, { StaticImageData } from 'next/image';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

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
                cursor: 'pointer',
                height: '100%',
                border: '1px solid',
                borderColor: 'divider'
            }}
            onClick={onClick}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar
                        sx={{
                            color: 'primary.contrastText',
                            width: 48,
                            height: 48,
                            '& svg': { fontSize: 24 }
                        }}
                    >
                        <Image alt='Service Icon' height={50} width={50} src={icon} />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {title}
                        </Typography>
                        {description && (
                            <Typography variant="body2" color="text.secondary">
                                {description}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ServiceCard;