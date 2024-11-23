import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { View, Text, TextInput, Pressable, FlatList, Modal, StyleSheet, Switch, Alert } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from 'axios';

import { ListItem, CheckBox, Icon } from '@rneui/themed';
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

const Rutinas = () => {
  //Conección
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [color, setColor] = useState('#D177E9');
  const [repetirDias, setRepetirDias] = useState('Lunes-Viernes');
  const [hora, setHora] = useState('07:00:00');
  const [enviarNotificacion, setEnviarNotificacion] = useState(false);

  const [nextId, setNextId] = useState(1); 
  const [newRoutine, setNewRoutine] = useState('');
  const [newRoutineDescription, setNewRoutineDescription] = useState('');
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#FFDE59');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [activitySelectionVisible, setActivitySelectionVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

  const [repeatDays, setRepeatDays] = useState<string>('Solo una vez');
  const [sendNotification, setSendNotification] = useState<boolean>(false);

  const [currentDate, setCurrentDate] = useState<string>('');
  const [showDaysOptions, setShowDaysOptions] = useState(false);

  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [time, setTime] = useState<Date | null>(null);


  const handleInputChange = (text: string, field: 'name' | 'description') => {
    const regex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]*$/;
    if (regex.test(text) || text === '') {
      field === 'name' ? setNewRoutine(text) : setNewRoutineDescription(text);
    }
  };

  const options = ['Salir a correr', 'Hacer ejercicio', 'Comer sano', 'Hacer la tarea', 'Practicar la guitarra'];
  const opDays = ['Solo una vez', 'Diario', 'Lunes-Viernes', 'Fines de semana'];

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

  

  const handleAddOrEditRoutine = () => {
    if (newRoutine.trim() !== '') {
      const routineData: Routine = {
        id: selectedRoutine ? selectedRoutine.id : nextId,
        //id: selectedRoutine ? selectedRoutine.id : routines.length + 1,
        name: newRoutine,
        description: newRoutineDescription,
        color: selectedColor,
        repeatDays,
        selectedTime: time,
        sendNotification,
        completed: false,
      };

      setRoutines(prevRoutines => 
        selectedRoutine
          ? prevRoutines.map(routine => 
              routine.id === selectedRoutine.id ? routineData : routine // Reemplazamos la rutina editada
            )
          : [...prevRoutines, routineData] // Si no estamos editando, agregamos una nueva rutina
      );
  
      // Actualizar el siguiente ID solo cuando se agrega una nueva rutina
      if (!selectedRoutine) {
        setNextId(prevId => prevId + 1); // Incrementamos nextId solo cuando estamos añadiendo una nueva rutina
      }
      resetModal();
    }
  };

  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);

  const handleConfirm = (selectedTime: Date) => {
    setTime(selectedTime);
    hideTimePicker();
  };

  const resetModal = () => {
    setActivitySelectionVisible(false);
    setNewRoutine('');
    setNewRoutineDescription('');
    setSelectedColor('#FFDE59');
    setRepeatDays('diario');
    setSendNotification(false);
    setTime(new Date());
    setSelectedRoutine(null);
    setModalVisible(false);
  };

  const toggleRoutineComplete = (id: number) => {
    setRoutines(routines.map(routine => (routine.id === id ? { ...routine, completed: !routine.completed } : routine)));
  };

  //Botones para editar y eliminar
  const handleEditRoutine = (routine: Routine) => {
    setNewRoutine(routine.name);
    setNewRoutineDescription(routine.description);
    setSelectedColor(routine.color || '#FFDE59');
    setRepeatDays(routine.repeatDays || '');
    setTime(routine.selectedTime || new Date());
    setSendNotification(routine.sendNotification || false);
    setSelectedRoutine(routine);
    setModalVisible(true);
  };

  const handleDeleteRoutine = (id: number) => {
    setRoutines(routines.filter((routine) => routine.id !== id));
  };

  const handleOptionPress = (option: string) => setSelectedOption(option);

  const proceedToNextStep = () => {
    if (selectedOption) {
      setNewRoutine(selectedOption === 'Crear actividad personalizada' ? '' : selectedOption);
      setActivitySelectionVisible(false);
      setModalVisible(true);
    }

    //Para la conexión


    const handleSave = async () => {
      // Datos que vas a enviar al servidor
      const routineData = {
        id_usuario: 1, // Cambia esto según el usuario autenticado
        titulo,
        descripcion,
        color,
        repetir_dias: repetirDias,
        hora,
        enviar_notificacion: enviarNotificacion ? 1 : 0,
      };
    
      try {
        // Solicitud POST al servidor (asegúrate de usar la URL correcta del servidor)
        const response = await axios.post('http://rutinaserver.database.windows.net/actividad', routineData);
        console.log(response.data); // Mensaje del servidor
        Alert.alert('Éxito', 'Actividad guardada exitosamente');
      } catch (error) {
        console.error('Error al guardar la actividad:', error);
        Alert.alert('Error', 'No se pudo guardar la actividad');
      }
    };  
    
  };

  return (
    <View style={modalStyles.container}>
      <View style={modalStyles.reservedSpace}>
        <Text>{currentDate}</Text>
      </View>

      <FlatList
  data={routines}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <ListItem.Swipeable
      leftContent={(reset) => (
        <View style={modalStyles.swipeButtonsContainer}>
            <Pressable
            onPress={() => {
              handleDeleteRoutine(item.id);
              reset(); // Cierra el swipe
            }}
            style={modalStyles.deleteButton}
          >
            <Text style={modalStyles.buttonText}>Eliminar</Text>
          </Pressable>
          
          <Pressable
            onPress={() => {
              handleEditRoutine(item);
              reset(); // Cierra el swipe
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
                { backgroundColor: item.color || '#FFFFFF' }, // Fondo basado en el color
            ]}>
            <View>
                <View>
                    {/* Nombre de la actividad con subrayado si está completada */}
                    <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: 12,
                        textDecorationLine: item.completed ? 'line-through' : 'none',
                    }}
                    >
                    {item.name}
                    </Text>
                    <Text style={modalStyles.descriptionText}>{item.description}</Text>
                </View>
            </View>

          {/* Botón para marcar como completada */}

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
  )}
  contentContainerStyle={modalStyles.listContent}
/>

      <View style={modalStyles.activiyButton}>
        <Pressable onPress={() => setActivitySelectionVisible(true)}>
          <Text style={modalStyles.buttonText}>Añadir nueva actividad +</Text>
        </Pressable>
      </View>



        


      {/* Modal for selecting an activity */}
<Modal
  animationType="slide"
  transparent={true}
  visible={activitySelectionVisible}
  onRequestClose={() => resetModal()}
>
  <View style={modalStyles.modalContainer}>
    <View style={modalStyles.modalContent}>
      <Text style={modalStyles.modalTitle}>Seleccione una actividad</Text>

      <Pressable
        onPress={() => handleOptionPress('Crear actividad personalizada')}
        style={[
          modalStyles.optionButton,
          selectedOption === 'Crear actividad personalizada' && modalStyles.selectedOptionButton,
        ]}
      >
        <Text style={modalStyles.optionButtonText}>Crear actividad personalizada</Text>
      </Pressable>

      <View style={modalStyles.optionsContainer}>
        {options.map((option) => (
          <Pressable
            key={option}
            onPress={() => handleOptionPress(option)}
            style={[
              modalStyles.optionButton,
              selectedOption === option && modalStyles.selectedOptionButton,
            ]}
          >
            <Text style={modalStyles.optionButtonText}>{option}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={proceedToNextStep}
        disabled={!selectedOption}
        style={[
          modalStyles.activiyButton,
          !selectedOption && modalStyles.disabledButton,
        ]}
      >
        <Text style={modalStyles.buttonText}>Siguiente</Text>
      </Pressable>

      <Pressable
        onPress={() => resetModal()}
        style={modalStyles.cancelButton}
      >
        <Text style={modalStyles.buttonText}>Cancelar</Text>
      </Pressable>
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
  <View style={modalStyles.modalContainer}>
    <View style={modalStyles.modalContent}>
      <Text style={modalStyles.modalTitle}>{selectedRoutine ? 'EDITAR ACTIVIDAD' : 'AGREGAR ACTIVIDAD'}</Text>

      <TextInput
        value={newRoutine}
        onChangeText={(text) => handleInputChange(text, 'name')}
        placeholder="Agrega un titulo para la actividad..."
        style={modalStyles.input}
        maxLength={25}
      />
      <TextInput
        value={newRoutineDescription}
        onChangeText={(text) => handleInputChange(text, 'description')}
        placeholder="Agrega una meta o descripción..."
        style={modalStyles.input}
        maxLength={25}
      />


      {/* Sección para elegir el color */}
      <Text style={modalStyles.label}>Elige un color</Text>
      <View style={modalStyles.colorPickerContainer}>
        {['#FFDE59', '#D177E9', '#FD71CA', '#F09393', '#38D39A'].map((color) => (
          <Pressable
            key={color}
            onPress={() => setSelectedColor(color)}
            style={[
              modalStyles.colorButton,
              { backgroundColor: color },
              selectedColor === color && modalStyles.selectedColorButton,
            ]}
          />
        ))}
      </View>


      {/* Campo para seleccionar días de repetición */}
      <View style={modalStyles.repeatContainer}>
        <Text style={modalStyles.label}>Repetir</Text>
        <Pressable onPress={() => setShowDaysOptions(true)}>
          <Text style={[modalStyles.selectButton]}>
            {repeatDays ? repeatDays.replace(/_/g, ' ') : 'Seleccionar días'} {'>'}
          </Text>
        </Pressable>
      </View>

      {/* Opciones de días */}
      {showDaysOptions && (
        <View style={modalStyles.optionsContainer}>
          {opDays.map((option) => (
            <Pressable
              key={option}
              onPress={() => {
                setRepeatDays(option.toLowerCase().replace(/ /g, "_"));
                setShowDaysOptions(false);
              }}
              style={[
                modalStyles.optionButton,
                repeatDays === option.toLowerCase().replace(/ /g, "_") && modalStyles.selectedOptionButton,
              ]}
            >
              <Text style={modalStyles.optionButtonText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Horarios de notificación */}
      <View style={modalStyles.repeatContainer}>
        <Text style={modalStyles.label}>Horario </Text>
        <View>
          <Pressable onPress={showTimePicker} style={modalStyles.timeButton}>
          {time && (
            <Text>
              Recordatorio:{" "}
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
          </Pressable>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            is24Hour={true}
            onConfirm={handleConfirm}
            onCancel={hideTimePicker}
          />
          
        </View>
      </View>

      {/* Campo de enviar notificación */}
      <View style={modalStyles.repeatContainer}>
        <Text style={modalStyles.label}>Enviar notificación</Text>
        <Switch
          value={sendNotification}
          onValueChange={setSendNotification}
        />
      </View>

      {/* Botones guardar y cancelar */}
      <Pressable 
        onPress={handleAddOrEditRoutine}
        style={modalStyles.activiyButton}
      >
        <Text style={modalStyles.buttonText}>Guardar Actividad</Text>
      </Pressable>

      <Pressable
        onPress={resetModal}
        style={modalStyles.cancelButton}
      >
        <Text style={modalStyles.buttonText}>Cancelar</Text>
      </Pressable>
    </View>
  </View>
</Modal>

    </View>
  );
};

export default Rutinas;