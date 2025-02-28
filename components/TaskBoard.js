import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert, 
  Dimensions,
  Modal
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import TaskColumn from './TaskColumn';
import CreateTaskModal from './CreateTaskModal';
import Colors from '../constants/colors';
import { 
  initialTasksState, 
  getNextId, 
  createEmptyTask 
} from '../utils/taskUtils';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const TaskBoard = () => {
  const [columns, setColumns] = useState(initialTasksState);
  const [expandedItem, setExpandedItem] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState(createEmptyTask());
  const [draggedItem, setDraggedItem] = useState(null);
  const [sourceColumn, setSourceColumn] = useState(null);
  const [showMoveActionSheet, setShowMoveActionSheet] = useState(false);
  const [selectedItemForMove, setSelectedItemForMove] = useState(null);

  // Add a new task locally
  const handleCreateTask = () => {
    if (!newTask.text.trim()) {
      Alert.alert("Error", "Task title cannot be empty.");
      return;
    }

    const task = {
      ...newTask,
      id: getNextId(columns),
      completed: false,
      originalColumn: 'todo'
    };

    const newColumns = { ...columns };
    newColumns.todo.items.push(task);

    setColumns(newColumns);
    setNewTask(createEmptyTask());
    setShowCreateModal(false);
  };

  // Move task between columns locally
  const handleMoveTask = (targetColumnId) => {
    if (selectedItemForMove && sourceColumn) {
      const newColumns = { ...columns };
      
      newColumns[sourceColumn].items = newColumns[sourceColumn].items.filter(
        item => item.id !== selectedItemForMove.id
      );
      newColumns[targetColumnId].items.push(selectedItemForMove);

      setColumns(newColumns);
      setShowMoveActionSheet(false);
      setSelectedItemForMove(null);
      setSourceColumn(null);
    }
  };

  // Toggle Complete Status and Move to Appropriate Column
  const handleToggleComplete = (columnId, itemId) => {
    const newColumns = { ...columns };

    // Find the item and toggle its completed status
    const itemIndex = newColumns[columnId].items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      newColumns[columnId].items[itemIndex].completed = 
        !newColumns[columnId].items[itemIndex].completed;

      // Move the item to the correct column
      const completedItem = newColumns[columnId].items[itemIndex];
      newColumns[columnId].items.splice(itemIndex, 1); // Remove from current column
      const targetColumnId = completedItem.completed ? 'done' : completedItem.originalColumn;
      newColumns[targetColumnId].items.push(completedItem); // Add to new column
    }

    setColumns(newColumns);
  };

  // Delete a task locally
  const handleDelete = (columnId, itemId) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            const newColumns = { ...columns };
            newColumns[columnId].items = newColumns[columnId].items.filter(
              item => item.id !== itemId
            );
            setColumns(newColumns);
          }
        }
      ]
    );
  };

  const handleDragStart = (columnId, itemId) => {
    const item = columns[columnId].items.find(item => item.id === itemId);
    if (item) {
      setSourceColumn(columnId);
      setSelectedItemForMove(item);
      setShowMoveActionSheet(true);
    }
  };

  const toggleExpandItem = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const renderColumns = () => {
    if (isTablet) {
      return (
        <ScrollView horizontal contentContainerStyle={styles.tabletColumnsContent}>
          {Object.values(columns).map((column) => (
            <View key={column.id} style={styles.columnWrapper}>
              <TaskColumn
                column={column}
                expandedItem={expandedItem}
                onToggleExpand={toggleExpandItem}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                onDragStart={handleDragStart}  // Ensure this is passed
                draggedItem={draggedItem}
              />
            </View>
          ))}
        </ScrollView>
      );
    } else {
      return (
        <ScrollView contentContainerStyle={styles.phoneColumnsContent}>
          {Object.values(columns).map((column) => (
            <View key={column.id} style={styles.columnWrapperVertical}>
              <TaskColumn
                column={column}
                expandedItem={expandedItem}
                onToggleExpand={toggleExpandItem}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                onDragStart={handleDragStart}  // Ensure this is passed
                draggedItem={draggedItem}
              />
            </View>
          ))}
        </ScrollView>
      );
    }
  };
  

  const renderMoveActionSheet = () => (
    <Modal
      visible={showMoveActionSheet}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowMoveActionSheet(false)}
    >
      <View style={styles.actionSheetOverlay}>
        <View style={styles.actionSheetContainer}>
          <Text style={styles.actionSheetTitle}>Move Task</Text>
          <View style={styles.actionSheetOptions}>
            {Object.values(columns).map(column => (
              <TouchableOpacity
                key={column.id}
                style={styles.actionSheetOption}
                onPress={() => handleMoveTask(column.id)}
                disabled={sourceColumn === column.id}
              >
                <Text style={styles.actionSheetOptionText}>
                  {column.title}
                  {sourceColumn === column.id && " (Current)"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity 
            style={styles.actionSheetCancel}
            onPress={() => setShowMoveActionSheet(false)}
          >
            <Text style={styles.actionSheetCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Task Board</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <AntDesign name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Long press a task to move it between columns
      </Text>

      <View style={styles.columnsContainer}>
        {renderColumns()}
      </View>

      {renderMoveActionSheet()}

      <CreateTaskModal 
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTask={handleCreateTask}
        newTask={newTask}
        setNewTask={setNewTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginVertical: 12,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  actionSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionSheetContainer: {
    backgroundColor: Colors.background,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  actionSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  actionSheetOptions: {
    marginVertical: 10,
  },
  actionSheetOption: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  actionSheetOptionText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  actionSheetCancel: {
    backgroundColor: Colors.danger,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  actionSheetCancelText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  }
});


export default TaskBoard;
