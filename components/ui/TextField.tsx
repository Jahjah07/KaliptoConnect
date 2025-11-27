import React from 'react';
import { TextInput, View, TextInputProps } from 'react-native';


type Props = TextInputProps & {
label?: string;
};


export default function TextField({ label, ...props }: Props) {
return (
<View style={{ marginBottom: 12 }}>
{label ? <View style={{ marginBottom: 6 }}><TextInput editable={false} style={{ height: 0 }} /></View> : null}
<TextInput
placeholderTextColor="#9CA3AF"
style={{
height: 48,
borderWidth: 1,
borderColor: '#E5E7EB',
borderRadius: 10,
paddingHorizontal: 12,
}}
{...props}
/>
</View>
);
}