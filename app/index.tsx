import * as ImageManipulator from 'expo-image-manipulator';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { PhotoSelect } from '../components/PhotoSelect';
import { PreviewLayout } from '../components/PreviewLayout';
import { PaperSize, PrintConfig } from '../components/PrintConfig';
import { Colors } from '../constants/Colors';
import { generateFoto3x4Html } from '../utils/htmlGenerator';

export default function App() {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [paperSize, setPaperSize] = useState<PaperSize>('A4');
    const [quantity, setQuantity] = useState<number>(5);
    const [autoQuantity, setAutoQuantity] = useState<boolean>(false);
    const [isPrinting, setIsPrinting] = useState<boolean>(false);

    // Calculate max photos per page
    const maxPhotos = useMemo(() => {
        // A4: 210x297mm, 3x4cm photos
        // Letter: 216x279mm
        // Approximation with margins
        if (paperSize === 'A4') return 30; // 5 x 6 grid safe
        return 25; // 5 x 5 grid safe
    }, [paperSize]);

    // Update quantity automatically if auto-fill is on
    if (autoQuantity && quantity !== maxPhotos) {
        setQuantity(maxPhotos);
    }

    const handlePrint = async () => {
        if (!imageUri || isPrinting) return;

        try {
            setIsPrinting(true);

            // Get Base64 using ImageManipulator (reliable and handles rotation)
            const manipResult = await ImageManipulator.manipulateAsync(
                imageUri,
                [],
                { base64: true, format: ImageManipulator.SaveFormat.JPEG, compress: 0.8 }
            );

            const imageSrc = `data:image/jpeg;base64,${manipResult.base64}`;

            // 1. Generate HTML
            const html = generateFoto3x4Html(imageSrc, paperSize, quantity);

            // 2. Print or Generate PDF
            const { uri } = await Print.printToFileAsync({ html });

            // 3. Share the PDF
            await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to generate PDF');
        } finally {
            setIsPrinting(false);
        }
    };

    const handleReset = () => {
        setImageUri(null);
        setPaperSize('A4');
        setQuantity(6);
        setAutoQuantity(true);
        setIsPrinting(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>Foto 3x4</Text>
                        <Text style={styles.headerSubtitle}>Professional Studio</Text>
                    </View>

                    <PhotoSelect
                        imageUri={imageUri}
                        onImageSelected={setImageUri}
                        onReset={() => setImageUri(null)}
                    />

                    {imageUri && (
                        <View style={styles.contentContainer}>
                            <PrintConfig
                                paperSize={paperSize}
                                setPaperSize={setPaperSize}
                                quantity={quantity}
                                setQuantity={setQuantity}
                                autoQuantity={autoQuantity}
                                setAutoQuantity={setAutoQuantity}
                                maxQuantity={maxPhotos}
                            />

                            <PreviewLayout
                                quantity={quantity}
                                onPrint={handlePrint}
                                imageUri={imageUri}
                                isPrinting={isPrinting}
                            />
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    headerContainer: {
        marginBottom: 32,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.text,
        letterSpacing: -1,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    contentContainer: {
        gap: 24,
    },
});
