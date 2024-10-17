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
      setNewRoutine('');
      setNewRoutineDescription('');
      setSelectedRoutine(null); // Reiniciar el estado de edición
      setModalVisible(false); // Cerrar el modal
    }
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
    setNewRoutine(option);
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
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
          <Text style={styles.buttonText}>Añadir nueva actividad +</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for adding or editing a routine */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
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

            <View style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleOptionPress(option)}
                  style={styles.optionButton}
                >
                  <Text style={styles.optionButtonText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleAddOrEditRoutine} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>{selectedRoutine ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, styles.cancelButton]}>
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
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#03045E',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#B0B0B0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
  },
  optionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Rutinas;
