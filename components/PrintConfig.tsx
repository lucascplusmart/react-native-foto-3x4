import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

export type PaperSize = 'A4' | 'Letter';
// Removed BackgroundColor type

interface PrintConfigProps {
    paperSize: PaperSize;
    setPaperSize: (size: PaperSize) => void;
    quantity: number;
    setQuantity: (qty: number) => void;
    autoQuantity: boolean;
    setAutoQuantity: (auto: boolean) => void;
    maxQuantity: number;
}

export function PrintConfig({
    paperSize,
    setPaperSize,
    quantity,
    setQuantity,
    autoQuantity,
    setAutoQuantity,
    maxQuantity
}: PrintConfigProps) {
    const incrementQuantity = () => {
        if (quantity < maxPhotos) {
            setQuantity(quantity + 1);
            setAutoQuantity(false);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            setAutoQuantity(false);
        }
    };

    // We pass maxQuantity directly now, calculated in parent
    const maxPhotos = maxQuantity;

    const handleQuantityChange = (text: string) => {
        const num = parseInt(text, 10);
        if (!isNaN(num)) {
            if (num > maxPhotos) {
                setQuantity(maxPhotos);
            } else if (num < 1) {
                setQuantity(1);
            } else {
                setQuantity(num);
            }
            setAutoQuantity(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.configItem}>
                <Text style={styles.label}>Paper Size</Text>
                <View style={styles.segmentedControl}>
                    {(['A4', 'Letter'] as PaperSize[]).map((size) => (
                        <TouchableOpacity
                            key={size}
                            onPress={() => setPaperSize(size)}
                            style={[
                                styles.segmentButton,
                                paperSize === size && styles.activeSegment,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.segmentText,
                                    paperSize === size && styles.activeSegmentText,
                                ]}
                            >
                                {size}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.configItem}>
                <Text style={styles.label}>Quantity (Max: {maxPhotos})</Text>
                <View style={styles.quantityControl}>
                    <TouchableOpacity
                        onPress={decrementQuantity}
                        style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                        disabled={quantity <= 1}
                    >
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.quantityInput}
                        value={String(quantity)}
                        onChangeText={handleQuantityChange}
                        keyboardType="numeric"
                        maxLength={2}
                    />

                    <TouchableOpacity
                        onPress={incrementQuantity}
                        style={[styles.quantityButton, quantity >= maxPhotos && styles.quantityButtonDisabled]}
                        disabled={quantity >= maxPhotos}
                    >
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.configItem}>
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => {
                        const newVal = !autoQuantity;
                        setAutoQuantity(newVal);
                        if (newVal) setQuantity(maxPhotos);
                    }}
                >
                    <View style={[styles.checkbox, autoQuantity && styles.checkboxChecked]}>
                        {autoQuantity && <View style={styles.checkboxInner} />}
                    </View>
                    <Text style={styles.checkboxLabel}>Auto-fill page</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    configItem: {
        marginBottom: 24,
    },
    label: {
        color: Colors.textSecondary,
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: Colors.background,
        borderRadius: 12,
        padding: 4,
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeSegment: {
        backgroundColor: Colors.primary,
    },
    segmentText: {
        color: Colors.textSecondary,
        fontWeight: '600',
        fontSize: 14,
    },
    activeSegmentText: {
        color: '#fff',
        fontWeight: '700',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    quantityButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    quantityButtonDisabled: {
        opacity: 0.3,
    },
    quantityButtonText: {
        color: Colors.text,
        fontSize: 24,
        fontWeight: '600',
        marginTop: -2,
    },
    quantityInput: {
        width: 60,
        height: 44,
        backgroundColor: Colors.background,
        color: Colors.text,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.primary,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    checkboxChecked: {
        backgroundColor: Colors.primary,
    },
    checkboxInner: {
        width: 10,
        height: 10,
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    checkboxLabel: {
        color: Colors.text,
        fontSize: 15,
        fontWeight: '500',
    },
});
