import { router, type Href } from 'expo-router';
import { Image } from 'expo-image';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';

import { ScreenBackButton } from '@/components/ScreenBackButton';
import { ScreenTitle } from '@/components/ScreenTitle';
import { GroupedDivider, GroupedList } from '@/components/ui/GroupedList';
import { Car, ChevronRight, iconSize, iconStroke, Trash2 } from '@/components/ui/icons';
import { useAppTopPadding } from '@/hooks/useAppTopPadding';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export type DetailListItem = {
  label: string;
  imageSource?: ImageSourcePropType | null;
  route?: Href;
  onDelete?: () => void;
};

type DetailScreenProps = {
  title: string;
  description: string;
  icon?: string;
  items?: (string | DetailListItem)[];
};

function VehicleThumbnail({ imageSource, label }: { imageSource?: ImageSourcePropType | null; label: string }) {
  return (
    <View style={styles.thumbnail}>
      {imageSource ? (
        <Image
          source={imageSource}
          style={styles.thumbnailImage}
          contentFit="contain"
          accessibilityLabel={`Foto do veículo ${label}`}
        />
      ) : (
        <View style={styles.thumbnailPlaceholder}>
          <Car size={16} color={colors.tertiaryLabel} strokeWidth={iconStroke} />
        </View>
      )}
    </View>
  );
}

export function ProfileDetailScreen({ title, description, items = [] }: DetailScreenProps) {
  const topPadding = useAppTopPadding(spacing.sm);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPadding, paddingBottom: spacing.xxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <ScreenBackButton />
      <ScreenTitle title={title} subtitle={description} />

      <GroupedList>
        {items.map((item, index) => {
          const label = typeof item === 'string' ? item : item.label;
          const route = typeof item === 'string' ? undefined : item.route;
          const onDelete = typeof item === 'string' ? undefined : item.onDelete;
          const imageSource = typeof item === 'string' ? undefined : item.imageSource;
          const key = typeof item === 'string' ? item : item.label;
          const hasThumbnail = imageSource !== undefined;

          const deleteButton = onDelete ? (
            <Pressable
              onPress={onDelete}
              accessibilityRole="button"
              accessibilityLabel={`Excluir ${label}`}
              hitSlop={8}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            >
              <Trash2 size={iconSize.sm} color={colors.systemRed} strokeWidth={iconStroke} />
            </Pressable>
          ) : null;

          const rowBody = (
            <>
              {hasThumbnail ? <VehicleThumbnail imageSource={imageSource} label={label} /> : null}
              <Text style={styles.rowText}>{label}</Text>
              {route ? (
                <ChevronRight size={16} color={colors.quaternaryLabel} strokeWidth={iconStroke} />
              ) : null}
            </>
          );

          if (route && onDelete) {
            return (
              <View key={key}>
                {index > 0 ? <GroupedDivider inset={hasThumbnail ? spacing.lg + 56 + spacing.md : spacing.lg} /> : null}
                <View style={[styles.row, hasThumbnail && styles.rowWithThumbnail]}>
                  <Pressable
                    onPress={() => router.push(route)}
                    accessibilityRole="button"
                    accessibilityLabel={`Visualizar ${label}`}
                    style={({ pressed }) => [styles.rowMain, pressed && styles.pressed]}
                  >
                    {rowBody}
                  </Pressable>
                  {deleteButton}
                </View>
              </View>
            );
          }

          if (route) {
            return (
              <View key={key}>
                {index > 0 ? <GroupedDivider inset={hasThumbnail ? spacing.lg + 56 + spacing.md : spacing.lg} /> : null}
                <Pressable
                  onPress={() => router.push(route)}
                  accessibilityRole="button"
                  accessibilityLabel={`Visualizar ${label}`}
                  style={({ pressed }) => [
                    styles.row,
                    hasThumbnail && styles.rowWithThumbnail,
                    pressed && styles.pressed,
                  ]}
                >
                  {rowBody}
                </Pressable>
              </View>
            );
          }

          return (
            <View key={key}>
              {index > 0 ? <GroupedDivider inset={hasThumbnail ? spacing.lg + 56 + spacing.md : spacing.lg} /> : null}
              <View style={[styles.row, hasThumbnail && styles.rowWithThumbnail]}>
                {rowBody}
                {deleteButton}
              </View>
            </View>
          );
        })}
      </GroupedList>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 44,
    gap: spacing.md,
  },
  rowWithThumbnail: {
    paddingVertical: spacing.md,
  },
  rowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 44,
  },
  rowText: {
    flex: 1,
    ...fonts.regular,
    fontSize: fontSize.body,
    color: colors.label,
  },
  thumbnail: {
    width: 56,
    height: 40,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.groupedBackground,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.groupedBackground,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.sm,
  },
  pressed: {
    opacity: 0.65,
  },
});
