import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native';

interface Routine {
  id: number;
  name: string;
  description: string;
  completed: boolean;
}

const Rutinas = () => {
  const [newRoutine, setNewRoutine] = useState('');
  const [newRoutineDescription, setNewRoutineDescription] = useState('');
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activitySelectionVisible, setActivitySelectionVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null); // Para modificación

  const options = ["Salir a caminar", "Escuchar música relajante", "Comer algo sano", "Tomar agua"];

  const handleAddOrEditRoutine = () => {
    if (newRoutine.trim() !== '') {
      if (selectedRoutine) {
        // Modificar rutina existente
        setRoutines(
          routines.map((routine) =>
            routine.id === selectedRoutine.id
              ? { ...routine, name: newRoutine, description: newRoutineDescription }
              : routine
          )
        );
      } else {
        // Agregar nueva rutina
        const newRoutineItem: Routine = {
          id: routines.length + 1,
          name: newRoutine,
          description: newRoutineDescription,
          completed: false,
        };
        setRoutines([...routines, newRoutineItem]);
      }
      resetModal();
    }
  };

  const resetModal = () => {
    setNewRoutine('');
    setNewRoutineDescription('');
    setSelectedRoutine(null); // Reiniciar el estado de edición
    setModalVisible(false); // Cerrar el modal
    setActivitySelectionVisible(false); // Cerrar la selección de actividades
    setSelectedOption(null); // Resetear opción seleccionada
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
        <Text>Reserved Space for Future Content</Text>
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
                <Text>Edit</Text>
              </TouchableOpacity>

              {/* Delete button */}
              <TouchableOpacity onPress={() => handleDeleteRoutine(item.id)} style={styles.actionButton}>
                <Text style={styles.deleteText}>Delete</Text>
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
            <TouchableOpacity onPress={() => resetModal()} style={styles.cancelButton}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>

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
            <Text style={styles.modalTitle}>{selectedRoutine ? 'Edit Routine' : 'Add a New Routine'}</Text>

            <TextInput
              value={newRoutine}
              onChangeText={setNewRoutine}
              placeholder="Enter routine name..."
              style={styles.input}
            />
            <TextInput
              value={newRoutineDescription}
              onChangeText={setNewRoutineDescription}
              placeholder="Enter routine description..."
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleAddOrEditRoutine} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>{selectedRoutine ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => resetModal()} style={[styles.modalButton, styles.cancelButton]}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
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
      marginBottom: 15,
      paddingHorizontal: 10,
      width: '100%',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    modalButton: {
      padding: 10,
      backgroundColor: '#007BFF',
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
      flex: 1,
      marginHorizontal: 5,
    },
    modalButtonText: {
      color: 'white',
    },
    cancelButton: {
      backgroundColor: 'gray',
    },
    optionsContainer: {
      marginVertical: 10,
      width: '100%',
    },
    optionButton: {
      padding: 15,
      backgroundColor: 'lightgray',
      borderRadius: 5,
      marginVertical: 5,
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
  });
  
export default Rutinas;