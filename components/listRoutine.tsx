import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { ListItem, CheckBox, Icon } from '@rneui/themed';
import ModalAddEdit from './modalAddEdit';
import modalStyles from '../styles/modalStyles';

interface Routine {
  id: number;
  name: string;
  description: string;
  color?: string;
  completed: boolean;
  repeatDays?: string;
  selectedTime?: Date | null;
  sendNotification?: boolean;
}

const ListRoutine: React.FC = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const date = new Date();
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthsOfYear = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const day = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = monthsOfYear[date.getMonth()];
    const year = date.getFullYear();

    setCurrentDate(`${day} ${dayOfMonth} de ${month}, ${year}`);
  }, []);

  const toggleRoutineComplete = (id: number) => {
    setRoutines(routines.map(routine => 
      routine.id === id ? { ...routine, completed: !routine.completed } : routine
    ));
  };

  const handleEditRoutine = (routine: Routine) => {
    setSelectedRoutine(routine);
    setModalVisible(true);
  };

  const handleDeleteRoutine = (id: number) => {
    setRoutines(routines.filter((routine) => routine.id !== id));
  };

  const renderItem = ({ item }: { item: Routine }) => (
    <ListItem.Swipeable
      leftContent={(reset) => (
        <View style={modalStyles.swipeButtonsContainer}>
          <Pressable
            onPress={() => {
              handleDeleteRoutine(item.id);
              reset();
            }}
            style={modalStyles.deleteButton}
          >
            <Text style={modalStyles.buttonText}>Eliminar</Text>
          </Pressable>
          
          <Pressable
            onPress={() => {
              handleEditRoutine(item);
              reset();
            }}
            style={modalStyles.editButton}
          >
            <Text style={modalStyles.buttonText}>Editar</Text>
          </Pressable>
        </View>
      )}
      containerStyle={modalStyles.listItemContainer}
    >
      <ListItem.Content>
        <View style={[
          modalStyles.routineContainer,
          { backgroundColor: item.color || '#FFFFFF' },
        ]}>
          <View>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 12,
              textDecorationLine: item.completed ? 'line-through' : 'none',
            }}>
              {item.name}
            </Text>
            <Text style={modalStyles.descriptionText}>{item.description}</Text>
          </View>

          <View style={modalStyles.rowContainer}>
            <CheckBox
              center
              containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
              checkedIcon={
                <Icon
                  name="radio-button-checked"
                  type="material"
                  color="#16367B"
                  size={20}
                  iconStyle={{ marginRight: 0 }}
                />
              }
              uncheckedIcon={
                <Icon
                  name="radio-button-unchecked"
                  type="material"
                  color="grey"
                  size={20}
                  iconStyle={{ marginRight: 0 }}
                />
              }
              checked={item.completed}
              onPress={() => toggleRoutineComplete(item.id)}
            />
          </View>
        </View>
      </ListItem.Content>
    </ListItem.Swipeable>
  );

  return (
    <View style={modalStyles.container}>
      <View style={modalStyles.reservedSpace}>
        <Text>{currentDate}</Text>
      </View>

      <FlatList
        data={routines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={modalStyles.listContent}
      />

      <View style={modalStyles.activiyButton}>
        <Pressable
          onPress={() => {
            setSelectedRoutine(null); // Limpiar rutina seleccionada
            setModalVisible(true); // Mostrar el modal
          }}
        >
          <Text style={modalStyles.buttonText}>Añadir nueva actividad +</Text>
        </Pressable>
      </View>

      {/* Modal Add/Edit */}
      <ModalAddEdit
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(routine) => {
          if (selectedRoutine) {
            setRoutines((prev) =>
              prev.map((r) => (r.id === routine.id ? routine : r))
            );
          } else {
            setRoutines((prev) => [...prev, routine]);
          }
          setModalVisible(false);
        }}
        selectedRoutine={selectedRoutine}
      />
    </View>
  );
};

export default ListRoutine;
