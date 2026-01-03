import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface PhotoSelectProps {
    imageUri: string | null;
    onImageSelected: (uri: string) => void;
    onReset: () => void;
}

export function PhotoSelect({
    imageUri,
    onImageSelected,
    onReset,
}: PhotoSelectProps) {
    const pickImage = async () => {
        // Request permissions
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
        });

        if (!result.canceled) {
            onImageSelected(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder}>
                        <Ionicons name="cloud-upload-outline" size={48} color={Colors.primary} />
                        <Text style={styles.placeholderText}>Tap to upload photo</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={styles.buttonGroup}>
                {imageUri && (
                    <TouchableOpacity onPress={pickImage} style={[styles.actionButton, styles.changeButton]}>
                        <Text style={styles.changeButtonText}>Change Photo</Text>
                    </TouchableOpacity>
                )}



                {imageUri && (
                    <TouchableOpacity onPress={onReset} style={[styles.actionButton, styles.clearButton]}>
                        <Text style={styles.clearButtonText}>Clear</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 10,
    },
    imageContainer: {
        width: 150, // 3 * 50
        height: 200, // 4 * 50
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: Colors.surface,
        borderWidth: 2,
        borderColor: Colors.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12, // Match container
    },
    placeholder: {
        alignItems: 'center',
        padding: 20,
    },
    placeholderText: {
        marginTop: 12,
        color: Colors.textSecondary,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    changeButton: {
        backgroundColor: Colors.primary,
    },
    changeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    bgButton: {
        backgroundColor: Colors.secondary,
    },
    bgButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    clearButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.error,
    },
    clearButtonText: {
        color: Colors.error,
        fontSize: 14,
        fontWeight: '600',
    },
});
