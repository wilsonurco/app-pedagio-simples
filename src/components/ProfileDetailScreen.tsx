import { router, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { ScreenBackButton } from '@/components/ScreenBackButton';
import { ScreenTitle } from '@/components/ScreenTitle';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export type DetailListItem = {
  label: string;
  route?: Href;
};

type DetailScreenProps = {
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  items?: (string | DetailListItem)[];
};

export function ProfileDetailScreen({ title, description, icon, items = [] }: DetailScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.sm, paddingBottom: spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenBackButton />
      <ScreenTitle title={title} subtitle={description} />

      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <MaterialIcons name={icon} size={24} color={colors.tint} />
        </View>
        {items.map((item, index) => {
          const label = typeof item === 'string' ? item : item.label;
          const route = typeof item === 'string' ? undefined : item.route;
          const key = typeof item === 'string' ? item : item.label;

          const content = (
            <>
              <Text style={styles.rowText}>{label}</Text>
              {route ? (
                <MaterialIcons name="chevron-right" size={20} color={colors.tertiaryLabel} />
              ) : null}
            </>
          );

          if (route) {
            return (
              <Pressable
                key={key}
                onPress={() => router.push(route)}
                accessibilityRole="button"
                accessibilityLabel={label}
                style={({ pressed }) => [
                  styles.row,
                  index < items.length - 1 && styles.divider,
                  pressed && styles.pressed,
                ]}
              >
                {content}
              </Pressable>
            );
          }

          return (
            <View
              key={key}
              style={[styles.row, index < items.length - 1 && styles.divider]}
            >
              {content}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: colors.groupedBackground,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  iconWrap: {
    alignSelf: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: 'rgba(91, 46, 140, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 44,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  rowText: {
    flex: 1,
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.label,
  },
  pressed: {
    opacity: 0.6,
  },
});
