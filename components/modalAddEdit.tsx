import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, Switch } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

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

interface ModalAddEditProps {
    visible: boolean;
    onClose: () => void;
    onSave: (routine: Routine) => void;
    selectedRoutine: Routine | null;
  }
  const ModalAddEdit: React.FC<ModalAddEditProps> = ({
    visible,
    onClose,
    onSave,
    selectedRoutine
  }) => {
    const [newRoutine, setNewRoutine] = useState(selectedRoutine?.name || '');
    const [newRoutineDescription, setNewRoutineDescription] = useState(selectedRoutine?.description || '');
    const [selectedColor, setSelectedColor] = useState<string>(selectedRoutine?.color || '#FFDE59');
    const [activitySelectionVisible, setActivitySelectionVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [repeatDays, setRepeatDays] = useState<string>(selectedRoutine?.repeatDays || 'Solo una vez');
    const [sendNotification, setSendNotification] = useState<boolean>(selectedRoutine?.sendNotification || false);
    const [showDaysOptions, setShowDaysOptions] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [time, setTime] = useState<Date | null>(selectedRoutine?.selectedTime || null);
  
    const options = ['Salir a correr', 'Hacer ejercicio', 'Comer sano', 'Hacer la tarea', 'Practicar la guitarra'];
    const opDays = ['Solo una vez', 'Diario', 'Lunes-Viernes', 'Fines de semana'];
  
    const handleInputChange = (text: string, field: 'name' | 'description') => {
      const regex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]*$/;
      if (regex.test(text) || text === '') {
        field === 'name' ? setNewRoutine(text) : setNewRoutineDescription(text);
      }
    };
  
    const handleSave = () => {
      if (newRoutine.trim() !== '') {
        const routineData: Routine = {
          id: selectedRoutine ? selectedRoutine.id : Date.now(),
          name: newRoutine,
          description: newRoutineDescription,
          color: selectedColor,
          repeatDays,
          selectedTime: time,
          sendNotification,
          completed: selectedRoutine ? selectedRoutine.completed : false,
        };
  
        onSave(routineData);
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
      setRepeatDays('Solo una vez');
      setSendNotification(false);
      setTime(null);
      onClose();
    };
  
    const handleOptionPress = (option: string) => setSelectedOption(option);
    
  
    const proceedToNextStep = () => {
      if (selectedOption) {
        setNewRoutine(selectedOption === 'Crear actividad personalizada' ? '' : selectedOption);
        setActivitySelectionVisible(false);
      }
      
    };
  
    return (
      <>
        {/* Modal for selecting an activity */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={activitySelectionVisible}
          onRequestClose={resetModal}
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
                onPress={resetModal}
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
          visible={visible}
          onRequestClose={resetModal}
        >
          <View style={modalStyles.modalContainer}>
            <View style={modalStyles.modalContent}>
              <Text style={modalStyles.modalTitle}>
                {selectedRoutine ? 'EDITAR ACTIVIDAD' : 'AGREGAR ACTIVIDAD'}
              </Text>
  
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
  
              <View style={modalStyles.repeatContainer}>
                <Text style={modalStyles.label}>Repetir</Text>
                <Pressable onPress={() => setShowDaysOptions(true)}>
                  <Text style={modalStyles.selectButton}>
                    {repeatDays ? repeatDays.replace(/_/g, ' ') : 'Seleccionar días'} {'>'}
                  </Text>
                </Pressable>
              </View>
  
              {showDaysOptions && (
                <View style={modalStyles.optionsContainer}>
                  {opDays.map((option) => (
                    <Pressable
                      key={option}
                      onPress={() => {
                        setRepeatDays(option);
                        setShowDaysOptions(false);
                      }}
                      style={[
                        modalStyles.optionButton,
                        repeatDays === option && modalStyles.selectedOptionButton,
                      ]}
                    >
                      <Text style={modalStyles.optionButtonText}>{option}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
  
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
  
              <View style={modalStyles.repeatContainer}>
                <Text style={modalStyles.label}>Enviar notificación</Text>
                <Switch
                  value={sendNotification}
                  onValueChange={setSendNotification}
                />
              </View>
  
              <Pressable
                onPress={handleSave}
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
      </>
    );
  };
  
  export default ModalAddEdit;