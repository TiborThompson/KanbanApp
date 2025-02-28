import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { getPriorityColor } from '../utils/taskUtils';

const TaskItem = ({ 
  item, 
  columnId,
  isExpanded,
  onToggleExpand,
  onToggleComplete,
  onDelete,
  onDragStart,
  isDragging
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.itemContainer,
          item.completed && styles.completedItem,
          isDragging && styles.draggingItem
        ]}
        onPress={onToggleExpand}
        onLongPress={() => onDragStart(columnId, item.id)}
        delayLongPress={300}
      >
        <View style={styles.leftContent}>
          <TouchableOpacity 
            style={[
              styles.checkbox,
              item.completed && styles.checkedBox
            ]}
            onPress={() => onToggleComplete(columnId, item.id)}
          >
            {item.completed && (
              <AntDesign name="check" size={12} color="#fff" />
            )}
          </TouchableOpacity>
          <Text 
            style={[
              styles.itemText,
              item.completed && styles.completedText
            ]}
            numberOfLines={1}
          >
            {item.text}
          </Text>
        </View>
        
        <View style={styles.rightContent}>
          <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
            {item.priority}
          </Text>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onToggleExpand}
          >
            <MaterialIcons 
              name={isExpanded ? "expand-less" : "expand-more"} 
              size={16} 
              color={Colors.textSecondary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => onDelete(columnId, item.id)}
          >
            <Feather name="trash-2" size={14} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <FontAwesome name="calendar" size={12} color={Colors.textSecondary} style={styles.detailIcon} />
              <Text style={styles.detailText}>Due: {item.dueDate || 'Not set'}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <FontAwesome name="user" size={12} color={Colors.textSecondary} style={styles.detailIcon} />
              <Text style={styles.detailText}>Assignee: {item.assignee || 'Unassigned'}</Text>
            </View>
          </View>
          
          <Text style={styles.description}>
            {item.description || 'No description provided.'}
          </Text>
          
          {/* <TouchableOpacity 
            style={styles.moveButton}
            onPress={() => onDragStart(columnId, item.id)}
          >
            <MaterialIcons name="swap-horiz" size={16} color={Colors.background} />
            <Text style={styles.moveButtonText}>Move to Another Column</Text>
          </TouchableOpacity> */} 
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  itemContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  completedItem: {
    backgroundColor: Colors.backgroundLight,
  },
  draggingItem: {
    opacity: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  itemText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
  },
  iconButton: {
    padding: 4,
    marginLeft: 4,
  },
  expandedContent: {
    marginTop: 4,
    marginLeft: 0,
    padding: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 4,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  description: {
    fontSize: 13,
    color: Colors.text,
    marginTop: 8,
    marginBottom: 12,
  },
  moveButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  moveButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  }
});

export default TaskItem;
