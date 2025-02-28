import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Pressable,
  Platform
} from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../constants/colors';

const CreateTaskModal = ({ visible, onClose, onCreateTask, newTask, setNewTask }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setNewTask({ ...newTask, dueDate: formattedDate });
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Select a date';
    return dateString;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Task</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Task Title *</Text>
              <TextInput
                style={styles.input}
                value={newTask.text}
                onChangeText={(text) => setNewTask({ ...newTask, text })}
                placeholder="Enter task title"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Due Date</Text>
              <Pressable 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {formatDisplayDate(newTask.dueDate)}
                </Text>
                <FontAwesome name="calendar" size={16} color={Colors.textSecondary} />
              </Pressable>
              
              {showDatePicker && (
                <DateTimePicker
                  value={newTask.dueDate ? new Date(newTask.dueDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityContainer}>
                {['High', 'Medium', 'Low'].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      newTask.priority === priority && styles.priorityButtonSelected,
                      { backgroundColor: newTask.priority === priority ? 
                        (priority === 'High' ? Colors.priorityHigh : 
                         priority === 'Medium' ? Colors.priorityMedium : 
                         Colors.priorityLow) : 'transparent' }
                    ]}
                    onPress={() => setNewTask({ ...newTask, priority })}
                  >
                    <Text 
                      style={[
                        styles.priorityText,
                        newTask.priority === priority && styles.priorityTextSelected
                      ]}
                    >
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Assignee</Text>
              <TextInput
                style={styles.input}
                value={newTask.assignee}
                onChangeText={(assignee) => setNewTask({ ...newTask, assignee })}
                placeholder="Enter assignee name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                value={newTask.description}
                onChangeText={(description) => setNewTask({ ...newTask, description })}
                placeholder="Enter task description"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button, 
                styles.createButton,
                !newTask.text.trim() && styles.disabledButton
              ]}
              onPress={onCreateTask}
              disabled={!newTask.text.trim()}
            >
              <Text style={styles.createButtonText}>Create Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  modalContent: {
    padding: 20,
    maxHeight: '70%',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.backgroundLight,
  },
  textarea: {
    minHeight: 100,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    backgroundColor: Colors.backgroundLight,
  },
  dateText: {
    fontSize: 14,
    color: Colors.text,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priorityButtonSelected: {
    borderWidth: 0,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text,
  },
  priorityTextSelected: {
    color: Colors.background,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: Colors.primary,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: Colors.textLight,
    opacity: 0.6,
  },
});

export default CreateTaskModal;