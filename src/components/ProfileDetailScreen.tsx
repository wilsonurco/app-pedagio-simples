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
import {
  Car,
  ChevronRight,
  detailScreenIcons,
  iconSize,
  iconStroke,
  Trash2,
  type DetailScreenIconName,
} from '@/components/ui/icons';
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
  icon: DetailScreenIconName;
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
          backgroundColor="#FFFFFF"
          accessibilityLabel={`Foto do veículo ${label}`}
        />
      ) : (
        <View style={styles.thumbnailPlaceholder}>
          <Car size={18} color={colors.tint} strokeWidth={iconStroke} />
        </View>
      )}
    </View>
  );
}

export function ProfileDetailScreen({ title, description, icon, items = [] }: DetailScreenProps) {
  const topPadding = useAppTopPadding(spacing.sm);
  const HeaderIcon = detailScreenIcons[icon];

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

      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <HeaderIcon size={iconSize.md} color={colors.tint} strokeWidth={iconStroke} />
        </View>
        {items.map((item, index) => {
          const label = typeof item === 'string' ? item : item.label;
          const route = typeof item === 'string' ? undefined : item.route;
          const onDelete = typeof item === 'string' ? undefined : item.onDelete;
          const imageSource = typeof item === 'string' ? undefined : item.imageSource;
          const key = typeof item === 'string' ? item : item.label;
          const hasThumbnail = imageSource !== undefined;

          const trailing = (
            <View style={styles.trailing}>
              {onDelete ? (
                <Pressable
                  onPress={(event) => {
                    event?.stopPropagation?.();
                    onDelete();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Excluir ${label}`}
                  hitSlop={8}
                  style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
                >
                  <View pointerEvents="none">
                    <Trash2 size={iconSize.sm} color={colors.systemRed} strokeWidth={iconStroke} />
                  </View>
                </Pressable>
              ) : null}
              {route ? (
                <ChevronRight size={iconSize.sm} color={colors.tertiaryLabel} strokeWidth={iconStroke} />
              ) : null}
            </View>
          );

          const content = (
            <>
              {hasThumbnail ? <VehicleThumbnail imageSource={imageSource} label={label} /> : null}
              <Text style={styles.rowText}>{label}</Text>
              {trailing}
            </>
          );

          if (route) {
            return (
              <Pressable
                key={key}
                onPress={() => router.push(route)}
                accessibilityRole="button"
                accessibilityLabel={`Visualizar ${label}`}
                style={({ pressed }) => [
                  styles.row,
                  hasThumbnail && styles.rowWithThumbnail,
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
              style={[
                styles.row,
                hasThumbnail && styles.rowWithThumbnail,
                index < items.length - 1 && styles.divider,
              ]}
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
    gap: spacing.md,
  },
  rowWithThumbnail: {
    paddingVertical: spacing.md,
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
  thumbnail: {
    width: 56,
    height: 40,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(91, 46, 140, 0.08)',
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.sm,
  },
  pressed: {
    opacity: 0.6,
  },
});
