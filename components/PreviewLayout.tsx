import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

export interface PreviewLayoutProps {
    imageUri: string | null;
    quantity: number;
    onPrint: () => void;
    isPrinting?: boolean;
}

export function PreviewLayout({ imageUri, quantity, onPrint, isPrinting = false }: PreviewLayoutProps) {
    // A4 aspect ratio (210/297 = ~0.707)
    // Letter aspect ratio (216/279 = ~0.774)
    const previewAspectRatio = 0.707;

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Preview</Text>

            <View style={styles.previewCard}>
                <View style={[styles.previewPaper, { aspectRatio: previewAspectRatio }]}>
                    {/* 
                        Approximation of photo grid for visual feedback.
                        In a real app, we might render the actual HTML in a WebView or 
                        calculate positions precisely. For now, a grid representation.
                     */}
                    <View style={styles.gridContainer}>
                        {Array.from({ length: quantity }).map((_, index) => (
                            <View key={index} style={styles.photoPlaceholder}>
                                <Image source={{ uri: imageUri || '' }} style={styles.photoImage} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            <Pressable
                onPress={onPrint}
                style={({ pressed }) => [
                    styles.printButton,
                    isPrinting && styles.printButtonDisabled,
                    pressed && !isPrinting && styles.printButtonPressed
                ]}
                disabled={isPrinting}
            >
                {isPrinting ? (
                    <View style={styles.buttonContent}>
                        <ActivityIndicator color="#fff" size="small" />
                        <Text style={styles.printButtonText}>GENERATING...</Text>
                    </View>
                ) : (
                    <Text style={styles.printButtonText}>PRINT / SAVE PDF</Text>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
        marginLeft: 4,
    },
    previewCard: {
        backgroundColor: Colors.surface, // Desk surface
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    previewPaper: {
        width: '80%', // Scale relative to screen
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        padding: 10, // Margin on paper
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        justifyContent: 'flex-start',
    },
    photoPlaceholder: {
        width: '18%', // Approx for 5 across
        aspectRatio: 3 / 4,
        backgroundColor: '#eee',
        overflow: 'hidden',
    },
    photoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    printButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    printButtonPressed: {
        backgroundColor: Colors.primaryDark,
        transform: [{ scale: 0.98 }],
    },
    printButtonDisabled: {
        backgroundColor: Colors.surfaceHighlight,
        shadowOpacity: 0,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    printButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
