import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import TaskItem from './TaskItem';
import { getColumnBackgroundColor } from '../utils/taskUtils';

const TaskColumn = ({ 
  column, 
  expandedItem, 
  onToggleExpand,
  onToggleComplete,
  onDelete,
  onDragStart,
  draggedItem
}) => {
  const renderEmptyColumn = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="gesture-tap-hold" size={24} color={Colors.textLight} />
      <Text style={styles.emptyText}>No tasks yet</Text>
    </View>
  );

  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: getColumnBackgroundColor(column.id) }
      ]}
    >
      <Text style={styles.title}>{column.title}</Text>
      
      {column.items.length === 0 ? (
        renderEmptyColumn()
      ) : (
        <ScrollView>
          {column.items.map(item => (
            <TaskItem
              key={item.id}
              item={item}
              columnId={column.id}
              isExpanded={expandedItem === item.id}
              onToggleExpand={() => onToggleExpand(item.id)}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onDragStart={onDragStart}
              isDragging={draggedItem === item.id}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 300,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: Colors.text,
  },
  emptyContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
  emptyText: {
    marginTop: 8,
    color: Colors.textLight,
    textAlign: 'center',
  }
});

export default TaskColumn;
