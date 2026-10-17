import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { Info, Inventory2 } from '@mui/icons-material';
import PropTypes from 'prop-types';

ListCardProductos.propTypes = {
    data: PropTypes.array.isRequired,
};

export function ListCardProductos({ data }) {
    return (
        <Grid container spacing={3} sx={{ py: 2 }}>
            {data.map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id_producto}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

                        <CardHeader
                            sx={{
                                backgroundColor: (theme) => theme.palette.secondary.main,
                                color: (theme) => theme.palette.common.white,
                                textAlign: 'center',
                                py: 0.5,
                                px: 1,
                                minHeight: 38,
                                '& .MuiCardHeader-title': {
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    lineHeight: 1.2,
                                },
                            }}
                            title={item.nombre}
                        />


                        {item.imagen_url ? (
                            <CardMedia
                                component="img"
                                height="220"
                                image={item.imagen_url}
                                alt={item.nombre}
                                sx={{ objectFit: 'contain', p: 2 }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    height: 220,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    bgcolor: 'action.hover',
                                }}
                            >
                                <Inventory2 sx={{ fontSize: 70, color: 'text.disabled' }} />
                            </Box>
                        )}

                        <CardContent
                            sx={{
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                px: 2,
                                py: 1.5,
                            }}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontSize: '0.8rem',
                                    textAlign: 'left',
                                    width: '100%',
                                }}
                            >
                                Marca: {item.marca || 'No especificada'}
                            </Typography>


                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    textAlign: 'right',
                                    mt: 'auto',
                                    pt: 2,
                                }}
                            >
                                Precio: {Number(item.precio).toFixed(2)}
                            </Typography>
                        </CardContent>

                        <CardActions
                            sx={{
                                backgroundColor: (theme) => theme.palette.action.focus,
                            }}
                        >
                            <IconButton
                                component={Link}
                                to={`/productos/${item.id_producto}`}
                                aria-label={`Ver detalle de ${item.nombre}`}
                                sx={{ ml: 'auto' }}
                            >
                                <Info />
                            </IconButton>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
