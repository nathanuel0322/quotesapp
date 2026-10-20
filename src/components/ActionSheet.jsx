import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStyles, useTheme } from '../theme/ThemeProvider';

// Cross-platform action sheet (Android's Alert only fits three buttons).
// Mount <ActionSheetHost /> once near the root, then call showActionSheet() from anywhere.
//   showActionSheet({ title, message, options: [{ text, onPress, destructive }] })
let show = null;

export function showActionSheet(config) {
  show?.(config);
}

export function ActionSheetHost() {
  const [config, setConfig] = useState(null);
  const { colors } = useTheme();
  const s = useStyles(styles);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    show = setConfig;
    return () => {
      show = null;
    };
  }, []);

  const close = () => setConfig(null);

  return (
    <Modal visible={!!config} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
      <Pressable style={s.backdrop} onPress={close}>
        <Pressable style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]} onPress={() => {}}>
          {config?.title ? <Text style={s.title}>{config.title}</Text> : null}
          {config?.message ? <Text style={s.message}>{config.message}</Text> : null}
          {config?.options.map((opt) => (
            <Pressable
              key={opt.text}
              style={({ pressed }) => [s.option, pressed && { backgroundColor: colors.surfaceAlt }]}
              onPress={() => {
                close();
                // let the modal start closing before anything else opens
                setTimeout(() => opt.onPress?.(), 250);
              }}
            >
              <Text style={[s.optionText, opt.destructive && { color: colors.danger }]}>{opt.text}</Text>
            </Pressable>
          ))}
          <Pressable style={({ pressed }) => [s.option, s.cancel, pressed && { opacity: 0.7 }]} onPress={close}>
            <Text style={[s.optionText, { fontFamily: s.title.fontFamily }]}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = (c, { fonts }) =>
  StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    sheet: { backgroundColor: c.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingHorizontal: 12 },
    title: { color: c.text, fontFamily: fonts.bold, fontSize: 16, textAlign: 'center', paddingTop: 8 },
    message: { color: c.textMuted, fontFamily: fonts.regular, fontSize: 14, textAlign: 'center', paddingHorizontal: 16, paddingTop: 4 },
    option: { paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
    optionText: { color: c.text, fontFamily: fonts.semibold, fontSize: 16 },
    cancel: { marginTop: 6, backgroundColor: c.surfaceAlt },
  });
