import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useStyles, useTheme } from '../theme/ThemeProvider';

export function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, icon, style, compact }) {
  const { colors } = useTheme();
  const s = useStyles(buttonStyles);
  const isDisabled = disabled || loading;
  const fg = variant === 'primary' || variant === 'danger' ? colors.onAccent : variant === 'ghost' ? colors.accent : colors.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        s.base,
        compact && s.compact,
        s[variant],
        (pressed || isDisabled) && { opacity: isDisabled ? 0.5 : 0.8 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={s.row}>
          {icon && <Ionicons name={icon} size={compact ? 16 : 18} color={fg} />}
          <Text style={[s.text, compact && s.compactText, { color: fg }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const buttonStyles = (c, { fonts }) =>
  StyleSheet.create({
    base: { height: 50, borderRadius: 16, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
    compact: { height: 38, borderRadius: 12, paddingHorizontal: 14 },
    row: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
    text: { fontFamily: fonts.bold, fontSize: 16 },
    compactText: { fontSize: 14 },
    primary: { backgroundColor: c.accent },
    secondary: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.border },
    ghost: { backgroundColor: 'transparent' },
    danger: { backgroundColor: c.danger },
  });

export function TextField({ label, error, style, inputStyle, ...rest }) {
  const { colors } = useTheme();
  const s = useStyles(fieldStyles);
  return (
    <View style={[s.wrap, style]}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.placeholder}
        selectionColor={colors.accent}
        style={[s.input, error && { borderColor: colors.danger }, inputStyle]}
        {...rest}
      />
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

const fieldStyles = (c, { fonts }) =>
  StyleSheet.create({
    wrap: { width: '100%', marginBottom: 14 },
    label: { color: c.textMuted, fontFamily: fonts.semibold, fontSize: 13, marginBottom: 6, marginLeft: 4 },
    input: {
      minHeight: 50,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      color: c.text,
      fontFamily: fonts.regular,
      fontSize: 16,
    },
    error: { color: c.danger, fontFamily: fonts.regular, fontSize: 12, marginTop: 4, marginLeft: 4 },
  });

const AVATAR_COLORS = ['#FF765E', '#177DDC', '#13A8A8', '#9B59B6', '#F84263', '#E6A23C'];

export function Avatar({ uri, name, size = 40, style }) {
  const { fonts } = useTheme();
  const letter = (name ?? '?').charAt(0).toUpperCase();
  const bg = AVATAR_COLORS[(name ?? '').length % AVATAR_COLORS.length];
  const radius = size * 0.36;
  if (uri) {
    return <Image source={{ uri }} style={[{ width: size, height: size, borderRadius: radius }, style]} contentFit="cover" transition={150} />;
  }
  return (
    <View style={[{ width: size, height: size, borderRadius: radius, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Text style={{ color: '#fff', fontFamily: fonts.bold, fontSize: size * 0.42 }}>{letter}</Text>
    </View>
  );
}

export function Chip({ label, emoji, color, selected, onPress, style }) {
  const s = useStyles(chipStyles);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.chip, selected && { backgroundColor: color, borderColor: color }, pressed && { opacity: 0.8 }, style]}
    >
      {emoji ? <Text style={s.emoji}>{emoji}</Text> : null}
      <Text style={[s.text, selected && s.selectedText]}>{label}</Text>
    </Pressable>
  );
}

const chipStyles = (c, { fonts }) =>
  StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: 6,
      paddingHorizontal: 14,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    emoji: { fontSize: 14 },
    text: { color: c.text, fontFamily: fonts.semibold, fontSize: 14 },
    selectedText: { color: '#0A0B14' },
  });

export function EmptyState({ icon = 'sparkles-outline', title, subtitle, action, style }) {
  const { colors } = useTheme();
  const s = useStyles(emptyStyles);
  return (
    <View style={[s.wrap, style]}>
      <Ionicons name={icon} size={44} color={colors.textMuted} />
      <Text style={s.title}>{title}</Text>
      {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
      {action ? <View style={{ marginTop: 18 }}>{action}</View> : null}
    </View>
  );
}

const emptyStyles = (c, { fonts }) =>
  StyleSheet.create({
    wrap: { alignItems: 'center', justifyContent: 'center', padding: 32 },
    title: { color: c.text, fontFamily: fonts.bold, fontSize: 18, marginTop: 12, textAlign: 'center' },
    subtitle: { color: c.textMuted, fontFamily: fonts.regular, fontSize: 14, marginTop: 6, textAlign: 'center', lineHeight: 20 },
  });

export function Loading({ style }) {
  const { colors } = useTheme();
  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }, style]}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}

export function ListRow({ icon, label, value, onPress, danger, right }) {
  const { colors } = useTheme();
  const s = useStyles(rowStyles);
  const tint = danger ? colors.danger : colors.text;
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [s.row, pressed && { opacity: 0.7 }]}>
      {icon ? <Ionicons name={icon} size={22} color={tint} /> : null}
      <Text style={[s.label, { color: tint }]}>{label}</Text>
      {value ? <Text style={s.value}>{value}</Text> : null}
      {right ?? (onPress && !danger ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} /> : null)}
    </Pressable>
  );
}

const rowStyles = (c, { fonts }) =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', columnGap: 14, paddingVertical: 16, paddingHorizontal: 20 },
    label: { flex: 1, fontFamily: fonts.semibold, fontSize: 16 },
    value: { color: c.textMuted, fontFamily: fonts.regular, fontSize: 14 },
  });

export function SectionTitle({ children }) {
  const s = useStyles(sectionStyles);
  return <Text style={s.title}>{children}</Text>;
}

const sectionStyles = (c, { fonts }) =>
  StyleSheet.create({
    title: {
      color: c.textMuted,
      fontFamily: fonts.semibold,
      fontSize: 12,
      letterSpacing: 1,
      textTransform: 'uppercase',
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 4,
    },
  });
