import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { useNavigate } from 'react-router-dom';

export const ListCardServicios = ({ servicio }) => {
    const navigate = useNavigate();

    return (
        <Card 
            elevation={3} 
            sx={{ 
                height: 350, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                borderRadius: 1,
                overflow: 'hidden'
            }}
        >
            {/* Encabezado azul claro */}
            <Box 
                sx={{ 
                    backgroundColor: '#81d4fa', 
                    color: '#01579b', 
                    p: 1.5, 
                    textAlign: 'center',
                    height: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        fontWeight: 'bold', 
                        fontSize: '1rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {servicio.nombre}
                </Typography>
            </Box>

            {/* Imagen / Icono del servicio */}
            <Box 
                sx={{ 
                    height: 140, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#fafafa',
                    py: 1
                }}
            >
                {servicio.imagen_url ? (
                    <img 
                        src={servicio.imagen_url} 
                        alt={servicio.nombre} 
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
                    />
                ) : (
                    <MedicalServicesIcon sx={{ fontSize: 60, color: '#bdbdbd' }} />
                )}
            </Box>

            {/* Contenido: Descripción y Precio alineado a la derecha */}
            <CardContent sx={{ pt: 1, pb: 1, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden',
                        height: 40,
                        fontSize: '0.85rem'
                    }}
                >
                    {servicio.descripcion}
                </Typography>

                {/* Caja del precio alineada totalmente a la derecha */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#000000', fontSize: '0.95rem', textAlign: 'right' }}>
                        Precio: ₡{parseFloat(servicio.precio).toLocaleString('es-CR', { minimumFractionDigits: 0 })}
                    </Typography>
                </Box>
            </CardContent>

            {/* Pie de tarjeta con icono (i) */}
            <Box 
                sx={{ 
                    backgroundColor: '#e0e0e0', 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    px: 1, 
                    py: 0.5 
                }}
            >
                <IconButton 
                    size="small" 
                    onClick={() => navigate(`/servicios/${servicio.id_servicio}`)}
                    title="Ver detalle del servicio"
                >
                    <InfoIcon sx={{ color: '#616161', fontSize: 20 }} />
                </IconButton>
            </Box>
        </Card>
    );
};