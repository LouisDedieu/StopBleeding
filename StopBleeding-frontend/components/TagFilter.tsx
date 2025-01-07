import React from 'react'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, toggleTag }) => {
  return (
    <View style={styles.tagsContainer}>
      {tags.map((tag, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tag, selectedTags.includes(tag) && styles.selectedTag]}
          onPress={() => toggleTag(tag)}
        >
          <Text style={styles.tagText}>{tag}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default TagFilter

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  selectedTag: {
    backgroundColor: '#007bff',
  },
  tagText: {
    color: '#000',
  },
})