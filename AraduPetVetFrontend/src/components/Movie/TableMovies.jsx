/* eslint-disable no-unused-vars */
//https://mui.com/material-ui/react-table/#sorting-amp-selecting
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useEffect } from 'react';
import MovieService from '../../services/MovieService';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

//Ordenar descendente
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
//Comparar para ordenar
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

//Ordenar estable
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);//Agrega el índice original a cada elemento para mantener el orden estable
  stabilizedThis.sort((a, b) => {//Ordena usando el comparador, y si son iguales, usa el índice original para mantener el orden estable
    const order = comparator(a[0], b[0]);//Compara los elementos sin el índice
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

//Encabezados de la tabla
const headCells = [
  {
    id: 'title', 
    numeric: false,
    disablePadding: true,
    label: 'Título',
  },
  {
    id: 'year',
    numeric: false,
    disablePadding: false,
    label: 'Año',
  },
  {
    id: 'time',
    numeric: false,
    disablePadding: false,
    label: 'Minutos',
  },
  {
    id: 'detail',
    numeric: false,
    disablePadding: false,
    label: 'Detalle',
  },
];
//Encabezado tabla
function TableMoviesHead(props) {
  const { order, orderBy, numSelected, rowCount, onRequestSort } = props;//Desestructuración de las propiedades recibidas
  const createSortHandler = (property) => (event) => {//Función para manejar el evento de ordenamiento, recibe la propiedad por la cual se va a ordenar
    onRequestSort(event, property);//Llama a la función de ordenamiento recibida por las propiedades, pasando el evento y la propiedad por la cual se va a ordenar
  };
//Renderiza el encabezado de la tabla, con un botón para crear una nueva película, y los encabezados de las columnas con la funcionalidad de ordenamiento
  return (
    // Encabezado de la tabla, con un botón para crear una nueva película, y los encabezados de las columnas con la funcionalidad de ordenamiento
    <TableHead>
      <TableRow>
        <TableCell>
          <Tooltip title="Crear">
            <IconButton component={Link} to="/movie/crear/">
              <AddIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
//Propiedades Encabezado tabla
TableMoviesHead.propTypes = {
  numSelected: PropTypes.number.isRequired,//Número de filas seleccionadas, requerido y debe ser un número
  onRequestSort: PropTypes.func.isRequired,//Función para manejar el evento de ordenamiento, requerida y debe ser una función
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,//Orden de ordenamiento, requerido y debe ser 'asc' o 'desc'
  orderBy: PropTypes.string.isRequired,//Propiedad por la cual se ordena, requerida y debe ser una cadena
  rowCount: PropTypes.number.isRequired,//Número total de filas, requerido y debe ser un número
};
//Barra de opciones
function TableMoviesToolbar(props) {
  const { numSelected } = props;//Número de filas seleccionadas, desestructurado de las propiedades recibidas
  const { idSelected } = props;//ID de la película seleccionada, desestructurado de las propiedades recibidas
  const navigate = useNavigate();//Hook para navegar entre rutas
  const update = () => {//Función para manejar el evento de actualización, navega a la ruta de actualización de la película seleccionada
    return navigate(`/movie/update/${idSelected}`);//Navega a la ruta de actualización de la película seleccionada
  };
  //Renderiza la barra de opciones, mostrando el número de filas seleccionadas, y los botones de borrar y actualizar si hay filas seleccionadas, o el botón de filtrar si no hay filas seleccionadas
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Mantenimiento Peliculas
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          <Tooltip title="Borrar">
            <IconButton>
              <DeleteIcon key={idSelected} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Actualizar">
            <IconButton onClick={update}>
              <EditIcon key={idSelected} />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
//Propieades Barra de opciones
TableMoviesToolbar.propTypes = {//Definición de las propiedades esperadas por el componente, con sus tipos y si son requeridas o no
  numSelected: PropTypes.number.isRequired,//Número de filas seleccionadas, requerido y debe ser un número
  idSelected: PropTypes.number.isRequired,//ID de la película seleccionada, requerido y debe ser un número
};
//Componente tabal
export default function TableMovies() {
  //Datos a cargar en la tabla
  const [data, setData] = useState({});//Resultado de consumo del API, respuesta

  const [error, setError] = useState('');//Error del API
  const [loaded, setLoaded] = useState(false);//Booleano para establecer sí se ha recibido respuesta
  //Llamar al API y obtener la lista de peliculas
   useEffect(() => {
    MovieService.getMovies()//Llamar al servicio para obtener las peliculas
      .then((response) => {//Mostrar la respuesta en consola, almacenar la respuesta en el estado, almacenar el error en el estado, y marcar como cargado
        console.log(response);//Mostrar la respuesta en consola
        setData(response.data);//Almacenar la respuesta en el estado
        setError(response.error);//Almacenar el error en el estado
        setLoaded(true);//Marcar como cargado
      })
      .catch((error) => {//Mostrar el error en consola, almacenar el error en el estado, y en caso de error de sintaxis, establecer el error y marcar como no cargado
        if (error instanceof SyntaxError) {//En caso de error de sintaxis, establecer el error y marcar como no cargado
          setError(error);//Almacenar el error en el estado
          console.log(error);//Mostrar el error en consola
          setLoaded(false);//En caso de error de sintaxis, establecer el error y marcar como no cargado
          throw new Error('Respuesta no válida del servidor');//En caso de error de sintaxis, lanzar un nuevo error con un mensaje personalizado
        }
      });
  }, []);
  const [order, setOrder] = React.useState('asc');//Orden de ordenamiento, 'asc' o 'desc'
  const [orderBy, setOrderBy] = React.useState('year');//Propiedad por la cual se ordena, inicialmente 'year'
  const [selected, setSelected] = React.useState([]);//Filas seleccionadas, inicialmente vacío
  const [page, setPage] = React.useState(0);//Página actual, inicialmente 0
  const [dense, setDense] = React.useState(false);//Densidad de la tabla, inicialmente false
  const [rowsPerPage, setRowsPerPage] = React.useState(5);//Número de filas por página, inicialmente 5

  const handleRequestSort = (event, property) => {//Función para manejar el evento de ordenamiento, recibe el evento y la propiedad por la cual se va a ordenar
    const isAsc = orderBy === property && order === 'asc';//Determina si el nuevo orden es ascendente o descendente, comparando la propiedad por la cual se ordena actualmente con la nueva propiedad, y el orden actual
    setOrder(isAsc ? 'desc' : 'asc');//Actualiza el estado del orden, si el nuevo orden es ascendente, cambia a descendente, y viceversa
    setOrderBy(property);//Actualiza el estado de la propiedad por la cual se ordena, con la nueva propiedad recibida
  };
  //Seleccionar solo un elemento de la tabla
  const handleClick = (event, name) => {//Función para manejar el evento de selección de una fila, recibe el evento y el nombre (ID) de la fila seleccionada
    let newSelected = [name];//Crea un nuevo array con el nombre (ID) de la fila seleccionada, para seleccionar solo un elemento
    const selectedIndex = selected.indexOf(name);//Busca el índice de la fila seleccionada en el array de filas seleccionadas, para determinar si ya está seleccionada o no
    
    if (selectedIndex === 0) {//Si la fila seleccionada es la primera en el array de filas seleccionadas, significa que ya está seleccionada, por lo que se deselecciona dejando el array vacío
      newSelected = [];
    } 
    setSelected(newSelected);
  };
  //Cambiar de página
  const handleChangePage = (event, newPage) => {//Función para manejar el evento de cambio de página, recibe el evento y el número de la nueva página
    setPage(newPage);
  };
  //Cambiar cantidad de filas por página
  const handleChangeRowsPerPage = (event) => {//Función para manejar el evento de cambio de cantidad de filas por página, recibe el evento
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //Cambiar densidad
  const handleChangeDense = (event) => {//Función para manejar el evento de cambio de densidad, recibe el evento
    setDense(event.target.checked);
  };
//Determina si una fila está seleccionada, recibe el nombre (ID) de la fila y verifica si está en el array de filas seleccionadas
  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Evita un salto de diseño al llegar a la última página con datos vacíos.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;


  if (!loaded) return <p>Cargando...</p>;//Si no se ha cargado, mostrar mensaje de carga
  if (error) return <p>Error: {error.message}</p>;//Si hay un error, mostrar mensaje de error
//Renderiza la tabla de películas, con el encabezado, el cuerpo con las filas de datos, y la paginación, además de un switch para cambiar la densidad de la tabla
  return (
    <>
    {/* Renderiza la tabla de películas, con el encabezado, el cuerpo con las filas de datos, y la paginación, además de un switch para cambiar la densidad de la tabla */}
      {data && data.length > 0 && (
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <TableMoviesToolbar
              numSelected={selected.length}
              idSelected={Number(selected[0]) || 0}
            />
            {/* Renderiza la tabla de películas, con el encabezado, el cuerpo con las filas de datos, y la paginación */}
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
              >
                {/* Renderiza el encabezado de la tabla, con un botón para crear una nueva película, y los encabezados de las columnas con la funcionalidad de ordenamiento */}
                <TableMoviesHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={data.length}
                />
                {/* Renderiza el cuerpo de la tabla, con las filas de datos, y la funcionalidad de selección de filas, además de un botón para ver el detalle de cada película en cada fila */}
                <TableBody>
                  {stableSort(data, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;
                    // Renderiza cada fila de la tabla, con la funcionalidad de selección, y un botón para ver el detalle de cada película en cada fila
                      return (
                        //  Renderiza cada fila de la tabla, con la funcionalidad de selección, y un botón para ver el detalle de cada película en cada fila
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          sx={{ cursor: 'pointer' }}
                        >
                             {/* Renderiza la celda de selección, con un checkbox para seleccionar la fila, y el contenido de la tabla con los datos de cada película, además de un botón para ver el detalle de cada película en cada fila */}
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>
                        {/* Contenido de la tabla */}
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="data"
                            padding="none"
                          >
                            {row.title}
                          </TableCell>
                          <TableCell align="left">{row.year}</TableCell>
                          <TableCell align="left">{row.time}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Ver detalle">
                            <IconButton
                                component={Link}
                                to={`/movie/${row.id}`}
                                color="primary"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <VisibilityIcon />
                            </IconButton>
                            </Tooltip>
                        </TableCell>
                        {/* Contenido de la tabla */}
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={5} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Paginación */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count} página(s)`
              }
            />
             {/* Paginación */}
          </Paper>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Espaciado"
          />
        </Box>
      )}
    </>
  );
}
