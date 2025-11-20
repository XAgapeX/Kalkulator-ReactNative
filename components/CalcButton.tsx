import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface CalcButtonProps {
  title: string;
  backgroundColor?: string;
  color?: string;
  flex?: number;
  borderColor?: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

const CalcButton: React.FC<CalcButtonProps> = ({
  title,
  backgroundColor = '#A5A5A5',
  color = '#fff',
  flex = 1,
  borderColor = '#000',
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, flex, borderColor, opacity: disabled ? 0.5 : 1 },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  text: {
    fontSize: 22,
    fontWeight: '500',
  },
});

export default CalcButton;
