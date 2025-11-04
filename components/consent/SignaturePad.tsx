import React, { useRef } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { Button } from '@/components/ui/Button';

interface SignaturePadProps {
  onSave: (signature: string) => void;
  onClear?: () => void;
  containerStyle?: ViewStyle;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSave,
  onClear,
  containerStyle,
}) => {
  const signatureRef = useRef<any>(null);

  const handleSave = (signature: string) => {
    onSave(signature);
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    onClear?.();
  };

  const handleEnd = () => {
    signatureRef.current?.readSignature();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>Sign below</Text>
      
      <View style={styles.canvasContainer}>
        <SignatureCanvas
          ref={signatureRef}
          onOK={handleSave}
          onEnd={handleEnd}
          descriptionText=""
          clearText="Clear"
          confirmText="Save"
          webStyle={`
            .m-signature-pad {
              box-shadow: none;
              border: 2px solid ${Colors.border};
              border-radius: ${Sizes.borderRadius.md}px;
            }
            .m-signature-pad--body {
              border: none;
            }
            .m-signature-pad--footer {
              display: none;
            }
          `}
        />
      </View>

      <View style={styles.actions}>
        <Button
          title="Clear"
          onPress={handleClear}
          variant="outline"
          size="sm"
          style={styles.button}
        />
        <Button
          title="Save Signature"
          onPress={() => signatureRef.current?.readSignature()}
          variant="primary"
          size="sm"
          style={styles.button}
        />
      </View>

      <Text style={styles.helperText}>
        By signing, you agree to the terms and conditions outlined in the consent form.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Sizes.spacing.md,
  },
  label: {
    fontSize: Sizes.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  canvasContainer: {
    height: 200,
    borderWidth: Sizes.borderWidth.medium,
    borderColor: Colors.border,
    borderRadius: Sizes.borderRadius.md,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    gap: Sizes.spacing.sm,
  },
  button: {
    flex: 1,
  },
  helperText: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Sizes.fontSize.xs * Sizes.lineHeight.relaxed,
  },
});
