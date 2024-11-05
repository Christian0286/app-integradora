import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, Switch } from 'react-native';

import DateTimePickerModal from "react-native-modal-datetime-picker";

interface Routine {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  repeatDays?: string; 
  selectedTime?: string;
  sendNotification?: boolean;
}

const Rutinas = () => {
  const [newRoutine, setNewRoutine] = useState('');
  const [newRoutineDescription, setNewRoutineDescription] = useState('');
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activitySelectionVisible, setActivitySelectionVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null); // Para modificación
  //repetir
  const [repeatDays, setRepeatDays] = useState<string>('Solo una vez');    
  //notificación
  const [sendNotification, setSendNotification] = useState<boolean>(false); // Nuevo estado para notificaciones
  //Fecha actual
  const [currentDate, setCurrentDate] = useState<string>(''); // Nuevo estado para la fecha actual
  const [showDaysOptions, setShowDaysOptions] = useState(false);
  //Hora
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // Estado para el picker de fecha y hora
  const [selectedTime, setSelectedTime] = useState<string>("");// Estado para la hora seleccionada

  const handleInputChange = (text: string, field: 'name' | 'description') => {
    // Expresión regular para permitir solo letras y números etc.
    const regex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]*$/;
    if (regex.test(text) || text === '') {
      if (field === 'name') {
        setNewRoutine(text);
      } else if (field === 'description') {
        setNewRoutineDescription(text);
      }
    }
  };

  


  

  const options = [
    'Salir a correr', 
    'Hacer ejercicio', 
    'Comer sano', 
    'Hacer la tarea',
    'Practicar la guitarra'
  ];
  const opDays = [
    'Solo una vez',
    'Diario',
    'Lunes-Viernes',
    'Fines de semana'
  ];

  // useEffect para obtener la fecha actual
  useEffect(() => {
    const date = new Date();
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthsOfYear = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const day = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = monthsOfYear[date.getMonth()];
    const year = date.getFullYear();

    setCurrentDate(`${day} ${dayOfMonth} de ${month}, ${year}`);
  }, []);

  // Función para agregar o editar una rutina
  const handleAddOrEditRoutine = () => {
    if (newRoutine.trim() !== '') {
      const routineData: Routine = {
        id: selectedRoutine ? selectedRoutine.id : routines.length + 1, // Mantén el mismo ID si se edita
        name: newRoutine,
        description: newRoutineDescription,
        repeatDays,
        selectedTime: selectedTime,
        sendNotification,
        completed: false,
      };
  
      if (selectedRoutine) {
        // Actualiza la rutina existente
        setRoutines(routines.map(r => (r.id === routineData.id ? routineData : r)));
      } else {
        // Agrega una nueva rutina
        setRoutines([...routines, routineData]);
      }

      resetModal(); // Reinicia el modal después de agregar o editar
    }
  };

  const handleConfirm = (date: Date) => {
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSelectedTime(formattedTime); // Actualiza con la hora seleccionada
    hideDatePicker(); // Cierra el picker
};

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  

  const resetModal = () => {
    setNewRoutine('');
    setNewRoutineDescription('');
    setRepeatDays('diario'); // Reiniciar selección de días
    setSendNotification(false); // Reiniciar estado de notificación
    setSelectedTime(""); 
    setSelectedRoutine(null);
    setModalVisible(false);
  };

  const toggleRoutineComplete = (id: number) => {
    setRoutines(
      routines.map((routine) =>
        routine.id === id ? { ...routine, completed: !routine.completed } : routine
      )
    );
  };

  const handleEditRoutine = (routine: Routine) => {
    setNewRoutine(routine.name);
    setNewRoutineDescription(routine.description);
    setRepeatDays(routine.repeatDays || ''); // Asegúrate de establecer el valor predeterminado si está vacío
    setSelectedTime(routine.selectedTime || "");
    setSendNotification(routine.sendNotification || false); // Establece el valor del switch
    setSelectedRoutine(routine);
    setModalVisible(true);
  };
  

  const handleDeleteRoutine = (id: number) => {
    setRoutines(routines.filter((routine) => routine.id !== id));
  };

  const handleOptionPress = (option: string) => {
    setSelectedOption(option);
  };


  const proceedToNextStep = () => {
    if (selectedOption) {
      if (selectedOption === 'Crear actividad personalizada') {
        setNewRoutine('');
      } else {
        setNewRoutine(selectedOption);
      }
      setActivitySelectionVisible(false);
      setModalVisible(true);
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.reservedSpace}>
        {/* Mostrar la fecha actual */}
        <Text>{currentDate}</Text>
      </View>

      <FlatList
        data={routines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.routineContainer}>
            <View>
              <Text style={{fontWeight: 'bold',fontSize: 12, textDecorationLine: item.completed ? 'line-through' : 'none' }}>
                {item.name}
              </Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>

            <View style={styles.routineActions}>
              <TouchableOpacity onPress={() => toggleRoutineComplete(item.id)}>
                <Text style={styles.checkBoxText}>{item.completed ? '✓' : '☐'}</Text>
              </TouchableOpacity>

            {/* Botones deslizables */}

              {/* Edit button */}
              <TouchableOpacity onPress={() => handleEditRoutine(item)} style={styles.actionButton}>
                <Text>Editar</Text>
              </TouchableOpacity>

              {/* Delete button */}
              <TouchableOpacity onPress={() => handleDeleteRoutine(item.id)} style={styles.actionButton}>
                <Text style={styles.deleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.activiyButton}>
        <TouchableOpacity onPress={() => setActivitySelectionVisible(true)} >
          <Text style={styles.buttonText}>Añadir nueva actividad +</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for selecting an activity */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={activitySelectionVisible}
        onRequestClose={() => resetModal()}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccione una actividad</Text>


            <TouchableOpacity
              onPress={() => handleOptionPress('Crear actividad personalizada')}
              style={[
                styles.optionButton,
                selectedOption === 'Crear actividad personalizada' && styles.selectedOptionButton,
              ]}
            >
              <Text style={styles.optionButtonText}>Crear actividad personalizada</Text>
            </TouchableOpacity>

            <View style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleOptionPress(option)}
                  style={[
                    styles.optionButton,
                    selectedOption === option && styles.selectedOptionButton,
                  ]}
                >
                  <Text style={styles.optionButtonText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={proceedToNextStep}
              disabled={!selectedOption}
              style={[
                styles.activiyButton,
                !selectedOption && styles.disabledButton,
              ]}
            >
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => resetModal()}
              style={[ styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



      {/* Modal for adding or editing a routine */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => resetModal()}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedRoutine ? 'EDITAR ACTIVIDAD' : 'AGREGAR ACTIVIDAD'}</Text>

            <TextInput
              value={newRoutine}
              onChangeText={(text) => handleInputChange(text, 'name')}
              placeholder="Agrega un titulo para la actividad..."
              style={styles.input}
              maxLength={25}
            />
            <TextInput
              value={newRoutineDescription}
              onChangeText={(text) => handleInputChange(text, 'description')}
              placeholder="Ingresa una breve descripción..."
              style={styles.input}
              maxLength={25}
            />

            {/* Campo para seleccionar días de repetición */}

            
            <View style={styles.repeatContainer}>
            <Text style={styles.label}>Repetir</Text>
    <TouchableOpacity onPress={() => setShowDaysOptions(true)}>
        <Text style={[styles.selectButton]}>
            {repeatDays ? repeatDays.replace(/_/g, ' ') : 'Seleccionar días'} {'>'}
        </Text>
    </TouchableOpacity>
</View>

{/* Opciones de días */}
{showDaysOptions && (
    <View style={styles.optionsContainer}>
        {opDays.map((option) => (
            <TouchableOpacity
                key={option}
                onPress={() => {
                    setRepeatDays(option.toLowerCase().replace(/ /g, "_")); // Actualiza el estado
                    setShowDaysOptions(false); // Cierra las opciones
                }}
                style={[
                    styles.optionButton,
                    repeatDays === option.toLowerCase().replace(/ /g, "_") && styles.selectedOptionButton,
                ]}
            >
                <Text style={styles.optionButtonText}>{option}</Text>
            </TouchableOpacity>
        ))}
    </View>
)}

        {/* Horarios de notificación */}
        
        <View style={styles.repeatContainer}>
        <Text style={styles.label}>Horario</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.timeButton}>
    <Text style={styles.timeButtonText}>
        {selectedTime ? `Seleccionar Hora: ${selectedTime}` : "Seleccionar Hora"}
    </Text>
</TouchableOpacity>

          {/* Picker para la hora */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="time"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker} // Cierra el picker
          />
    </View>


            {/* Campo de enviar notificación */}
            <View style={styles.repeatContainer}>
                <Text style={styles.label}>Enviar notificación</Text>
                <Switch
                value={sendNotification} // Enlazado al estado actual
                onValueChange={setSendNotification}// Se actualiza el estado al cambiar
                />
            </View>

            {/* Botones guardar y cancelar */}

            <TouchableOpacity 
              onPress={handleAddOrEditRoutine}
              style={styles.activiyButton}
            >
              <Text style={styles.buttonText}>Guardar Actividad</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={resetModal}
              style={[styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
    // Contenedor principal de la aplicación
    container: {
      flex: 1,
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
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eaeaea',
        marginBottom: 10,
      },



    
    

    //ItenListRoutine
    listContent: {
      paddingTop: 10, // Espaciado superior para la lista
    },
    routineContainer: {
        flexDirection: 'row', // Mantiene el layout en fila
        justifyContent: 'space-between', // Espacio entre los elementos
        padding: 10, // Espaciado interno
        borderBottomWidth: 1, // Línea de separación
        borderBottomColor: '#ddd', // Color de la línea de separación
        backgroundColor: '#5271FF', // Color de fondo
        borderRadius: 10, // Bordes redondeados
        marginBottom: 10, // Espacio entre elementos
        fontWeight: 'bold',
    },
    descriptionText: {
      fontSize: 12,
      color: 'black', // Color del texto de la descripción
    },
    routineActions: {
      flexDirection: 'row', // Disposición horizontal para acciones
      alignItems: 'center',
    },
  
    checkBoxText: {
      fontSize: 20, // Tamaño del texto para el checkbox
      marginRight: 10,
    },



    //Botones deslizables eliminar y editar

    actionButton: {
      marginLeft: 10,
      padding: 5,
      backgroundColor: '#ddd', // Color de fondo del botón de acción
      borderRadius: 5,
    },
    deleteText: {
      color: 'red', // Color rojo para el texto de eliminar
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
      },
      
    
    
    
    //Segundo modal
    
    label: {
      fontSize: 16, // Tamaño de la etiqueta
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
    },
  
    // Estilos para el botón de hora seleccionada
    timeButton: {
      marginVertical: 10, // Espaciado vertical
    },
    timeButtonText: {
      fontSize: 16, // Tamaño del texto en el botón de hora
    },

    //Boton para actividad SAVE
    activiyButton: {
        backgroundColor: '#16367B', // Color de fondo
        width: 228, // Ancho del botón
        height: 30, // Alto del botón
        borderRadius: 5, // Puedes ajustar esto según el diseño deseado
        justifyContent: 'center', // Centrar el contenido
        alignItems: 'center', // Centrar el contenido
        marginBottom: 10,
        alignSelf: 'center',
      },
      buttonText: {
        color: 'white', // Color del texto
        fontWeight: 'bold', // Hacer el texto más audaz
        textAlign: 'center', // Centrar texto
      },
      cancelButton: {
        padding: 10,
        backgroundColor: '#679FDB', // Color del botón de cancelar
        borderRadius: 5,
        width: 228, // Ancho del botón
        height: 30, // Alto del botón
        marginBottom: 5,
        justifyContent: 'center',
        alignSelf: 'center',
        
      },
      
  });
    
  export default Rutinas;

