import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Check, iconStroke } from '@/components/ui/icons';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { fonts } from '@/theme/typography';

export type FormStep = {
  key: string;
  label: string;
};

type FormStepIndicatorProps = {
  steps: FormStep[];
  /** Índice da etapa atual (1-based). */
  currentStep: number;
  /** Texto de apoio opcional abaixo do indicador (ex.: instrução do formulário). */
  hint?: string;
};

const NODE_SIZE = 24;
const CONNECTOR_WIDTH = 120;

export function FormStepIndicator({ steps, currentStep, hint }: FormStepIndicatorProps) {
  const total = steps.length;
  const safeCurrent = Math.min(Math.max(currentStep, 1), total);

  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <View style={styles.track}>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < safeCurrent;
          const isActive = stepNumber === safeCurrent;
          const isUpcoming = stepNumber > safeCurrent;
          const isLast = index === steps.length - 1;

          const accessibilityState = isComplete
            ? 'concluída'
            : isActive
              ? 'etapa atual'
              : 'pendente';

          return (
            <Fragment key={step.key}>
              <View
                style={[
                  styles.node,
                  isComplete && styles.nodeComplete,
                  isActive && styles.nodeActive,
                  isUpcoming && styles.nodeUpcoming,
                ]}
                accessibilityLabel={`${step.label}, ${accessibilityState}`}
              >
                {isComplete ? (
                  <Check size={13} color={colors.onTint} strokeWidth={iconStroke} />
                ) : null}
              </View>

              {!isLast ? (
                <View
                  style={[
                    styles.connector,
                    stepNumber < safeCurrent
                      ? styles.connectorComplete
                      : styles.connectorUpcoming,
                  ]}
                />
              ) : null}
            </Fragment>
          );
        })}
      </View>

      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeComplete: {
    backgroundColor: colors.tint,
  },
  nodeActive: {
    backgroundColor: colors.tint,
  },
  nodeUpcoming: {
    backgroundColor: colors.badgePurpleBg,
    borderWidth: 1.5,
    borderColor: 'rgba(91, 46, 140, 0.18)',
  },
  connector: {
    width: CONNECTOR_WIDTH,
    height: 2,
    borderRadius: 1,
  },
  connectorComplete: {
    backgroundColor: colors.tint,
  },
  connectorUpcoming: {
    backgroundColor: 'rgba(91, 46, 140, 0.16)',
  },
  hint: {
    ...fonts.regular,
    fontSize: fontSize.subheadline,
    color: colors.secondaryLabel,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
});
