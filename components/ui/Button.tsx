import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/colors';


type Props = TouchableOpacityProps & {
title: string;
style?: ViewStyle;
};


export default function Button({ title, style, ...rest }: Props) {
return (
<TouchableOpacity
{...rest}
activeOpacity={0.8}
style={[{ backgroundColor: COLORS.primary, padding: 14, borderRadius: 12 }, style]}
>
<Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>{title}</Text>
</TouchableOpacity>
);
}