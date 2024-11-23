import { StyleSheet } from 'react-native';

const modalStyles = StyleSheet.create({

    // Contenedor principal de la aplicación
    container: {
      backgroundColor: '#90E0EF', // Color de fondo

    },
    currentDateText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: 10,
      textAlign: 'center', // Centrar el texto
    },

  
    // Espacio reservado en la parte superior
    reservedSpace: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eaeaea',
        marginTop: 50,
      },


    

    //ItenListRoutine
    listItemContainer: {
        backgroundColor: '#90E0EF', // Fondo del Swipeable
        borderRadius: 8,
        marginBottom: 0,
        overflow: 'hidden', // Evita que los bordes se desborden
      },
    listContent: {
      paddingHorizontal: 0,
      paddingBottom: 26,
    },
    routineContainer: {
        flexDirection: 'row', // Mantiene el layout en fila
        justifyContent: 'space-between', // Espacio entre los elementos
        padding: 10, // Espaciado interno
        borderBottomWidth: 1, // Línea de separación
        borderBottomColor: '#ddd', // Color de la línea de separación
        borderRadius: 10, // Bordes redondeados
        marginBottom: 10, // Espacio entre elementos
        fontWeight: 'bold',
        width: '100%', // Ancho completo
        shadowColor: '#000',
    },
    descriptionText: {
      fontSize: 12,
      color: 'black', // Color del texto de la descripción
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
   



    //Botones deslizables eliminar y editar

    
      editButton: {
        backgroundColor: '#9AC8FA', 
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 70,
        width: 60,
        marginVertical: 5,
        overflow: 'hidden',
        marginLeft: 15,
      },
      deleteButton: {
        backgroundColor: '#16367B', 
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: 70,
        width: 60,
        marginVertical: 5,
        overflow: 'hidden',
        
      },
      swipeButtonsContainer: {
        flexDirection: 'row', 
        alignItems: 'center', // Centra verticalmente los botones
        justifyContent: 'space-around', // Ajusta la separación horizontal entre botones
        height: '100%',
        paddingHorizontal: 10,
      },
      
     
    
      
      




    // Estilos para el modal
    modalContent: {
        backgroundColor: 'white', // Fondo blanco para el modal
        padding: 20,
        borderRadius: 10,
        width: '90%', // Ancho del modal al 90% de la pantalla
        maxWidth: 400, // Limitar el ancho máximo
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        zIndex: 10, 
      },
      
    
    
    
    //Segundo modal
    
    label: {
      fontSize: 18, // Tamaño de la etiqueta
      marginBottom: 5,
      flexDirection: 'row',
      
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20, // Margen inferior para el título del modal
    },
    input: {
      height: 40,
      borderColor: '#ccc', // Color del borde del input
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10, // Espaciado interno
      width: '100%', // Ancho completo
    },
    
    modalButtons: {
      flexDirection: 'row', // Disposición horizontal para botones
      justifyContent: 'space-between',
    },
    
    //Opciones de los select modals
    
    optionsContainer: {
      flexDirection: 'row', // Disposición horizontal para opciones
      flexWrap: 'wrap', // Permitir ajuste a múltiples líneas
      justifyContent: 'center', // Centrar botones
      marginVertical: 10,
      width: '100%', // Ancho completo
    },
    optionButton: {
      paddingVertical: 5, // Altura del botón de opción
      paddingHorizontal: 10, // Ancho del botón de opción
      backgroundColor: 'lightgray', // Color de fondo del botón de opción
      borderRadius: 5,
      margin: 5, // Margen alrededor de cada botón
    },
    optionButtonText: {
      textAlign: 'center', // Centrar texto en el botón de opción
    },
    selectedOptionButton: {
      backgroundColor: '#48C78E', // Color verde para selección
    },
    disabledButton: {
      backgroundColor: '#ccc', // Color gris para botón deshabilitado
    },
    
  
  
    //Estilos para seleccionar el color

    colorPickerContainer: {
        flexDirection: 'row', // Botones en fila
        justifyContent: 'space-between', // Separación uniforme
        marginVertical: 10,
      },
      
      colorButton: {
        height: 30,
        width: 30,
        borderRadius: 10, // Botones circulares
        borderWidth: 1,
        borderColor: '#ccc',
      },
      
      selectedColorButton: {
        borderWidth: 3,
        borderColor: '#000', // Indica el color seleccionado
      },
    
    
  
    // Estilos para el contenedor de repetición
    repeatContainer: {
        flexDirection: 'row', // Distribuir en fila
    justifyContent: 'space-between', // Espacio entre los elementos
    alignItems: 'center', // Alinear verticalmente al centro
    marginBottom: 15,
    },
    selectedOptionText: {
      fontSize: 16, // Tamaño del texto seleccionado
    },
    selectButton: {
      color: 'black', // Color del botón de selección
      fontSize: 16,
    },
  
    // Estilos para el botón de hora seleccionada
    timeButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        alignItems: 'center',
    },
    timeButtonText: {
        fontSize: 16,
        color: '#333',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginRight: 10,
        width: '10%',
      },
    

    //Boton para actividad SAVE
    activiyButton: {
        backgroundColor: '#16367B', // Color de fondo
        width: 228, // Ancho del botón
        height: 30, // Alto del botón
        borderRadius: 5, // Puedes ajustar esto según el diseño deseado
        justifyContent: 'center', // Centrar el contenido
        alignItems: 'center', // Centrar el contenido
        marginBottom: 5,
        alignSelf: 'center',
      },
      buttonText: {
        color: 'white', // Color del texto
        fontWeight: 'bold', // Hacer el texto más audaz
        textAlign: 'center', // Centrar texto
        fontSize: 15,
        
      },
      cancelButton: {
        backgroundColor: '#679FDB', // Color del botón de cancelar
        borderRadius: 5,
        width: 228, // Ancho del botón
        height: 30, // Alto del botón
        marginBottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        
      },
      
  });

  export default modalStyles;