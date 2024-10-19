import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Routine {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  repeatDays?: string; // Campo opcional para los días de repetición
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
  const [repeatDays, setRepeatDays] = useState<string>('Solo una vez');    
  const [sendNotification, setSendNotification] = useState<boolean>(false); // Nuevo estado para notificaciones
  const [currentDate, setCurrentDate] = useState<string>(''); // Nuevo estado para la fecha actual
  const [showDaysOptions, setShowDaysOptions] = useState(false);

  const handleInputChange = (text: string, field: 'name' | 'description') => {
    // Expresión regular para permitir solo letras y números, incluyendo caracteres acentuados y Ñ
    const regex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ]*$/;
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
        sendNotification,
        completed: false,
      };
  
      if (selectedRoutine) {
        // Modificar rutina existente
        setRoutines(
          routines.map((routine) =>
            routine.id === selectedRoutine.id ? { ...routineData } : routine
          )
        );
      } else {
        // Agregar nueva rutina
        setRoutines([...routines, routineData]);
      }
      resetModal();
    }
  };
  

  const resetModal = () => {
    setNewRoutine('');
    setNewRoutineDescription('');
    setRepeatDays('diario'); // Reiniciar selección de días
    setSendNotification(false); // Reiniciar estado de notificación
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
              <Text style={{ textDecorationLine: item.completed ? 'line-through' : 'none' }}>
                {item.name}
              </Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>

            <View style={styles.routineActions}>
              <TouchableOpacity onPress={() => toggleRoutineComplete(item.id)}>
                <Text style={styles.checkBoxText}>{item.completed ? '✓' : '☐'}</Text>
              </TouchableOpacity>

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

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => setActivitySelectionVisible(true)} style={styles.button}>
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
                styles.modalButton,
                !selectedOption && styles.disabledButton,
              ]}
            >
              <Text style={styles.modalButtonText}>Siguiente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => resetModal()}
              style={[styles.modalButton, styles.cancelButton]}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
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
{/* Campo para seleccionar días de repetición */}
<Text style={styles.label}>Repetir</Text>
<View style={styles.repeatContainer}>
  <Text style={styles.selectedOptionText}>
    {repeatDays ? repeatDays.replace(/_/g, ' ') : 'Seleccionar días'}
  </Text>
  <TouchableOpacity onPress={() => setShowDaysOptions(true)}>
    <Text style={styles.selectButton}>Seleccionar</Text>
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




            {/* Campo de enviar notificación */}
            <Text style={styles.label}>Enviar notificación</Text>
            <Switch
             value={sendNotification} // Enlazado al estado actual
             onValueChange={setSendNotification}// Se actualiza el estado al cambiar
            />

            <TouchableOpacity
              onPress={handleAddOrEditRoutine}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={resetModal}
              style={[styles.modalButton, styles.cancelButton]}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#90E0EF',
      },
      currentDateText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
      },

// MODAL

modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%', // Ajustar el ancho del modal al 90% del ancho de la pantalla
    maxWidth: 400, // Limitar el ancho máximo para pantallas grandes
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15, // Aumentar el padding vertical
  },



      reservedSpace: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eaeaea',
        marginBottom: 10,
      },
    listContent: {
      paddingTop: 10,
    },
    routineContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    descriptionText: {
      fontSize: 12,
      color: 'gray',
    },
    routineActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },

     
      
    checkBoxText: {
      fontSize: 20,
      marginRight: 10,
    },
    actionButton: {
      marginLeft: 10,
      padding: 5,
      backgroundColor: '#ddd',
      borderRadius: 5,
    },
    deleteText: {
      color: 'red',
    },
    bottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 10,
      backgroundColor: '#90E0EF',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#03045E',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    
     
      label: {
        fontSize: 16,
        marginBottom: 5,
      },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '100%',
      },
    
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      saveButton: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
      },
      saveButtonText: {
        color: 'white',
        textAlign: 'center',
      },
      cancelButton: {
        padding: 10,
        backgroundColor: 'gray',
        borderRadius: 5,
        flex: 1,
      },
      cancelButtonText: {
        color: 'white',
        textAlign: 'center',
      },
    modalButtonText: {
      color: 'white',
    },
    optionsContainer: {
        flexDirection: 'row', // Cambia a fila
        flexWrap: 'wrap', // Permite que los botones se ajusten a múltiples líneas
        justifyContent: 'center', // Centra los botones
        marginVertical: 10,
        width: '100%',
      },
      optionButton: {
        paddingVertical: 5, // Ajustar altura
        paddingHorizontal: 10, // Ajustar ancho
        backgroundColor: 'lightgray',
        borderRadius: 5,
        margin: 5, // Margen alrededor de cada botón
      },
    optionButtonText: {
      textAlign: 'center',
    },
    selectedOptionButton: {
      backgroundColor: '#48C78E', // Verde para selección
    },
    disabledButton: {
      backgroundColor: '#ccc', // Gris para botón deshabilitado
    },

    //MODAL ADD OR EDIT ACTIVIDAD
    daySelectorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 15,
      },
      dayButton: {
        backgroundColor: 'lightgray',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        margin: 5,
      },
      selectedDayButton: {
        backgroundColor: '#48C78E', // Cambia el color cuando está seleccionado
      },
      dayButtonText: {
        color: 'white',
        textAlign: 'center',
      },
      switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
      },
      


      // DIAS SELECCIONADOS

      repeatContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
      },
      selectedOptionText: {
        fontSize: 16,
      },
      selectButton: {
        color: 'blue',
      },
      
      

  });
  
  export default Rutinas;

