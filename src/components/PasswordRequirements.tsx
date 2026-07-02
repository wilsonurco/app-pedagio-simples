import { StyleSheet, Text, View } from 'react-native';

import { Check, X, iconStroke } from '@/components/ui/icons';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';
import { getPasswordRequirementStatuses } from '@/utils/authValidation';

type PasswordRequirementsProps = {
  password: string;
};

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = getPasswordRequirementStatuses(password);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requisitos de segurança:</Text>
      {requirements.map((requirement) => (
        <View key={requirement.id} style={styles.row}>
          <View style={[styles.iconWrap, requirement.met && styles.iconWrapMet]}>
            {requirement.met ? (
              <Check size={12} color={colors.onTint} strokeWidth={iconStroke} />
            ) : (
              <X size={12} color={colors.tertiaryLabel} strokeWidth={iconStroke} />
            )}
          </View>
          <Text style={[styles.label, requirement.met && styles.labelMet]}>
            {requirement.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  title: {
    ...fonts.semibold,
    fontSize: fontSize.subheadline,
    color: colors.tint,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapMet: {
    backgroundColor: colors.systemGreen,
  },
  label: {
    ...fonts.regular,
    fontSize: fontSize.footnote,
    color: colors.secondaryLabel,
    flex: 1,
  },
  labelMet: {
    color: colors.label,
  },
});
